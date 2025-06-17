// app/api/romaneios/assinar/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { put } from '@vercel/blob';
import { headers } from 'next/headers'; // Usado para pegar o IP do usuário

export async function POST(request: Request) {
  try {
    // 1. Pega os dados enviados pelo formulário de assinatura
    const body = await request.json();
    const { romaneioId, signerName, signatureImage } = body; // signatureImage é a imagem em base64

    if (!romaneioId || !signerName || !signatureImage) {
      return NextResponse.json({ error: 'Dados insuficientes para assinar.' }, { status: 400 });
    }
    
    // 2. Busca o romaneio original no banco de dados
    const romaneio = await prisma.romaneio.findUnique({ where: { id: romaneioId }});
    if (!romaneio || romaneio.isSigned) {
      return NextResponse.json({ error: 'Romaneio não encontrado ou já assinado.' }, { status: 404 });
    }
    
    // 3. Carrega o PDF original do Vercel Blob
    const originalPdfBytes = await fetch(romaneio.storageUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    
    // 4. Carrega a imagem da assinatura
    const signatureImageBytes = Buffer.from(signatureImage.split('base64,')[1], 'base64');
    const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);
    
    // 5. Adiciona a assinatura e os textos na primeira página do PDF
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();
    
    // Posiciona a assinatura no canto inferior direito
    firstPage.drawImage(signatureImageEmbed, {
      x: width - 170, // Posição X (distância da borda esquerda)
      y: 50,         // Posição Y (distância da borda inferior)
      width: 150,    // Largura da imagem
      height: 75,    // Altura da imagem
    });

    // Adiciona os textos abaixo da assinatura
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const date = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const ip = headers().get('x-forwarded-for') ?? 'IP não detectado';
    const signatureText = `Assinado por: ${signerName}\nData: ${date}\nIP: ${ip}`;
    
    firstPage.drawText(signatureText, {
        x: width - 170,
        y: 20,
        size: 8,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
        lineHeight: 10,
    });

    // 6. Salva o novo PDF (com a assinatura) em memória
    const newPdfBytes = await pdfDoc.save();
    
    // 7. Faz o upload do novo PDF assinado para o Vercel Blob
    const signedFilename = `assinado-${romaneio.fileName}`;
    const signedBlob = await put(signedFilename, newPdfBytes, {
      access: 'public',
      contentType: 'application/pdf',
    });
    
    // 8. Atualiza o registro do romaneio no nosso banco de dados
    const updatedRomaneio = await prisma.romaneio.update({
      where: { id: romaneioId },
      data: {
        isSigned: true,
        signedAt: new Date(),
        signerName: signerName,
        signerIp: ip,
        signedUrl: signedBlob.url, // Salva a URL do novo PDF assinado
      }
    });

    return NextResponse.json(updatedRomaneio, { status: 200 });

  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    return NextResponse.json({ error: 'Erro interno do servidor ao salvar assinatura.' }, { status: 500 });
  }
}