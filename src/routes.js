const {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBooksHandler,
    deleteBooksHandler,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBooksHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBooksHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBooksHandler,
    },
];

module.exports = routes;
