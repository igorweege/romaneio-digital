// app/api/sign/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { UploadClient } from '@uploadcare/upload-client';

const uploadClient = new UploadClient({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY || '',
});

// Schema para validar os dados recebidos
const signSchema = z.object({
  romaneioId: z.string(),
  signatureImage: z.string().startsWith('data:image/png;base64,'), // Garante que é uma imagem PNG em base64
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = signSchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const { romaneioId, signatureImage } = validatedData.data;

    // 1. Converte a imagem base64 para um Buffer (formato de arquivo)
    const base64Data = signatureImage.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // 2. Faz o upload da imagem da assinatura para o Uploadcare
    const uploadResult = await uploadClient.uploadFile(imageBuffer, {
        fileName: `signature-${romaneioId}.png`,
        contentType: 'image/png',
    });

    if (!uploadResult?.cdnUrl) {
        throw new Error("Falha no upload da imagem da assinatura.");
    }

    // 3. Atualiza o romaneio no banco de dados
    const updatedRomaneio = await prisma.romaneio.update({
      where: {
        id: romaneioId,
        isSigned: false, // Garante que só podemos assinar uma vez
      },
      data: {
        isSigned: true,
        signedAt: new Date(),
        signatureImageUrl: uploadResult.cdnUrl,
      },
    });

    return NextResponse.json(updatedRomaneio, { status: 200 });

  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    // Verificamos se o erro já tem uma mensagem legível
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}