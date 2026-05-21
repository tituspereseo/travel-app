import React, { useState } from 'react';

const ClientSettings = () => {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    promoEmails: true,
    bookingReminders: true
  });

  const [preferences, setPreferences] = useState({
    currency: 'PHP',
    language: 'English',
    timezone: 'Asia/Manila'
  });

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="client-settings">
      <div className="settings-header">
        <h1><i className="fas fa-sliders-h"></i> Settings</h1>
        <p>Customize your travel experience</p>
      </div>

      <div className="settings-grid">
        {/* Notification Settings */}
        <div className="settings-card">
          <h3><i className="fas fa-bell"></i> Notifications</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div>
                <label>Email Alerts</label>
                <p>Receive booking confirmations and updates via email</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.emailAlerts} onChange={() => toggleNotification('emailAlerts')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div>
                <label>SMS Alerts</label>
                <p>Get text messages for booking status changes</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.smsAlerts} onChange={() => toggleNotification('smsAlerts')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div>
                <label>Promotional Emails</label>
                <p>Receive travel deals and exclusive offers</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.promoEmails} onChange={() => toggleNotification('promoEmails')} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div>
                <label>Booking Reminders</label>
                <p>Get reminders before your upcoming trips</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={notifications.bookingReminders} onChange={() => toggleNotification('bookingReminders')} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-card">
          <h3><i className="fas fa-globe"></i> Preferences</h3>
          <div className="settings-form">
            <div className="setting-group">
              <label>Currency</label>
              <select value={preferences.currency} onChange={(e) => setPreferences({...preferences, currency: e.target.value})}>
                <option value="PHP">Philippine Peso (₱)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="JPY">Japanese Yen (¥)</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Language</label>
              <select value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})}>
                <option value="English">English</option>
                <option value="Tagalog">Tagalog</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Time Zone</label>
              <select value={preferences.timezone} onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}>
                <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
              </select>
            </div>
          </div>
          <button className="save-preferences-btn" onClick={() => alert('Preferences saved!')}>
            Save Preferences
          </button>
        </div>

        {/* Account Settings */}
        <div className="settings-card">
          <h3><i className="fas fa-shield-alt"></i> Account</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div>
                <label>Privacy Mode</label>
                <p>Hide your profile from other users</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div>
                <label>Two-Factor Authentication</label>
                <p>Add an extra layer of security</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <button className="delete-account-btn" onClick={() => alert('Contact support to delete account')}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;