import test from 'ava';
import * as express from 'express';
import * as path from 'path';
import * as request from 'supertest';
import { router as indexRoute } from '../../routes/index';

test.beforeEach('make a new server', (t) => {
  const app = express();

  // Taken directly from app.ts
  // view engine setup
  app.set('views', path.join(__dirname, '../..', 'views'));
  app.set('view engine', 'jade');
  app.use('/', indexRoute);
  t.context.app = app;
});

test('index route gives 200', async (t) => {
  const res = await request(t.context.app)
    .get('/');
  t.is(res.status, 200);
});
