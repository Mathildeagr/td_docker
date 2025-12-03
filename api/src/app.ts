import 'dotenv/config';
import { AppDataSource } from './config/data-source';
import { createServer, registerPlugins } from './config/server';
import { healthRoutes } from './routes/health.routes';
import { itemRoutes } from './routes/item.routes';

const start = async () => {
  const fastify = createServer();

  try {
    await AppDataSource.initialize();
    
    await registerPlugins(fastify);

    await fastify.register(healthRoutes, { prefix: '/api' });
    await fastify.register(itemRoutes, { prefix: '/api/items' });

    const port = Number(process.env.PORT);
    const host = '0.0.0.0';
    
    await fastify.listen({ port, host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  const shutdown = async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await fastify.close();
    await AppDataSource.destroy();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start();