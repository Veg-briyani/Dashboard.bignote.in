import { useState, useEffect } from "react";
import { adminAPI } from "../../services/adminAPI";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (userId) => {
    try {
      await adminAPI.updateUser(userId, editForm);
      await fetchUsers();
      setEditingUser(null);
      setError(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminAPI.deleteUser(userId);
      await fetchUsers();
      setError(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      await fetchUsers();
      setError(null);
    } catch (err) {
      console.error("Error updating user role:", err);
      setError("Failed to update user role. Please try again.");
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="card">
      <h5 className="card-header">User Management</h5>
      {error && (
        <div className="alert alert-danger mx-4 mt-4" role="alert">
          {error}
        </div>
      )}
      <div className="table-responsive text-nowrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-border-bottom-0">
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {editingUser?._id === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  ) : (
                    <strong>{user.name}</strong>
                  )}
                </td>
                <td>
                  {editingUser?._id === user._id ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={
                      editingUser?._id === user._id ? editForm.role : user.role
                    }
                    onChange={(e) =>
                      editingUser?._id === user._id
                        ? handleFormChange(e)
                        : handleRoleChange(user._id, e.target.value)
                    }
                    name="role"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="author">Author</option>
                  </select>
                </td>
                <td>
                  {editingUser?._id === user._id ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdateUser(user._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
