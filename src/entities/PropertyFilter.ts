import { Expose, Type } from 'class-transformer';
import { IsInt, IsPositive, IsString } from 'class-validator';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { Property } from './Property';

export class PropertyFilter {
  @IsInt()
  @IsPositive()
  @Expose()
  @Type(() => Number)
  id?: number;

  @IsString()
  @Expose()
  @Type(() => String)
  address?: string;

  @IsPositive()
  @Expose()
  @Type(() => Number)
  minPrice?: number;

  @IsPositive()
  @Expose()
  @Type(() => Number)
  maxPrice?: number;

  @IsInt()
  @IsPositive()
  @Expose()
  @Type(() => Number)
  minBedrooms?: number;

  @IsInt()
  @IsPositive()
  @Expose()
  @Type(() => Number)
  maxBedrooms?: number;

  @IsInt()
  @IsPositive()
  @Expose()
  @Type(() => Number)
  minBathrooms?: number;

  @IsInt()
  @IsPositive()
  @Expose()
  @Type(() => Number)
  maxBathrooms?: number;

  @IsString()
  @Expose()
  @Type(() => String)
  type?: string;

  toTypeOrmWhere() {
    const whereClause: any = {};
    ['id', 'address', 'type'].forEach((type) => {
      if (this[type as keyof PropertyFilter] !== undefined) {
        whereClause[type] = this[type as keyof PropertyFilter];
      }
    });
    ['bathrooms', 'bedrooms', 'price'].forEach((type) => {
      const capitalizedType = `${type.slice(0, 1).toUpperCase()}${type.slice(
        1,
      )}`;
      const minType = `min${capitalizedType}` as keyof PropertyFilter;
      const maxType = `max${capitalizedType}` as keyof PropertyFilter;
      if (this[minType] && this[maxType]) {
        whereClause[type] = Between(this[minType], this[maxType]);
      } else if (this[minType]) {
        whereClause[type] = MoreThanOrEqual(this[minType]);
      } else if (this[maxType]) {
        whereClause[type] = LessThanOrEqual(this[maxType]);
      }
    });
    return whereClause as FindOptionsWhere<Property>;
  }
}
