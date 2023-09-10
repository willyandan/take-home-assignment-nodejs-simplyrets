import { DataSource } from 'typeorm';
import { Property } from './entities';

const AppDataSource = new DataSource({
  logging: false,
  type: 'sqlite',
  database: ':memory:',
  entities: [Property],
  synchronize: true, // synchronize the database schema with the entity classes
});

export default AppDataSource;

export const seedDb = async (appDataSource: DataSource) => {
  const { default: data } = await import('./data/seed.json');
  await appDataSource.manager.insert(Property, data);
};
