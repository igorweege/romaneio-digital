// app/admin/editar/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation'; // Importar função de "não encontrado"

// Esta interface descreve os parâmetros que a página recebe da URL
interface EditUserPageProps {
  params: {
    id: string; // O ID virá da URL
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  // Proteção: Apenas Admins podem acessar
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const userId = params.id;

  // Busca os dados do usuário específico no banco
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  // Se o usuário não for encontrado, mostra uma página de erro 404 padrão
  if (!user) {
    notFound();
  }

  return (
    <div className="flex justify-center p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Editar Usuário</h1>
        <p className="mt-2 text-sm text-gray-600">
          Alterando dados de: <strong>{user.name}</strong> ({user.email})
        </p>

        <div className="mt-8 p-8 bg-white rounded-lg shadow-md border">
          <p className="text-gray-500">O formulário de edição aparecerá aqui no próximo passo.</p>
          {/* No próximo passo, substituiremos este parágrafo pelo nosso
            componente de formulário interativo, passando os dados do 'user'.
            Ex: <EditUserForm user={user} />
          */}
        </div>
      </div>
    </div>
  );
}