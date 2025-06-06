import mongoose from 'mongoose';

let instance: typeof mongoose | null = null;

export async function connectMongo() {
  if (instance) {
    return instance;
  }
  
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo1:27017,mongo2:27018,mongo3:27019/pix?replicaSet=rs0';

    instance = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }

  return instance;
}