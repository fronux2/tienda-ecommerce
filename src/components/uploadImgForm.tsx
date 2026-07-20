'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function UploadImgForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setErrorMsg('');
    const ext = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('mangas')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      setErrorMsg(error.message);
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
      {errorMsg && <p className="mt-2 text-red-600 text-sm">{errorMsg}</p>}
      {url && (
        <div className="mt-4">
          <p>Imagen subida:</p>
          <Image src={url} alt="Preview" width={128} height={128} className="mt-2 object-cover rounded" />
          <code className="text-sm break-all">{url}</code>
        </div>
      )}
    </div>
  );
}
