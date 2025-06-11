"use client"
export function AddToCartButton({ mangaId, userId }: { mangaId: string, userId: string }) {
  
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mangaIdValue = formData.get('mangaId');
    const userIdValue = formData.get('userId');
    if (!mangaIdValue) return;
    const res = await fetch('/api/agregar-carro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mangaId: mangaIdValue, userId: userIdValue }),
    });
    await res.json();
  }
  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="mangaId" value={mangaId} />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Añadir al Carrito
      </button>
    </form>
  )
}
