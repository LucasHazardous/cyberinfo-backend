const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const {
  port,
  requestsTimeFrame,
  maxRequestsPerTimeFrame,
} = require('./config/config');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const { connection } = require('mongoose');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: requestsTimeFrame,
  max: maxRequestsPerTimeFrame,
  standardHeaders: true,
  legacyHeaders: false,
});

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Initiating more.`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started.`);
  const app = express();
  app.use('/api', limiter);

  app.use(helmet());
  app.use(compression());
  app.use(cors());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

  connection.once('open', () => {
    app.use('/api/user', require('./api/user'));
    app.use('/api/article', require('./api/article'));
    app.use('/api/newsletter', require('./api/newsletter'));
    app.use('/api/upload', require('./api/upload'));

    app.listen(port, () => {
      console.log(`Worker ${process.pid} listening on port ${port}`);
    });
  });
}
