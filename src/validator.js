const validBook = (payload) => {
  const response = {
    isValid: true,
    message: '',
  };
  const {
    name, year, author, summary, publisher, pageCount, readPage,
  } = payload;
  if (!(name || '').trim()) {
    response.isValid = false;
    response.message = 'Mohon isi nama buku';
  }
  if (!year) {
    response.isValid = false;
    response.message = 'Mohon isi tahun buku';
  }
  if (!(author || '').trim()) {
    response.isValid = false;
    response.message = 'Mohon isi author buku';
  }
  if (!(summary || '').trim()) {
    response.isValid = false;
    response.message = 'Mohon isi summary buku';
  }
  if (!(publisher || '').trim()) {
    response.isValid = false;
    response.message = 'Mohon isi publisher buku';
  }
  if (!pageCount) {
    response.isValid = false;
    response.message = 'Mohon isi pageCount buku';
  }
  if (pageCount && readPage && readPage > pageCount) {
    response.isValid = false;
    response.message = 'readPage tidak boleh lebih besar dari pageCount';
  }
  return response;
};
module.exports = {
  validBook,
};
