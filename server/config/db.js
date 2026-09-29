import mongoose from 'mongoose';

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not set. Add it to server/.env.');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

export default connectToDatabase;
