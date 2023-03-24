import express from 'express';
import bodyParser from 'body-parser';

export const propertyRoutes = express.Router();

propertyRoutes.use(bodyParser.json());

propertyRoutes.get('/', async (req, res) => {
  res.send('GET all properties');
});

propertyRoutes.get('/:id', async (req, res) => {
  res.send('GET property by id');
});

propertyRoutes.post('/', async (req, res) => {
  res.send('Create property');
});

propertyRoutes.put('/:id', async (req, res) => {
  res.send('Update property');
});

propertyRoutes.delete('/:id', async (req, res) => {
  res.send('Delete property');
});
