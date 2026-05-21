import React, { useState, useRef } from "react";

const EditProfile = ({ user, setUser }) => {
  const API_URL = "http://localhost:8080/api";

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    profileImage: user?.profileImage || null,
  });

  const [previewImage, setPreviewImage] = useState(user?.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 2MB" });
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Only JPG, PNG, and GIF are allowed",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updateData = {};
      updateData.firstName = formData.firstName;
      updateData.lastName = formData.lastName;

      if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
        updateData.phoneNumber = formData.phoneNumber;
      }

      if (
        formData.profileImage &&
        formData.profileImage !== user?.profileImage
      ) {
        updateData.profileImage = formData.profileImage;
      }

      const response = await fetch(`${API_URL}/auth/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          profileImage: formData.profileImage,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage({ type: "success", text: "Profile updated successfully!" });

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error connecting to server: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      profileImage: user?.profileImage || null,
    });
    setPreviewImage(user?.profileImage || null);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="edit-profile">
      <div className="profile-card">
        <div className="profile-avatar-section">
          <div
            className="profile-avatar-large"
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            {previewImage ? (
              <img src={previewImage} alt="Profile" />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/gif"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <button
            className="change-photo-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="fas fa-camera"></i> Click to change profile picture
          </button>
          <small className="photo-hint">
            Supported: JPG, PNG, GIF (Max 2MB)
          </small>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            <i
              className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}
            ></i>
            {message.text}
          </div>
        )}

        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="disabled-input"
            />
            <small className="email-hint">Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-actions">
            <button
              className="btn-save"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
            <button className="btn-change-password" onClick={handleCancel}>
              <i className="fas fa-undo-alt"></i> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
