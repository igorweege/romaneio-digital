// app/api/romaneios/route.ts - VERSÃO COM VERIFICAÇÃO EXTRA

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UploadClient } from '@uploadcare/upload-client';

const uploadClient = new UploadClient({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY || '',
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const nomeCompleto = formData.get('nomeCompleto') as string | null;
    const cpf = formData.get('cpf') as string | null;
    const emailSolicitante = formData.get('emailSolicitante') as string | null;

    if (!file || !nomeCompleto) {
      return NextResponse.json(
        { error: 'Arquivo PDF e Nome Completo são obrigatórios.' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadClient.uploadFile(fileBuffer, {
      fileName: file.name,
      contentType: file.type,
    });

    // NOVA VERIFICAÇÃO DE SEGURANÇA
    if (!uploadResult?.cdnUrl) {
      throw new Error("Falha no upload do arquivo para o serviço de armazenamento.");
    }

    const novoRomaneio = await prisma.romaneio.create({
      data: {
        nomeCompleto,
        cpf: cpf || null,
        emailSolicitante: emailSolicitante || null,
        authorId: session.user.id,
        fileName: file.name,
        fileUrl: uploadResult.cdnUrl,
      },
    });
    
    return NextResponse.json(novoRomaneio, { status: 201 });

  } catch (error) {
    console.error("Falha ao criar romaneio com upload:", error);
    // Verificamos se o erro já tem uma mensagem legível
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}