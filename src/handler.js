const { nanoid } = require('nanoid');
const books = require('./books');

const getAllBooksHandler = (req, h) => {
    const { name, reading, finished } = req.query;
    let booksFiltered = books;

    if (name !== undefined) {
        booksFiltered = booksFiltered.filter(
            (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );
    } else if (reading !== undefined) {
        booksFiltered = booksFiltered.filter(
            (book) => Number(book.reading) === Number(reading),
        );
    } else if (finished !== undefined) {
        booksFiltered = booksFiltered.filter(
            (book) => book.finished == finished,
        );
    }

    const response = h.response({
        status: 'success',
        data: {
            books: booksFiltered.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);

    return response;
};

const getBookByIdHandler = (req, h) => {
    const { id } = req.params;

    const book = books.filter((j) => j.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);

    return response;
};

const addBooksHandler = (req, h) => {
    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = req.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);

        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);

        return response;
    }

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const finished = readPage === pageCount;
    const insertedAt = createdAt;

    const newBook = {
        name,
        year,
        publisher,
        id,
        createdAt,
        updatedAt,
        author,
        summary,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);

        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);

    return response;
};

const updateBooksHandler = (req, h) => {
    const { id } = req.params;
    const index = books.findIndex((book) => {
        return book.id === id;
    });

    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = req.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);

        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);

        return response;
    }

    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);

        return response;
    }

    const updatedAt = new Date().toISOString();
    const finished = (readPage === pageCount);

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
        insertedAt: new Date().toISOString(),
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);

    return response;
};

const deleteBooksHandler = (req, h) => {
    const { id } = req.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);

        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);

    return response;
};

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBooksHandler,
    deleteBooksHandler,
};
