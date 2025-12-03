import { FastifyInstance } from 'fastify';
import { ItemController } from '../controllers/ItemController';
import { itemSchemas } from '../schemas/item.schemas';

export const itemRoutes = async (app: FastifyInstance) => {
  const itemController = new ItemController();

  app.get('/', {
    schema: itemSchemas.getAll
  }, itemController.getAll.bind(itemController));

  app.get('/:id', {
    schema: itemSchemas.getById
  }, itemController.getById.bind(itemController));

  app.post('/', {
    schema: itemSchemas.create
  }, itemController.create.bind(itemController));

  app.put('/:id', {
    schema: itemSchemas.update
  }, itemController.update.bind(itemController));

  app.delete('/:id', {
    schema: itemSchemas.delete
  }, itemController.delete.bind(itemController));
};