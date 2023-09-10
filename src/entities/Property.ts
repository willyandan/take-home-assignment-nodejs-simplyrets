import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @IsString()
  @Column({ type: 'text' })
  address: string;

  @IsPositive()
  @Column({ type: 'decimal' })
  price: number;

  @IsInt()
  @IsPositive()
  @Column({ type: 'smallint' })
  bedrooms: number;

  @IsInt()
  @IsPositive()
  @Column({ type: 'smallint' })
  bathrooms: number;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  type: string | null;
}
