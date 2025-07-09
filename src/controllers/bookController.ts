import { Router, Request, Response } from 'express';
import { Book } from '../Book';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/:id', this.getBook.bind(this));

        this.router.post('/create', this.createBook.bind(this));

        // get all books
        this.router.get('/', this.getBooks.bind(this));
    }

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    createBook = async (req: Request, res: Response) => {
        const { book_id, title, ISBN, number_copies } = req.body;
        console.log(req.body);
        console.log(book_id, title, ISBN, number_copies);
        try {
            await Book.addBook(book_id, title, ISBN, number_copies);
            res.json({ success: true, message: 'Book added successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: err.message });
        }
    }

    getBooks = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await Book.getAllBooks();
            res.json({ success: true, books: result });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: err.message });
        }
    };
}

export default new BookController().router;
