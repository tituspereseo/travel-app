import React, { useState, useEffect } from "react";

const ClientDashboard = ({ user, tours, onNavigate }) => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    travelDate: "",
    guests: 1,
    specialRequests: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: "", text: "" });

  // CENTERED POPUP MODAL STATES
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalData, setInfoModalData] = useState({
    title: "",
    message: "",
    details: {},
    onConfirm: null,
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    wishlistCount: 0,
  });

  // Use direct paths from public folder
  const travelVideos = [
    {
      id: 1,
      title: "Boracay Paradise",
      location: "Boracay, Philippines",
      video: "/assets/images/boracay-video.mp4",
    },
    {
      id: 2,
      title: "Cebu Whale Sharks",
      location: "Cebu, Philippines",
      video: "/assets/images/cebu-video.mp4",
    },
  ];

  const popularDestinations = [
    {
      name: "Tokyo, Japan",
      image: "/assets/images/tours/tokyo.png",
      price: "₱28,500",
      rating: 4.8,
      tourId: 1,
      location: "Japan",
    },
    {
      name: "Paris, France",
      image: "/assets/images/tours/paris.png",
      price: "₱52,000",
      rating: 4.9,
      tourId: 2,
      location: "France",
    },
    {
      name: "Bali, Indonesia",
      image: "/assets/images/tours/bali.png",
      price: "₱14,500",
      rating: 4.7,
      tourId: 3,
      location: "Indonesia",
    },
  ];

  // Fetch real data from backend
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const bookingsRes = await fetch(
        `http://localhost:8080/api/bookings/user/${user.id}`,
      );
      const bookingsData = await bookingsRes.json();
      const userBookings = Array.isArray(bookingsData) ? bookingsData : [];
      setBookings(userBookings);

      const paymentsRes = await fetch(`http://localhost:8080/api/payments`);
      const paymentsData = await paymentsRes.json();
      const userPayments = Array.isArray(paymentsData)
        ? paymentsData.filter((p) => p.userId === user.id)
        : [];
      setPayments(userPayments);

      const totalBookings = userBookings.length;
      const totalSpent = userPayments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + Number(p.amount), 0);
      const upcomingTrips = userBookings.filter(
        (b) => b.status === "confirmed" && new Date(b.travelDate) > new Date(),
      ).length;

      setStats({
        totalBookings,
        totalSpent,
        upcomingTrips,
        wishlistCount: 0,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTourImage = (tourName) => {
    const imageMap = {
      "Tokyo Explorer": "/assets/images/tours/tokyo.png",
      "Paris Romance": "/assets/images/tours/paris.png",
      "Bali Retreat": "/assets/images/tours/bali.png",
      "New York City Break": "/assets/images/tours/newyork.png",
      "Cebu Island Hopping": "/assets/images/tours/cebu.png",
      "Santorini Escape": "/assets/images/tours/santorini.png",
    };
    return imageMap[tourName] || "/assets/images/tours/tokyo.png";
  };

  const handleImageError = (e, tourName) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/400x300/1e293b/ffd700?text=${encodeURIComponent(tourName || "Image")}`;
  };

  // CENTERED MODAL POPUP FUNCTION - replaces alert()
  const showCenteredModal = (
    title,
    message,
    details = {},
    onConfirm = null,
  ) => {
    setInfoModalData({
      title,
      message,
      details,
      onConfirm,
    });
    setShowInfoModal(true);
  };

  // FUNCTIONAL BOOK NOW BUTTON
  const handleBookNow = (tour) => {
    setSelectedTour(tour);
    setBookingForm({
      travelDate: "",
      guests: 1,
      specialRequests: "",
      customerName: user?.firstName + " " + user?.lastName || "",
      customerEmail: user?.email || "",
      customerPhone: user?.phoneNumber || "",
    });
    setBookingMessage({ type: "", text: "" });
    setShowBookingModal(true);
  };

  // FUNCTIONAL EXPLORE BUTTON WITH CENTERED MODAL
  const handleExploreDestination = (destination) => {
    showCenteredModal(
      `✨ Explore ${destination.name}`,
      `Discover the beauty of ${destination.name}!`,
      {
        Rating: `⭐ ${destination.rating} / 5`,
        "Starting Price": destination.price,
        "Best Time to Visit": destination.name.includes("Tokyo")
          ? "March-May, Sept-Nov"
          : destination.name.includes("Paris")
            ? "April-June, Sept-Oct"
            : "April-October",
        "Popular Activities": destination.name.includes("Tokyo")
          ? "Temples, Shopping, Sushi"
          : destination.name.includes("Paris")
            ? "Eiffel Tower, Louvre, Cafes"
            : "Beaches, Temples, Rice Terraces",
      },
      () => {
        // On Confirm - Navigate to View Tours with location filter
        if (onNavigate) {
          onNavigate("view-tours", { filterLocation: destination.location });
        }
      },
    );
  };

  const handleExploreAllDestinations = () => {
    showCenteredModal(
      "🌍 All Destinations",
      "Explore our amazing travel destinations around the world!",
      {
        "Available Destinations":
          "Japan, France, Indonesia, USA, Philippines, Greece",
        "Best Deals": "Up to 30% off on early bookings",
        "Free Cancellation": "Up to 7 days before travel",
        "24/7 Support": "We are here to help anytime",
      },
      () => {
        if (onNavigate) {
          onNavigate("view-tours");
        }
      },
    );
  };

  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitBooking = async () => {
    if (!bookingForm.travelDate) {
      setBookingMessage({ type: "error", text: "Please select travel date" });
      return;
    }
    if (!bookingForm.customerName) {
      setBookingMessage({ type: "error", text: "Please enter your name" });
      return;
    }
    if (!bookingForm.customerEmail) {
      setBookingMessage({ type: "error", text: "Please enter your email" });
      return;
    }

    setBookingLoading(true);
    setBookingMessage({ type: "", text: "" });

    const totalAmount = selectedTour.price * bookingForm.guests;

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          tourId: selectedTour.id,
          customerName: bookingForm.customerName,
          customerEmail: bookingForm.customerEmail,
          customerPhone: bookingForm.customerPhone,
          travelDate: bookingForm.travelDate,
          guests: bookingForm.guests,
          totalAmount: totalAmount,
          specialRequests: bookingForm.specialRequests,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingMessage({
          type: "success",
          text: `✅ Booking successful! Booking #: ${data.bookingNumber}`,
        });
        setTimeout(() => {
          setShowBookingModal(false);
          fetchUserData();
        }, 2000);
      } else {
        setBookingMessage({
          type: "error",
          text: data.error || "Booking failed",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading your dashboard...</div>;
  }

  return (
    <div className="client-dashboard">
      {/* Hero Banner */}
      <div className="client-hero">
        <div className="client-hero-overlay"></div>
        <div className="client-hero-content">
          <h1>
            Where do you want to go today,{" "}
            <span className="highlight">{user?.firstName || "Traveler"}</span>?
            🌍
          </h1>
          <p>
            Discover amazing destinations, book your next adventure, and create
            unforgettable memories.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="client-stats-grid">
        <div className="client-stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-info">
            <h3>My Bookings</h3>
            <div className="stat-number">{stats.totalBookings}</div>
          </div>
        </div>
        <div className="client-stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>Total Spent</h3>
            <div className="stat-number">
              ₱{stats.totalSpent.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="client-stat-card">
          <div className="stat-icon">
            <i className="fas fa-plane-departure"></i>
          </div>
          <div className="stat-info">
            <h3>Upcoming Trips</h3>
            <div className="stat-number">{stats.upcomingTrips}</div>
          </div>
        </div>
        <div className="client-stat-card">
          <div className="stat-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="stat-info">
            <h3>Wishlist</h3>
            <div className="stat-number">{stats.wishlistCount}</div>
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div className="client-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-star"></i> Recommended for You
          </h2>
          <button
            className="view-all-btn"
            onClick={handleExploreAllDestinations}
          >
            View All →
          </button>
        </div>
        <div className="recommended-grid">
          {tours &&
            tours.slice(0, 6).map((tour) => (
              <div key={tour.id} className="recommended-card">
                <div className="card-image">
                  <img
                    src={getTourImage(tour.name)}
                    alt={tour.name}
                    onError={(e) => handleImageError(e, tour.name)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span className="card-price">
                    ₱{Number(tour.price).toLocaleString()}
                  </span>
                </div>
                <div className="card-info">
                  <h3>{tour.name}</h3>
                  <p>
                    <i className="fas fa-map-marker-alt"></i> {tour.location}
                  </p>
                  <div className="card-rating">
                    <i className="fas fa-star"></i> {tour.rating || 4.8} (128
                    reviews)
                  </div>
                  <button
                    className="book-now-btn"
                    onClick={() => handleBookNow(tour)}
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Travel Videos */}
      <div className="client-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-video"></i> Travel Inspiration
          </h2>
          <p>Watch and get inspired for your next destination</p>
        </div>
        <div className="videos-grid">
          {travelVideos.map((video) => (
            <div key={video.id} className="video-card">
              <video
                className="travel-video"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              >
                <source src={video.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>
                  <i className="fas fa-map-marker-alt"></i> {video.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="client-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-fire"></i> Popular Destinations
          </h2>
          <button
            className="view-all-btn"
            onClick={handleExploreAllDestinations}
          >
            View All →
          </button>
        </div>
        <div className="destinations-grid">
          {popularDestinations.map((dest, index) => (
            <div
              key={index}
              className="destination-card"
              onClick={() => handleExploreDestination(dest)}
            >
              <img
                src={dest.image}
                alt={dest.name}
                onError={(e) => handleImageError(e, dest.name)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="destination-overlay">
                <h3>{dest.name}</h3>
                <div className="destination-details">
                  <span className="price">{dest.price}</span>
                  <span className="rating">
                    <i className="fas fa-star"></i> {dest.rating}
                  </span>
                </div>
                <button
                  className="explore-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExploreDestination(dest);
                  }}
                >
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && selectedTour && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-container">
            <div className="booking-modal-header">
              <div className="booking-modal-icon">
                <i className="fas fa-suitcase-rolling"></i>
              </div>
              <div className="booking-modal-title">
                <h2>Complete Your Booking</h2>
                <p>Secure your spot for this amazing adventure</p>
              </div>
              <button
                className="booking-modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="booking-modal-body">
              <div className="booking-tour-summary">
                <div className="booking-tour-image">
                  <img
                    src={getTourImage(selectedTour.name)}
                    alt={selectedTour.name}
                  />
                </div>
                <div className="booking-tour-info">
                  <h3>{selectedTour.name}</h3>
                  <div className="booking-tour-meta">
                    <span>
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {selectedTour.location}
                    </span>
                    <span>
                      <i className="fas fa-clock"></i> {selectedTour.duration}
                    </span>
                    <span>
                      <i className="fas fa-star"></i> {selectedTour.rating}
                    </span>
                  </div>
                  <div className="booking-tour-price">
                    ₱{Number(selectedTour.price).toLocaleString()}{" "}
                    <span>/ person</span>
                  </div>
                </div>
              </div>

              {bookingMessage.text && (
                <div className={`booking-message ${bookingMessage.type}`}>
                  <i
                    className={
                      bookingMessage.type === "success"
                        ? "fas fa-check-circle"
                        : "fas fa-exclamation-circle"
                    }
                  ></i>
                  {bookingMessage.text}
                </div>
              )}

              <div className="booking-form">
                <div className="booking-form-section">
                  <h4>
                    <i className="fas fa-user"></i> Personal Information
                  </h4>
                  <div className="booking-form-row">
                    <div className="booking-form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={bookingForm.customerName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="booking-form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={bookingForm.customerEmail}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="booking-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={bookingForm.customerPhone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="booking-form-section">
                  <h4>
                    <i className="fas fa-calendar-alt"></i> Trip Details
                  </h4>
                  <div className="booking-form-row">
                    <div className="booking-form-group">
                      <label>Travel Date *</label>
                      <input
                        type="date"
                        name="travelDate"
                        value={bookingForm.travelDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="booking-form-group">
                      <label>Number of Guests *</label>
                      <div className="booking-guest-control">
                        <button
                          type="button"
                          onClick={() =>
                            setBookingForm({
                              ...bookingForm,
                              guests: Math.max(1, bookingForm.guests - 1),
                            })
                          }
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          name="guests"
                          value={bookingForm.guests}
                          onChange={handleInputChange}
                          min="1"
                          max="20"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setBookingForm({
                              ...bookingForm,
                              guests: Math.min(20, bookingForm.guests + 1),
                            })
                          }
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="booking-form-group">
                    <label>Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={bookingForm.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requests? (dietary, accessibility, etc.)"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="booking-price-breakdown">
                  <div className="price-row">
                    <span>Tour Price per person</span>
                    <span>₱{Number(selectedTour.price).toLocaleString()}</span>
                  </div>
                  <div className="price-row">
                    <span>Number of Guests</span>
                    <span>x {bookingForm.guests}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>
                      ₱
                      {(
                        selectedTour.price * bookingForm.guests
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-modal-footer">
              <button
                className="booking-btn-cancel"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button
                className="booking-btn-confirm"
                onClick={submitBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i> Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CENTERED INFO MODAL POPUP - replaces browser alert */}
      {showInfoModal && (
        <div
          className="centered-modal-overlay"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="centered-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="centered-modal-header">
              <div className="centered-modal-icon">
                <i className="fas fa-compass"></i>
              </div>
              <h2>{infoModalData.title}</h2>
              <button
                className="centered-modal-close"
                onClick={() => setShowInfoModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="centered-modal-body">
              <p className="centered-modal-message">{infoModalData.message}</p>

              {Object.keys(infoModalData.details).length > 0 && (
                <div className="centered-modal-details">
                  {Object.entries(infoModalData.details).map(([key, value]) => (
                    <div key={key} className="detail-row">
                      <span className="detail-label">{key}:</span>
                      <span className="detail-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="centered-modal-footer">
              <button
                className="centered-modal-btn cancel"
                onClick={() => setShowInfoModal(false)}
              >
                Close
              </button>
              <button
                className="centered-modal-btn confirm"
                onClick={() => {
                  setShowInfoModal(false);
                  if (infoModalData.onConfirm) {
                    infoModalData.onConfirm();
                  }
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
