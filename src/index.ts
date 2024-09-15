import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors, {CorsOptions} from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import goodnessRoutes from './routes/goodness.routes';
import mineralRoutes from './routes/mineral.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goodness', goodnessRoutes);
app.use('/api/minerals', mineralRoutes);
app.use('/api/users', userRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json('Could not find this route.');
});

app.listen(port, () => {
  console.debug(`Server is running on port: ${port}`);
});
