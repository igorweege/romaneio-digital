// app/api/romaneios/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação com Zod
const createRomaneioSchema = z.object({
  nomeCompleto: z.string().min(3, 'O nome completo é obrigatório.'),
  cpf: z.string().optional(),
  emailSolicitante: z.string().email('Formato de e-mail inválido.').optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // 1. Proteção da Rota: Verificar se o usuário está logado
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const json = await request.json();

  // 2. Validação dos Dados
  const validatedFields = createRomaneioSchema.safeParse(json);

  if (!validatedFields.success) {
    return NextResponse.json({ errors: validatedFields.error.format() }, { status: 400 });
  }

  const { nomeCompleto, cpf, emailSolicitante } = validatedFields.data;

  try {
    // 3. Criação no Banco de Dados
    const novoRomaneio = await prisma.romaneio.create({
      data: {
        nomeCompleto,
        cpf: cpf || null, // Garante que o valor seja null se vazio
        emailSolicitante: emailSolicitante || null, // Garante que o valor seja null se vazio
        authorId: session.user.id, // Associa o romaneio ao usuário logado
      },
    });

    // 4. Resposta de Sucesso
    return NextResponse.json(novoRomaneio, { status: 201 });

  } catch (error) {
    console.error("Falha ao criar romaneio:", error);
    return NextResponse.json({ error: 'Ocorreu um erro ao salvar o romaneio.' }, { status: 500 });
  }
}