import express, { Request, Response, NextFunction } from "express";
import connectDB from '../back-end/models/connect';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

// Connect to MongoDB
connectDB();

// API Routes
app.use("/user", require('../back-end/routes/userRoutes'));
app.use("/waterPoint", require('../back-end/routes/waterPointRoutes'));
app.use("/feedback", require('../back-end/routes/feedbackRoutes'));

// Check if server is listening
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json('Servidor rodando poha!!');
})

// Error MiddleWare
app.use((err: Error, req: Request, res: Response, next : NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
})

const PORT = process.env.PORT ? Number(process.env.PORT)  : 3000;

app.listen(PORT, '0.0.0.0',  () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));

