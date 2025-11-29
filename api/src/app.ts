import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import 'dotenv/config';
import { AppDataSource } from './data-source';
import { Item } from './Item';

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await AppDataSource.initialize();
    
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

    fastify.register(async (app) => {
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
    }, { prefix: '/api' });

    fastify.register(async (app) => {
      const itemRepository = AppDataSource.getRepository(Item);

      // GET all items
      app.get('/', {
        schema: {
          description: 'Récupère tous les items',
          tags: ['Items'],
          response: {
            200: {
              description: 'Liste des items',
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        }
      }, async () => {
        return await itemRepository.find();
      });

      // GET item by id
      app.get('/:id', {
        schema: {
          description: 'Récupère un item par son ID',
          tags: ['Items'],
          params: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'ID de l\'item' }
            }
          },
          response: {
            200: {
              description: 'Item trouvé',
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
              }
            },
            404: {
              description: 'Item non trouvé',
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const item = await itemRepository.findOne({ where: { id: Number(id) } });
        
        if (!item) {
          reply.code(404);
          return { error: 'Item not found' };
        }
        
        return item;
      });

      // POST create item
      app.post('/', {
        schema: {
          description: 'Crée un nouvel item',
          tags: ['Items'],
          body: {
            type: 'object',
            properties: {
              name: { 
                type: 'string',
                description: 'Nom de l\'item'
              },
              description: { 
                type: 'string',
                description: 'Description de l\'item (optionnel)'
              },
              price: { 
                type: 'number',
                description: 'Prix de l\'item'
              }
            },
            required: ['name', 'price']
          },
          response: {
            201: {
              description: 'Item créé avec succès',
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
              }
            },
            400: {
              description: 'Données invalides',
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }, async (request, reply) => {
        const { name, description, price } = request.body as { 
          name: string; 
          description?: string; 
          price: number 
        };

        if (!name || price === undefined) {
          reply.code(400);
          return { error: 'Name and price are required' };
        }

        const item = itemRepository.create({ 
          name, 
          description: description || null, 
          price 
        });
        const savedItem = await itemRepository.save(item);
        
        reply.code(201);
        return savedItem;
      });

      // PUT update item
      app.put('/:id', {
        schema: {
          description: 'Met à jour un item existant',
          tags: ['Items'],
          params: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'ID de l\'item' }
            }
          },
          body: {
            type: 'object',
            properties: {
              name: { 
                type: 'string',
                description: 'Nom de l\'item'
              },
              description: { 
                type: 'string',
                description: 'Description de l\'item'
              },
              price: { 
                type: 'number',
                description: 'Prix de l\'item'
              }
            }
          },
          response: {
            200: {
              description: 'Item mis à jour',
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }
              }
            },
            404: {
              description: 'Item non trouvé',
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const { name, description, price } = request.body as { 
          name: string; 
          description?: string; 
          price: number 
        };

        const item = await itemRepository.findOne({ where: { id: Number(id) } });
        
        if (!item) {
          reply.code(404);
          return { error: 'Item not found' };
        }

        if (name !== undefined) item.name = name;
        if (description !== undefined) item.description = description;
        if (price !== undefined) item.price = price;

        const updatedItem = await itemRepository.save(item);
        return updatedItem;
      });

      // DELETE item
      app.delete('/:id', {
        schema: {
          description: 'Supprime un item',
          tags: ['Items'],
          params: {
            type: 'object',
            properties: {
              id: { type: 'number', description: 'ID de l\'item' }
            }
          },
          response: {
            200: {
              description: 'Item supprimé',
              type: 'object',
              properties: {
                message: { type: 'string' }
              }
            },
            404: {
              description: 'Item non trouvé',
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }, async (request, reply) => {
        const { id } = request.params as { id: number };
        
        const item = await itemRepository.findOne({ where: { id: Number(id) } });
        
        if (!item) {
          reply.code(404);
          return { error: 'Item not found' };
        }

        await itemRepository.remove(item);
        return { message: 'Item deleted successfully' };
      });

    }, { prefix: '/api/items' });

    const port = Number(process.env.PORT) || 3000;
    const host = '0.0.0.0';
    
    await fastify.listen({ port, host });
  
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  await AppDataSource.destroy();
  process.exit(0);
});

start();