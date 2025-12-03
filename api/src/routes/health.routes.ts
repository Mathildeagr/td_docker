import { FastifyInstance } from 'fastify';
import { AppDataSource } from '../config/data-source';

export const healthRoutes = async (app: FastifyInstance) => {
  app.get('/health', {
    schema: {
      description: 'Vérifie l\'état de santé de l\'API et de la base de données',
      tags: ['Health']
    }
  }, async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: AppDataSource.isInitialized ? 'connected' : 'disconnected'
    };
  });

  app.get('/status', {
    schema: {
      description: 'Retourne le statut de l\'API',
      tags: ['Status']
    }
  }, async () => {
    return {
      message: "API opérationnelle",
      uptime: process.uptime(),
      version: "1.0.0"
    };
  });
};