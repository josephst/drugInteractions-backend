import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'drugs';
const dbPath = `mongodb://localhost:${process.env.DB_PORT}`;

const dbOptions = {
  server: {
    socketOptions: {
      connectTimeoutMS: 5000,
    },
  },
};

export { dbName, dbPath, dbOptions };
