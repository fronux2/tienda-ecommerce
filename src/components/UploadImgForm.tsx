'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import LoadingButton from '@/components/LoadingButton';

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
    <div className="p-4 border border-border rounded-lg max-w-md mx-auto">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <LoadingButton
        onClick={handleUpload}
        disabled={!file}
        loading={loading}
        variant="primary"
        className="mt-2"
      >
        Subir imagen
      </LoadingButton>
      {errorMsg && <p className="mt-2 text-danger text-sm">{errorMsg}</p>}
      {url && (
        <div className="mt-4">
          <p>Imagen subida:</p>
          <Image src={url} alt="Preview" width={128} height={128} className="mt-2 object-cover rounded-md" />
          <code className="text-sm break-all">{url}</code>
        </div>
      )}
    </div>
  );
}
