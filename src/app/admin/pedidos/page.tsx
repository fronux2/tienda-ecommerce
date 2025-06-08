export default async function Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Pedidos</p>

      <div className="rounded-lg border border-gray-300 shadow">
        <table className="min-w-full w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Usuario</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className="px-4 py-2 border">1</td>
              <td className="px-4 py-2 border">John Doe</td>
              <td className="px-4 py-2 border">2023-01-01</td>
              <td className="px-4 py-2 border">$100</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}