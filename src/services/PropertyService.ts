import {
  ValidationError as ClassValidatorError,
  validateOrReject,
} from 'class-validator';
import 'reflect-metadata';
import { DeepPartial, EntityNotFoundError } from 'typeorm';
import AppDataSource from '../dataSource';
import { Property } from '../entities';
import { PropertyFilter } from '../entities/PropertyFilter';
import { NotFoundError } from '../entities/errors/NotFoundError';
import { ValidationError } from '../entities/errors/ValidationError';

export class PropertyService {
  private propertyRepository = AppDataSource.getRepository(Property);

  async getAllProperties(
    filter: PropertyFilter,
    page: number = 1,
    perPage: number = 10,
  ) {
    const skip = Math.max(page - 1, 0) * perPage;
    const [properties, total] = await this.propertyRepository.findAndCount({
      take: perPage,
      skip,
      where: filter.toTypeOrmWhere(),
      cache: true,
    });
    return { properties, total, page, perPage };
  }

  async findPropertyById(id: number) {
    try {
      const property = await this.propertyRepository.findOneByOrFail({
        id: id,
      });
      return property;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError(`Property with id ${id} not found`);
      }
      throw error;
    }
  }

  async createProperty(fields: Omit<DeepPartial<Property>, 'id'>) {
    try {
      await validateOrReject(this.propertyRepository.create(fields));
      const property = this.propertyRepository.save(fields);
      return property;
    } catch (error) {
      if (Array.isArray(error) && error[0] instanceof ClassValidatorError) {
        throw new ValidationError('Bad Request', error);
      }
      throw error;
    }
  }

  async updateProperty(id: number, fields: Omit<DeepPartial<Property>, 'id'>) {
    try {
      const propertyExists = await this.propertyRepository.exist({
        where: { id },
      });
      if (!propertyExists) {
        throw new NotFoundError(`Property with id ${id} not found`);
      }
      await validateOrReject(this.propertyRepository.create({ ...fields, id }));
      const property = await this.propertyRepository.save({ ...fields, id });
      return property;
    } catch (error) {
      if (Array.isArray(error) && error[0] instanceof ClassValidatorError) {
        throw new ValidationError('Bad Request', error);
      }
      throw error;
    }
  }

  async deleteProperty(id: number) {
    const propertyExists = await this.propertyRepository.exist({
      where: { id },
    });
    if (!propertyExists) {
      throw new NotFoundError(`Property with id ${id} not found`);
    }
    await this.propertyRepository.delete({ id });
    return { success: true };
  }
}
