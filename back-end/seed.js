import mongoose from 'mongoose';
import fs from 'fs';
import User from './models/User.js';
import WaterPoint from './models/WaterPoint.js';

// Ler dados do seedData.json
const seedData = JSON.parse(fs.readFileSync('./seedData.json', 'utf8'));

mongoose.connect('mongodb://localhost:27017/water_app');

const seed = async () => {
  // Limpar collections
  await User.deleteMany({});
  await WaterPoint.deleteMany({});
  
  // Usar dados do seedData.json
  await User.create(seedData.users[0]);
  await WaterPoint.create(seedData.waterPoints[0]);
  
  console.log('BD alimentada com dados do seedData.json!');  
  process.exit();
};

seed();