// app/api/email/send-link/route.ts - VERSÃO FLEXÍVEL

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { createLogEntry } from '@/lib/logging';

// O schema agora aceita um email opcional
const sendLinkSchema = z.object({
  romaneioId: z.string(),
  email: z.string().email().optional(),
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
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const { romaneioId, email: newEmail } = validatedData.data;

    const romaneio = await prisma.romaneio.findUnique({
      where: { id: romaneioId },
    });

    if (!romaneio) throw new Error('Romaneio não encontrado.');
    if (romaneio.isSigned) throw new Error('Este romaneio já foi assinado.');

    // Determina para qual email enviar
    const targetEmail = newEmail || romaneio.emailSolicitante;
    if (!targetEmail) {
      throw new Error('Nenhum email de destino foi fornecido.');
    }

    const signingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/assinar/${romaneio.signatureToken}`;

    await sendEmail({
      to: targetEmail,
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

    await createLogEntry({
      userId: session.user.id,
      romaneioId: romaneio.id,
      message: `Enviou o link de assinatura para '${romaneio.nomeCompleto}' no email '${targetEmail}'.`,
      action: 'ROMANEIO_CREATED',
    });

    return NextResponse.json({ message: 'Email enviado com sucesso!' });

  } catch (error) {
    console.error("Falha ao enviar email:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}