import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";

const BookEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [book, setBook] = useState({
    title: "",
    price: 0,
    stock: 0,
    category: "",
    isbn: "",
    marketplaceLinks: {
      amazon: "",
      flipkart: "",
    },
    publication: {
      publicationId: "",
      rating: 0,
      publishedDate: "",
      description: "",
    },
  });

  useEffect(() => {
    // Fetch book details when component mounts
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch book details");
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError("Failed to load book details");
      }
    };

    if (id) fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBook((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBook((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) throw new Error("Failed to update book");
      setSuccess("Book updated successfully");
      setTimeout(() => navigate("/books"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <h5 className="mb-0">Edit Book</h5>
      </CardHeader>
      <CardBody>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={book.price}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={book.stock}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={book.category}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="isbn">ISBN</Label>
            <Input
              id="isbn"
              name="isbn"
              value={book.isbn}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="amazon">Amazon Link</Label>
            <Input
              id="amazon"
              name="marketplaceLinks.amazon"
              value={book.marketplaceLinks.amazon}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="flipkart">Flipkart Link</Label>
            <Input
              id="flipkart"
              name="marketplaceLinks.flipkart"
              value={book.marketplaceLinks.flipkart}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="publicationId">Publication ID</Label>
            <Input
              id="publicationId"
              name="publication.publicationId"
              value={book.publication.publicationId}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="rating">Rating</Label>
            <Input
              id="rating"
              name="publication.rating"
              type="number"
              step="0.1"
              value={book.publication.rating}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="publishedDate">Published Date</Label>
            <Input
              id="publishedDate"
              name="publication.publishedDate"
              type="date"
              value={book.publication.publishedDate.split("T")[0]}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              id="description"
              name="publication.description"
              type="textarea"
              value={book.publication.description}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Button color="primary" type="submit">
            Update Book
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default BookEditForm;
