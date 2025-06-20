// app/api/romaneios/route.ts - VERSÃO CORRIGIDA

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação com Zod
const createRomaneioSchema = z.object({
  nomeCompleto: z.string().min(3, 'O nome completo é obrigatório.'),
  cpf: z.string().optional(),
  // AQUI A CORREÇÃO: Adicionamos .or(z.literal('')) para aceitar texto vazio.
  emailSolicitante: z.string().email('Formato de e-mail inválido.').or(z.literal('')).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const json = await request.json();
  const validatedFields = createRomaneioSchema.safeParse(json);

  if (!validatedFields.success) {
    return NextResponse.json({ errors: validatedFields.error.format() }, { status: 400 });
  }

  const { nomeCompleto, cpf, emailSolicitante } = validatedFields.data;

  try {
    const novoRomaneio = await prisma.romaneio.create({
      data: {
        nomeCompleto,
        cpf: cpf || null,
        emailSolicitante: emailSolicitante || null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(novoRomaneio, { status: 201 });

  } catch (error) {
    console.error("Falha ao criar romaneio:", error);
    return NextResponse.json({ error: 'Ocorreu um erro ao salvar o romaneio.' }, { status: 500 });
  }
}