import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });

  describe('GET /properties', () => {
    it('should return all properties', async () => {
      const response = await request(app).get('/properties');

      expect(response.text).toBe('GET all properties');
    });
  });
});
