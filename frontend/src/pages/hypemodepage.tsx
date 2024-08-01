import { useState } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Layout } from "../components";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { googleProvider } from "./firebase";

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

const HypeModeProfile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  const fetchBirthday = async (token: string) => {
    try {
      console.log('Fetching birthday with token:', token);
      const res = await axios.get('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const birthday = res.data.birthdays?.[0]?.date;
      if (birthday) {
        const formattedBirthday = `${birthday.year}-${birthday.month}-${birthday.day}`;
        console.log('Birthday:', formattedBirthday);
        return formattedBirthday;
      }
      console.log('No birthday found.');
      return '';
    } catch (error: any) {
      console.error('Error fetching birthday:', error.response ? error.response.data : error.message);
      return '';
    }
  };

  const registerUser = async (username: string, email: string, avatar: string, dob: string, password: string, callback: () => void) => {
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
        setIsLoggedIn(true);
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

  const loginUser = async (email: string, password: string, callback: () => void) => {
    try {
      const res = await axios.post('https://wecinema.onrender.com/user/login', {
        email,
        password,
      });

      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
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

  const onLoginSuccess = async (user: any) => {
    const profile = user.providerData[0];
    const email = profile.email;
    const username = profile.displayName;
    const avatar = profile.photoURL;
    const token = await user.getIdToken();
    const dob = await fetchBirthday(token);
    const callback = () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });

    if (isSignup) {
      await registerUser(username, email, avatar, dob, password, callback);
      console.log('Date of Birth:', dob);

    } else {
      await loginUser(email, password, callback);

    }
  };

  const onLoginFailure = (error: any) => {
    console.error('Google login failed:', error);
    setPopupMessage('Google login failed. Please try again.');
    setShowPopup(true);
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await onLoginSuccess(user);
    } catch (error: any) {
      onLoginFailure(error);
    }
  };

  const handleGoogleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setPopupMessage('Logout successful.');
      setShowPopup(true);
    } catch (error: any) {
      console.error('Logout failed:', error);
      setPopupMessage('Logout failed. Please try again.');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubscriptionClick = (subscriptionType: string) => {
    setSelectedSubscription(subscriptionType);
    if (isLoggedIn) {
      const amount = subscriptionType === 'user' ? 5 : subscriptionType === 'studio' ? 10 : 0;
      navigate('/payment', { state: { subscriptionType, amount, userId } });
    }
  };

  const toggleSignupSignin = () => {
    setIsSignup(!isSignup);
  };

  return (
    <Layout expand={false} hasHeader={false}>
      <MainContainer>
        <ToggleButton onClick={toggleSignupSignin}>
          {isSignup ? "Already have an account? Switch to Sign in" : "Don't have an account? Switch to Sign up"}
        </ToggleButton>

        <RightContainer>
          {isLoggedIn ? (
            <SubscriptionContainer>
              <SubscriptionBox>
                <Title>Logout</Title>
                <Button onClick={handleGoogleLogout}>Logout</Button>
              </SubscriptionBox>
            </SubscriptionContainer>
          ) : (
            <SubscriptionContainer>
              <SubscriptionBox onClick={() => handleSubscriptionClick('user')}>
                <Title>User Subscription</Title>
                <Description>$5 a month to buy and sell films and scripts</Description>
                <Button onClick={handleGoogleLogin}>{isSignup ? "Sign up with Google" : "Sign in with Google"}</Button>
              </SubscriptionBox>
              <SubscriptionBox onClick={() => handleSubscriptionClick('studio')}>
                <Title>Studio Subscription</Title>
                <Description>$10 a month to buy and sell, get early access to new features</Description>
                <Button onClick={handleGoogleLogin}>{isSignup ? "Sign up with Google" : "Sign in with Google"}</Button>
              </SubscriptionBox>
              <SubscriptionBox>
                <h3>{isSignup ? 'Register' : 'Login'} with Email</h3>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={() => loginUser(email, password, () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } }))}>
                  {isSignup ? 'Register' : 'Login'}
                </Button>
              </SubscriptionBox>
            </SubscriptionContainer>
          )}
        </RightContainer>
      </MainContainer>
      {showPopup && (
        <>
          <Overlay onClick={closePopup} />
          <Popup>
            <p>{popupMessage}</p>
            <Button onClick={closePopup}>Close</Button>
          </Popup>
        </>
      )}
    </Layout>
  );
};

export default HypeModeProfile;
