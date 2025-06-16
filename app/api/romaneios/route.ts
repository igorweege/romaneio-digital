// app/api/romaneios/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  // 1. Proteger a rota - apenas usuários logados podem fazer upload
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  // 2. Pegar o arquivo da requisição
  const form = await request.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
  }
  
  try {
    // 3. Fazer o upload do arquivo para o Vercel Blob
    // Adicionamos um prefixo aleatório para garantir que o nome do arquivo seja único
    const randomPrefix = randomBytes(4).toString('hex');
    const blobFilename = `${randomPrefix}-${file.name}`;
    
    const blob = await put(blobFilename, file, {
      access: 'public', // O arquivo será acessível publicamente pela sua URL
    });

    // 4. Gerar um token único para a página de assinatura
    const signatureToken = randomBytes(20).toString('hex');
    
    // 5. Salvar as informações do romaneio no nosso banco de dados
    const romaneio = await prisma.romaneio.create({
      data: {
        fileName: file.name,
        storageUrl: blob.url, // A URL do arquivo salvo no Vercel Blob
        signatureToken: signatureToken,
        authorId: session.user.id, // Associa o romaneio ao usuário que fez o upload
      },
    });

    // 6. Retornar sucesso com os dados do romaneio criado
    return NextResponse.json(romaneio, { status: 201 });

  } catch (error) {
    console.error("Erro no upload do romaneio:", error);
    return NextResponse.json({ error: 'Erro interno do servidor ao processar o arquivo.' }, { status: 500 });
  }
}