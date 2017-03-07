import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

interface IConfig {
  [devEnv: string]: {
    dbPath: string;
    port: number;
  };
}

const config: IConfig = {
  development: {
    dbPath: `mongodb://localhost:${process.env.DB_PORT}/testing`,
    port: 3000,
  },
  production: {
    dbPath: `mongodb://joseph:${process.env.MONGO_PASS}@ds058579.mlab.com:58579/production`,
    port: 80,
  },
  testing: {
    dbPath: `mongodb://joseph:${process.env.MONGO_PASS}@ds058579.mlab.com:58579/testing`,
    port: 80,
  },
};
const currConfig = config[env];

const dbOptions = {
  server: {
    socketOptions: {
      connectTimeoutMS: 5000,
    },
  },
};

const username = process.env.API_USERNAME;
const password = process.env.API_KEY;

export { currConfig as config, dbOptions, username, password };
