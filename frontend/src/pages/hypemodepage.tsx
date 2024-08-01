import { useState } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Layout } from "../components";
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to right, #ffffa1 0%, #ffc800 100%);
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    justify-content: flex-start;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const SubscriptionBox = styled.div`
  padding: 15px;
  border: 2px dashed #000;
  text-align: center;
  width: 90%;
  margin: 10px 0;
  background-color: #fff;
  
  @media (min-width: 768px) {
    width: 270px;
    margin: 10px;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #000;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  margin-bottom: 15px;
  color: #000;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Button = styled.button`
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const ToggleButton = styled.button`
  color: #000;
  border: 2px solid #000;
  padding: 8px 15px;
  margin-bottom: 30px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    margin-top: 80px;
    font-size: 14px;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px;
  background: #fff;
  border: 2px solid #000;
  z-index: 1000;
  max-width: 90%;
  box-sizing: border-box;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDst7s0XVPLrGr7S0S0IMZ4e9T4Z_W8rVs",
    authDomain: "wecinemaco.firebaseapp.com",
    databaseURL: "https://wecinemaco-default-rtdb.firebaseio.com",
    projectId: "wecinemaco",
    storageBucket: "wecinemaco.appspot.com",
    messagingSenderId: "133384787906",
    appId: "1:133384787906:web:93ef08a61ffa389622285b",
    measurementId: "G-L7XZ0MBR1C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');

const HypeModeProfile = () => {
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [userId, setUserId] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const fetchBirthday = async (token: string) => {
    try {
      const res = await axios.get('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const birthday = res.data.birthdays?.[0]?.date;
      if (birthday) {
        const formattedBirthday = `${birthday.year}-${birthday.month}-${birthday.day}`;
        return formattedBirthday;
      }
      return '';
    } catch (error: any) {
      console.error('Error fetching birthday:', error.response ? error.response.data : error.message);
      return '';
    }
  };

  const registerUser = async (username: string, email: string, avatar: string, dob: string, callback: () => void) => {
    try {
      const res = await axios.post('https://wecinema.onrender.com/user/register', {
        username,
        email,
        avatar,
        dob,
        password
      });

      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        setPopupMessage('Registration successful and logged in.!');
        setUserId(userId);
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error === 'Email already exists..') {
        setPopupMessage('Email already exists.');
      } else {
        setPopupMessage('Registration successful. Please sign in.');
      }
      setShowPopup(true);
    }
  };

  const loginUser = async (email: string, callback: () => void) => {
    try {
      const res = await axios.post('https://wecinema.onrender.com/user/login', {
        email,
        
      });
  
      const token = res.data.token;
      const userId = res.data.id;
  
      if (token) {
        localStorage.setItem('token', token);
        setUserId(userId);
        setPopupMessage('Login successful..!');
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error:any) {
      console.error('Login failed:', error);
      if (error.response) {
        setPopupMessage(error.response.data.message || 'Login failed.');
      } else {
        setPopupMessage('Login failed.');
      }
      setShowPopup(true);
    }
  };

  const onLoginSuccess = async (googleUser: any) => {
    const profile = googleUser.providerData[0];
    const email = profile.email;
    const username = profile.displayName;
    const avatar = profile.photoURL;
    const token = await googleUser.getIdToken();
    const dob = await fetchBirthday(token);
    const callback = () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });

    if (isSignup) {
      await registerUser(username, email, avatar, dob, callback);
    } else {
      await loginUser(email, callback);
    }
  };

  const onLoginFailure = (error: any) => {
    console.error('Google login failed:', error);
    setPopupMessage('Google login failed. Please try again.');
    setShowPopup(true);
    setIsSigningIn(false);
  };

  const handleGoogleLogin = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await onLoginSuccess(user);
    } catch (error: any) {
      onLoginFailure(error);
    } finally {
      setIsSigningIn(false);
    }
  };

  

  return (
    <Layout expand={false}>
      <MainContainer>
        <ToggleButton onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Sign in' : 'New user? Sign up'}
        </ToggleButton>
        <RightContainer>
          <SubscriptionContainer>
            <SubscriptionBox onClick={() => setSelectedSubscription('user')}>
              <Title>User Subscription</Title>
              <Description>$5 / month</Description>
              <Button onClick={handleGoogleLogin}>Subscribe</Button>
            </SubscriptionBox>
            <SubscriptionBox onClick={() => setSelectedSubscription('admin')}>
              <Title>Admin Subscription</Title>
              <Description>$10 / month</Description>
              <Button onClick={handleGoogleLogin}>Subscribe</Button>
            </SubscriptionBox>
          </SubscriptionContainer>
        </RightContainer>
        {showPopup && (
          <>
            <Overlay onClick={() => setShowPopup(false)} />
            <Popup>
              <p>{popupMessage}</p>
              <Button onClick={() => setShowPopup(false)}>Close</Button>
            </Popup>
          </>
        )}
      </MainContainer>
    </Layout>
  );
};

export default HypeModeProfile;
