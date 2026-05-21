import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Modal, { useModal } from "./components/Modal";
// Import video
import oceanwave from "./oceanwave.mp4";

// Import actual images
import authLogo from "./assets/images/auth-logo.png";
import hero1 from "./assets/images/hero1.jpg";
import hero2 from "./assets/images/hero2.jpg";
import hero3 from "./assets/images/hero3.jpg";
import hero4 from "./assets/images/hero4.jpg";
import loginBg from "./assets/images/loginbg.jpg";
import chatbotIcon from "./assets/images/chatbot.png";

// Import Client Components
import ClientNavbar from "./components/client/ClientNavbar";
import ClientDashboard from "./components/client/ClientDashboard";
import ClientViewTours from "./components/client/ClientViewTours";
import ClientBookings from "./components/client/ClientBookings";
import ClientPayments from "./components/client/ClientPayments";
import EditProfile from "./components/client/EditProfile";
import ClientSettings from "./components/client/ClientSettings";

// Import Tour Management Modal
import TourManagementModal from "./components/admin/TourManagementModal";

// API URL
const API_URL = "http://localhost:8080/api";

// ========== FLIGHT SEARCH COMPONENT ==========
const FlightSearch = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const philippineAirports = {
    manila: {
      code: "MNL",
      name: "Ninoy Aquino International Airport",
      city: "Manila",
    },
    cebu: {
      code: "CEB",
      name: "Mactan-Cebu International Airport",
      city: "Cebu",
    },
    boracay: {
      code: "MPH",
      name: "Godofredo P. Ramos Airport",
      city: "Boracay",
    },
    palawan: {
      code: "PPS",
      name: "Puerto Princesa International Airport",
      city: "Palawan",
    },
    bicol: { code: "LGP", name: "Legazpi Airport", city: "Bicol" },
    davao: {
      code: "DVO",
      name: "Francisco Bangoy International Airport",
      city: "Davao",
    },
    iloilo: {
      code: "ILO",
      name: "Iloilo International Airport",
      city: "Iloilo",
    },
  };

  const flightDatabase = {
    manila: {
      cebu: [
        {
          airline: "Cebu Pacific",
          flightNo: "5J 561",
          duration: "1h 20m",
          price: 1999,
          departure: "05:30",
          arrival: "06:50",
        },
      ],
      boracay: [
        {
          airline: "Philippine Airlines",
          flightNo: "PR 2043",
          duration: "1h 05m",
          price: 2899,
          departure: "08:00",
          arrival: "09:05",
        },
      ],
      palawan: [
        {
          airline: "Cebu Pacific",
          flightNo: "5J 637",
          duration: "1h 30m",
          price: 3599,
          departure: "07:00",
          arrival: "08:30",
        },
      ],
      davao: [
        {
          airline: "Philippine Airlines",
          flightNo: "PR 2813",
          duration: "2h 00m",
          price: 4299,
          departure: "06:00",
          arrival: "08:00",
        },
      ],
    },
    cebu: {
      manila: [
        {
          airline: "Cebu Pacific",
          flightNo: "5J 562",
          duration: "1h 20m",
          price: 1999,
          departure: "07:30",
          arrival: "08:50",
        },
      ],
      boracay: [
        {
          airline: "Air Asia",
          flightNo: "Z2 341",
          duration: "1h 00m",
          price: 1599,
          departure: "10:00",
          arrival: "11:00",
        },
      ],
      palawan: [
        {
          airline: "Cebu Pacific",
          flightNo: "5J 637",
          duration: "1h 15m",
          price: 2499,
          departure: "09:00",
          arrival: "10:15",
        },
      ],
    },
    bicol: {
      cebu: [
        {
          airline: "Cebu Pacific",
          flightNo: "5J 328",
          duration: "1h 15m",
          price: 2899,
          departure: "06:00",
          arrival: "07:15",
        },
      ],
      manila: [
        {
          airline: "Philippine Airlines",
          flightNo: "PR 2922",
          duration: "1h 10m",
          price: 2399,
          departure: "07:00",
          arrival: "08:10",
        },
      ],
    },
    davao: {
      manila: [
        {
          airline: "Cebu Pacific",
          flightNo: "5J 972",
          duration: "2h 00m",
          price: 3999,
          departure: "05:00",
          arrival: "07:00",
        },
      ],
      cebu: [
        {
          airline: "Philippine Airlines",
          flightNo: "PR 2356",
          duration: "1h 05m",
          price: 1999,
          departure: "08:00",
          arrival: "09:05",
        },
      ],
    },
  };

  const performSearch = () => {
    const from = fromLocation.toLowerCase().trim();
    const to = toLocation.toLowerCase().trim();

    if (activeTab === "flights") {
      if (flightDatabase[from] && flightDatabase[from][to]) {
        setSearchResults({
          type: "flights",
          results: flightDatabase[from][to],
          from: philippineAirports[from]?.city || from,
          to: philippineAirports[to]?.city || to,
        });
      } else {
        setSearchResults({
          type: "flights",
          results: [
            {
              airline: "Sample Airline",
              flightNo: "SA 123",
              duration: "2h 00m",
              price: 3500,
              departure: "08:00",
              arrival: "10:00",
            },
          ],
          from: from,
          to: to,
        });
      }
    } else if (activeTab === "hotels") {
      setSearchResults({
        type: "hotels",
        results: [
          {
            name: "Shangri-La Resort",
            rating: 4.9,
            pricePerNight: 15800,
            amenities: "Pool, Spa, Restaurant",
          },
          {
            name: "Holiday Inn",
            rating: 4.5,
            pricePerNight: 5800,
            amenities: "Pool, Gym, WiFi",
          },
          {
            name: "Budget Hotel",
            rating: 4.0,
            pricePerNight: 2500,
            amenities: "WiFi, Breakfast",
          },
        ],
        to: to,
      });
    } else if (activeTab === "packages") {
      setSearchResults({
        type: "packages",
        results: [
          {
            name: `${to.charAt(0).toUpperCase() + to.slice(1)} Adventure Package`,
            duration: "4D/3N",
            price: 15999,
            inclusions: "Flight + Hotel + Tours",
          },
          {
            name: `${to.charAt(0).toUpperCase() + to.slice(1)} Luxury Package`,
            duration: "5D/4N",
            price: 25999,
            inclusions: "Flight + 5-star Hotel + Tours + Meals",
          },
          {
            name: `${to.charAt(0).toUpperCase() + to.slice(1)} Budget Package`,
            duration: "3D/2N",
            price: 8999,
            inclusions: "Flight + 3-star Hotel",
          },
        ],
        to: to,
      });
    }
  };

  return (
    <div className="flight-search-card">
      <div className="search-tabs">
        <div
          className={`search-tab ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          <i className="fas fa-plane"></i> Flights
        </div>
        <div
          className={`search-tab ${activeTab === "hotels" ? "active" : ""}`}
          onClick={() => setActiveTab("hotels")}
        >
          <i className="fas fa-hotel"></i> Hotels
        </div>
        <div
          className={`search-tab ${activeTab === "packages" ? "active" : ""}`}
          onClick={() => setActiveTab("packages")}
        >
          <i className="fas fa-box"></i> Packages
        </div>
      </div>
      <div className="search-form">
        <div className="search-field">
          <label>FROM</label>
          <div className="field-input">
            <i className="fas fa-map-marker-alt"></i>
            <input
              type="text"
              placeholder="your location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="search-field">
          <label>TO</label>
          <div className="field-input">
            <i className="fas fa-location-dot"></i>
            <input
              type="text"
              placeholder="choose destination"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <button className="btn-search" onClick={performSearch}>
          <i className="fas fa-search"></i> Search {activeTab}
        </button>
      </div>

      {searchResults && (
        <div className="results-section active">
          <div className="results-header">
            <h3>
              <i className="fas fa-plane"></i>{" "}
              {searchResults.type === "flights"
                ? "Flight"
                : searchResults.type === "hotels"
                  ? "Hotel"
                  : "Package"}{" "}
              Results
            </h3>
            <span className="results-count">
              {searchResults.results.length}{" "}
              {searchResults.type === "flights"
                ? "flights"
                : searchResults.type === "hotels"
                  ? "hotels"
                  : "packages"}{" "}
              found
              {searchResults.from && ` from ${searchResults.from}`}
              {searchResults.to && ` to ${searchResults.to}`}
            </span>
          </div>
          <div className="results-list">
            {searchResults.results.map((item, idx) => (
              <div className="result-item" key={idx}>
                <div className="result-info">
                  <div className="result-title">
                    {searchResults.type === "flights"
                      ? `✈️ ${item.airline} ${item.flightNo}`
                      : searchResults.type === "hotels"
                        ? `🏨 ${item.name}`
                        : `🎒 ${item.name}`}
                  </div>
                  <div className="result-detail">
                    {searchResults.type === "flights" ? (
                      <>
                        <span>
                          {item.departure} - {item.arrival}
                        </span>
                        <span>{item.duration}</span>
                      </>
                    ) : searchResults.type === "hotels" ? (
                      <>
                        <span>⭐ {item.rating}/5</span>
                        <span>{item.amenities}</span>
                      </>
                    ) : (
                      <>
                        <span>{item.duration}</span>
                        <span>{item.inclusions}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="result-price">
                  <div className="price-amount">
                    {searchResults.type === "flights"
                      ? `₱${item.price.toLocaleString()}`
                      : searchResults.type === "hotels"
                        ? `₱${item.pricePerNight.toLocaleString()}/night`
                        : `₱${item.price.toLocaleString()}`}
                  </div>
                  <div className="price-label">
                    {searchResults.type === "flights"
                      ? "per person"
                      : searchResults.type === "hotels"
                        ? "per night"
                        : "per person"}
                  </div>
                  <button
                    className="btn-select"
                    onClick={() =>
                      alert(`Selected ${item.airline || item.name}`)
                    }
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ========== WONDERBOT CHATBOT COMPONENT ==========
const WonderBot = ({ isOpen, onToggle, chatbotIcon }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm WonderBot! 🌍\n\nI can help you with:\n✈️ Flight info (Manila to Cebu)\n🏨 Hotel recommendations\n🎒 Travel packages\n📍 Destination guides\n💰 Price inquiries\n\nAsk me anything about travel!",
      isUser: false,
      time: getCurrentTime(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (message) => {
    const lowerMsg = message.toLowerCase().trim();

    if (
      lowerMsg.includes("flight") &&
      lowerMsg.includes("manila") &&
      lowerMsg.includes("cebu")
    )
      return "✈️ Manila to Cebu flights:\n• Cebu Pacific (5J 561) - ₱1,999 - 05:30 AM\n• Philippine Airlines (PR 1847) - ₱2,499 - 08:00 AM\n• Air Asia (Z2 431) - ₱1,799 - 02:00 PM\n\nDuration: ~1 hour 20 minutes";
    if (
      lowerMsg.includes("flight") &&
      lowerMsg.includes("bicol") &&
      lowerMsg.includes("cebu")
    )
      return "✈️ Bicol to Cebu flights:\n• Cebu Pacific (5J 328) - ₱2,899 - 06:00 AM\n• Philippine Airlines (PR 2924) - ₱3,299 - 11:00 AM\n\nDuration: ~1 hour 15 minutes";
    if (lowerMsg.includes("hotel") && lowerMsg.includes("boracay"))
      return "🏨 Top Hotels in Boracay:\n1. Shangri-La Boracay - ₱18,500/night ⭐5\n2. Crimson Resort - ₱12,800/night ⭐5\n3. Henann Regency - ₱7,500/night ⭐4";
    if (lowerMsg.includes("hotel") && lowerMsg.includes("cebu"))
      return "🏨 Top Hotels in Cebu:\n1. Shangri-La Mactan - ₱16,800/night ⭐5\n2. Waterfront Hotel - ₱6,500/night ⭐4\n3. Radisson Blu - ₱7,200/night ⭐4";
    if (lowerMsg.includes("package") && lowerMsg.includes("boracay"))
      return "🎒 Boracay Travel Packages:\n• Summer Escape: 4D/3N - ₱15,999\n• Luxury Getaway: 5D/4N - ₱25,999\n• Honeymoon Special: 5D/4N - ₱22,999";
    if (lowerMsg.includes("boracay"))
      return "🏝️ Boracay Island Guide:\n✨ Best Time: November to May\n✨ Must-Visit: White Beach, Puka Beach, D'Mall\n✨ Activities: Island Hopping, Paraw Sailing, Scuba Diving";
    if (lowerMsg.includes("help"))
      return '🤖 I\'m WonderBot! Try:\n✈️ "flights from Manila to Cebu"\n🏨 "hotels in Boracay"\n🎒 "packages in Palawan"\n📍 "Boracay guide"';
    if (lowerMsg.includes("hello") || lowerMsg === "hi")
      return "👋 Hello! Welcome to Travel&Go! How can I help you today? ✈️";
    if (lowerMsg.includes("thank"))
      return "You're very welcome! 😊 Happy travels!";

    return '🤔 Try asking about:\n• flights from Manila to Cebu\n• hotels in Boracay\n• packages in Palawan\n• Boracay guide\n\nType "help" for more options!';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        text: inputMessage,
        isUser: true,
        time: getCurrentTime(),
      },
    ]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: getBotResponse(inputMessage),
          isUser: false,
          time: getCurrentTime(),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="chat-window active">
      <div className="chat-header">
        <div className="chat-avatar">
          <img src={chatbotIcon} alt="WonderBot" className="chat-avatar-img" />
          <div className="online-dot"></div>
        </div>
        <div className="chat-header-info">
          <h3>WonderBot 🤖</h3>
          <p>✨ Online • AI Travel Assistant</p>
        </div>
        <button className="chat-close" onClick={onToggle}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.isUser ? "user" : "bot"}`}
          >
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask WonderBot anything..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

// ========== DATA ==========
const recentActivitiesData = [
  {
    user: "Danie Bacani",
    action: "booked Tokyo Explorer (5 days)",
    time: "2 hours ago",
    icon: "fa-bookmark",
  },
  {
    user: "J. Reyes",
    action: "Payment received ₱28,500",
    time: "5 hours ago",
    icon: "fa-credit-card",
  },
  {
    user: "Admin",
    action: "New tour Cebu Island Hopping was added",
    time: "1 day ago",
    icon: "fa-plus-circle",
  },
  {
    user: "A. Cruz",
    action: "Booking cancelled Bali Retreat",
    time: "2 days ago",
    icon: "fa-times-circle",
  },
  {
    user: "Marilyn Mendez",
    action: "registered as new customer",
    time: "3 days ago",
    icon: "fa-user-plus",
  },
];

const monthlyRevenue = [
  { month: "Jan", amount: 3.2 },
  { month: "Feb", amount: 2.8 },
  { month: "Mar", amount: 3.5 },
  { month: "Apr", amount: 4.2 },
  { month: "May", amount: 4.8 },
  { month: "Jun", amount: 5.2 },
];

// ========== FORGOT PASSWORD PAGE ==========
const ForgotPasswordPage = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setMessage(
          "If an account exists with that email, you will receive a password reset link.",
        );
      } else {
        setSubmitted(true);
        setMessage(
          "If an account exists with that email, you will receive a password reset link.",
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-overlay"></div>
      <div className="auth-caption">
        <h2>NEED HELP?</h2>
        <h1>
          Reset Your
          <br />
          <span className="highlight">PASSWORD</span>
        </h1>
        <p>
          Don't worry! Enter your email address and we'll send you a link to
          reset your password.
        </p>
        <div className="travel-stats">
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div className="stat">
            <div className="stat-number">Secure</div>
            <div className="stat-label">Process</div>
          </div>
          <div className="stat">
            <div className="stat-number">Fast</div>
            <div className="stat-label">Recovery</div>
          </div>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src={authLogo} alt="Logo" className="auth-logo-img" />
          <h2>
            Travel<span>&Go</span>
          </h2>
        </div>

        {!submitted ? (
          <>
            <h3>Forgot Password?</h3>
            <p className="subtitle">Enter your email to reset your password</p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleRequestReset}>
              <div className="form-group">
                <label>Email address</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary-auth"
                disabled={loading}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}{" "}
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <>
            <div
              className="success-message"
              style={{ textAlign: "center", padding: "20px" }}
            >
              <i
                className="fas fa-envelope-open-text"
                style={{
                  fontSize: "48px",
                  color: "#10b981",
                  marginBottom: "16px",
                }}
              ></i>
              <h3>Check Your Email</h3>
              <p style={{ color: "#64748b", marginTop: "8px" }}>{message}</p>
            </div>
            <button
              className="btn-secondary"
              onClick={() => setCurrentPage("login")}
              style={{ width: "100%", marginTop: "20px" }}
            >
              <i className="fas fa-arrow-left"></i> Back to Login
            </button>
          </>
        )}

        <p className="auth-link" style={{ marginTop: "20px" }}>
          Remember your password?{" "}
          <button
            className="auth-link-btn"
            onClick={() => setCurrentPage("login")}
          >
            Log in
          </button>
        </p>
        <div className="back-to-home">
          <button
            className="back-home-btn"
            onClick={() => setCurrentPage("home")}
          >
            <i className="fas fa-arrow-left"></i> Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== RESET PASSWORD PAGE ==========
const ResetPasswordPage = ({ setCurrentPage }) => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(
        "Invalid or missing reset token. Please request a new password reset.",
      );
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setMessage(
          "Password reset successful! You can now log in with your new password.",
        );
      } else {
        setError(
          data.error || "Failed to reset password. Please request a new link.",
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-overlay"></div>
      <div className="auth-caption">
        <h2>CREATE NEW</h2>
        <h1>
          <span className="highlight">PASSWORD</span>
          <br />
          For Your Account
        </h1>
        <p>Create a strong and unique password to keep your account secure.</p>
      </div>
      <div className="auth-card">
        <div className="auth-logo">
          <img src={authLogo} alt="Logo" className="auth-logo-img" />
          <h2>
            Travel<span>&Go</span>
          </h2>
        </div>

        {!submitted ? (
          <>
            <h3>Reset Password</h3>
            <p className="subtitle">Enter your new password below</p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Enter new password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-with-icon">
                  <i className="fas fa-check-circle"></i>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary-auth"
                disabled={loading}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-key"></i>
                )}{" "}
                Reset Password
              </button>
            </form>
          </>
        ) : (
          <>
            <div
              className="success-message"
              style={{ textAlign: "center", padding: "20px" }}
            >
              <i
                className="fas fa-check-circle"
                style={{
                  fontSize: "48px",
                  color: "#10b981",
                  marginBottom: "16px",
                }}
              ></i>
              <h3>Password Reset Complete!</h3>
              <p style={{ color: "#64748b", marginTop: "8px" }}>{message}</p>
            </div>
            <button
              className="btn-primary-auth"
              onClick={() => setCurrentPage("login")}
              style={{ width: "100%", marginTop: "20px" }}
            >
              <i className="fas fa-sign-in-alt"></i> Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ========== MAIN APP ==========
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminSection, setAdminSection] = useState("dashboard");
  const [clientPage, setClientPage] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGCashModal, setShowGCashModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [gcashPhone, setGcashPhone] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    tourId: "",
    travelDate: "",
    guests: 1,
    specialRequests: "",
  });

  // Settings state
  const [settings, setSettings] = useState({
    companyName: "Travel&Go",
    companyEmail: "info@travelandgo.com",
    companyPhone: "+63 2 8888 0000",
    companyAddress: "Makati City, Philippines",
    timezone: "Asia/Manila",
    dateFormat: "MM/DD/YYYY",
    currency: "PHP",
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    bookingReminder: true,
    maintenanceMode: false,
  });

  const fetchBookings = () => {
    fetch(`${API_URL}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  };

  const fetchPayments = () => {
    fetch(`${API_URL}/payments`)
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((err) => console.error("Error fetching payments:", err));
  };

  const fetchCustomers = () => {
    fetch(`${API_URL}/auth/users`)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  };

  const fetchActivities = () => {
    fetch(`${API_URL}/activities/recent`)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error fetching activities:", err));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        console.log("Loaded user from localStorage:", parsedUser);
        console.log("Loaded user role:", parsedUser.role);
      } catch (e) {
        console.error("Error parsing user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/tours`)
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings();
      fetchPayments();
      fetchCustomers();
      fetchActivities();
    }
  }, [isLoggedIn]);

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

  const getTourName = (tourId) => {
    const tour = tours.find((t) => t.id === tourId);
    return tour ? tour.name : `Tour #${tourId}`;
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Logout Confirmation",
      "Are you sure you want to logout?",
    );

    if (confirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setCurrentPage("home");
      setClientPage("dashboard");
      await showAlert("Logged Out", "You have been successfully logged out.");
    }
  };

  const handleCreateBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBooking,
          userId: user?.id,
          tourId: parseInt(newBooking.tourId),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Booking created successfully!");
        setShowBookingModal(false);
        setNewBooking({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          tourId: "",
          travelDate: "",
          guests: 1,
          specialRequests: "",
        });
        fetchBookings();
        fetchActivities();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error creating booking");
    }
  };

  const handleEditBooking = (booking) => {
    const newStatus = prompt(
      "Enter new status (pending/confirmed/cancelled):",
      booking.status,
    );
    if (
      newStatus &&
      ["pending", "confirmed", "cancelled"].includes(newStatus)
    ) {
      fetch(`${API_URL}/bookings/${booking.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }).then(() => {
        alert("Booking status updated!");
        fetchBookings();
        fetchPayments();
        fetchActivities();
      });
    }
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      fetch(`${API_URL}/bookings/${id}`, { method: "DELETE" }).then(() => {
        alert("Booking deleted!");
        fetchBookings();
        fetchPayments();
        fetchActivities();
      });
    }
  };

  const processGCashPayment = async () => {
    if (!gcashPhone || gcashPhone.length < 10) {
      alert("Please enter a valid GCash number (10 digits)");
      return;
    }

    setPaymentProcessing(true);

    try {
      const response = await fetch(`${API_URL}/payments/gcash/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          phoneNumber: gcashPhone,
          amount: selectedBooking.totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `✅ Payment Successful!\n\nReference: ${data.referenceNumber}\nTransaction ID: ${data.transactionId}`,
        );
        setShowGCashModal(false);
        setGcashPhone("");
        setSelectedBooking(null);
        fetchBookings();
        fetchPayments();
        fetchActivities();
      } else {
        alert("❌ Payment failed: " + data.error);
      }
    } catch (err) {
      alert("❌ Error processing payment: " + err.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const openGCashPayment = (booking) => {
    setSelectedBooking(booking);
    setGcashPhone("");
    setShowGCashModal(true);
  };

  const exportToPDF = (data, title, columns) => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      const tableData = data.map((item) =>
        columns.map((col) => item[col.key] || ""),
      );
      const tableHeaders = columns.map((col) => col.label);

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 40,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [255, 215, 0], textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      doc.save(`${title.replace(/\s/g, "_")}_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Error generating PDF: " + error.message);
    }
  };
  const exportToExcel = (data, title, columns) => {
    const worksheetData = [
      columns.map((col) => col.label),
      ...data.map((item) => columns.map((col) => item[col.key] || "")),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    worksheet["!cols"] = columns.map(() => ({ wch: 20 }));

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, `${title.replace(/\s/g, "_")}_${Date.now()}.xlsx`);
  };

  const exportBookings = (format) => {
    const columns = [
      { key: "bookingNumber", label: "Booking ID" },
      { key: "customerName", label: "Customer" },
      { key: "tourId", label: "Tour ID" },
      { key: "travelDate", label: "Travel Date" },
      { key: "guests", label: "Guests" },
      { key: "totalAmount", label: "Total Amount" },
      { key: "status", label: "Status" },
      { key: "paymentStatus", label: "Payment" },
    ];

    const data = bookings.map((b) => ({
      ...b,
      totalAmount: `₱${Number(b.totalAmount).toLocaleString()}`,
    }));

    if (format === "PDF") {
      exportToPDF(data, "Bookings_Report", columns);
    } else {
      exportToExcel(data, "Bookings_Report", columns);
    }
  };

  const exportPayments = (format) => {
    const columns = [
      { key: "paymentNumber", label: "Transaction ID" },
      { key: "bookingId", label: "Booking ID" },
      { key: "amount", label: "Amount" },
      { key: "paymentMethod", label: "Method" },
      { key: "paymentDate", label: "Date" },
      { key: "status", label: "Status" },
    ];

    const data = payments.map((p) => ({
      ...p,
      amount: `₱${Number(p.amount).toLocaleString()}`,
      paymentDate: new Date(p.paymentDate).toLocaleDateString(),
    }));

    if (format === "PDF") {
      exportToPDF(data, "Payments_Report", columns);
    } else {
      exportToExcel(data, "Payments_Report", columns);
    }
  };

  const exportCustomers = (format) => {
    const columns = [
      { key: "id", label: "ID" },
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
    ];

    const data = customers.map((c) => ({
      ...c,
      status: c.status || "Active",
    }));

    if (format === "PDF") {
      exportToPDF(data, "Customers_Report", columns);
    } else {
      exportToExcel(data, "Customers_Report", columns);
    }
  };

  const exportTours = (format) => {
    const columns = [
      { key: "id", label: "ID" },
      { key: "name", label: "Tour Name" },
      { key: "location", label: "Location" },
      { key: "duration", label: "Duration" },
      { key: "price", label: "Price" },
      { key: "bookings", label: "Bookings" },
      { key: "rating", label: "Rating" },
    ];

    const data = tours.map((t) => ({
      ...t,
      price: `₱${Number(t.price).toLocaleString()}`,
    }));

    if (format === "PDF") {
      exportToPDF(data, "Tours_Report", columns);
    } else {
      exportToExcel(data, "Tours_Report", columns);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing settings:", e);
      }
    }
  }, []);

  // Custom Modal
  const { showAlert, showConfirm, showPrompt, ModalComponent } = useModal();

  // Homepage Component
  const Homepage = () => (
    <div className="homepage">
      <video autoPlay muted loop playsInline className="bg-video">
        <source src={oceanwave} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>

      <nav className="navbar">
        <div className="logo" onClick={() => setCurrentPage("home")}>
          <img src={authLogo} alt="Logo" className="logo-img" />
          <h1>
            Travel<span>&Go</span>
          </h1>
        </div>
        <div className="nav-links"></div>
        <div className="nav-buttons">
          {!isLoggedIn ? (
            <>
              <button
                className="btn-outline-light"
                onClick={() => setCurrentPage("login")}
              >
                <i className="fas fa-sign-in-alt"></i> Log in
              </button>
              <button
                className="btn-primary-light"
                onClick={() => setCurrentPage("signup")}
              >
                <i className="fas fa-user-plus"></i> Sign up for free
              </button>
            </>
          ) : (
            <div className="user-info-nav">
              <span className="user-name-nav">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="user-avatar-nav">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="avatar"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <button
                className="btn-outline-light"
                onClick={() => setCurrentPage("dashboard")}
              >
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </button>
              <button className="btn-outline-light" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h2>LET US</h2>
          <h1>
            Take You To Your
            <br />
            <span className="highlight">DREAM DESTINATION</span>
          </h1>
          <p>
            Book flights, hotels, and travel packages to anywhere on the
            globe—all in one place, at the best prices.
          </p>
          <FlightSearch />
        </div>
        <div className="hero-images-grid">
          <div className="hero-img-card">
            <img src={hero1} alt="Destination 1" className="hero-img" />
          </div>
          <div className="hero-img-card">
            <img src={hero2} alt="Destination 2" className="hero-img" />
          </div>
          <div className="hero-img-card">
            <img src={hero3} alt="Destination 3" className="hero-img" />
          </div>
          <div className="hero-img-card">
            <img src={hero4} alt="Destination 4" className="hero-img" />
          </div>
        </div>
      </div>

      <div className="features" id="features">
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-plane"></i>
            <h3>Best Flight Deals</h3>
            <p>Find the cheapest flights</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-hotel"></i>
            <h3>Luxury Hotels</h3>
            <p>Book from thousands worldwide</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-passport"></i>
            <h3>Travel Packages</h3>
            <p>All-in-one hassle-free travel</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-headset"></i>
            <h3>24/7 Support</h3>
            <p>We're here to help anytime</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Tours Section Component with Full CRUD (for Admin)
  const ToursSection = () => {
    const [showTourModal, setShowTourModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [tourList, setTourList] = useState(tours);
    const [loadingTours, setLoadingTours] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const refreshTours = () => {
      setLoadingTours(true);
      fetch(`${API_URL}/tours`)
        .then((res) => res.json())
        .then((data) => {
          setTourList(data);
          setTours(data);
          setLoadingTours(false);
        })
        .catch((err) => {
          console.error("Error refreshing tours:", err);
          setLoadingTours(false);
        });
    };

    const handleSaveTour = async (tourData) => {
      setLoadingTours(true);
      const url = editingTour
        ? `${API_URL}/tours/${editingTour.id}`
        : `${API_URL}/tours`;
      const method = editingTour ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...tourData,
            price: parseFloat(tourData.price),
            bookings: parseInt(tourData.bookings),
            rating: parseFloat(tourData.rating),
          }),
        });
        const data = await response.json();

        if (data.success) {
          alert(
            editingTour
              ? "Tour updated successfully!"
              : "Tour created successfully!",
          );
          setShowTourModal(false);
          setEditingTour(null);
          refreshTours();
          fetchActivities();
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        alert("Error saving tour: " + error.message);
      } finally {
        setLoadingTours(false);
      }
    };

    const handleDeleteTour = async (tourId) => {
      setLoadingTours(true);
      try {
        const response = await fetch(`${API_URL}/tours/${tourId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          alert("Tour deleted successfully!");
          setDeleteConfirm(null);
          refreshTours();
          fetchActivities();
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        alert("Error deleting tour: " + error.message);
      } finally {
        setLoadingTours(false);
      }
    };

    const handleEditTour = (tour) => {
      setEditingTour(tour);
      setShowTourModal(true);
    };

    const handleAddTour = () => {
      setEditingTour(null);
      setShowTourModal(true);
    };

    return (
      <div className="tours-section">
        <div className="tours-header">
          <h2 className="tours-title">
            <i className="fas fa-umbrella-beach"></i> Tour Management
          </h2>
          <p className="tours-subtitle">Add, edit, or remove travel packages</p>
        </div>

        <div
          className="reports-export-bar"
          style={{ marginBottom: "20px", justifyContent: "space-between" }}
        >
          <div>
            <button
              className="btn-export-pdf"
              onClick={() => exportTours("PDF")}
            >
              <i className="fas fa-file-pdf"></i> Export PDF
            </button>
            <button
              className="btn-export-excel"
              onClick={() => exportTours("Excel")}
            >
              <i className="fas fa-file-excel"></i> Export Excel
            </button>
          </div>
          <button
            onClick={handleAddTour}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#10b981",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-plus"></i> Add New Tour
          </button>
        </div>

        {loadingTours ? (
          <p>Loading tours...</p>
        ) : (
          <div className="tours-grid-new">
            {tourList.map((tour) => (
              <div key={tour.id} className="tour-card-new">
                <div className="tour-card-header">
                  <h3>{tour.name}</h3>
                  <span
                    className={`tour-status ${tour.status === "Active" ? "active" : "inactive"}`}
                  >
                    {tour.status || "Active"}
                  </span>
                </div>
                <p className="tour-location-new">
                  {tour.location} - {tour.duration}
                </p>
                <p
                  className="tour-description"
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    margin: "10px 0",
                  }}
                >
                  {tour.description?.substring(0, 80)}...
                </p>
                <div className="tour-stats">
                  <div className="tour-stat">
                    <span className="tour-stat-label">Bookings</span>
                    <span className="tour-stat-value">
                      {tour.bookings || 0}
                    </span>
                  </div>
                  <div className="tour-stat">
                    <span className="tour-stat-label">Rating</span>
                    <span className="tour-stat-value">
                      ⭐ {tour.rating || 4.5}
                    </span>
                  </div>
                  <div className="tour-stat">
                    <span className="tour-stat-label">Price</span>
                    <span className="tour-stat-value">
                      ₱{Number(tour.price).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                >
                  <button
                    className="tour-edit-btn"
                    onClick={() => handleEditTour(tour)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#3b82f6",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="tour-delete-btn"
                    onClick={() => setDeleteConfirm(tour)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteConfirm && (
          <div
            className="modal-overlay"
            style={{
              display: "flex",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1001,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                width: "400px",
                textAlign: "center",
              }}
            >
              <div
                className="modal-header"
                style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}
              >
                <h3>Confirm Delete</h3>
              </div>
              <div style={{ padding: "20px" }}>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{deleteConfirm.name}</strong>?
                </p>
                <p style={{ color: "#ef4444", fontSize: "14px" }}>
                  This action cannot be undone.
                </p>
              </div>
              <div
                className="modal-buttons"
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "20px",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTour(deleteConfirm.id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete Tour
                </button>
              </div>
            </div>
          </div>
        )}

        <TourManagementModal
          isOpen={showTourModal}
          tour={editingTour}
          onSave={handleSaveTour}
          onClose={() => {
            setShowTourModal(false);
            setEditingTour(null);
          }}
        />
      </div>
    );
  };

  // Settings Page Component (for Admin)
  const SettingsPage = () => (
    <div className="settings-page">
      <div className="settings-header">
        <h2>
          <i className="fas fa-sliders-h"></i> System Settings
        </h2>
        <p>Configure your application preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>
            <i className="fas fa-building"></i> General Settings
          </h3>
          <div className="settings-form">
            <div className="setting-group">
              <label>Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) =>
                  handleSettingChange("companyName", e.target.value)
                }
              />
            </div>
            <div className="setting-group">
              <label>Company Email</label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) =>
                  handleSettingChange("companyEmail", e.target.value)
                }
              />
            </div>
            <div className="setting-group">
              <label>Company Phone</label>
              <input
                type="text"
                value={settings.companyPhone}
                onChange={(e) =>
                  handleSettingChange("companyPhone", e.target.value)
                }
              />
            </div>
            <div className="setting-group">
              <label>Company Address</label>
              <textarea
                value={settings.companyAddress}
                onChange={(e) =>
                  handleSettingChange("companyAddress", e.target.value)
                }
                rows="2"
              ></textarea>
            </div>
            <div className="setting-group">
              <label>Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) =>
                  handleSettingChange("timezone", e.target.value)
                }
              >
                <option>Asia/Manila</option>
                <option>Asia/Tokyo</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                  handleSettingChange("dateFormat", e.target.value)
                }
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Currency</label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  handleSettingChange("currency", e.target.value)
                }
              >
                <option>PHP</option>
                <option>USD</option>
                <option>EUR</option>
                <option>JPY</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>
            <i className="fas fa-bell"></i> Notification Settings
          </h3>
          <div className="settings-form">
            <div className="setting-toggle">
              <label>Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleSettingChange("emailNotifications", e.target.checked)
                }
              />
            </div>
            <div className="setting-toggle">
              <label>SMS Notifications</label>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  handleSettingChange("smsNotifications", e.target.checked)
                }
              />
            </div>
            <div className="setting-toggle">
              <label>Low Stock Alerts</label>
              <input
                type="checkbox"
                checked={settings.lowStockAlert}
                onChange={(e) =>
                  handleSettingChange("lowStockAlert", e.target.checked)
                }
              />
            </div>
            <div className="setting-toggle">
              <label>Booking Reminders</label>
              <input
                type="checkbox"
                checked={settings.bookingReminder}
                onChange={(e) =>
                  handleSettingChange("bookingReminder", e.target.checked)
                }
              />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>
            <i className="fas fa-shield-alt"></i> Security Settings
          </h3>
          <div className="settings-form">
            <div className="setting-toggle">
              <label>Two-Factor Authentication</label>
              <input type="checkbox" />
            </div>
            <div className="setting-toggle">
              <label>Maintenance Mode</label>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  handleSettingChange("maintenanceMode", e.target.checked)
                }
              />
            </div>
            <div className="setting-group">
              <label>Session Timeout (minutes)</label>
              <input type="number" defaultValue="30" />
            </div>
            <div className="setting-group">
              <label>Password Expiry (days)</label>
              <input type="number" defaultValue="90" />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>
            <i className="fas fa-database"></i> Backup & Restore
          </h3>
          <div className="settings-form">
            <button
              className="btn-backup"
              onClick={() => alert("Backup feature coming soon!")}
            >
              <i className="fas fa-download"></i> Export Data Backup
            </button>
            <button
              className="btn-restore"
              onClick={() => alert("Restore feature coming soon!")}
            >
              <i className="fas fa-upload"></i> Restore from Backup
            </button>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-save-settings" onClick={saveSettings}>
          <i className="fas fa-save"></i> Save All Settings
        </button>
        <button
          className="btn-reset-settings"
          onClick={() => {
            if (window.confirm("Reset all settings to default?")) {
              setSettings({
                companyName: "Travel&Go",
                companyEmail: "info@travelandgo.com",
                companyPhone: "+63 2 8888 0000",
                companyAddress: "Makati City, Philippines",
                timezone: "Asia/Manila",
                dateFormat: "MM/DD/YYYY",
                currency: "PHP",
                emailNotifications: true,
                smsNotifications: false,
                lowStockAlert: true,
                bookingReminder: true,
                maintenanceMode: false,
              });
              alert("Settings reset to default!");
            }
          }}
        >
          <i className="fas fa-undo-alt"></i> Reset to Default
        </button>
      </div>
    </div>
  );

  // Users Section Component (for Admin)
  const UsersSection = () => {
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editUserData, setEditUserData] = useState({});
    const [passwordUserData, setPasswordUserData] = useState({});
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const filteredUsers = customers.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    const openEditUserModal = (user) => {
      setEditUserData({ ...user });
      setShowEditUserModal(true);
    };

    const handleSaveUserEdit = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/users/${editUserData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editUserData),
          },
        );
        const data = await response.json();
        if (data.success) {
          await showAlert("Success", "✅ User updated successfully!");
          setShowEditUserModal(false);
          fetchCustomers();
        } else {
          await showAlert("Error", data.error || "Failed to update user");
        }
      } catch (err) {
        await showAlert("Error", "Error updating user: " + err.message);
      }
    };

    const openChangePasswordModal = (user) => {
      setPasswordUserData(user);
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(true);
    };

    const handleChangePassword = async () => {
      if (newPassword.length < 6) {
        await showAlert("Error", "Password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        await showAlert("Error", "Passwords do not match");
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/auth/users/${passwordUserData.id}/password`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
          },
        );
        const data = await response.json();
        if (data.success) {
          await showAlert("Success", "✅ Password changed successfully!");
          setShowPasswordModal(false);
        } else {
          await showAlert("Error", data.error || "Failed to change password");
        }
      } catch (err) {
        await showAlert("Error", "Error changing password: " + err.message);
      }
    };

    const handleDeleteUser = async (userId) => {
      const confirmed = await showConfirm(
        "Confirm Delete",
        "⚠️ Are you sure you want to delete this user? This action cannot be undone.",
      );
      if (confirmed) {
        try {
          const response = await fetch(`${API_URL}/auth/users/${userId}`, {
            method: "DELETE",
          });
          const data = await response.json();
          if (data.success) {
            await showAlert("Success", "✅ User deleted successfully!");
            fetchCustomers();
          } else {
            await showAlert("Error", data.error || "Failed to delete user");
          }
        } catch (err) {
          await showAlert("Error", "Error deleting user: " + err.message);
        }
      }
    };

    const handleProfileImageUpload = (e, isEdit) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isEdit) {
            setEditUserData({ ...editUserData, profileImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="admin-users-v2">
        <div className="users-header-v2">
          <h2 className="users-title-v2">
            <i className="fas fa-user-cog"></i> System Users
          </h2>
          <p className="users-subtitle-v2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="users-toolbar-v2">
          <div className="search-input-v2">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group-v2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
        <div className="users-table-wrapper-v2">
          <div className="users-table-container-v2">
            <table className="users-table-v2">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-info-cell">
                      <div className="user-avatar-list">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.firstName} />
                        ) : (
                          <div
                            className="avatar-placeholder"
                            style={{
                              background:
                                user.role === "admin" ? "#ffd700" : "#cbd5e1",
                            }}
                          >
                            {user.firstName?.charAt(0)}
                            {user.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="user-details-list">
                        <span className="user-name-list">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="user-id-list">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={`user-role-badge ${user.role}`}>
                        <i
                          className={`fas ${user.role === "admin" ? "fa-shield-alt" : "fa-user"}`}
                        ></i>
                        {user.role || "client"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`user-status-badge ${user.status?.toLowerCase() === "inactive" ? "inactive" : "active"}`}
                      >
                        <i
                          className={`fas ${user.status?.toLowerCase() === "inactive" ? "fa-circle-pause" : "fa-circle-check"}`}
                        ></i>
                        {user.status || "Active"}
                      </span>
                    </td>
                    <td>
                      {new Date(
                        user.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </td>
                    <td className="user-actions-cell">
                      <button
                        className="user-action-btn edit"
                        onClick={() => openEditUserModal(user)}
                        title="Edit User"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="user-action-btn password"
                        onClick={() => openChangePasswordModal(user)}
                        title="Change Password"
                      >
                        <i className="fas fa-key"></i>
                      </button>
                      <button
                        className="user-action-btn delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="empty-state-v2">
                <i className="fas fa-users-slash"></i>
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        {showEditUserModal && (
          <div
            className="modal-overlay-v2"
            onClick={() => setShowEditUserModal(false)}
          >
            <div
              className="modal-content-v2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-v2">
                <h3>
                  <i className="fas fa-user-edit"></i> Edit User
                </h3>
                <button
                  className="modal-close-v2"
                  onClick={() => setShowEditUserModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body-v2">
                <div className="profile-upload-section">
                  <div
                    className="profile-preview-large"
                    onClick={() =>
                      document.getElementById("editProfileImageInput").click()
                    }
                  >
                    {editUserData.profileImage ? (
                      <img src={editUserData.profileImage} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder-large">
                        <i className="fas fa-camera"></i>
                        <span>Click to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="editProfileImageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleProfileImageUpload(e, true)}
                  />
                  <button
                    className="btn-upload-photo"
                    onClick={() =>
                      document.getElementById("editProfileImageInput").click()
                    }
                  >
                    <i className="fas fa-upload"></i> Change Photo
                  </button>
                </div>
                <div className="form-row-v2">
                  <div className="form-group-v2">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={editUserData.firstName || ""}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group-v2">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={editUserData.lastName || ""}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group-v2">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editUserData.email || ""}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-row-v2">
                  <div className="form-group-v2">
                    <label>Role</label>
                    <select
                      value={editUserData.role || "client"}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          role: e.target.value,
                        })
                      }
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group-v2">
                    <label>Status</label>
                    <select
                      value={editUserData.status || "Active"}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer-v2">
                <button
                  className="btn-cancel-v2"
                  onClick={() => setShowEditUserModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-save-v2" onClick={handleSaveUserEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div
            className="modal-overlay-v2"
            onClick={() => setShowPasswordModal(false)}
          >
            <div
              className="modal-content-v2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-v2">
                <h3>
                  <i className="fas fa-key"></i> Change Password
                </h3>
                <button
                  className="modal-close-v2"
                  onClick={() => setShowPasswordModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body-v2">
                <div className="user-info-compact">
                  <strong>
                    {passwordUserData?.firstName} {passwordUserData?.lastName}
                  </strong>
                  <span>{passwordUserData?.email}</span>
                </div>
                <div className="form-group-v2">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <small>Minimum 6 characters</small>
                </div>
                <div className="form-group-v2">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="modal-footer-v2">
                <button
                  className="btn-cancel-v2"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-save-v2" onClick={handleChangePassword}>
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    // Search functionality
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState({
      bookings: [],
      customers: [],
      tours: [],
      payments: [],
    });
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const getTourNameForSearch = (tourId) => {
      const tour = tours.find((t) => t.id === tourId);
      return tour ? tour.name : `Tour #${tourId}`;
    };

    const handleSearch = () => {
      if (!searchTerm.trim()) {
        setShowSearchResults(false);
        setSearchPerformed(false);
        return;
      }

      const term = searchTerm.toLowerCase();

      const filteredBookings = bookings.filter(
        (booking) =>
          booking.bookingNumber?.toLowerCase().includes(term) ||
          booking.customerName?.toLowerCase().includes(term) ||
          booking.customerEmail?.toLowerCase().includes(term) ||
          getTourNameForSearch(booking.tourId)?.toLowerCase().includes(term) ||
          booking.status?.toLowerCase().includes(term) ||
          booking.paymentStatus?.toLowerCase().includes(term),
      );

      const filteredCustomers = customers.filter(
        (customer) =>
          customer.firstName?.toLowerCase().includes(term) ||
          customer.lastName?.toLowerCase().includes(term) ||
          customer.email?.toLowerCase().includes(term) ||
          customer.role?.toLowerCase().includes(term) ||
          (customer.firstName + " " + customer.lastName)
            .toLowerCase()
            .includes(term),
      );

      const filteredTours = tours.filter(
        (tour) =>
          tour.name?.toLowerCase().includes(term) ||
          tour.location?.toLowerCase().includes(term) ||
          tour.duration?.toLowerCase().includes(term) ||
          tour.description?.toLowerCase().includes(term),
      );

      const filteredPayments = payments.filter(
        (payment) =>
          payment.paymentNumber?.toLowerCase().includes(term) ||
          payment.bookingId?.toString().includes(term) ||
          payment.paymentMethod?.toLowerCase().includes(term) ||
          payment.status?.toLowerCase().includes(term),
      );

      setSearchResults({
        bookings: filteredBookings,
        customers: filteredCustomers,
        tours: filteredTours,
        payments: filteredPayments,
      });
      setShowSearchResults(true);
      setSearchPerformed(true);
    };

    const clearSearch = () => {
      setSearchTerm("");
      setShowSearchResults(false);
      setSearchPerformed(false);
      setShowMobileSearch(false);
    };

    const totalResults =
      searchResults.bookings.length +
      searchResults.customers.length +
      searchResults.tours.length +
      searchResults.payments.length;

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications from backend
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/activities/recent`);
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    useEffect(() => {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }, []);

    // Compute monthly revenue from actual payments
    const getMonthlyRevenueData = () => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentYear = new Date().getFullYear();

      // Initialize monthly revenue with zeros
      const monthlyData = months.map((month) => ({ month, amount: 0 }));

      // Sum payments by month
      payments.forEach((payment) => {
        if (payment.paymentDate && payment.status === "completed") {
          const paymentDate = new Date(payment.paymentDate);
          if (paymentDate.getFullYear() === currentYear) {
            const monthIndex = paymentDate.getMonth();
            monthlyData[monthIndex].amount += Number(payment.amount);
          }
        }
      });

      // Convert to millions and filter only months with data or last 6 months
      const last6Months = monthlyData.slice(-6);
      const maxAmount = Math.max(...last6Months.map((m) => m.amount), 1000);

      return { data: last6Months, maxAmount: maxAmount / 1000000 };
    };

    const { data: monthlyRevenueData, maxAmount: graphMaxAmount } =
      getMonthlyRevenueData();

    const maxAmount = Math.max(...monthlyRevenue.map((m) => m.amount));

    // Search Result Component
    const SearchResultsPanel = () => {
      if (!showSearchResults) return null;

      return (
        <div className="admin-search-results-overlay">
          <div className="admin-search-results-panel">
            <div className="search-results-header">
              <div className="search-results-title">
                <i className="fas fa-search"></i>
                <h3>Search Results</h3>
                <span className="results-badge">{totalResults} found</span>
              </div>
              <button className="close-results-btn" onClick={clearSearch}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="search-results-content">
              {searchTerm && (
                <div className="search-query-info">
                  Searching for: <strong>"{searchTerm}"</strong>
                </div>
              )}

              {/* Bookings Results */}
              {searchResults.bookings.length > 0 && (
                <div className="search-result-category">
                  <div className="category-header">
                    <i className="fas fa-calendar-check"></i>
                    <h4>Bookings ({searchResults.bookings.length})</h4>
                    <button
                      className="view-all-category"
                      onClick={() => {
                        setAdminSection("bookings");
                        clearSearch();
                      }}
                    >
                      View All Bookings →
                    </button>
                  </div>
                  <div className="category-results">
                    {searchResults.bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="result-item-clickable"
                        onClick={() => {
                          setAdminSection("bookings");
                          clearSearch();
                        }}
                      >
                        <div className="result-icon">
                          <i className="fas fa-ticket-alt"></i>
                        </div>
                        <div className="result-info">
                          <div className="result-title">
                            {booking.bookingNumber}
                          </div>
                          <div className="result-detail">
                            {booking.customerName} -{" "}
                            {getTourNameForSearch(booking.tourId)}
                          </div>
                          <div className="result-meta">
                            <span
                              className={`status-badge-small ${booking.status}`}
                            >
                              {booking.status}
                            </span>
                            <span>
                              ₱{Number(booking.totalAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.bookings.length > 5 && (
                      <div className="more-results">
                        +{searchResults.bookings.length - 5} more bookings
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Customers Results */}
              {searchResults.customers.length > 0 && (
                <div className="search-result-category">
                  <div className="category-header">
                    <i className="fas fa-users"></i>
                    <h4>Customers ({searchResults.customers.length})</h4>
                    <button
                      className="view-all-category"
                      onClick={() => {
                        setAdminSection("customers");
                        clearSearch();
                      }}
                    >
                      View All Customers →
                    </button>
                  </div>
                  <div className="category-results">
                    {searchResults.customers.slice(0, 5).map((customer) => (
                      <div
                        key={customer.id}
                        className="result-item-clickable"
                        onClick={() => {
                          setAdminSection("customers");
                          clearSearch();
                        }}
                      >
                        <div className="result-icon">
                          {customer.profileImage ? (
                            <img src={customer.profileImage} alt="" />
                          ) : (
                            <i className="fas fa-user-circle"></i>
                          )}
                        </div>
                        <div className="result-info">
                          <div className="result-title">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="result-detail">{customer.email}</div>
                          <div className="result-meta">
                            <span
                              className={`role-badge-small ${customer.role}`}
                            >
                              {customer.role || "client"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.customers.length > 5 && (
                      <div className="more-results">
                        +{searchResults.customers.length - 5} more customers
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tours Results */}
              {searchResults.tours.length > 0 && (
                <div className="search-result-category">
                  <div className="category-header">
                    <i className="fas fa-umbrella-beach"></i>
                    <h4>Tours ({searchResults.tours.length})</h4>
                    <button
                      className="view-all-category"
                      onClick={() => {
                        setAdminSection("tours");
                        clearSearch();
                      }}
                    >
                      View All Tours →
                    </button>
                  </div>
                  <div className="category-results">
                    {searchResults.tours.slice(0, 5).map((tour) => (
                      <div
                        key={tour.id}
                        className="result-item-clickable"
                        onClick={() => {
                          setAdminSection("tours");
                          clearSearch();
                        }}
                      >
                        <div className="result-icon">
                          <i className="fas fa-map-marked-alt"></i>
                        </div>
                        <div className="result-info">
                          <div className="result-title">{tour.name}</div>
                          <div className="result-detail">
                            {tour.location} - {tour.duration}
                          </div>
                          <div className="result-meta">
                            <span>⭐ {tour.rating || 4.5}</span>
                            <span>₱{Number(tour.price).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.tours.length > 5 && (
                      <div className="more-results">
                        +{searchResults.tours.length - 5} more tours
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payments Results */}
              {searchResults.payments.length > 0 && (
                <div className="search-result-category">
                  <div className="category-header">
                    <i className="fas fa-credit-card"></i>
                    <h4>Payments ({searchResults.payments.length})</h4>
                    <button
                      className="view-all-category"
                      onClick={() => {
                        setAdminSection("payments");
                        clearSearch();
                      }}
                    >
                      View All Payments →
                    </button>
                  </div>
                  <div className="category-results">
                    {searchResults.payments.slice(0, 5).map((payment) => (
                      <div
                        key={payment.id}
                        className="result-item-clickable"
                        onClick={() => {
                          setAdminSection("payments");
                          clearSearch();
                        }}
                      >
                        <div className="result-icon">
                          <i className="fab fa-gcash"></i>
                        </div>
                        <div className="result-info">
                          <div className="result-title">
                            {payment.paymentNumber}
                          </div>
                          <div className="result-detail">
                            Booking #{payment.bookingId}
                          </div>
                          <div className="result-meta">
                            <span
                              className={`payment-status-small ${payment.status}`}
                            >
                              {payment.status}
                            </span>
                            <span>
                              ₱{Number(payment.amount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.payments.length > 5 && (
                      <div className="more-results">
                        +{searchResults.payments.length - 5} more payments
                      </div>
                    )}
                  </div>
                </div>
              )}

              {totalResults === 0 && searchPerformed && (
                <div className="no-results-found">
                  <i className="fas fa-search"></i>
                  <p>No results found for "{searchTerm}"</p>
                  <span>
                    Try searching by name, email, booking ID, tour name, or
                    payment reference
                  </span>
                </div>
              )}
            </div>
            {totalResults > 0 && (
              <div className="search-results-footer">
                <button className="clear-search-btn" onClick={clearSearch}>
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <img src={authLogo} alt="Logo" className="admin-logo" />
            <h2>
              Travel<span>&Go</span>
            </h2>
          </div>

          <div className="admin-user-card-top">
            <div className="admin-user-info-top">
              <div className="admin-user-avatar-top">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <i className="fas fa-user-circle"></i>
                )}
              </div>
              <div className="admin-user-details-top">
                <h4>
                  {user?.firstName} {user?.lastName}
                </h4>
                <p>{user?.email}</p>
                <span className="admin-user-role-top">Administrator</span>
              </div>
            </div>
          </div>

          <div className="admin-sidebar-nav">
            <div className="admin-nav-section">MAIN</div>
            <div
              className={`admin-nav-item ${adminSection === "dashboard" ? "active" : ""}`}
              onClick={() => setAdminSection("dashboard")}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </div>

            <div className="admin-nav-section">TRAVEL</div>
            <div
              className={`admin-nav-item ${adminSection === "tours" ? "active" : ""}`}
              onClick={() => setAdminSection("tours")}
            >
              <i className="fas fa-umbrella-beach"></i>
              <span>Tour Management</span>
            </div>
            <div
              className={`admin-nav-item ${adminSection === "bookings" ? "active" : ""}`}
              onClick={() => setAdminSection("bookings")}
            >
              <i className="fas fa-calendar-check"></i>
              <span>Bookings</span>
            </div>
            <div
              className={`admin-nav-item ${adminSection === "itinerary" ? "active" : ""}`}
              onClick={() => setAdminSection("itinerary")}
            >
              <i className="fas fa-map-marked-alt"></i>
              <span>Itinerary</span>
            </div>

            <div className="admin-nav-section">MANAGEMENT</div>
            <div
              className={`admin-nav-item ${adminSection === "customers" ? "active" : ""}`}
              onClick={() => setAdminSection("customers")}
            >
              <i className="fas fa-users"></i>
              <span>Customers</span>
            </div>
            <div
              className={`admin-nav-item ${adminSection === "payments" ? "active" : ""}`}
              onClick={() => setAdminSection("payments")}
            >
              <i className="fas fa-credit-card"></i>
              <span>Payments</span>
            </div>
            <div
              className={`admin-nav-item ${adminSection === "reports" ? "active" : ""}`}
              onClick={() => setAdminSection("reports")}
            >
              <i className="fas fa-chart-line"></i>
              <span>Reports</span>
            </div>

            <div className="admin-nav-section">SYSTEM</div>
            <div
              className={`admin-nav-item ${adminSection === "users" ? "active" : ""}`}
              onClick={() => setAdminSection("users")}
            >
              <i className="fas fa-user-cog"></i>
              <span>Users</span>
            </div>
            <div
              className={`admin-nav-item ${adminSection === "settings" ? "active" : ""}`}
              onClick={() => setAdminSection("settings")}
            >
              <i className="fas fa-sliders-h"></i>
              <span>Settings</span>
            </div>
          </div>

          <div className="admin-sidebar-footer">
            <button onClick={handleLogout} className="admin-logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="admin-main">
          <div className="admin-topbar">
            <div className="admin-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search bookings, customers, tours, payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button className="search-btn" onClick={handleSearch}>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div
              className="admin-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <i className="fas fa-bell"></i>
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <div className="notifications-header-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <h4>Notifications</h4>
                    <button
                      className="notifications-close"
                      onClick={() => setShowNotifications(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="notifications-list">
                    {bookings.length > 0 ? (
                      bookings.slice(0, 5).map((booking, idx) => (
                        <div
                          key={idx}
                          className="notification-item"
                          onClick={() => {
                            setAdminSection("bookings");
                            setShowNotifications(false);
                          }}
                        >
                          <div className="notification-icon new">
                            <i className="fas fa-calendar-check"></i>
                          </div>
                          <div className="notification-content">
                            <p className="notification-title">
                              <strong>New Booking!</strong>
                            </p>
                            <p className="notification-message">
                              {booking.customerName} booked{" "}
                              {getTourName(booking.tourId)}
                            </p>
                            <span className="notification-time">
                              <i className="fas fa-clock"></i>{" "}
                              {booking.travelDate}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <div className="no-notifications-icon">
                          <i className="fas fa-bell-slash"></i>
                        </div>
                        <p>No notifications yet</p>
                        <span>New bookings will appear here</span>
                      </div>
                    )}
                  </div>
                  {bookings.length > 0 && (
                    <div className="notifications-footer">
                      <button
                        onClick={() => {
                          setAdminSection("bookings");
                          setShowNotifications(false);
                        }}
                      >
                        View All Bookings →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search Results Panel */}
          <SearchResultsPanel />

          {adminSection === "dashboard" && (
            <div className="admin-dashboard-content">
              <div className="admin-welcome">
                <h2>
                  Welcome back, <span>{user?.firstName || "ADMIN"}</span>! 👋
                </h2>
                <p>
                  You are logged in as <strong>Administrator</strong>. Here's
                  what's happening with your travel business today.
                </p>
              </div>

              <div className="admin-stats">
                <div className="admin-stat-card">
                  <div>
                    <h3>TOTAL BOOKINGS</h3>
                    <div className="stat-number">{bookings.length}</div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i> Total
                    </div>
                  </div>
                  <div className="stat-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div>
                    <h3>TOTAL REVENUE</h3>
                    <div className="stat-number">
                      ₱
                      {payments
                        .reduce((sum, p) => sum + Number(p.amount), 0)
                        .toLocaleString()}
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i> Total
                    </div>
                  </div>
                  <div className="stat-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div>
                    <h3>ACTIVE TOURS</h3>
                    <div className="stat-number">{tours.length}</div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i> Total
                    </div>
                  </div>
                  <div className="stat-icon">
                    <i className="fas fa-umbrella-beach"></i>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div>
                    <h3>CUSTOMERS</h3>
                    <div className="stat-number">{customers.length}</div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i> Total
                    </div>
                  </div>
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
              </div>

              <div className="admin-dashboard-row">
                <div className="admin-graph-card">
                  <div className="graph-header">
                    <h3>
                      <i className="fas fa-chart-line"></i> Monthly Revenue
                    </h3>
                    <span className="graph-total">
                      Total Revenue: ₱
                      {payments
                        .filter((p) => p.status === "completed")
                        .reduce((sum, p) => sum + Number(p.amount), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="graph-container">
                    {monthlyRevenueData.map((item, idx) => (
                      <div key={idx} className="graph-bar-wrapper">
                        <div className="graph-bar-label">{item.month}</div>
                        <div className="graph-bar">
                          <div
                            className="graph-bar-fill"
                            style={{
                              height: `${(item.amount / 1000000 / graphMaxAmount) * 100}%`,
                            }}
                          >
                            <span className="graph-bar-value">
                              ₱{(item.amount / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="graph-footer">
                    <span className="trend-up">
                      <i className="fas fa-arrow-up"></i>
                      {monthlyRevenueData.length >= 2 &&
                        `+${(((monthlyRevenueData[monthlyRevenueData.length - 1]?.amount - monthlyRevenueData[monthlyRevenueData.length - 2]?.amount) / (monthlyRevenueData[monthlyRevenueData.length - 2]?.amount || 1)) * 100).toFixed(1)}% Growth`}
                    </span>
                  </div>
                </div>

                <div className="admin-activity-card">
                  <h3>
                    <i className="fas fa-clock"></i> Recent Activities
                  </h3>
                  <div className="activity-list">
                    {bookings.length > 0 ? (
                      bookings.slice(0, 5).map((booking, idx) => (
                        <div key={idx} className="activity-item">
                          <div className="activity-icon">
                            <i className="fas fa-bookmark"></i>
                          </div>
                          <div className="activity-details">
                            <p>
                              <strong>{booking.customerName}</strong> booked{" "}
                              {getTourName(booking.tourId)}
                            </p>
                            <span>Booking ID: {booking.bookingNumber}</span>
                            <small>{booking.travelDate}</small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="activity-item">
                        <div className="activity-icon">
                          <i className="fas fa-info-circle"></i>
                        </div>
                        <div className="activity-details">
                          <p>No recent activities yet</p>
                          <span>
                            Activities will appear here when users interact with
                            the system
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-recent">
                <div className="admin-recent-header">
                  <h3>
                    <i className="fas fa-table"></i> Recent Bookings
                  </h3>
                  <button
                    onClick={() => setAdminSection("bookings")}
                    className="view-all-link"
                  >
                    View All →
                  </button>
                </div>
                <div className="admin-recent-table">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>CUSTOMER</th>
                        <th>TOUR</th>
                        <th>AMOUNT</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.customerName}</td>
                          <td>{getTourName(booking.tourId)}</td>
                          <td>
                            ₱{Number(booking.totalAmount).toLocaleString()}
                          </td>
                          <td>{booking.travelDate}</td>
                          <td>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            No bookings yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminSection === "tours" && <ToursSection />}
          {adminSection === "bookings" && (
            <div className="admin-bookings">
              <div className="bookings-header">
                <h2 className="bookings-title">
                  <i className="fas fa-calendar-check"></i> All Bookings
                </h2>
                <p className="bookings-subtitle">
                  Manage all tour bookings and reservations
                </p>
              </div>

              {/* Export Buttons */}
              <div className="reports-export-bar">
                <button
                  className="btn-export-pdf"
                  onClick={() => exportBookings("PDF")}
                >
                  <i className="fas fa-file-pdf"></i> Export PDF
                </button>
                <button
                  className="btn-export-excel"
                  onClick={() => exportBookings("Excel")}
                >
                  <i className="fas fa-file-excel"></i> Export Excel
                </button>
              </div>

              {/* Stats Cards - IMPROVED */}
              <div className="bookings-stats-grid">
                <div className="booking-stat-card-v2">
                  <div className="stat-icon-wrapper yellow">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Total Bookings</span>
                    <span className="stat-value">{bookings.length}</span>
                  </div>
                </div>
                <div className="booking-stat-card-v2">
                  <div className="stat-icon-wrapper green">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Confirmed</span>
                    <span className="stat-value">
                      {bookings.filter((b) => b.status === "confirmed").length}
                    </span>
                    <span className="stat-percent">
                      {bookings.length > 0
                        ? Math.round(
                            (bookings.filter((b) => b.status === "confirmed")
                              .length /
                              bookings.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="booking-stat-card-v2">
                  <div className="stat-icon-wrapper orange">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value">
                      {bookings.filter((b) => b.status === "pending").length}
                    </span>
                    <span className="stat-percent">
                      {bookings.length > 0
                        ? Math.round(
                            (bookings.filter((b) => b.status === "pending")
                              .length /
                              bookings.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
                <div className="booking-stat-card-v2">
                  <div className="stat-icon-wrapper red">
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Cancelled</span>
                    <span className="stat-value">
                      {bookings.filter((b) => b.status === "cancelled").length}
                    </span>
                    <span className="stat-percent">
                      {bookings.length > 0
                        ? Math.round(
                            (bookings.filter((b) => b.status === "cancelled")
                              .length /
                              bookings.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Bookings Table Container */}
              <div className="bookings-table-wrapper">
                <div className="bookings-toolbar">
                  <div className="search-filter-group">
                    <div className="search-input-v2">
                      <i className="fas fa-search"></i>
                      <input
                        type="text"
                        id="bookingSearchInput"
                        placeholder="Search by customer, booking ID or tour..."
                        onKeyUp={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const rows = document.querySelectorAll(
                            "#bookingsTableBody tr",
                          );
                          rows.forEach((row) => {
                            const text = row.innerText.toLowerCase();
                            row.style.display = text.includes(searchTerm)
                              ? ""
                              : "none";
                          });
                        }}
                      />
                    </div>
                    <div className="status-filter-group">
                      <button
                        className="filter-chip active"
                        data-filter="all"
                        onClick={(e) => {
                          document
                            .querySelectorAll(".filter-chip")
                            .forEach((btn) => btn.classList.remove("active"));
                          e.target.classList.add("active");
                          const rows = document.querySelectorAll(
                            "#bookingsTableBody tr",
                          );
                          rows.forEach((row) => {
                            row.style.display = "";
                          });
                        }}
                      >
                        All
                      </button>
                      <button
                        className="filter-chip"
                        data-filter="confirmed"
                        onClick={(e) => {
                          document
                            .querySelectorAll(".filter-chip")
                            .forEach((btn) => btn.classList.remove("active"));
                          e.target.classList.add("active");
                          const rows = document.querySelectorAll(
                            "#bookingsTableBody tr",
                          );
                          rows.forEach((row) => {
                            const status = row
                              .querySelector(".status-badge")
                              ?.innerText.toLowerCase();
                            row.style.display =
                              status === "confirmed" ? "" : "none";
                          });
                        }}
                      >
                        Confirmed
                      </button>
                      <button
                        className="filter-chip"
                        data-filter="pending"
                        onClick={(e) => {
                          document
                            .querySelectorAll(".filter-chip")
                            .forEach((btn) => btn.classList.remove("active"));
                          e.target.classList.add("active");
                          const rows = document.querySelectorAll(
                            "#bookingsTableBody tr",
                          );
                          rows.forEach((row) => {
                            const status = row
                              .querySelector(".status-badge")
                              ?.innerText.toLowerCase();
                            row.style.display =
                              status === "pending" ? "" : "none";
                          });
                        }}
                      >
                        Pending
                      </button>
                      <button
                        className="filter-chip"
                        data-filter="cancelled"
                        onClick={(e) => {
                          document
                            .querySelectorAll(".filter-chip")
                            .forEach((btn) => btn.classList.remove("active"));
                          e.target.classList.add("active");
                          const rows = document.querySelectorAll(
                            "#bookingsTableBody tr",
                          );
                          rows.forEach((row) => {
                            const status = row
                              .querySelector(".status-badge")
                              ?.innerText.toLowerCase();
                            row.style.display =
                              status === "cancelled" ? "" : "none";
                          });
                        }}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn-new-booking-v2"
                    onClick={() => setShowBookingModal(true)}
                  >
                    <i className="fas fa-plus"></i> New Booking
                  </button>
                </div>

                <div className="admin-table-container-v2">
                  <table className="admin-table-v2">
                    <thead>
                      <tr>
                        <th>BOOKING ID</th>
                        <th>CUSTOMER</th>
                        <th>TOUR</th>
                        <th>TRAVEL DATE</th>
                        <th>GUESTS</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>PAYMENT</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody id="bookingsTableBody">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="booking-id">
                            {booking.bookingNumber}
                          </td>
                          <td className="customer-name">
                            {booking.customerName}
                          </td>
                          <td>{getTourName(booking.tourId)}</td>
                          <td>{booking.travelDate}</td>
                          <td>{booking.guests}</td>
                          <td className="amount">
                            ₱{Number(booking.totalAmount).toLocaleString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge-v2 ${booking.status}`}
                            >
                              {booking.status === "confirmed" ? (
                                <i className="fas fa-check-circle"></i>
                              ) : booking.status === "pending" ? (
                                <i className="fas fa-hourglass-half"></i>
                              ) : (
                                <i className="fas fa-ban"></i>
                              )}
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`payment-badge ${booking.paymentStatus}`}
                            >
                              {booking.paymentStatus === "paid" ? (
                                <i className="fas fa-check"></i>
                              ) : (
                                <i className="fas fa-spinner"></i>
                              )}
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEditBooking(booking)}
                              title="Edit booking"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteBooking(booking.id)}
                              title="Delete booking"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                            {booking.paymentStatus !== "paid" && (
                              <button
                                className="action-btn gcash"
                                onClick={() => openGCashPayment(booking)}
                                title="Pay with GCash"
                              >
                                <i className="fab fa-gcash"></i> Pay
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && (
                    <div className="empty-state">
                      <i className="fas fa-calendar-times"></i>
                      <p>No bookings found</p>
                      <button
                        className="btn-new-booking-v2"
                        onClick={() => setShowBookingModal(true)}
                      >
                        + Create your first booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {adminSection === "itinerary" && (
            <div className="admin-itinerary">
              <div className="itinerary-header">
                <h2 className="itinerary-title">
                  <i className="fas fa-map-marked-alt"></i> Itinerary
                </h2>
                <p className="itinerary-subtitle">
                  Manage tour day-by-day schedules
                </p>
              </div>

              <div className="itinerary-sidebar-layout">
                <div className="itinerary-tour-list">
                  <div className="tour-search">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Search tours..." />
                  </div>
                  <div className="tour-items">
                    <div className="tour-item active">
                      <span className="tour-item-name">Tokyo Explorer</span>
                      <span className="tour-item-duration">– 5 days</span>
                    </div>
                    <div className="tour-item">
                      <span className="tour-item-name">Paris Romance</span>
                      <span className="tour-item-duration">– 7 days</span>
                    </div>
                    <div className="tour-item">
                      <span className="tour-item-name">Bali Retreat</span>
                      <span className="tour-item-duration">– 4 days</span>
                    </div>
                    <div className="tour-item">
                      <span className="tour-item-name">
                        New York City Break
                      </span>
                      <span className="tour-item-duration">– 6 days</span>
                    </div>
                    <div className="tour-item">
                      <span className="tour-item-name">
                        Cebu Island Hopping
                      </span>
                      <span className="tour-item-duration">– 3 days</span>
                    </div>
                    <div className="tour-item">
                      <span className="tour-item-name">Santorini Escape</span>
                      <span className="tour-item-duration">– 8 days</span>
                    </div>
                  </div>
                  <button className="add-new-tour-btn">+ Add New Tour</button>
                </div>

                <div className="itinerary-days-content">
                  <div className="itinerary-day-card">
                    <div className="day-header">
                      <div>
                        <h3>Arrival in Tokyo</h3>
                        <p className="day-date">
                          April 15, 2026 - Narita International Airport
                        </p>
                      </div>
                      <div>
                        <button className="day-edit-btn">Edit Day</button>
                        <button className="day-delete-btn">Delete</button>
                      </div>
                    </div>
                    <div className="activities-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>10:00</td>
                            <td>
                              Arrival at Narita Airport. Welcome by local guide.
                            </td>
                            <td>
                              <button className="activity-edit-btn">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>14:00</td>
                            <td>Light orientation tour around Shinjuku.</td>
                            <td>
                              <button className="activity-edit-btn">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>19:00</td>
                            <td>Welcome dinner. Traditional ramen dinner.</td>
                            <td>
                              <button className="activity-edit-btn">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="add-activity-btn">+ Add Activity</button>
                  </div>
                  <button className="add-new-day-btn">+ Add New Day</button>
                </div>
              </div>
            </div>
          )}

          {adminSection === "customers" && (
            <div className="admin-customers">
              <div className="customers-header">
                <h2 className="customers-title">
                  <i className="fas fa-users"></i> Customer List
                </h2>
                <p className="customers-subtitle">
                  Manage all registered customers
                </p>
              </div>

              <div className="reports-export-bar">
                <button
                  className="btn-export-pdf"
                  onClick={() => exportCustomers("PDF")}
                >
                  <i className="fas fa-file-pdf"></i> Export PDF
                </button>
                <button
                  className="btn-export-excel"
                  onClick={() => exportCustomers("Excel")}
                >
                  <i className="fas fa-file-excel"></i> Export Excel
                </button>
              </div>

              <div className="customers-search-bar">
                <div className="search-input-wrapper">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                  />
                </div>
                <div className="filter-dropdown">
                  <button className="filter-btn-custom">
                    All Status <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
                <button className="add-customer-btn">+ Add Customer</button>
              </div>

              <div className="customers-table-container">
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>ROLE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                          <strong>
                            {customer.firstName} {customer.lastName}
                          </strong>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.role}</td>
                        <td>
                          <span
                            className={`customer-status ${customer.status?.toLowerCase() || "active"}`}
                          >
                            {customer.status || "Active"}
                          </span>
                        </td>
                        <td>
                          <button className="customer-edit-btn">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="customer-delete-btn">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminSection === "payments" && (
            <div className="admin-payments-v2">
              <div className="payments-header-v2">
                <h2 className="payments-title-v2">
                  <i className="fas fa-credit-card"></i> Payment Transactions
                </h2>
                <p className="payments-subtitle-v2">
                  Track and manage all payment transactions from bookings
                </p>
              </div>

              {/* Export Buttons */}
              <div className="reports-export-bar-v2">
                <button
                  className="btn-export-pdf-v2"
                  onClick={() => exportPayments("PDF")}
                >
                  <i className="fas fa-file-pdf"></i> Export PDF
                </button>
                <button
                  className="btn-export-excel-v2"
                  onClick={() => exportPayments("Excel")}
                >
                  <i className="fas fa-file-excel"></i> Export Excel
                </button>
              </div>

              {/* Stats Cards */}
              <div className="payments-stats-grid-v2">
                <div className="payment-stat-card-v2">
                  <div className="stat-icon-wrapper-v2 purple">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="stat-content-v2">
                    <span className="stat-label-v2">TOTAL REVENUE</span>
                    <span className="stat-value-v2">
                      ₱
                      {payments
                        .reduce((sum, p) => sum + Number(p.amount), 0)
                        .toLocaleString()}
                    </span>
                    <span className="stat-trend-v2">
                      <i className="fas fa-arrow-up"></i> Overall
                    </span>
                  </div>
                </div>

                <div className="payment-stat-card-v2">
                  <div className="stat-icon-wrapper-v2 green">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content-v2">
                    <span className="stat-label-v2">COMPLETED</span>
                    <span className="stat-value-v2">
                      ₱
                      {payments
                        .filter((p) => p.status === "completed")
                        .reduce((sum, p) => sum + Number(p.amount), 0)
                        .toLocaleString()}
                    </span>
                    <span className="stat-trend-v2 success">
                      <i className="fas fa-check"></i> Paid
                    </span>
                  </div>
                </div>

                <div className="payment-stat-card-v2">
                  <div className="stat-icon-wrapper-v2 orange">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-content-v2">
                    <span className="stat-label-v2">PENDING</span>
                    <span className="stat-value-v2">
                      ₱
                      {payments
                        .filter((p) => p.status === "pending")
                        .reduce((sum, p) => sum + Number(p.amount), 0)
                        .toLocaleString()}
                    </span>
                    <span className="stat-trend-v2 warning">
                      <i className="fas fa-hourglass-half"></i> Awaiting
                    </span>
                  </div>
                </div>
              </div>

              {/* Payments Table */}
              <div className="payments-table-wrapper-v2">
                <div className="payments-toolbar-v2">
                  <div className="search-input-v2">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      id="paymentSearchInput"
                      placeholder="Search by transaction ID, booking ID or method..."
                      onKeyUp={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const rows = document.querySelectorAll(
                          "#paymentsTableBody tr",
                        );
                        rows.forEach((row) => {
                          const text = row.innerText.toLowerCase();
                          row.style.display = text.includes(searchTerm)
                            ? ""
                            : "none";
                        });
                      }}
                    />
                  </div>
                  <div className="status-filter-group-v2">
                    <button
                      className="filter-chip-v2 active"
                      data-filter="all"
                      onClick={(e) => {
                        document
                          .querySelectorAll(".filter-chip-v2")
                          .forEach((btn) => btn.classList.remove("active"));
                        e.target.classList.add("active");
                        const rows = document.querySelectorAll(
                          "#paymentsTableBody tr",
                        );
                        rows.forEach((row) => (row.style.display = ""));
                      }}
                    >
                      All
                    </button>
                    <button
                      className="filter-chip-v2"
                      data-filter="completed"
                      onClick={(e) => {
                        document
                          .querySelectorAll(".filter-chip-v2")
                          .forEach((btn) => btn.classList.remove("active"));
                        e.target.classList.add("active");
                        const rows = document.querySelectorAll(
                          "#paymentsTableBody tr",
                        );
                        rows.forEach((row) => {
                          const status = row
                            .querySelector(".payment-status-badge-v2")
                            ?.innerText.toLowerCase();
                          row.style.display =
                            status === "completed" ? "" : "none";
                        });
                      }}
                    >
                      Completed
                    </button>
                    <button
                      className="filter-chip-v2"
                      data-filter="pending"
                      onClick={(e) => {
                        document
                          .querySelectorAll(".filter-chip-v2")
                          .forEach((btn) => btn.classList.remove("active"));
                        e.target.classList.add("active");
                        const rows = document.querySelectorAll(
                          "#paymentsTableBody tr",
                        );
                        rows.forEach((row) => {
                          const status = row
                            .querySelector(".payment-status-badge-v2")
                            ?.innerText.toLowerCase();
                          row.style.display =
                            status === "pending" ? "" : "none";
                        });
                      }}
                    >
                      Pending
                    </button>
                  </div>
                </div>

                <div className="payments-table-container-v2">
                  <table className="payments-table-v2">
                    <thead>
                      <tr>
                        <th>TRANSACTION ID</th>
                        <th>BOOKING ID</th>
                        <th>AMOUNT</th>
                        <th>METHOD</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody id="paymentsTableBody">
                      {payments.length > 0 ? (
                        payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="transaction-id">
                              {payment.paymentNumber}
                            </td>
                            <td className="booking-ref">
                              #{payment.bookingId}
                            </td>
                            <td className="amount-cell">
                              ₱{Number(payment.amount).toLocaleString()}
                            </td>
                            <td>
                              <span className="method-badge-v2">
                                {payment.paymentMethod === "GCash" ? (
                                  <i className="fab fa-gcash"></i>
                                ) : (
                                  <i className="fas fa-credit-card"></i>
                                )}
                                {payment.paymentMethod || "GCash"}
                              </span>
                            </td>
                            <td>
                              {new Date(
                                payment.paymentDate,
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              <span
                                className={`payment-status-badge-v2 ${payment.status}`}
                              >
                                {payment.status === "completed" ? (
                                  <i className="fas fa-check-circle"></i>
                                ) : (
                                  <i className="fas fa-spinner"></i>
                                )}
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="empty-state-v2">
                            <div>
                              <i className="fas fa-receipt"></i>
                              <p>No payment transactions yet</p>
                              <small>
                                Payments will appear here when customers
                                complete bookings
                              </small>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminSection === "reports" && (
            <div className="admin-reports-v2">
              <div className="reports-header-v2">
                <h2 className="reports-title-v2">
                  <i className="fas fa-chart-line"></i> Analytics & Reports
                </h2>
                <p className="reports-subtitle-v2">
                  Generate and download detailed reports for your travel
                  business
                </p>
              </div>

              {/* Stats Overview Cards - Walang cents */}
              <div className="reports-stats-grid-v2">
                <div className="report-stat-card-v2">
                  <div className="stat-icon-wrapper-v2 blue">
                    <i className="fas fa-chart-simple"></i>
                  </div>
                  <div className="stat-content-v2">
                    <span className="stat-label-v2">TOTAL REVENUE</span>
                    <span className="stat-value-v2">
                      ₱
                      {(1284500 + 1456200 + 1543800).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="stat-trend-v2 up">
                      <i className="fas fa-arrow-up"></i> +12.5% from last
                      quarter
                    </span>
                  </div>
                </div>

                <div className="report-stat-card-v2">
                  <div className="stat-icon-wrapper-v2 green">
                    <i className="fas fa-calendar-week"></i>
                  </div>
                  <div className="stat-content-v2">
                    <span className="stat-label-v2">AVERAGE MONTHLY</span>
                    <span className="stat-value-v2">
                      ₱
                      {Math.round(
                        (1284500 + 1456200 + 1543800) / 3,
                      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="stat-trend-v2">
                      <i className="fas fa-chart-line"></i> Last 3 months
                    </span>
                  </div>
                </div>

                <div className="report-stat-card-v2">
                  <div className="stat-icon-wrapper-v2 orange">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="stat-content-v2">
                    <span className="stat-label-v2">REPORTS READY</span>
                    <span className="stat-value-v2">8</span>
                    <span className="stat-trend-v2">
                      <i className="fas fa-download"></i> Available for export
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Reports Grid */}
              <div className="reports-grid-v2">
                {/* Export Reports Section */}
                <div className="report-card-v2">
                  <div className="report-card-header-v2">
                    <div className="header-icon yellow">
                      <i className="fas fa-file-export"></i>
                    </div>
                    <div>
                      <h3>Export Reports</h3>
                      <p>Download data in PDF or Excel format</p>
                    </div>
                  </div>
                  <div className="report-buttons-group-v2">
                    <div className="button-group-title">
                      <i className="fas fa-calendar-check"></i> Bookings
                    </div>
                    <div className="button-row">
                      <button
                        className="btn-pdf-v2"
                        onClick={() => exportBookings("PDF")}
                      >
                        <i className="fas fa-file-pdf"></i> Booking PDF
                      </button>
                      <button
                        className="btn-excel-v2"
                        onClick={() => exportBookings("Excel")}
                      >
                        <i className="fas fa-file-excel"></i> Booking Excel
                      </button>
                    </div>

                    <div className="button-group-title">
                      <i className="fas fa-umbrella-beach"></i> Tours
                    </div>
                    <div className="button-row">
                      <button
                        className="btn-pdf-v2"
                        onClick={() => exportTours("PDF")}
                      >
                        <i className="fas fa-file-pdf"></i> Tours PDF
                      </button>
                      <button
                        className="btn-excel-v2"
                        onClick={() => exportTours("Excel")}
                      >
                        <i className="fas fa-file-excel"></i> Tours Excel
                      </button>
                    </div>

                    <div className="button-group-title">
                      <i className="fas fa-users"></i> Customers
                    </div>
                    <div className="button-row">
                      <button
                        className="btn-pdf-v2"
                        onClick={() => exportCustomers("PDF")}
                      >
                        <i className="fas fa-file-pdf"></i> Customers PDF
                      </button>
                      <button
                        className="btn-excel-v2"
                        onClick={() => exportCustomers("Excel")}
                      >
                        <i className="fas fa-file-excel"></i> Customers Excel
                      </button>
                    </div>

                    <div className="button-group-title">
                      <i className="fas fa-credit-card"></i> Payments
                    </div>
                    <div className="button-row">
                      <button
                        className="btn-pdf-v2"
                        onClick={() => exportPayments("PDF")}
                      >
                        <i className="fas fa-file-pdf"></i> Payments PDF
                      </button>
                      <button
                        className="btn-excel-v2"
                        onClick={() => exportPayments("Excel")}
                      >
                        <i className="fas fa-file-excel"></i> Payments Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Monthly Revenue Report - Walang cents */}
                <div className="report-card-v2 revenue-report">
                  <div className="report-card-header-v2">
                    <div className="header-icon purple">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div>
                      <h3>Monthly Revenue Report</h3>
                      <p>January - March 2026</p>
                    </div>
                  </div>

                  <div className="revenue-list-v2">
                    <div className="revenue-item-v2">
                      <div className="month-info">
                        <span className="month-name">January 2026</span>
                        <span className="month-trend up">
                          <i className="fas fa-arrow-up"></i> +8.2%
                        </span>
                      </div>
                      <div className="progress-bar-v2">
                        <div
                          className="progress-fill"
                          style={{ width: "83%" }}
                        ></div>
                      </div>
                      <div className="revenue-amount">₱1,284,500</div>
                    </div>

                    <div className="revenue-item-v2">
                      <div className="month-info">
                        <span className="month-name">February 2026</span>
                        <span className="month-trend up">
                          <i className="fas fa-arrow-up"></i> +13.4%
                        </span>
                      </div>
                      <div className="progress-bar-v2">
                        <div
                          className="progress-fill"
                          style={{ width: "94%" }}
                        ></div>
                      </div>
                      <div className="revenue-amount">₱1,456,200</div>
                    </div>

                    <div className="revenue-item-v2">
                      <div className="month-info">
                        <span className="month-name">March 2026</span>
                        <span className="month-trend up">
                          <i className="fas fa-arrow-up"></i> +6.0%
                        </span>
                      </div>
                      <div className="progress-bar-v2">
                        <div
                          className="progress-fill"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <div className="revenue-amount">₱1,543,800</div>
                    </div>
                  </div>

                  <div className="revenue-footer-v2">
                    <div className="total-revenue">
                      <span>Total Q1 Revenue</span>
                      <strong>₱4,284,500</strong>
                    </div>
                    <button
                      className="btn-download-report-v2"
                      onClick={() => alert("Full report downloaded")}
                    >
                      <i className="fas fa-download"></i> Download Full Report
                    </button>
                  </div>
                </div>

                {/* Quick Insights - Walang cents */}
                <div className="report-card-v2 insights-card">
                  <div className="report-card-header-v2">
                    <div className="header-icon teal">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div>
                      <h3>Quick Insights</h3>
                      <p>Key metrics at a glance</p>
                    </div>
                  </div>
                  <div className="insights-list-v2">
                    <div className="insight-item-v2">
                      <div className="insight-icon">
                        <i className="fas fa-ticket-alt"></i>
                      </div>
                      <div className="insight-content">
                        <span className="insight-label">
                          Total Bookings (Q1)
                        </span>
                        <span className="insight-value">156</span>
                      </div>
                    </div>
                    <div className="insight-item-v2">
                      <div className="insight-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="insight-content">
                        <span className="insight-label">New Customers</span>
                        <span className="insight-value">+42</span>
                      </div>
                    </div>
                    <div className="insight-item-v2">
                      <div className="insight-icon">
                        <i className="fas fa-star"></i>
                      </div>
                      <div className="insight-content">
                        <span className="insight-label">Avg. Rating</span>
                        <span className="insight-value">4.8 ★</span>
                      </div>
                    </div>
                    <div className="insight-item-v2">
                      <div className="insight-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="insight-content">
                        <span className="insight-label">Pending Payments</span>
                        <span className="insight-value warning">₱0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminSection === "settings" && <SettingsPage />}
          {adminSection === "users" && <UsersSection />}
        </div>
      </div>
    );
  };

  // New Booking Modal
  const BookingModal = () => (
    <div
      className="modal-overlay"
      style={{ display: showBookingModal ? "flex" : "none" }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <i className="fas fa-plus-circle"></i> Create New Booking
          </h3>
          <button
            className="modal-close"
            onClick={() => setShowBookingModal(false)}
          >
            ✕
          </button>
        </div>
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={newBooking.customerName}
            onChange={(e) =>
              setNewBooking({ ...newBooking, customerName: e.target.value })
            }
            placeholder="Enter customer name"
          />
        </div>
        <div className="form-group">
          <label>Customer Email</label>
          <input
            type="email"
            value={newBooking.customerEmail}
            onChange={(e) =>
              setNewBooking({ ...newBooking, customerEmail: e.target.value })
            }
            placeholder="customer@email.com"
          />
        </div>
        <div className="form-group">
          <label>Customer Phone</label>
          <input
            type="text"
            value={newBooking.customerPhone}
            onChange={(e) =>
              setNewBooking({ ...newBooking, customerPhone: e.target.value })
            }
            placeholder="09123456789"
          />
        </div>
        <div className="form-group">
          <label>Select Tour</label>
          <select
            value={newBooking.tourId}
            onChange={(e) =>
              setNewBooking({ ...newBooking, tourId: e.target.value })
            }
          >
            <option value="">-- Select Tour --</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.name} - ₱{Number(tour.price).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Travel Date</label>
          <input
            type="date"
            value={newBooking.travelDate}
            onChange={(e) =>
              setNewBooking({ ...newBooking, travelDate: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label>Number of Guests</label>
          <input
            type="number"
            min="1"
            value={newBooking.guests}
            onChange={(e) =>
              setNewBooking({ ...newBooking, guests: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="form-group">
          <label>Special Requests</label>
          <textarea
            value={newBooking.specialRequests}
            onChange={(e) =>
              setNewBooking({ ...newBooking, specialRequests: e.target.value })
            }
            placeholder="Any special requests?"
            rows="3"
          ></textarea>
        </div>
        <div className="modal-buttons">
          <button className="btn-primary" onClick={handleCreateBooking}>
            Create Booking
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowBookingModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // GCash Payment Modal
  const GCashPaymentModalComp = () => (
    <div
      className="modal-overlay"
      style={{ display: showGCashModal ? "flex" : "none" }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <i className="fab fa-gcash"></i> GCash Payment
          </h3>
          <button
            className="modal-close"
            onClick={() => setShowGCashModal(false)}
          ></button>
        </div>

        <div className="payment-details">
          <div className="payment-info">
            <span>Booking ID:</span>
            <strong>{selectedBooking?.bookingNumber}</strong>
          </div>
          <div className="payment-info">
            <span>Amount:</span>
            <strong className="amount">
              ₱{Number(selectedBooking?.totalAmount).toLocaleString()}
            </strong>
          </div>
          <div className="payment-info">
            <span>Customer:</span>
            <strong>{selectedBooking?.customerName}</strong>
          </div>
        </div>

        <div className="gcash-instructions">
          <div className="gcash-logo">
            <i className="fab fa-gcash"></i> GCash
          </div>
          <p>
            Enter your GCash registered mobile number to complete the payment.
          </p>
        </div>

        <div className="form-group">
          <label>GCash Mobile Number</label>
          <div className="phone-input">
            <span className="country-code">+63</span>
            <input
              type="tel"
              placeholder="9123456789"
              value={gcashPhone}
              onChange={(e) =>
                setGcashPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              autoComplete="off"
            />
          </div>
          <small>Enter 10-digit mobile number (e.g., 9123456789)</small>
        </div>

        <div className="payment-note">
          <i className="fas fa-shield-alt"></i> Your payment is secure and
          encrypted
        </div>

        <div className="modal-buttons">
          <button
            className="btn-gcash"
            onClick={processGCashPayment}
            disabled={paymentProcessing}
          >
            {paymentProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              <>
                <i className="fab fa-gcash"></i> Pay with GCash
              </>
            )}
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowGCashModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Login Page
  const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log("=== FULL RESPONSE ===");
        console.log("Response status:", response.status);
        console.log("Full data:", data);
        console.log("User object:", data.user);
        console.log("User role:", data.user?.role);
        console.log("Has user?", !!data.user);

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Login failed");
        }

        // Ensure user has a role
        if (!data.user.role) {
          console.warn("User role is missing, setting to client");
          data.user.role = "client";
        }

        localStorage.setItem("token", "dummy-token");
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsLoggedIn(true);

        setEmail("");
        setPassword("");

        setCurrentPage("dashboard");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        className="auth-container"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="auth-overlay"></div>
        <div className="auth-caption">
          <h2>WELCOME BACK</h2>
          <h1>
            Continue Your
            <br />
            <span className="highlight">JOURNEY</span>
          </h1>
          <p>
            Access your account to manage bookings, view itineraries, and
            explore exclusive deals tailored just for you.
          </p>
          <div className="travel-stats">
            <div className="stat">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat">
              <div className="stat-number">200+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-logo">
            <img src={authLogo} alt="Logo" className="auth-logo-img" />
            <h2>
              Travel<span>&Go</span>
            </h2>
          </div>
          <h3>Welcome back</h3>
          <p className="subtitle">Log in to continue your journey</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email address</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="forgot-password">
              <button
                className="forgot-link"
                onClick={() => setCurrentPage("forgot-password")}
              >
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              className="btn-primary-auth"
              disabled={loading}
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-sign-in-alt"></i>
              )}{" "}
              Log in
            </button>
          </form>
          <p className="auth-link">
            Don't have an account?{" "}
            <button
              className="auth-link-btn"
              onClick={() => setCurrentPage("signup")}
            >
              Sign up free
            </button>
          </p>
          <div className="back-to-home">
            <button
              className="back-home-btn"
              onClick={() => setCurrentPage("home")}
            >
              <i className="fas fa-arrow-left"></i> Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Signup Page
  const SignupPage = () => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
      profileImage: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          setFormData({ ...formData, profileImage: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSignup = async (e) => {
      e.preventDefault();
      setError("");

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            profile_image: formData.profileImage,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "client",
          profileImage: null,
        });
        setPreviewImage(null);

        alert("Registration successful! Please login.");
        setCurrentPage("login");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        className="auth-container"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="auth-overlay"></div>
        <div className="auth-caption">
          <h2>JOIN US TODAY</h2>
          <h1>
            Start Your
            <br />
            <span className="highlight">ADVENTURE</span>
          </h1>
          <p>
            Create an account and unlock amazing travel deals, exclusive
            discounts, and personalized recommendations for your next getaway.
          </p>
          <div className="travel-stats">
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Partners</div>
            </div>
            <div className="stat">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
        <div className="auth-card">
          <div className="auth-logo">
            <img src={authLogo} alt="Logo" className="auth-logo-img" />
            <h2>
              Travel<span>&Go</span>
            </h2>
          </div>
          <h3>Create your account</h3>
          <p className="subtitle">Join millions of travelers worldwide</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="profile-upload">
            <div
              className="profile-preview"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <i className="fas fa-user-circle"></i>
              )}
            </div>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <button
              type="button"
              className="upload-btn"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            >
              <i className="fas fa-camera"></i> Upload Profile Picture
            </button>
          </div>

          <form onSubmit={handleSignup}>
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <div className="input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Last name</label>
                <div className="input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Email address</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <div className="input-with-icon">
                <i className="fas fa-check-circle"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Account Type</label>
              <div className="input-with-icon">
                <i className="fas fa-user-tag"></i>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 42px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <option value="client">Client - Book tours and travel</option>
                  <option value="admin">
                    Admin - Manage system (requires approval)
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary-auth"
              disabled={loading}
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-user-plus"></i>
              )}{" "}
              Create Account
            </button>
          </form>
          <p className="auth-link">
            Already have an account?{" "}
            <button
              className="auth-link-btn"
              onClick={() => setCurrentPage("login")}
            >
              Log in
            </button>
          </p>
          <div className="back-to-home">
            <button
              className="back-home-btn"
              onClick={() => setCurrentPage("home")}
            >
              <i className="fas fa-arrow-left"></i> Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ========== RETURN STATEMENT ==========
  return (
    <div className="app">
      {currentPage === "home" && <Homepage />}
      {currentPage === "login" && <LoginPage />}
      {currentPage === "signup" && <SignupPage />}
      {currentPage === "forgot-password" && (
        <ForgotPasswordPage setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "reset-password" && (
        <ResetPasswordPage setCurrentPage={setCurrentPage} />
      )}

      {/* Admin Dashboard */}
      {isLoggedIn &&
        user?.role === "admin" &&
        currentPage !== "home" &&
        currentPage !== "login" &&
        currentPage !== "signup" &&
        currentPage !== "forgot-password" &&
        currentPage !== "reset-password" && <AdminDashboard />}

      {/* Client Dashboard */}
      {isLoggedIn &&
        user?.role === "client" &&
        currentPage !== "home" &&
        currentPage !== "login" &&
        currentPage !== "signup" &&
        currentPage !== "forgot-password" &&
        currentPage !== "reset-password" && (
          <div className="client-layout">
            <ClientNavbar
              activePage={clientPage}
              setActivePage={setClientPage}
              user={user}
              handleLogout={handleLogout}
            />
            <div className="client-main-content">
              {clientPage === "dashboard" && (
                <ClientDashboard user={user} tours={tours} />
              )}
              {clientPage === "view-tours" && (
                <ClientViewTours
                  tours={tours}
                  loading={loading}
                  onBookNow={(tour) => console.log("Booked:", tour)}
                  user={user}
                />
              )}
              {clientPage === "bookings" && <ClientBookings user={user} />}
              {clientPage === "payments" && <ClientPayments user={user} />}
              {clientPage === "edit-profile" && (
                <EditProfile user={user} setUser={setUser} />
              )}
              {clientPage === "settings" && <ClientSettings />}
            </div>
          </div>
        )}

      <BookingModal />
      <GCashPaymentModalComp />
      {currentPage === "home" && (
        <div className="chatbot-container">
          <div
            className="chatbot-button"
            onClick={() => setShowChat(!showChat)}
          >
            <img src={chatbotIcon} alt="WonderBot" className="chatbot-icon" />
          </div>
          <WonderBot
            isOpen={showChat}
            onToggle={() => setShowChat(false)}
            chatbotIcon={chatbotIcon}
          />
        </div>
      )}
      <ModalComponent />
    </div>
  );
}

export default App;
