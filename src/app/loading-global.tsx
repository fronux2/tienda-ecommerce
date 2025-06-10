// app/loading-global.tsx
"use client";

import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula un tiempo mínimo de carga para evitar parpadeo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="mb-4">
        <Loading />
      </div>
      <p className="text-lg text-gray-600">Cargando aplicación...</p>
    </div>
  );
}