const books = require('./books');
const { validBook } = require('./validator');

const addBookHandler = (request, h) => {
  const validation = validBook(request.payload);
  if (validation.isValid) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage = 0,
      reading = false,
    } = request.payload;
    const id = Date.now().toString();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    books.push({
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      id,
      insertedAt,
      updatedAt,
    });
    const isSuccess = books.some((book) => book.id === id);
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: `Gagal menambahkan buku. ${validation.message}`,
  });
  response.code(400);
  return response;
};
const getAllBooksHandler = (request) => {
  const { name = '', reading, finished } = request.query;
  const filterReading = !!(reading === '0' || reading === '1');
  const filterFinished = !!(finished === '0' || finished === '1');
  let filteredBook = books.filter(
    (item) => item.name.toLowerCase().includes(name.toLowerCase())
      && (filterReading ? item.reading === (reading !== '0') : true)
      && (filterFinished ? item.finished === (finished !== '0') : true),
  );
  filteredBook = (filteredBook || []).map((item) => ({
    id: item.id,
    name: item.name,
    publisher: item.publisher,
  }));
  return {
    status: 'success',
    data: {
      books: filteredBook,
    },
  };
};
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((item) => item.id === bookId);
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
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((item) => item.id === bookId);
  if (index !== -1) {
    const validation = validBook(request.payload);
    if (validation.isValid) {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage = 0,
        reading = false,
      } = request.payload;
      const updatedAt = new Date().toISOString();
      const finished = pageCount === readPage;

      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        finished,
        readPage,
        reading,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${validation.message}`,
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((item) => item.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
