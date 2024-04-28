import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectToDb from './db/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import groupRoutes from './routes/group.routes.js';
const port = process.env.PORT;
const app = express();
// connect to db
connectToDb();
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/group', groupRoutes);
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
