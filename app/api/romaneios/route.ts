// app/api/romaneios/route.ts - VERSÃO COM ENVIO AUTOMÁTICO DE EMAIL

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UploadClient } from '@uploadcare/upload-client';
import { createLogEntry } from '@/lib/logging';
import { sendEmail } from '@/lib/email'; // 1. Importamos o serviço de email

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

    if (!uploadResult?.cdnUrl) {
      throw new Error('Falha no upload do arquivo para o serviço de armazenamento.');
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

    await createLogEntry({
      userId: session.user.id,
      romaneioId: novoRomaneio.id,
      message: `Usuário '${session.user.name}' criou o romaneio para '${novoRomaneio.nomeCompleto}'.`,
      action: 'ROMANEIO_CREATED',
    });

    // ---- NOVA LÓGICA DE ENVIO DE EMAIL ----
    if (novoRomaneio.emailSolicitante) {
      const signingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/assinar/${novoRomaneio.signatureToken}`;

      await sendEmail({
        to: novoRomaneio.emailSolicitante,
        subject: `Ação Requerida: Assinatura de Documento - ${novoRomaneio.nomeCompleto}`,
        html: `
          <h1>Assinatura de Romaneio Pendente</h1>
          <p>Olá, ${novoRomaneio.nomeCompleto},</p>
          <p>Um documento foi gerado em seu nome e requer sua assinatura.</p>
          <p>Por favor, acesse o link abaixo para visualizar o documento e assiná-lo:</p>
          <p><a href="${signingLink}">${signingLink}</a></p>
          <br>
          <p>Atenciosamente,</p>
          <p>Sistema de Romaneio Digital</p>
        `,
      });

      // Log para o envio do email
      await createLogEntry({
        userId: session.user.id,
        romaneioId: novoRomaneio.id,
        message: `Enviou automaticamente o link de assinatura para '${novoRomaneio.emailSolicitante}'.`,
        action: 'ROMANEIO_CREATED'
      });
    }
    // ---- FIM DA LÓGICA DE ENVIO ----

    return NextResponse.json(novoRomaneio, { status: 201 });
  } catch (error) {
    console.error("Falha ao criar romaneio:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}