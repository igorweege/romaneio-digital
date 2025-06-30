// lib/email.ts

import nodemailer from 'nodemailer';

// Puxamos as credenciais do nosso arquivo .env
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

// Verificação para garantir que todas as variáveis de ambiente estão presentes
if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
  console.warn("As credenciais de SMTP não estão totalmente configuradas. O envio de emails estará desabilitado.");
}

// Criamos o "transportador" - o objeto que sabe como se conectar ao seu servidor
export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // True para a porta 465, false para as outras como 587
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

// Uma interface para padronizar os dados do email
export interface EmailData {
    to: string;
    subject: string;
    html: string;
}

// Uma função de ajuda para enviar o email
export const sendEmail = async (data: EmailData) => {
    // Se as credenciais não estiverem configuradas, não tenta enviar.
    if (!smtpHost) {
        console.error("Tentativa de enviar email, mas o SMTP não está configurado.");
        throw new Error("O serviço de email não está configurado no servidor.");
    }

    // Usamos o 'from' com o nome da aplicação e o email do usuário configurado
    const from = `Romaneio Digital <${smtpUser}>`;

    return await transporter.sendMail({
        from,
        ...data
    });
}