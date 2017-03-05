import test from 'ava';
import * as express from 'express';
import * as request from 'supertest';
import { router as indexRoute } from '../../../routes/apiV1/index';

test.beforeEach('make a new server', (t) => {
  const app = express();

  // Taken directly from app.ts
  // view engine setup
  app.use('/apiV1', indexRoute);
  t.context.app = app;
});

test('index route gives 200', async (t) => {
  const res = await request(t.context.app)
    .get('/apiV1');
  t.is(res.status, 200);
});
