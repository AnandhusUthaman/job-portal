import mongoose from "mongoose";


// function to connect to the database
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('error', (err) => console.log('MongoDB connection error', err));

    await mongoose.connect(`${process.env.MONGODB_URI}/Job-Portal`);
}

export default connectDB;