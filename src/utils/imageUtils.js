export const getBookCover = (book) => {
  if (book.coverImage) return book.coverImage;
  if (book.isbn) return `/assets/books/${book.isbn}.jpg`;
  return '/assets/books/default-book.jpg';
}; 