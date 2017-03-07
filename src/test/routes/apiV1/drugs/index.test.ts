import test from 'ava';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { dbOptions, dbPath, password, username } from '../../../../config/config';
import { IDrug } from '../../../../models/interfaces/IDrugDoc.d';
import { router as indexRoute } from '../../../../routes/apiV1/drugs/index';

let sampleData: IDrug[];

test.before('connect to testing db', async (t) => {
  await (mongoose.connect(`${dbPath}`, dbOptions) as any);
});

test.cb.before('read sample data', (t) => {
  fs.readFile(`${__dirname}/../../../fixtures/sampleParseData.json`, (err, data) => {
    if (err) {
      t.fail('could not read sample data');
    } else {
      sampleData = JSON.parse(data.toString());
    }
    t.end();
  });
});

test.beforeEach('make a new server', (t) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/apiV1/drugs', indexRoute);
  t.context.app = app;
});

test.afterEach.always('wipe db', async (t) => {
  const res = await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth(username, password);
  t.is(res.status, 204);
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

test.serial('database starts empty', async (t) => {
  const deleteRes = await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth(username, password);
  const res = await request(t.context.app)
    .get('/apiV1/drugs/meta/count');
  t.is(res.status, 200);
  t.is(res.body.count, 0);
});

test.serial('get drug document count', async (t) => {
  await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(sampleData[0]);
  const res = await request(t.context.app)
    .get('/apiV1/drugs/meta/count');
  t.is(res.body.count, 1);
  const delRes = await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth(username, password);
  t.is(delRes.status, 204);
  const delSizeRes = await request(t.context.app)
    .get('/apiV1/drugs/meta/count');
  t.is(delSizeRes.body.count, 0);
});

test.serial('delete clears DB', async (t) => {
  const res = await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth(username, password);
  t.is(res.status, 204);
});

test.serial('deleting without authentication fails', async (t) => {
  const res1 = await request(t.context.app)
    .delete('/apiV1/drugs');
  t.is(res1.status, 403);
  const res2 = await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth(username, 'badpassword');
  t.is(res2.status, 403);
  const res3 = await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth('bad username', password);
  t.is(res3.status, 403);
});

test.serial('save Lepirudin to DB', async (t) => {
  const res = await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(sampleData[0]);
  t.is(res.status, 201);
  t.is(res.body.drugbankId, sampleData[0].drugbankId);
  t.is(res.body.description, sampleData[0].description);
  t.is(res.body.name, sampleData[0].name);
});

test.serial('saving without authentication fails', async (t) => {
  const res = await request(t.context.app)
    .post('/apiV1/drugs')
    .send(sampleData[0]);
  t.is(res.status, 403);
});

test.serial('saving same drug twice fails', async (t) => {
  const res = await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(sampleData[0]);
  t.is(res.status, 201);
  const res2 = await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(sampleData[0]);
  t.is(res2.status, 409);
  t.is(res2.body.error.code, 'EXISTS');
});

// NOT going to implement saving many drugs at once, currently.
