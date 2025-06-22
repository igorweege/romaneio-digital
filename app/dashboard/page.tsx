// app/dashboard/page.tsx - VERSÃO DE TESTE TEMPORÁRIA

// Removido async, prisma, etc. Apenas um componente visual simples.
export default function Dashboard() {
  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800">Página de Teste do Dashboard</h1>
      <p className="mt-4">
        Este é um teste. Se o cabeçalho acima apareceu imediatamente e sem precisar de F5, 
        significa que o problema está na forma como a versão antiga desta página buscava os dados.
      </p>
    </div>
  );
}