import test from 'ava';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { config, dbOptions, password, username } from '../../../../config/config';
import { IDrug } from '../../../../models/interfaces/IDrugDoc.d';
import { router as indexRoute } from '../../../../routes/apiV1/drugs/index';

let sampleData: IDrug[];

test.before('connect to testing db', async (t) => {
  await (mongoose.connect(`${config.dbPath}`, dbOptions) as any);
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

test.serial('lookup Lepirudin by ID', async (t) => {
  const drug = sampleData[0];
  await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(drug);
  const res = await request(t.context.app)
    .get(`/apiV1/drugs/id/${drug.drugbankId}`);
  t.is(res.status, 200);
  t.is(res.body.drugbankId, drug.drugbankId);
});

test.serial('looking up non-existant Drug fails with 404', async (t) => {
  const res = await request(t.context.app)
    .get('/apiV1/drugs/id/missingID');
  t.is(res.status, 404);
  t.is(res.body.error.code, 'MISSING');
});

test.serial('deleting without authentication fails regardless of ID', async (t) => {
  const res = await request(t.context.app)
    .delete('/apiV1/drugs/id/foo');
  t.is(res.status, 403);
});

test.serial('delete Lepirudin by ID', async (t) => {
  const drug = sampleData[0];
  await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(drug);
  const res = await request(t.context.app)
    .delete(`/apiV1/drugs/id/${drug.drugbankId}`)
    .auth(username, password);
  t.is(res.status, 204);
  const countRes = await request(t.context.app)
    .get('/apiV1/drugs/meta/count');
  t.is(countRes.body.count, 0);
});
