import { Request } from 'tedious';
import { ConnectionTedious } from './ConnectionTedious';
import { TYPES } from 'tedious';

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
                    return resolve(allData); //Here we resolve allData using promise in order to get it´s content later
                },
            );

            ConnectionTedious.getConnection().execSql(request);
        });

        return allData;
    }

    static async addBook(
        book_id: number,
        title: string,
        ISBN: string,
        number_copies: number,
    ) {
        return new Promise<void>((resolve, reject) => {
            const request = new Request(
                `INSERT INTO bookish.dbo.Books (book_id, title, ISBN, number_copies)
                                         VALUES (@book_id, @title, @ISBN, @number_copies)`,
                (err: Error, rowCount: number) => {
                    if (err) {
                        console.error('Error inserting book:', err);
                        return reject(err);
                    } else {
                        console.log(`Inserted ${rowCount} row(s)`);
                        return resolve();
                    }
                },
            );

            // Add parameters
            request.addParameter('book_id', TYPES.Int, book_id);
            request.addParameter('title', TYPES.NVarChar, title);
            request.addParameter('ISBN', TYPES.NVarChar, ISBN);
            request.addParameter('number_copies', TYPES.Int, number_copies);

            ConnectionTedious.getConnection().execSql(request);
        });
    }
}
