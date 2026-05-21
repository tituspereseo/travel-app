import React, { useState } from "react";

const ClientViewTours = ({ tours, loading, onBookNow, user, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Booking Modal States
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

  const locations = [
    "all",
    "Japan",
    "France",
    "Indonesia",
    "USA",
    "Philippines",
    "Greece",
  ];

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

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || tour.location === selectedLocation;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under20k" && tour.price < 20000) ||
      (priceRange === "20k-40k" &&
        tour.price >= 20000 &&
        tour.price <= 40000) ||
      (priceRange === "above40k" && tour.price > 40000);
    return matchesSearch && matchesLocation && matchesPrice;
  });

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
          if (onBookNow) onBookNow(selectedTour);
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

  return (
    <div className="client-view-tours">
      <div className="tours-header">
        <h1>
          <i className="fas fa-umbrella-beach"></i> Explore Tours
        </h1>
        <p>Discover amazing travel experiences around the world</p>
      </div>

      <div className="tours-filters">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by destination or tour name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locations
              .filter((l) => l !== "all")
              .map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under20k">Under ₱20,000</option>
            <option value="20k-40k">₱20,000 - ₱40,000</option>
            <option value="above40k">Above ₱40,000</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading amazing tours...</div>
      ) : filteredTours.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No tours found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="tours-client-grid">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="tour-client-card">
              <div className="tour-image">
                <img
                  src={getTourImage(tour.name)}
                  alt={tour.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x300/1e293b/ffd700?text=${encodeURIComponent(tour.name)}`;
                  }}
                />
                <span className="tour-badge active">
                  {tour.status || "Active"}
                </span>
              </div>
              <div className="tour-details">
                <h3>{tour.name}</h3>
                <p className="tour-location">
                  <i className="fas fa-map-marker-alt"></i> {tour.location}
                </p>
                <p className="tour-description">
                  {tour.description ||
                    "Experience the beauty and culture of this amazing destination."}
                </p>
                <div className="tour-meta">
                  <span>
                    <i className="fas fa-clock"></i> {tour.duration}
                  </span>
                  <span>
                    <i className="fas fa-users"></i> {tour.bookings || 0}{" "}
                    bookings
                  </span>
                  <span>
                    <i className="fas fa-star"></i> {tour.rating || 4.8}
                  </span>
                </div>
                <div className="tour-footer">
                  <div className="tour-price">
                    ₱{Number(tour.price).toLocaleString()}
                    <span>/person</span>
                  </div>
                  {/* FUNCTIONAL BOOK NOW BUTTON */}
                  <button
                    className="btn-book-now"
                    onClick={() => handleBookNow(tour)}
                  >
                    Book Now <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BEAUTIFUL BOOKING MODAL */}
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
              {/* Tour Summary Card */}
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

              {/* Booking Form */}
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

                {/* Price Breakdown */}
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
    </div>
  );
};

export default ClientViewTours;
