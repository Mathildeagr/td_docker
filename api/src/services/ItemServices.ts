import { ItemRepository } from '../repositories/ItemRepository';
import { Item } from '../entities/Item';

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async getAllItems(): Promise<Item[]> {
    return await this.itemRepository.findAll();
  }

  async getItemById(id: number): Promise<Item | null> {
    return await this.itemRepository.findById(id);
  }

  async createItem(data: { name: string; description?: string; price: number }): Promise<Item> {
    if (!data.name || data.price === undefined) {
      throw new Error('Name and price are required');
    }

    return await this.itemRepository.create({
      name: data.name,
      description: data.description || null,
      price: data.price
    });
  }

  async updateItem(id: number, data: Partial<Item>): Promise<Item | null> {
    const item = await this.itemRepository.update(id, data);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  async deleteItem(id: number): Promise<void> {
    const deleted = await this.itemRepository.delete(id);
    if (!deleted) {
      throw new Error('Item not found');
    }
  }
}