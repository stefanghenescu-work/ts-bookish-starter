import { Request } from 'tedious';
import { ConnectionTedious } from './ConnectionTedious';

export class Book {
    id: number;
    title: string;
    ISBN: string;
    numberCopies: number;

    constructor(id: number, title: string, ISBN: string, numberCopies: number) {
        this.id = id;
        this.title = title;
        this.ISBN = ISBN;
        this.numberCopies = numberCopies;
    }

    static async getAllBooks() {
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

            request.on('row', (columns) => {
                const id = columns[0].value;
                const title = columns[1].value;
                const ISBN = columns[2].value;
                const nr_copies = columns[3].value;

                allData.push(new Book(id, title, ISBN, nr_copies));
            });

            request.on(
                'doneProc',
                function (rowCount, more, returnStatus, rows) {
                    console.log('onDoneProc');
                    return resolve(allData); //Here we resolve allData using promise in order to get it´s content later
                },
            );

            ConnectionTedious.getConnection().execSql(request);
        });

        return allData;
    }


    static async addBook() {
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

            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    allData.push(column.value); //Push the result to array
                });
            });

            request.on(
                'doneProc',
                function (rowCount, more, returnStatus, rows) {
                    console.log('onDoneProc');
                    return resolve(allData); //Here we resolve allData using promise in order to get it´s content later
                },
            );

            ConnectionTedious.getConnection().execSql(request);
        });

        return allData;
    }


}
