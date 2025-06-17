// app/api/romaneios/route.ts - VERSÃO ATUALIZADA COM UPLOADCARE
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { UploadClient } from '@uploadcare/upload-client'; // 1. Importar o cliente do Uploadcare

// 2. Inicializar o cliente do Uploadcare com a chave pública
const uploadClient = new UploadClient({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY || '',
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
  }
  
  try {
    // 3. Converter o arquivo para um formato que o Uploadcare entende (Buffer)
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 4. Fazer o upload para o Uploadcare
    const uploadResult = await uploadClient.uploadFile(fileBuffer, {
      fileName: file.name,
      contentType: file.type,
      // A chave secreta é usada implicitamente pelo SDK em ambiente de servidor
    });

    const signatureToken = randomBytes(20).toString('hex');
    
    // 5. Salvar as informações no nosso banco de dados, usando a URL do Uploadcare
    const romaneio = await prisma.romaneio.create({
      data: {
        fileName: file.name,
        storageUrl: uploadResult.cdnUrl, // <-- Usando a URL do Uploadcare
        signatureToken: signatureToken,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(romaneio, { status: 201 });

  } catch (error) {
    console.error("Erro no upload do romaneio via Uploadcare:", error);
    return NextResponse.json({ error: 'Erro interno do servidor ao processar o arquivo.' }, { status: 500 });
  }
}