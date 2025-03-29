import React, { useState, useEffect } from "react";
import UserEditForm from "./UserEditForm";
import BookEditForm from "./BookEditForm";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [usersResponse, booksResponse] = await Promise.all([
        fetch("http://localhost:5000/api/admin/users", { headers }),
        fetch("http://localhost:5000/api/admin/books", { headers }),
      ]);

      if (!usersResponse.ok || !booksResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [usersData, booksData] = await Promise.all([
        usersResponse.json(),
        booksResponse.json(),
      ]);

      setUsers(usersData);
      setBooks(booksData?.data || []);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
      setUsers([]);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Validate userData before sending request
      if (!userData || typeof userData !== "object") {
        throw new Error("Invalid user data provided");
      }

      // Create a sanitized update object with default values
      const updateData = {
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "user",
        profile: {
          title: userData.profile?.title || "",
          location: userData.profile?.location || "",
          bio: userData.profile?.bio || "",
          memberSince:
            userData.profile?.memberSince || new Date().toISOString(),
        },
        authorStats: {
          numberOfPublications: userData.authorStats?.numberOfPublications || 0,
          averageRating: userData.authorStats?.averageRating || 0,
          numberOfFollowers: userData.authorStats?.numberOfFollowers || 0,
          totalWorks: userData.authorStats?.totalWorks || 0,
        },
        badges: Array.isArray(userData.badges) ? userData.badges : [],
        achievements: Array.isArray(userData.achievements)
          ? userData.achievements
          : [],
      };

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      await fetchData();
      setSelectedUser(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update user");
      console.error("Update user error:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.deleteUser(userId);
        fetchData();
      } catch (err) {
        setError("Failed to delete user");
        console.error(err);
      }
    }
  };

  const handleUpdateBook = async (bookId, bookData) => {
    try {
      await bookService.updateBook(bookId, bookData);
      await fetchData();
      setSelectedBook(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update book");
      console.error("Update book error:", err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId);
        await fetchData();
        setError(null);
      } catch (err) {
        setError("Failed to delete book");
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-section">
        <h2>User Management</h2>
        <div className="user-list">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="user-card p-4 border rounded mb-3 bg-white shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="mb-1">{user.name}</h3>
                    <p className="text-muted mb-1">Email: {user.email}</p>
                    <p className="mb-1">
                      <span
                        className={`badge bg-${
                          user.role === "admin" ? "danger" : "primary"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      <i className="bx bx-edit-alt me-1"></i>Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <i className="bx bx-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Profile</h5>
                        <p className="mb-1">
                          <strong>Title:</strong> {user.profile.title}
                        </p>
                        <p className="mb-1">
                          <strong>Location:</strong> {user.profile.location}
                        </p>
                        <p className="mb-1">
                          <strong>Member Since:</strong>{" "}
                          {new Date(
                            user.profile.memberSince
                          ).toLocaleDateString()}
                        </p>
                        <p className="mb-0">
                          <strong>Bio:</strong> {user.profile.bio}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">Author Stats</h5>
                        <div className="d-flex flex-wrap gap-3">
                          <div>
                            <small className="text-muted d-block">
                              Publications
                            </small>
                            <strong>
                              {user.authorStats.numberOfPublications}
                            </strong>
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              Avg Rating
                            </small>
                            <strong>
                              {user.authorStats.averageRating.toFixed(1)}
                            </strong>
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              Followers
                            </small>
                            <strong>
                              {user.authorStats.numberOfFollowers}
                            </strong>
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              Total Works
                            </small>
                            <strong>{user.authorStats.totalWorks}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(user.badges.length > 0 || user.achievements.length > 0) && (
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            {user.badges.length > 0 && (
                              <div className="col-md-6">
                                <h5 className="card-title">Badges</h5>
                                <div className="d-flex flex-wrap gap-2">
                                  {user.badges.map((badge, index) => (
                                    <span key={index} className="badge bg-info">
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {user.achievements.length > 0 && (
                              <div className="col-md-6">
                                <h5 className="card-title">Achievements</h5>
                                <div className="d-flex flex-wrap gap-2">
                                  {user.achievements.map(
                                    (achievement, index) => (
                                      <span
                                        key={index}
                                        className="badge bg-success"
                                      >
                                        {achievement}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No users found</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="mb-4">Book Management</h2>
        <div className="row g-4">
          {books && books.length > 0 ? (
            books.map((book) => (
              <div key={book._id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow">
                  <div className="card-header bg-light py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-primary">{book.title}</h5>
                    <div>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => setSelectedBook(book)}
                      >
                        <i className="bx bx-edit-alt me-1"></i>Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteBook(book._id)}
                      >
                        <i className="bx bx-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="mb-3">
                      <small className="text-muted">ISBN:</small>
                      <div className="fw-medium">{book.isbn}</div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="p-3 border rounded bg-light">
                          <small className="text-muted d-block">Price</small>
                          <strong className="text-success">
                            ${book.price}
                          </strong>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 border rounded bg-light">
                          <small className="text-muted d-block">Stock</small>
                          <strong
                            className={`text-${
                              book.stock <= 10
                                ? "danger"
                                : book.stock <= 30
                                ? "warning"
                                : "success"
                            }`}
                          >
                            {book.stock}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Category:</small>
                      <div className="badge bg-primary rounded-pill">
                        {book.category}
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Publication Details:</small>
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Rating:</span>
                          <div className="badge bg-warning text-dark">
                            {book.publication?.rating || "N/A"} ★
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Published:</span>
                          <div>
                            {new Date(
                              book.publication?.publishedDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">Marketplace Links:</small>
                      <div className="d-flex gap-2 mt-2">
                        {book.marketplaceLinks?.amazon && (
                          <a
                            href={book.marketplaceLinks.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-dark"
                          >
                            <i className="bx bxl-amazon me-1"></i>Amazon
                          </a>
                        )}
                        {book.marketplaceLinks?.flipkart && (
                          <a
                            href={book.marketplaceLinks.flipkart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bx bxs-shopping-bag me-1"></i>Flipkart
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <div className="border rounded p-2 text-center bg-light">
                          <small className="text-muted d-block">
                            Sold Copies
                          </small>
                          <strong>{book.soldCopies || 0}</strong>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded p-2 text-center bg-light">
                          <small className="text-muted d-block">Revenue</small>
                          <strong className="text-success">
                            ${book.totalRevenue || 0}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="card h-100 text-center p-5">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i
                    className="bx bx-book-alt mb-4"
                    style={{ fontSize: "4rem", color: "#7367f0" }}
                  ></i>
                  <h3 className="mb-3">No Books Found</h3>
                  <p className="text-muted mb-4">
                    Start building your book collection by adding your first
                    book.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setSelectedBook({
                        title: "",
                        price: 0,
                        stock: 0,
                        category: "",
                        isbn: "",
                        marketplaceLinks: { amazon: "", flipkart: "" },
                        publication: {
                          publicationId: "",
                          rating: 0,
                          publishedDate: "",
                          description: "",
                        },
                      })
                    }
                  >
                    <i className="bx bx-plus me-2"></i>
                    Add Your First Book
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserEditForm
          user={selectedUser}
          onSubmit={handleUpdateUser}
          onCancel={() => setSelectedUser(null)}
        />
      )}

      {selectedBook && (
        <BookEditForm
          book={selectedBook}
          onSubmit={handleUpdateBook}
          onCancel={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
