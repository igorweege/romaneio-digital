// app/api/sign/route.ts - VERSÃO COM RENOMEAÇÃO DE ARQUIVO

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { UploadClient } from '@uploadcare/upload-client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const uploadClient = new UploadClient({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY || '',
});

const signSchema = z.object({
  romaneioId: z.string(),
  signatureImage: z.string().startsWith('data:image/png;base64,'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = signSchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const { romaneioId, signatureImage } = validatedData.data;

    const romaneio = await prisma.romaneio.findUnique({
      where: { id: romaneioId, isSigned: false },
    });

    if (!romaneio || !romaneio.fileUrl) {
      throw new Error('Romaneio não encontrado ou PDF original ausente.');
    }

    const originalPdfBytes = await fetch(romaneio.fileUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    const signatureImageBytes = Buffer.from(signatureImage.split(',')[1], 'base64');
    const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
    
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();
    
    const signatureHeight = 75;
    const signatureWidth = 150;
    
    firstPage.drawImage(signatureImageEmbed, {
      x: width - signatureWidth - 20,
      y: height - signatureHeight - 15,
      width: signatureWidth,
      height: signatureHeight,
    });

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const signatureDate = new Date(); // Guardamos o objeto Date para usar depois
    const formattedDate = signatureDate.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
    firstPage.drawText(`Assinado digitalmente em: ${formattedDate}`, {
        x: width - signatureWidth - 20,
        y: height - signatureHeight - 15 - 15,
        size: 8,
        font: helveticaFont,
        color: rgb(0.2, 0.2, 0.2),
    });

    const signedPdfBytes = await pdfDoc.save();
    const signedPdfBuffer = Buffer.from(signedPdfBytes);

    // --- LÓGICA DE RENOMEAÇÃO DO ARQUIVO ---
    const today = new Date();
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const sanitizedName = romaneio.nomeCompleto.replace(/[^a-zA-Z0-9]/g, '_').replace(/_{2,}/g, '_');
    const newFileName = `${sanitizedName}_${dateString}.pdf`;
    // --- FIM DA LÓGICA DE RENOMEAÇÃO ---

    const signedPdfUploadResult = await uploadClient.uploadFile(signedPdfBuffer, {
      fileName: newFileName, // Usando o novo nome de arquivo
      contentType: 'application/pdf',
    });
    
    if (!signedPdfUploadResult?.cdnUrl) {
      throw new Error('Falha no upload do PDF assinado.');
    }

    const updatedRomaneio = await prisma.romaneio.update({
      where: {
        id: romaneioId,
      },
      data: {
        isSigned: true,
        signedAt: signatureDate,
        signatureImageUrl: (await uploadClient.uploadFile(Buffer.from(signatureImage.split(',')[1], 'base64'))).cdnUrl,
        fileUrl: signedPdfUploadResult.cdnUrl,
        fileName: newFileName, // Salvando o novo nome no banco de dados
      },
    });

    return NextResponse.json(updatedRomaneio, { status: 200 });

  } catch (error) {
    console.error("Erro ao salvar e mesclar assinatura:", error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}