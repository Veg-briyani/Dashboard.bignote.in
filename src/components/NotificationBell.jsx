
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import 'boxicons/css/boxicons.min.css';
import './NotificationBell.css';
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          console.error('Unexpected response structure:', response.data);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up interval to refresh notifications every 2 minutes
    const intervalId = setInterval(fetchNotifications, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Count unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment':
        return 'bx-credit-card';
      case 'royalty':
        return 'bx-dollar-circle';
      case 'book':
        return 'bx-book';
      case 'system':
        return 'bx-info-circle';
      default:
        return 'bx-bell';
    }
  };

  return (
    <div className="nav-item dropdown" ref={dropdownRef}>
      <a 
        className="nav-link dropdown-toggle hide-arrow" 
        href="#" 
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <div className="avatar avatar-online">
          <span className="position-relative">
            <i className="bx bx-bell fs-4"></i>
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount > 99 ? '99+' : unreadCount}
                <span className="visually-hidden">unread notifications</span>
              </span>
            )}
          </span>
        </div>
      </a>
      
      <ul className={`dropdown-menu dropdown-menu-end py-0 ${isOpen ? 'show' : ''}`} style={{ width: '350px', maxHeight: '500px', overflow: 'hidden' }}>
        <li className="dropdown-menu-header border-bottom">
          <div className="dropdown-header d-flex align-items-center py-3">
            <h5 className="text-body mb-0 me-auto">Notifications</h5>
            {unreadCount > 0 && (
              <span className="badge badge-dot bg-danger d-flex align-items-center">
                <span className="small text-muted ms-1">{unreadCount} unread</span>
              </span>
            )}
            {notifications.length > 0 && (
              <a href="#" className="dropdown-notifications-all text-body small" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark all as read">
                <i className="bx bx-check-double fs-4"></i>
              </a>
            )}
          </div>
        </li>
        
        <li className="dropdown-notifications-list scrollable-container">
          <div className="scrollable-content" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center p-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-4">
                <div className="mb-2">
                  <i className="bx bx-bell-off fs-1 text-muted"></i>
                </div>
                <p className="mb-0 text-muted">No notifications</p>
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {notifications.map(notification => (
                  <li 
                    key={notification._id} 
                    className={`list-group-item list-group-item-action dropdown-notifications-item ${!notification.read ? 'bg-light' : ''}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className={`avatar avatar-sm ${!notification.read ? 'bg-label-primary' : 'bg-label-secondary'}`}>
                          <span className="avatar-initial rounded-circle">
                            <i className={`bx ${getNotificationIcon(notification.type)}`}></i>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold">{notification.title || 'Notification'}</h6>
                        <p className="mb-1">{notification.message}</p>
                        <small className="text-muted">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </small>
                      </div>
                      
                      {!notification.read && (
                        <div className="flex-shrink-0 dropdown-notifications-actions">
                          <span className="badge badge-dot bg-primary"></span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
        
        <li className="dropdown-menu-footer border-top p-3">
          <a href="/notifications" className="btn btn-primary d-flex justify-content-center align-items-center">
            <span>View All Notifications</span>
            <i className="bx bx-right-arrow-alt ms-2 fs-5"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default NotificationBell;