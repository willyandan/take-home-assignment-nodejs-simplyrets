import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'smallint' })
  bedrooms: number;

  @Column({ type: 'smallint' })
  bathrooms: number;

  @Column({ type: 'text', nullable: true })
  type: string | null;
}
