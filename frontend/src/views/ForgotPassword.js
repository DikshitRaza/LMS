// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();

    try {
      // Check if the email exists
      const emailCheckResponse = await axios.post('http://localhost:3001/api/check-email', { email });

      if (emailCheckResponse.data.exists) {
        // Email exists, show new password and confirm password fields
        setShowPasswordFields(true);
      } else {
        setMessage('Email not found.');
      }
    } catch (error) {
      console.error('Error checking email:', error.message);
      setMessage('An error occurred while checking the email.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Proceed with password reset logic
      if (newPassword === confirmPassword) {
        // Make an API request to update the new password in the database
        const updateResponse = await axios.post('http://localhost:3001/api/update-password', {
          email,
          newPassword,
        });

        setMessage(updateResponse.data.message);

        // If the password is updated successfully, reload the page
        if (updateResponse.data.success) {
          window.location.reload();
        }
      } else {
        setMessage('Passwords do not match.');
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setMessage('An error occurred while resetting the password.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Forgot Password</h2>
        <form onSubmit={handleCheckEmail} style={styles.form}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Check Email
          </button>
        </form>

        {showPasswordFields && (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <label htmlFor="newPassword" style={styles.label}>
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Reset Password
            </button>
          </form>
        )}

        <p style={styles.message}>{message}</p>
        <Link to="/" style={styles.link}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#000',
    color: '#fff',
  },
  formContainer: {
    width: '400px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '1px solid #fff',
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: '#000',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginBottom: '16px',
    textAlign: 'center',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    color: '#fff',
    textDecoration: 'none',
  },
};

export default ForgotPassword;
