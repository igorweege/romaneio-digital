// app/api/romaneios/assinar/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { put } from '@vercel/blob';
import { headers } from 'next/headers';
import { Resend } from 'resend'; // <-- 1. IMPORTAR RESEND
import { Prisma } from '@prisma/client';

// Inicializar o Resend com a chave de API que está nas variáveis de ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // ... (TODA A LÓGICA EXISTENTE DE ASSINATURA ATÉ O PASSO 8) ...
    // 1. Pega os dados
    const body = await request.json();
    const { romaneioId, signerName, signatureImage } = body;
    if (!romaneioId || !signerName || !signatureImage) {
      return NextResponse.json({ error: 'Dados insuficientes para assinar.' }, { status: 400 });
    }
    // 2. Busca o romaneio
    const romaneio = await prisma.romaneio.findUnique({ where: { id: romaneioId }});
    if (!romaneio || romaneio.isSigned) {
      return NextResponse.json({ error: 'Romaneio não encontrado ou já assinado.' }, { status: 404 });
    }
    // 3. Carrega o PDF
    const originalPdfBytes = await fetch(romaneio.storageUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    // 4. Carrega a assinatura
    const signatureImageBytes = Buffer.from(signatureImage.split('base64,')[1], 'base64');
    const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
    // 5. Adiciona a assinatura e os textos
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawImage(signatureImageEmbed, { x: width - 170, y: 50, width: 150, height: 75 });
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const ip = headers().get('x-forwarded-for') ?? 'IP não detectado';
    const signatureText = `Assinado por: ${signerName}\nData: ${date}\nIP: ${ip}`;
    firstPage.drawText(signatureText, { x: width - 170, y: 20, size: 8, font: font, color: rgb(0.2, 0.2, 0.2), lineHeight: 10 });
    // 6. Salva o novo PDF
    const newPdfBytes = await pdfDoc.save();
    // 7. Faz o upload do PDF assinado
    const signedFilename = `assinado-${romaneio.fileName}`;
    const signedBlob = await put(signedFilename, Buffer.from(newPdfBytes), { access: 'public', contentType: 'application/pdf' });
    // 8. Atualiza o registro no banco
    const updatedRomaneio = await prisma.romaneio.update({
      where: { id: romaneioId },
      data: { isSigned: true, signedAt: new Date(), signerName: signerName, signerIp: ip, signedUrl: signedBlob.url }
    });
    
    // --- INÍCIO DA NOVA PARTE ---
    // 9. Enviar e-mail de confirmação com o PDF assinado em anexo
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Usamos o endereço de teste do Resend por enquanto
      to: 'igor.weege@osirnet.com.br', // E-mail de destino para o teste
      subject: `Documento Assinado: ${romaneio.fileName}`,
      html: `<p>Olá,</p><p>O documento <strong>${romaneio.fileName}</strong> foi assinado com sucesso por <strong>${signerName}</strong>.</p><p>O PDF assinado está em anexo.</p><p>Obrigado!</p>`,
      attachments: [
        {
          filename: `assinado-${romaneio.fileName}`,
          content: Buffer.from(newPdfBytes), // Anexa o PDF que acabamos de criar
        },
      ],
    });
    // --- FIM DA NOVA PARTE ---

    return NextResponse.json(updatedRomaneio, { status: 200 });

  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor ao salvar assinatura.' }, { status: 500 });
  }
}