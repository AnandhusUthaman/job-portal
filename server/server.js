import './config/instrument.js'
import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/Webhooks.js';
import CompanyRoutes from './routes/CompanyRoutes.js';
import connectCloudinary from './config/Cloudinary.js';
import jobRouter from './routes/jobRouter.js';
import userRouter from './routes/userRouter.js';
import { clerkMiddleware } from '@clerk/express';

// initialize express
const app = express();

//connect to database
await connectDB();

//connect to cloudinary
await connectCloudinary()


//middleware
app.use(cors());
app.use(express.json());
//clerk middleware
app.use(clerkMiddleware())

//routes
app.get('/', (req, res) => {
    res.send("Api is running");
})
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
app.post('/webhooks',clerkWebhooks)
app.use('/api/company',CompanyRoutes)
app.use('/api/jobs',jobRouter)
app.use('/api/user',userRouter)

//port 
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })