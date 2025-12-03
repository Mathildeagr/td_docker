import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

export const createServer = () => {
  const fastify = Fastify({ logger: true });
  return fastify;
};

export const registerPlugins = async (fastify: any) => {
  await fastify.register(cors, { origin: true });
  
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "TD API - Items Management",
        description: "API de gestion d'items avec CRUD complet",
        version: "1.0.0"
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Health', description: 'Endpoints de santé' },
        { name: 'Status', description: 'Endpoints de statut' },
        { name: 'Items', description: 'CRUD pour les items' }
      ]
    }
  });
  
  await fastify.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: { 
      docExpansion: 'list', 
      deepLinking: true 
    }
  });
};