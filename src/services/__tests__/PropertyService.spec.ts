import { plainToClass } from 'class-transformer';
import { EntityNotFoundError } from 'typeorm';
import AppDataSource, { seedDb } from '../../dataSource';
import { Property } from '../../entities';
import { PropertyFilter } from '../../entities/PropertyFilter';
import { NotFoundError } from '../../entities/errors/NotFoundError';
import { ValidationError } from '../../entities/errors/ValidationError';
import { PropertyService } from '../../services';

describe('PropertyService', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb(AppDataSource);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getAllProperties', () => {
    it('should return all properties', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async findAndCount() {
              return [
                [
                  {
                    address: '74434 East Sweet Bottom Br #18393',
                    bathrooms: 5,
                    bedrooms: 2,
                    id: 1,
                    price: 20714261,
                    type: null,
                  },
                ],
                1,
              ];
            },
          } as any),
      );
      const propertyService = new PropertyService();
      const properties = await propertyService.getAllProperties(
        new PropertyFilter(),
      );

      expect(properties).toEqual({
        page: 1,
        perPage: 10,
        properties: [
          {
            address: '74434 East Sweet Bottom Br #18393',
            bathrooms: 5,
            bedrooms: 2,
            id: 1,
            price: 20714261,
            type: null,
          },
        ],
        total: 1,
      });
    });

    it.each([
      [1, 10],
      [2, 10],
      [1, 5],
      [2, 5],
    ])(
      'should return all properties on page %p getting %p per page',
      async (page, perPage) => {
        jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
          () =>
            ({
              async findAndCount() {
                return [
                  [
                    {
                      address: '74434 East Sweet Bottom Br #18393',
                      bathrooms: 5,
                      bedrooms: 2,
                      id: 1,
                      price: 20714261,
                      type: null,
                    },
                  ],
                  1,
                ];
              },
            } as any),
        );
        const propertyService = new PropertyService();
        const properties = await propertyService.getAllProperties(
          new PropertyFilter(),
          page,
          perPage,
        );

        expect(properties).toEqual({
          page: page,
          perPage: perPage,
          properties: [
            {
              address: '74434 East Sweet Bottom Br #18393',
              bathrooms: 5,
              bedrooms: 2,
              id: 1,
              price: 20714261,
              type: null,
            },
          ],
          total: 1,
        });
      },
    );

    it('should filter the properties', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async findAndCount() {
              return [
                [
                  {
                    address: '74434 East Sweet Bottom Br #18393',
                    bathrooms: 5,
                    bedrooms: 2,
                    id: 1,
                    price: 20714261,
                    type: null,
                  },
                ],
                1,
              ];
            },
          } as any),
      );
      const propertyService = new PropertyService();
      const properties = await propertyService.getAllProperties(
        plainToClass(PropertyFilter, { maxBathrooms: 5 }),
      );

      expect(properties).toEqual({
        page: 1,
        perPage: 10,
        properties: [
          {
            address: '74434 East Sweet Bottom Br #18393',
            bathrooms: 5,
            bedrooms: 2,
            id: 1,
            price: 20714261,
            type: null,
          },
        ],
        total: 1,
      });
    });
  });

  describe('findPropertyById', () => {
    it('should return a property by the id', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async findOneByOrFail() {
              return {
                address: '74434 East Sweet Bottom Br #18393',
                bathrooms: 5,
                bedrooms: 2,
                id: 1,
                price: 20714261,
                type: null,
              };
            },
          } as any),
      );
      const propertyService = new PropertyService();
      const properties = await propertyService.findPropertyById(1);

      expect(properties).toEqual({
        address: '74434 East Sweet Bottom Br #18393',
        bathrooms: 5,
        bedrooms: 2,
        id: 1,
        price: 20714261,
        type: null,
      });
    });
    it('should throw a NotFoundError when try to found a property that do not exist', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async findOneByOrFail() {
              throw new EntityNotFoundError(Property, {});
            },
          } as any),
      );
      const propertyService = new PropertyService();
      expect(
        async () => await propertyService.findPropertyById(1),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw an Error when an unhandled error occurs', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async findOneByOrFail() {
              throw new Error('Test error');
            },
          } as any),
      );
      const propertyService = new PropertyService();
      expect(
        async () => await propertyService.findPropertyById(1),
      ).rejects.toThrowError(Error('Test error'));
    });
  });

  describe('createProperty', () => {
    it('should create a new property', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              return {
                ...property,
                id: 1,
              };
            },
          } as any),
      );
      const propertyService = new PropertyService();
      const properties = await propertyService.createProperty({
        address: 'Test property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Apartment',
      });

      expect(properties).toEqual({
        address: 'Test property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Apartment',
        id: 1,
      });
    });

    it('should throw a ValidationError when the property fields are invalid', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              return {
                ...property,
                id: 1,
              };
            },
          } as any),
      );
      const propertyService = new PropertyService();
      await expect(
        async () =>
          await propertyService.createProperty({
            address: 'Test property',
            price: 'price',
            bedrooms: -1,
            bathrooms: -1,
            type: 'Apartment',
          } as any),
      ).rejects.toThrowError(ValidationError);
    });

    it('should throw an Error when an unhandled error occurs', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              throw new Error('test error');
            },
          } as any),
      );
      const propertyService = new PropertyService();
      await expect(
        async () =>
          await propertyService.createProperty({
            address: 'Test property',
            price: 1,
            bedrooms: 1,
            bathrooms: 1,
            type: 'Apartment',
          }),
      ).rejects.toThrowError(Error);
    });
  });

  describe('updateProperty', () => {
    it('should update a property', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async exist() {
              return true;
            },
            create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              return {
                ...property,
              };
            },
          } as any),
      );
      const propertyService = new PropertyService();
      const properties = await propertyService.updateProperty(1, {
        address: 'Test property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Apartment',
      });

      expect(properties).toEqual({
        address: 'Test property',
        price: 20000,
        bedrooms: 1,
        bathrooms: 1,
        type: 'Apartment',
        id: 1,
      });
    });
    it('should throw a ValidationError when the property fields are invalid', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async exist() {
              return true;
            },
            create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              return {
                ...property,
              };
            },
          } as any),
      );
      const propertyService = new PropertyService();
      await expect(
        async () =>
          await propertyService.updateProperty(1, {
            address: 'Test property',
            price: 'price',
            bedrooms: -1,
            bathrooms: -1,
            type: 'Apartment',
          } as any),
      ).rejects.toThrowError(ValidationError);
    });

    it('should throw a NotFoundError when the property do not exist', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async exist() {
              return false;
            },
            create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              return {
                ...property,
              };
            },
          } as any),
      );
      const propertyService = new PropertyService();
      await expect(
        async () =>
          await propertyService.updateProperty(1, {
            address: 'Test property',
            price: 2000,
            bedrooms: 1,
            bathrooms: 1,
            type: 'Apartment',
          } as any),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw an Error when an unhandled error occurs', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async exist() {
              return true;
            },
            create(propery: any) {
              return plainToClass(Property, propery);
            },
            async save(property: Property) {
              throw new Error('test error');
            },
          } as any),
      );
      const propertyService = new PropertyService();
      await expect(
        async () =>
          await propertyService.updateProperty(1, {
            address: 'Test property',
            price: 1,
            bedrooms: 1,
            bathrooms: 1,
            type: 'Apartment',
          }),
      ).rejects.toThrowError(new Error('test error'));
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async exist() {
              return true;
            },
            async delete() {
              return true;
            },
          } as any),
      );
      const propertyService = new PropertyService();
      const properties = await propertyService.deleteProperty(1);

      expect(properties).toEqual({
        success: true,
      });
    });

    it('should throw a NotFoundError when the property do not exist', async () => {
      jest.spyOn(AppDataSource, 'getRepository').mockImplementation(
        () =>
          ({
            async exist() {
              return false;
            },
            delete() {
              return true;
            },
          } as any),
      );
      const propertyService = new PropertyService();
      await expect(
        async () => await propertyService.deleteProperty(1),
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
