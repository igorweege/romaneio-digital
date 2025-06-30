// app/api/email/send-link/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { createLogEntry } from '@/lib/logging';

const sendLinkSchema = z.object({
  romaneioId: z.string(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const validatedData = sendLinkSchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'ID do romaneio inválido.' }, { status: 400 });
    }

    const { romaneioId } = validatedData.data;

    const romaneio = await prisma.romaneio.findUnique({
      where: { id: romaneioId },
    });

    if (!romaneio) {
      throw new Error('Romaneio não encontrado.');
    }
    if (!romaneio.emailSolicitante) {
      throw new Error('Este romaneio não possui um email de solicitante para envio.');
    }
    if (romaneio.isSigned) {
      throw new Error('Este romaneio já foi assinado.');
    }

    const signingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/assinar/${romaneio.signatureToken}`;

    // Envia o email usando nosso serviço
    await sendEmail({
      to: romaneio.emailSolicitante,
      subject: `Ação Requerida: Assinatura de Documento - ${romaneio.nomeCompleto}`,
      html: `
        <h1>Assinatura de Romaneio Pendente</h1>
        <p>Olá, ${romaneio.nomeCompleto},</p>
        <p>Um documento foi gerado em seu nome e requer sua assinatura.</p>
        <p>Por favor, acesse o link abaixo para visualizar o documento e assiná-lo:</p>
        <p><a href="${signingLink}">${signingLink}</a></p>
        <br>
        <p>Atenciosamente,</p>
        <p>Sistema de Romaneio Digital</p>
      `,
    });

    // Registra o evento no log
    await createLogEntry({
      userId: session.user.id,
      romaneioId: romaneio.id,
      message: `Enviou o link de assinatura para '${romaneio.nomeCompleto}' no email '${romaneio.emailSolicitante}'.`,
      action: 'ROMANEIO_CREATED', // Podemos criar uma ação nova depois se quisermos
    });

    return NextResponse.json({ message: 'Email enviado com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error("Falha ao enviar email:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}