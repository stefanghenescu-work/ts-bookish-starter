// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Connection } = require('tedious');

export class ConnectionTedious {
    static connection: any;

    constructor() {
        const config = {
            server: 'localhost',
            authentication: {
                type: 'default',
                options: {
                    userName: 'stefan',
                    password: '%Y21rF7j=w3L',
                },
            },
            options: {
                trustServerCertificate: true,
                database: 'bookish',
                rowCollectionOnDone: true,
                rowCollectionOnRequestCompletion: true,
            },
        };

        if (!ConnectionTedious.connection) {
            ConnectionTedious.connection = new Connection(config);

            ConnectionTedious.connection.on('connect', (err: Error) => {
                if (err) {
                    console.error('Connection failed:', err);
                } else {
                    console.log('Connected to DB');
                }
            });

            ConnectionTedious.connection.connect();
        }
    }

    static getConnection() {
        return ConnectionTedious.connection;
    }
}
