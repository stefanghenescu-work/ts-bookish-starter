import express from 'express';
import 'dotenv/config';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import { exec } from 'node:child_process';
import { Book } from './controllers/Book';

const port = process.env['PORT'] || 3000;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Connection = require('tedious').Connection;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Request = require('tedious').Request;

const config = {
    server: 'localhost',
    options: { trustServerCertificate: true, database: 'bookish' },
    authentication: {
        type: 'default',
        options: {
            userName: 'stefan',
            password: '%Y21rF7j=w3L',
            rowCollectionOnDone: true,
            rowCollectionOnRequestCompletion: true
        },
    },
};

const connection = new Connection(config);

connection.on('connect', function (err: Error) {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to DB');
    }
});

connection.connect();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/books/', async (req, res) => {
    try {
        const result = await getAllBooks();
        res.json({ success: true, books: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

async function getAllBooks() {
    const allData = [];
    // We now set the promise awaiting it gets results
    await new Promise((resolve, reject) => {
        const request = new Request('SELECT * FROM dbo.Books', function (
            err,
            rowCount,
        ) {
            if (err) {
                return reject(err);
            } else {
                console.log(rowCount + ' rows');
            }
        });

        request.on('row', function(columns) {
            columns.forEach(function(column) {
                allData.push(column.value); //Push the result to array
            });
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            console.log('onDoneProc');
            return resolve(allData); //Here we resolve allData using promise in order to get it´s content later
        });

        connection.execSql(request);

    });

    return allData;
}
//
// function getAllBooks() {
//     const books: Array<Book> = new Array<Book>();
//     const request = new Request('SELECT * FROM dbo.Books', (err) => {
//         if (err) {
//             throw err;
//         }
//         connection.close();
//     });
//
//     request.on('row', (columns) => {
//         const id: number = columns[0].value;
//         const title: string = columns[1].value;
//         const ISBN: string = columns[2].value;
//
//         const book = new Book(id, title, ISBN);
//         books.push(book);
//         });
//
//         connection.execSql(request);
//
//         return books;
// }

app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
});

//
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.listen(port, () => {
//     return console.log(`Express is listening at http://localhost:${port}`);
// });
//
// /**
//  * Primary app routes.
//  */
// app.use('/healthcheck', healthcheckRoutes);
// app.use('/books', bookRoutes);
