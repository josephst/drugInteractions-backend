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
  await request(t.context.app)
    .delete('/apiV1/drugs')
    .auth(username, password);
});

test.serial('Search for Drug by name returns list of Drugs', async (t) => {
  // save several drugs
  const slice = sampleData.slice(1);
  const doneEntering = slice.map(async (drug) => {
    const res = await request(t.context.app)
      .post('/apiV1/drugs')
      .auth(username, password)
      .send(drug);
    t.is(res.status, 201);
    return res;
  });
  await Promise.all(doneEntering);
  const searchRes = await request(t.context.app)
    .get(`/apiV1/drugs/name/search/${slice[0].name}`);
  t.is(searchRes.status, 200);
  t.is(searchRes.body.length, 1);
  t.is(searchRes.body[0].drugbankId, slice[0].drugbankId);
});

test.serial('Searching by incomplete name returns list of Drugs', async (t) => {
  const res = await request(t.context.app)
    .post('/apiV1/drugs')
    .auth(username, password)
    .send(sampleData[0]);
  t.is(res.status, 201);
  const searchRes = await request(t.context.app)
    .get(`/apiV1/drugs/name/search/${sampleData[0].name.substring(0, 3)}`);
  t.true(searchRes.body.length > 0);
  t.is(searchRes.status, 200);
  let match = false;
  searchRes.body.forEach((drug) => {
    if (drug.drugbankId === sampleData[0].drugbankId) {
      match = true;
    }
  });
  t.is(match, true);
});
