import mongoose from 'mongoose'
import dns from 'dns'

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Fallback if dns custom servers not supported
}

export const connectDB = async () => {
  console.log("MONGO_URL:", process.env.MONGO_URL);
  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("DB IS CONNECTED");
}