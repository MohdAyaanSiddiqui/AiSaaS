import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

const connectApp = async () => {
    try {
        await connectDB();
        await connectCloudinary();
    } catch (error) {
        console.log("Error connecting to services:", error);
    }
}
connectApp();

const corOptions = {
    origin: [
     "http://localhost:5173",   
    ,"https://neuroglowai.onrender.com"],
    credentials: true,
}

app.use(cors(corOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Server Is Live!'));

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server Is Running', PORT);
})

