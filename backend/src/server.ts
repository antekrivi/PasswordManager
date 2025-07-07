import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { dbConnect } from './config/database.config';

import dotenv from 'dotenv';
dotenv.config();

dbConnect();

const app = express();
app.use(express.json());
 
app.use(cors({
    credentials: true,
    origin: 'http://localhost:4200'
}));

app.use('/auth', authRoutes);

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});