import { Sequelize } from 'sequelize-typescript';
import { Asset } from '../models/Asset.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'dam_db',
  models: [Asset],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // Sync models if not in production
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
