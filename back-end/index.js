import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import waterPointRoutes from './routes/waterPoints.js';
import favoriteRoutes from './routes/favorites.js';
import feedbackRoutes from './routes/feedback.js';
import waterIntakeRoutes from './routes/waterIntake.js';
import waterGoalRoutes from './routes/waterGoals.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/water-points', waterPointRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/water-intake', waterIntakeRoutes);
app.use('/api/water-goals', waterGoalRoutes);

app.get('/', (req, res) => res.send('Water App API rodando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));