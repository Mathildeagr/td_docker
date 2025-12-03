import { FastifyRequest, FastifyReply } from 'fastify';
import { ItemService } from '../services/ItemServices';

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const items = await this.itemService.getAllItems();
      return items;
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: number };
      const item = await this.itemService.getItemById(Number(id));
      
      if (!item) {
        return reply.code(404).send({ error: 'Item not found' });
      }
      
      return item;
    } catch (error) {
      reply.code(500).send({ error: 'Internal server error' });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as { name: string; description?: string; price: number };
      const item = await this.itemService.createItem(data);
      return reply.code(201).send(item);
    } catch (error: any) {
      reply.code(400).send({ error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: number };
      const data = request.body as Partial<{ name: string; description: string; price: number }>;
      
      const item = await this.itemService.updateItem(Number(id), data);
      return item;
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: number };
      await this.itemService.deleteItem(Number(id));
      return { message: 'Item deleted successfully' };
    } catch (error: any) {
      reply.code(404).send({ error: error.message });
    }
  }
}