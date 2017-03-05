import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'drugs';
const dbPath = `mongodb://localhost:${process.env.DB_PORT}`;

const dbOptions = {
  // pass: process.env.MONGO_PASS,
  server: {
    socketOptions: {
      connectTimeoutMS: 5000,
    },
  },
  // user: 'joseph',
};

const username = '44dd4d5f-bf99-45b4-978f-837203f06b54';
const password = process.env.API_KEY;

export { dbName, dbPath, dbOptions, username, password };
