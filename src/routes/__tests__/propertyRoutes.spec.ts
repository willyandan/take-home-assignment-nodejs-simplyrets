import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import { PropertyService } from '../../services';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb(AppDataSource);
  });

  describe('GET /properties', () => {
    it('should return all properties', async () => {
      const response = await request(app).get(`/properties`);
      expect(response.body.properties.length).toBe(10);
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.page).toBe(1);
      expect(response.body.perPage).toBe(10);
    });
    it.each([
      [1, 10],
      [2, 10],
      [1, 5],
      [2, 5],
    ])(
      'should return all properties on page %p getting %p per page',
      async (page, perPage) => {
        const response = await request(app).get(
          `/properties?page=${page}&perPage=${perPage}`,
        );
        expect(response.body.properties.length).toBe(perPage);
        expect(response.body.total).toBeGreaterThan(0);
        expect(response.body.page).toBe(page);
        expect(response.body.perPage).toBe(perPage);
      },
    );

    it('should filter the properties', async () => {
      const response = await request(app).get(
        `/properties?minPrice=20764444&maxPrice=30764446&minBedrooms=1&maxBedrooms=10&minBathrooms=1&maxBathrooms=10&type=Townhouse`,
      );

      expect(response.body.properties.length).toBe(3);
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.page).toBe(1);
      expect(response.body.perPage).toBe(10);
    });

    it('should return 400 when the filter is invalid', async () => {
      const response = await request(app).get(
        `/properties?maxPrice=pricestring`,
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        message: 'Error 400: Bad request',
        errors: ['maxPrice must be a positive number'],
      });
    });
  });

  describe('GET /properties/:id', () => {
    it('should return a property by the id', async () => {
      const response = await request(app).get(`/properties/1`);

      expect(response.body).toEqual({
        address: '74434 East Sweet Bottom Br #18393',
        bathrooms: 5,
        bedrooms: 2,
        id: 1,
        price: 20714261,
        type: null,
      });
    });
    it('should return 404 when try to found a property that do not exist', async () => {
      const response = await request(app).get(`/properties/1000`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: 404,
        message: 'Error 404: Property with id 1000 not found',
      });
    });
  });

  describe('POST /properties', () => {
    it('should create a new property', async () => {
      const response = await request(app).post(`/properties`).send({
        address: 'Test property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Apartment',
      });

      expect(response.body).toEqual({
        address: 'Test property',
        bathrooms: 1,
        bedrooms: 1,
        id: 127,
        price: 20000,
        type: 'Apartment',
      });
    });
    it('should return 400 when try to create a property with bad data', async () => {
      const response = await request(app).post(`/properties`).send({
        address: 'Test property',
        price: '20000',
        bedrooms: -1,
        bathrooms: -1,
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        errors: [
          'price must be a positive number',
          'bedrooms must be a positive number',
          'bathrooms must be a positive number',
        ],
        message: 'Error 400: Bad Request',
      });
    });
  });

  describe('PUT /properties/:id', () => {
    it('should update a property', async () => {
      const response = await request(app).put(`/properties/1`).send({
        address: 'Update property',
        price: 10000,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Update',
      });

      expect(response.body).toEqual({
        address: 'Update property',
        bathrooms: 1,
        bedrooms: 1,
        id: 1,
        price: 10000,
        type: 'Update',
      });
    });
    it('should return 400 when try to update a property with bad data', async () => {
      const response = await request(app).put(`/properties/1`).send({
        address: 'update property',
        price: '20000',
        bedrooms: -1,
        bathrooms: -1,
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        errors: [
          'price must be a positive number',
          'bedrooms must be a positive number',
          'bathrooms must be a positive number',
        ],
        message: 'Error 400: Bad Request',
      });
    });
    it('should return 404 when try to update a property that do not exist', async () => {
      const response = await request(app).put(`/properties/1000`).send({
        address: 'update property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: 404,
        message: 'Error 404: Property with id 1000 not found',
      });
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should delete a property', async () => {
      const response = await request(app).delete(`/properties/1`);

      expect(response.body).toEqual({
        success: true,
      });
    });
    it('should return 404 when try to delete a property that do not exist', async () => {
      const response = await request(app).delete(`/properties/1000`).send({
        address: 'update property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        code: 404,
        message: 'Error 404: Property with id 1000 not found',
      });
    });
  });

  describe('Internal server error', () => {
    it('should not expose the real error when a internal server error happens', async () => {
      jest
        .spyOn(PropertyService.prototype, 'getAllProperties')
        .mockImplementation(() => {
          throw new Error('test error');
        });
      const response = await request(app).get(`/properties`);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        message: 'Error 500: Internal server error',
      });
    });
  });
});
