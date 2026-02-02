import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import authRoutes from './routes/authRoutes.js';
const app = express();

await connectCloudinary();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.send('Server Is Live!'));


app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server Is Running', PORT);
})
