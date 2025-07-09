import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';

import { ConnectionTedious } from './ConnectionTedious';

const port = process.env['PORT'] || 3000;

// create connection
new ConnectionTedious();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Request = require('tedious').Request;


const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */

app.use(express.json()); // Add this line

app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);

