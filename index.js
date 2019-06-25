const express = require('express');
const app = express();
const mongoRepository = require('./mongoRepo');
const db = require('./mongodb');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

db.once('open', () => {
  console.log('db is accessed');
});

app.get('/api/v1/counters', async (req, res) => {
  await mongoRepository.find({}, null, (err, counters) => {
    if (!err) {
      res.status(200).send(counters);
    }
  });
});

app.get('/api/v1/counter', async (req, res) => {
  await mongoRepository.create(
    { title: req.body.title, count: 0 },
    async (err) => {
      if (!err) {
        await mongoRepository.find({}, null, (err, counters) => {
          if (!err) {
            res.status(200).send(counters);
          }
        });
      }
    }
  );
});

app.post('/api/v1/counter/inc', async (req, res) => {
  let counterFromRepo = {};
  await mongoRepository.findById(req.body.id, (err, counter) => {
    if (!err) {
      counterFromRepo = counter;
    }
  });

  await mongoRepository.findByIdAndUpdate(
    req.body.id,
    { count: counterFromRepo.count + 1 },
    async (err, counter) => {
      if (err) {
        res.status(500).send(err);
      } else {
        await mongoRepository.find({}, null, (err, counters) => {
          if (!err) {
            res.status(202).send(counters);
          }
        });
      }
    }
  );
});

app.post('/api/v1/counter/dec', async (req, res) => {
  let counterFromRepo = {};
  await mongoRepository.findById(req.body.id, (err, counter) => {
    if (!err) {
      counterFromRepo = counter;
    }
  });

  await mongoRepository.findByIdAndUpdate(
    req.body.id,
    { count: counterFromRepo.count - 1 },
    async (err, counter) => {
      if (err) {
        res.status(500).send(err);
      } else {
        await mongoRepository.find({}, null, (err, counters) => {
          if (!err) {
            res.status(202).send(counters);
          }
        });
      }
    }
  );
});

app.delete('/api/v1/counter', async (req, res) => {
  await mongoRepository.findByIdAndRemove(
    req.body.id,
    null,
    async (err, counter) => {
      if (err) {
        res.status(500).send(err);
      } else {
        await mongoRepository.find({}, null, (err, counters) => {
          if (!err) {
            res.status(202).send(counters);
          }
        });
      }
    }
  );
});

app.listen(3000);
