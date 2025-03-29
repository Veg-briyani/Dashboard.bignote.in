import React, { useState } from "react";

const UserEditForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "author",
    profile: {
      title: user.profile?.title || "",
      location: user.profile?.location || "",
      bio: user.profile?.bio || "",
    },
    authorStats: {
      numberOfPublications: user.authorStats?.numberOfPublications || 0,
      averageRating: user.authorStats?.averageRating || 0,
      numberOfFollowers: user.authorStats?.numberOfFollowers || 0,
      totalWorks: user.authorStats?.totalWorks || 0,
    },
    badges: user.badges || [],
    achievements: user.achievements || [],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data before submission
    if (!formData.name || !formData.email || !formData.role) {
      console.error("Required fields are missing");
      return;
    }

    // Ensure all nested objects exist
    const validatedFormData = {
      ...formData,
      profile: {
        title: formData.profile?.title || "",
        location: formData.profile?.location || "",
        bio: formData.profile?.bio || "",
      },
      authorStats: {
        numberOfPublications:
          Number(formData.authorStats?.numberOfPublications) || 0,
        averageRating: Number(formData.authorStats?.averageRating) || 0,
        numberOfFollowers: Number(formData.authorStats?.numberOfFollowers) || 0,
        totalWorks: Number(formData.authorStats?.totalWorks) || 0,
      },
      badges: Array.isArray(formData.badges) ? formData.badges : [],
      achievements: Array.isArray(formData.achievements)
        ? formData.achievements
        : [],
    };

    onSubmit(user._id, validatedFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit-form">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Profile</h3>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="profile.title"
            value={formData.profile.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="profile.location"
            value={formData.profile.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            name="profile.bio"
            value={formData.profile.bio}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Author Stats</h3>
        <div className="form-group">
          <label>Number of Publications:</label>
          <input
            type="number"
            name="authorStats.numberOfPublications"
            value={formData.authorStats.numberOfPublications}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Average Rating:</label>
          <input
            type="number"
            step="0.1"
            name="authorStats.averageRating"
            value={formData.authorStats.averageRating}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Number of Followers:</label>
          <input         
            type="number"
            name="authorStats.numberOfFollowers"
            value={formData.authorStats.numberOfFollowers}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Total Works:</label>
          <input
            type="number"
            name="authorStats.totalWorks"
            value={formData.authorStats.totalWorks}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Save Changes
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
