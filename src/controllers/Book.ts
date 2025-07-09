export class Book {
    id: number;
    title: string;
    ISBN: string;

    constructor(id: number, title: string, ISBN: string) {
        this.id = id;
        this.title = title;
        this.ISBN = ISBN;
    }
}
