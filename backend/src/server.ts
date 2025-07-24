import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { dbConnect } from './config/database.config';

import https from 'https';
import fs from 'fs';
import path from 'path';

dbConnect();

const app = express();
app.use(express.json());
 
app.use(cors({
    credentials: true,
    origin: 'https://localhost:4200'
}));
app.use(cookieParser());

app.use('/auth', authRoutes);

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../localhost+2.pem'))
};

const port = 5000;

https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});