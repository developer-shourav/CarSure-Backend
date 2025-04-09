import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

/* --------Parser--------- */
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));

/* ------- Root Route ----------*/
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to CarSure! 🎇✨🎉');
});

/* ------Global Error Handler Middleware------- */
app.use(globalErrorHandler as express.ErrorRequestHandler); // Explicitly cast here

/* ------Global Not Found Middleware------- */
app.use(notFound);

export default app;
