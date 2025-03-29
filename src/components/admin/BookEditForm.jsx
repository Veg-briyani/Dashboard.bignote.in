import React, { useState } from "react";
import { bookService } from "../../services/bookService";

const BookEditForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: book.title || "",
    price: book.price || 0,
    stock: book.stock || 0,
    category: book.category || "",
    isbn: book.isbn || "",
    marketplaceLinks: {
      amazon: book.marketplaceLinks?.amazon || "",
      flipkart: book.marketplaceLinks?.flipkart || "",
    },
    publication: {
      publicationId: book.publication?.publicationId || "",
      rating: book.publication?.rating || 0,
      publishedDate: book.publication?.publishedDate || "",
      description: book.publication?.description || "",
    },
    soldCopies: book.soldCopies || 0,
    royalties: book.royalties || 0,
    lastMonthSale: book.lastMonthSale || 0,
    totalRevenue: book.totalRevenue || 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (book._id) {
        await bookService.updateBook(book._id, formData);
        setSuccess("Book updated successfully");
      } else {
        await bookService.createBook(formData);
        setSuccess("Book created successfully");
      }
      onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-edit-form">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>ISBN:</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-section">
        <h3>Marketplace Links</h3>
        <div className="form-group">
          <label>Amazon:</label>
          <input
            type="url"
            name="marketplaceLinks.amazon"
            value={formData.marketplaceLinks.amazon}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Flipkart:</label>
          <input
            type="url"
            name="marketplaceLinks.flipkart"
            value={formData.marketplaceLinks.flipkart}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Publication Details</h3>
        <div className="form-group">
          <label>Publication ID:</label>
          <input
            type="text"
            name="publication.publicationId"
            value={formData.publication.publicationId}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            step="0.1"
            name="publication.rating"
            value={formData.publication.rating}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Published Date:</label>
          <input
            type="date"
            name="publication.publishedDate"
            value={formData.publication.publishedDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="publication.description"
            value={formData.publication.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BookEditForm;
