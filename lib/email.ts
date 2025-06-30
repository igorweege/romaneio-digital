// lib/email.ts - VERSÃO COM AJUSTE DE TLS

import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
  console.warn("As credenciais de SMTP não estão totalmente configuradas. O envio de emails estará desabilitado.");
}

export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, 
  // Adicionamos esta linha para forçar uma conexão segura em portas não padrão
  requireTLS: true, 
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export interface EmailData {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (data: EmailData) => {
    if (!smtpHost) {
        console.error("Tentativa de enviar email, mas o SMTP não está configurado.");
        throw new Error("O serviço de email não está configurado no servidor.");
    }

    const from = `Romaneio Digital <${smtpUser}>`;

    return await transporter.sendMail({
        from,
        ...data
    });
}