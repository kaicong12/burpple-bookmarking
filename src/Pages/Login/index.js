import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, twitterProvider } from '../../db/firebase';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    const navigate = useNavigate();
    const handleEmailPasswordLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate('/home');
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                navigate('/home');
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleTwitterLogin = () => {
        signInWithPopup(auth, twitterProvider)
            .then((result) => {
                navigate('/home');
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            alert('You have signed out successfully.');
        }).catch((error) => {
            alert('An error occurred while signing out: ' + error.message);
        });
    };

    return (
        <div className="container">
            <h1>Login</h1>
            {currentUser ? (
                <p>Welcome, {currentUser.email}</p>
            ) : (
                <form onSubmit={handleEmailPasswordLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            )}
            <button onClick={handleGoogleLogin} className="google-button">
                Sign in with Google
            </button>
            <button onClick={handleTwitterLogin} className="google-button">
                Sign in with Facebook
            </button>
            <button onClick={handleSignOut}>
                Sign Out
            </button>
            {error && <p id="error-message">{error}</p>}
        </div>
    );
};
