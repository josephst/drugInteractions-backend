import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'testing';
let dbPath: string;
if (process.env.DEPLOYED) {
  dbPath = `mongodb://joseph:${process.env.MONGO_PASS}@ds058579.mlab.com:58579/${dbName}`;
} else {
  dbPath = `mongodb://localhost:${process.env.DB_PORT}/${dbName}`;
}

const dbOptions = {
  server: {
    socketOptions: {
      connectTimeoutMS: 5000,
    },
  },
};

const username = '44dd4d5f-bf99-45b4-978f-837203f06b54';
const password = process.env.API_KEY;

export { dbPath, dbOptions, username, password };
