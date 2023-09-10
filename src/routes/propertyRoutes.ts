import bodyParser from 'body-parser';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import express, { NextFunction, Request, Response } from 'express';
import { PropertyFilter } from '../entities/PropertyFilter';
import { IHttpError, isIHttpError } from '../entities/errors/IHttpError';
import { InternalServerError } from '../entities/errors/InternalServerError';
import { ValidationError } from '../entities/errors/ValidationError';
import { PropertyService } from '../services';

const propertyService = new PropertyService();

export const propertyRoutes = express.Router();
propertyRoutes.use(bodyParser.json());
propertyRoutes.get('/', async (req, res, next) => {
  try {
    const filter = plainToClass(PropertyFilter, req.query, {
      excludeExtraneousValues: true,
    });
    const filterValidationErrors = validateSync(filter, {
      skipMissingProperties: true,
    });
    if (filterValidationErrors.length > 0) {
      throw new ValidationError('Bad request', filterValidationErrors);
    }
    const { page, perPage } = req.query;
    const properties = await propertyService.getAllProperties(
      filter,
      page ? Number(page) : undefined,
      perPage ? Number(perPage) : undefined,
    );
    res.send(properties);
  } catch (error) {
    next(error);
  }
});

propertyRoutes.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const properties = await propertyService.findPropertyById(id);
    res.send(properties);
  } catch (error) {
    next(error);
  }
});

propertyRoutes.post('/', async (req, res, next) => {
  try {
    const properties = await propertyService.createProperty(req.body);
    res.send(properties);
  } catch (error) {
    next(error);
  }
});

propertyRoutes.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const properties = await propertyService.updateProperty(id, req.body);
    res.send(properties);
  } catch (error) {
    next(error);
  }
});

propertyRoutes.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const properties = await propertyService.deleteProperty(id);
    res.send(properties);
  } catch (error) {
    next(error);
  }
});

propertyRoutes.use(
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (isIHttpError(error)) {
      return next(error);
    }
    return next(new InternalServerError());
  },
);

propertyRoutes.use(
  (error: IHttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.code).send(error.toJson());
  },
);
