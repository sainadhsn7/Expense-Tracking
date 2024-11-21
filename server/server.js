import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js'
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { fileURLToPath } from 'url';

import path from "path";
dotenv.config();

const app=express();

connectDB().catch((error)=>{
    console.error('Database connection failed:', error);
    process.exit(1);
});

app.use(cors());


app.use(express.json());

const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));


app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expenses', expenseRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong', error: err.message})
});



const PORT=3000;

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));