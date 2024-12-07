import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Login = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const toggle = () => setIsSignIn(!isSignIn);
     const [videoEnded, setVideoEnded] = useState(false);
     const [showForgotPassword, setShowForgotPassword] = useState(false);
     const[passwo,setPasswo]=useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleVideoEnd = () => {
        setVideoEnded(true);
    };

const handleLogin = async () => {
    if (!recaptchaToken) {
        setMessage('Please complete the reCAPTCHA verification.');
        return;
    }
    try {
        const response = await axios.post('http://localhost:5000/login', {
            username: form.username,
            password: form.password,
            recaptchaToken: recaptchaToken,
        });
        console.log("Full Response:", response);
        const { data } = response;
        console.log("Response Data:", data);
        setMessage(data.message);

        if (data.success) {
            localStorage.setItem('username', form.username);
            setTimeout(() => {
                alert('Session expired, please log in again.');
                navigate('/login');
            }, 3600000);
            Cookies.set('authToken', data.token, { expiresIn: '1h' });
            console.log("Login successful, navigating to dashboard...");
            navigate('/dashboard');
        } else {
            console.log("Login was not successful:", data.message);
            setMessage(data.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.response?.data?.message || 'An error occurred during login';
        setMessage(errorMessage);
    }
};
const handleForgotPassword = async () => {
        if (!resetEmail) {
            setMessage('Please enter your email address.');
            return;
        }

        try {
            const { data } = await axios.post('http://localhost:5000/forgot-password', { email: resetEmail });
            setMessage(data.message);

            if (data.success) {
                setShowForgotPassword(false); // Close email validation modal
                setPasswo(true); // Open password reset modal
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'An error occurred while verifying the email.';
            setMessage(errorMessage);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setMessage('Please fill in both password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const { data } = await axios.patch('http://localhost:5000/reset-password', {
                email: resetEmail, // Use the validated email
                password: newPassword,
            });

            setMessage(data.message);

            if (data.success) {
                setPasswo(false); // Close the password reset modal
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'An error occurred while resetting the password.';
            setMessage(errorMessage);
        }
    };



    const handleRegister = async () => {
        if (form.password !== form.confirmPassword) {
            setMessage("Passwords don't match!");
            return;
        }
        try {
            const { data } = await axios.post('http://localhost:5000/register', {
                username: form.username,
                email: form.email,
                password: form.password,
            });
            setMessage(data.message);
            toggle();
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred during registration');
        }
    };
const handleGoogleLogin = async (credentialResponse) => {
    try {
        // Send the Google credential (ID token) to the backend
        const { data } = await axios.post('http://localhost:5000/google-login', {
            idToken: credentialResponse.credential,
        });

        // Store the username in localStorage
        localStorage.setItem('username', data.username);

        // Store the authentication token in cookies
        Cookies.set('authToken', data.token, { expires: 1 / 24 }); // Token expires in 1 hour

        // Set success message
        setMessage(data.message);

        // Navigate to the dashboard
        navigate('/dashboard');
    } catch (error) {
        // Handle any errors during login
        const errorMessage = error.response?.data?.message || 'An error occurred during Google login';
        setMessage(errorMessage);
        console.error('Google login error:', errorMessage);
    }
};


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignIn) {
            handleLogin();
        } else {
            handleRegister();
        }
    };
const fetchProtectedData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/protected-route', { withCredentials: true });
        console.log(response.data);
    } catch (error) {
        if (error.response && error.response.data.message === 'Session expired') {
            alert('Your session has expired. Please log in again.');
            navigate('../login');
        } else {
            console.error('Error fetching protected data:', error);
        }
    }
};
    return (
        <div id="login-container" className={`login-container ${isSignIn ? 'sign-in' : 'sign-up'} ${videoEnded ? 'video-ended' : ''}`}>
            <div className="row">
                {!videoEnded && (
                    <video width="100%" autoPlay muted onEnded={handleVideoEnd}>
                        <source src="/35575-407595493.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                <div className="col align-items-center flex-col sign-up">
                    <div className="form-wrapper align-items-center">
                        <form className="form sign-up" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit">Sign up</button>
                            <p>
                                <span className="pointer">Already have an account?</span>
                                <b onClick={toggle} className="pointer">Sign in here</b>
                            </p>
                        </form>
                    </div>
                </div>
                {/* Sign In Section */}
                <div className="col align-items-center flex-col sign-in">
                    <div className="form-wrapper align-items-center">
                        <form className="form sign-in" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <ReCAPTCHA
                                sitekey="6LdfH3wqAAAAANvlMejthNXN-eOBioVid3y69RO5"
                                onChange={(token) => setRecaptchaToken(token)}
                            />
                            <button type="submit">Sign in</button>
                            <p><b className="pointer">OR</b></p>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={(error) => {
                                    console.error('Login Failed:', error);
                                    setMessage('Google login failed');
                                }}
                            />
                            <p>
                                <b
                                    className="pointer"
                                    onClick={() => setShowForgotPassword(true)} // Open modal when clicked
                                >
                                    Forgot password?
                                </b>

                            </p>

{showForgotPassword && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Password Reset</h3>
                                <button
                                    type="button"
                                    className="custom-close-btn"
                                    aria-label="Close"
                                    onClick={() => setShowForgotPassword(false)}
                                >
                                    ✖
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="email"
                                    className="form-control custom-input"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="custom-btn custom-btn-primary"
                                    onClick={handleForgotPassword}
                                >
                                    CHECK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {passwo && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Set New Password</h3>
                                <button
                                    type="button"
                                    className="custom-close-btn"
                                    aria-label="Close"
                                    onClick={() => setPasswo(false)}
                                >
                                    ✖
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="password"
                                    className="form-control custom-input"
                                    placeholder="Enter Your Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    className="form-control custom-input"
                                    placeholder="Confirm Your Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="custom-btn custom-btn-primary"
                                    onClick={handleResetPassword}
                                >
                                    RESET
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                            <p>
                                <span className="pointer">Don't have an account?</span>
                                <b onClick={toggle} className="pointer">Sign up here</b>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row content-row">
                <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                        <h2>Welcome Back!<  /h2>
                        {message && <p>{message}</p>}
                    </div>
                </div>
                <div className="col align-items-center flex-col">
                    <div className="text sign-up">
                        <h2>Join with us</h2>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
);
};

export default Login;
