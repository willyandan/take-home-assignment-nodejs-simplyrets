import express from 'express';
import { propertyRoutes } from './routes';

const app = express();
app.use('/properties', propertyRoutes);

export default app;
