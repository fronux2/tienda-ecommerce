'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function UploadImgForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const supabase = createClient();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const filePath = `${file.name}`;

    const { error } = await supabase.storage
      .from('mangas')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error al subir:', error.message);
    } else {
      const { data: publicUrlData } = supabase.storage
        .from('mangas')
        .getPublicUrl(filePath);

      setUrl(publicUrlData.publicUrl);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Subiendo...' : 'Subir imagen'}
      </button>
      {url && (
        <div className="mt-4">
          <p>Imagen subida:</p>
          <img src={url} alt="Preview" className="w-32 mt-2" />
          <code className="text-sm break-all">{url}</code>
        </div>
      )}
    </div>
  );
}
