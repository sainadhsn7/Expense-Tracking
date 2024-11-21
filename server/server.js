import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js'
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();

const app=express();

connectDB().catch((error)=>{
    console.error('Database connection failed:', error);
    process.exit(1);
});

app.use(cors({
    origin: "https://expense-sharing-application.vercel.app/"
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expenses', expenseRoutes);

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong', error: err.message})
});

const PORT=3000;

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));