import test from 'ava';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { router as indexRoute } from '../../../../routes/apiV1/drugs/index';

test.beforeEach('make a new server', (t) => {
  const app = express();
  app.use('/apiV1/drugs', indexRoute);
  t.context.app = app;
});

test('index route gives 200', async (t) => {
  const res = await request(t.context.app)
    .get('/apiV1/drugs');
  t.is(res.status, 200);
});

test('id route gives 200', async (t) => {
  const res = await request(t.context.app)
    .get('/apiV1/drugs/id');
  t.is(res.status, 200);
});

test('name route gives 200', async (t) => {
  const res = await request(t.context.app)
    .get('/apiV1/drugs/name');
  t.is(res.status, 200);
});
