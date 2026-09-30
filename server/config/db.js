import mongoose from 'mongoose';

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set. Add it to server/.env.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

export default connectToDatabase;
