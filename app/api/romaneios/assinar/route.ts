// app/api/romaneios/assinar/route.ts - VERSÃO FINAL COM UPLOADCARE
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { Prisma } from '@prisma/client';
import { UploadClient } from '@uploadcare/upload-client'; // 1. Importar o Uploadcare

const resend = new Resend(process.env.RESEND_API_KEY);
// 2. Inicializar o cliente do Uploadcare
const uploadClient = new UploadClient({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { romaneioId, signerName, signatureImage } = body;

    if (!romaneioId || !signerName || !signatureImage) {
      return NextResponse.json({ error: 'Dados insuficientes para assinar.' }, { status: 400 });
    }
    
    const romaneio = await prisma.romaneio.findUnique({ where: { id: romaneioId }});
    if (!romaneio || romaneio.isSigned) {
      return NextResponse.json({ error: 'Romaneio não encontrado ou já assinado.' }, { status: 404 });
    }
    
    // A URL agora vem do Uploadcare, mas o processo de fetch é o mesmo
    const originalPdfBytes = await fetch(romaneio.storageUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    
    const signatureImageBytes = Buffer.from(signatureImage.split('base64,')[1], 'base64');
    const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
    
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();
    
    firstPage.drawImage(signatureImageEmbed, { x: width - 170, y: 50, width: 150, height: 75 });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const ip = headers().get('x-forwarded-for') ?? 'IP não detectado';
    const signatureText = `Assinado por: ${signerName}\nData: ${date}\nIP: ${ip}`;
    
    firstPage.drawText(signatureText, { x: width - 170, y: 20, size: 8, font, color: rgb(0.2, 0.2, 0.2), lineHeight: 10 });

    const newPdfBytes = await pdfDoc.save();
    
    // 3. Fazer o upload do novo PDF assinado para o UPLOADCARE
    const signedFilename = `assinado-${romaneio.fileName}`;
    const uploadResult = await uploadClient.uploadFile(Buffer.from(newPdfBytes), {
        fileName: signedFilename,
        contentType: 'application/pdf',
    });

    const updatedRomaneio = await prisma.romaneio.update({
      where: { id: romaneioId },
      data: {
        isSigned: true,
        signedAt: new Date(),
        signerName: signerName,
        signerIp: ip,
        signedUrl: uploadResult.cdnUrl, // <-- Usando a nova URL do Uploadcare
      }
    });
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'vieiraweege@gmail.com',
      subject: `Documento Assinado: ${romaneio.fileName}`,
      html: `<p>Olá,</p><p>O documento <strong>${romaneio.fileName}</strong> foi assinado com sucesso por <strong>${signerName}</strong>.</p><p>O PDF assinado está em anexo.</p><p>Obrigado!</p>`,
      attachments: [
        {
          filename: signedFilename,
          content: Buffer.from(newPdfBytes),
        },
      ],
    });

    return NextResponse.json(updatedRomaneio, { status: 200 });

  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Erro interno do servidor ao salvar assinatura.' }, { status: 500 });
  }
}