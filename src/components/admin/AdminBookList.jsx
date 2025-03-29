import React, { useState, useEffect } from "react";
import { adminBookService } from "../../services/adminBookService";
import { Table, Button, Form, Modal } from "react-bootstrap";

const AdminBookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    isbn: "",
    marketplaceLinks: {
      amazon: "",
      flipkart: "",
    },
    publication: {
      publicationId: "",
      rating: "",
      publishedDate: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await adminBookService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setEditForm({
      title: book.title,
      price: book.price,
      stock: book.stock,
      category: book.category,
      isbn: book.isbn,
      marketplaceLinks: {
        amazon: book.marketplaceLinks?.amazon || "",
        flipkart: book.marketplaceLinks?.flipkart || "",
      },
      publication: {
        publicationId: book.publication?.publicationId || "",
        rating: book.publication?.rating || "",
        publishedDate: book.publication?.publishedDate || "",
        description: book.publication?.description || "",
      },
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await adminBookService.deleteBook(id);
        await fetchBooks();
      } catch (err) {
        setError("Failed to delete book");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminBookService.updateBook(selectedBook._id, editForm);
      setShowEditModal(false);
      await fetchBooks();
    } catch (err) {
      setError("Failed to update book");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Manage Books</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.authorName}</td>
              <td>{book.category}</td>
              <td>${book.price}</td>
              <td>{book.stock}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(book._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editForm.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editForm.stock}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={editForm.category}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                name="isbn"
                value={editForm.isbn}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <h5>Marketplace Links</h5>
            <Form.Group className="mb-3">
              <Form.Label>Amazon</Form.Label>
              <Form.Control
                type="url"
                name="marketplaceLinks.amazon"
                value={editForm.marketplaceLinks.amazon}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Flipkart</Form.Label>
              <Form.Control
                type="url"
                name="marketplaceLinks.flipkart"
                value={editForm.marketplaceLinks.flipkart}
                onChange={handleInputChange}
              />
            </Form.Group>

            <h5>Publication Details</h5>
            <Form.Group className="mb-3">
              <Form.Label>Publication ID</Form.Label>
              <Form.Control
                type="text"
                name="publication.publicationId"
                value={editForm.publication.publicationId}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="publication.rating"
                value={editForm.publication.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Published Date</Form.Label>
              <Form.Control
                type="date"
                name="publication.publishedDate"
                value={editForm.publication.publishedDate}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="publication.description"
                value={editForm.publication.description}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminBookList;
