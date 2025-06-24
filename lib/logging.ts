// lib/logging.ts

import prisma from './prisma';

interface LogData {
  message: string;
  userId?: string;
  romaneioId?: string;
}

/**
 * Cria uma nova entrada de log no banco de dados.
 * @param {LogData} logData - Os dados para o registro de log.
 */
export async function createLogEntry(logData: LogData): Promise<void> {
  try {
    await prisma.logEntry.create({
      data: {
        message: logData.message,
        userId: logData.userId,
        romaneioId: logData.romaneioId,
      },
    });
  } catch (error) {
    // Se a criação do log falhar, apenas registramos o erro no console
    // para não quebrar a funcionalidade principal que o usuário está executando.
    console.error("Falha ao criar entrada de log:", error);
  }
}