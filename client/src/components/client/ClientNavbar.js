import React from 'react';

const ClientNavbar = ({ activePage, setActivePage, user, handleLogout }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'view-tours', name: 'View Tours', icon: 'fas fa-umbrella-beach' },
    { id: 'bookings', name: 'Bookings', icon: 'fas fa-calendar-check' },
    { id: 'payments', name: 'Payments', icon: 'fas fa-credit-card' },
    { id: 'edit-profile', name: 'Edit Profile', icon: 'fas fa-user-edit' },
    { id: 'settings', name: 'Settings', icon: 'fas fa-sliders-h' }
  ];

  return (
    <div className="client-sidebar">
      <div className="client-sidebar-header">
        <img src="/assets/images/auth-logo.png" alt="Logo" className="client-logo" />
        <h2>Travel<span>&Go</span></h2>
      </div>
      
      <div className="client-user-info">
        <div className="client-avatar">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" />
          ) : (
            <i className="fas fa-user-circle"></i>
          )}
        </div>
        <div className="client-user-details">
          <h4>{user?.firstName} {user?.lastName}</h4>
          <p>{user?.email}</p>
        </div>
      </div>
      
      <div className="client-sidebar-nav">
        {navItems.map(item => (
          <div 
            key={item.id}
            className={`client-nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <i className={item.icon}></i>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="client-sidebar-footer">
        <button onClick={handleLogout} className="client-logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default ClientNavbar;