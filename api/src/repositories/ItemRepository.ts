import { AppDataSource } from '../config/data-source';
import { Item } from '../entities/Item';

export class ItemRepository {
  private repository = AppDataSource.getRepository(Item);

  async findAll(): Promise<Item[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Item | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Item>): Promise<Item> {
    const item = this.repository.create(data);
    return await this.repository.save(item);
  }

  async update(id: number, data: Partial<Item>): Promise<Item | null> {
    const item = await this.findById(id);
    if (!item) return null;

    Object.assign(item, data);
    return await this.repository.save(item);
  }

  async delete(id: number): Promise<boolean> {
    const item = await this.findById(id);
    if (!item) return false;

    await this.repository.remove(item);
    return true;
  }
}