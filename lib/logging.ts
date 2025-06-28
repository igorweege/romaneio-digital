// lib/logging.ts - VERSÃO CORRIGIDA

import prisma from './prisma';
import type { LogAction } from '@prisma/client';

interface LogData {
  message: string;
  userId?: string;
  romaneioId?: string;
  action: LogAction; // Ação agora é um campo obrigatório do tipo LogAction
}

/**
 * Cria uma nova entrada de log no banco de dados.
 * @param {LogData} logData - Os dados para o registro de log.
 */
export async function createLogEntry(logData: LogData): Promise<void> {
  try {
    // Construímos o objeto de dados dinamicamente
    const data: any = {
      message: logData.message,
      action: logData.action,
    };

    if (logData.userId) {
      data.userId = logData.userId;
    }
    if (logData.romaneioId) {
      data.romaneioId = logData.romaneioId;
    }

    await prisma.logEntry.create({
      data: data,
    });
  } catch (error) {
    console.error("Falha ao criar entrada de log:", error);
  }
}