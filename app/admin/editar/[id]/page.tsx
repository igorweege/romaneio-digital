// app/admin/editar/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditUserForm from '@/components/EditUserForm'; // Importar nosso novo formulário

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const userId = params.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

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
        
        {/* Substituímos a mensagem de placeholder pelo nosso formulário real */}
        <div className="mt-8 p-8 bg-white rounded-lg shadow-md border">
          <EditUserForm user={user} />
        </div>
      </div>
    </div>
  );
}