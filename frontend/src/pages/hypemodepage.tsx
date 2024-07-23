import { useState, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { Layout } from "../components";
import { useNavigate } from 'react-router-dom';
import { gapi } from "gapi-script";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to right, #ffffa1 0%, #ffc800 100%);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
  width: 100%;
`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SubscriptionBox = styled.div`
  padding: 20px;
  border: 2px dashed #000;
  text-align: center;
  width: 80%;
  margin: 10px 0;
  background-color: #fff;
  @media (min-width: 768px) {
    width: 300px;
    margin: 0 20px;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #000;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  color: #000;
`;

const Button = styled.button`
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const ToggleButton = styled.button`
  color: #000;
  border: 2px solid #000;
  padding: 10px 20px;
  margin-bottom: 100px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f0f0f0;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: #fff;
  border: 2px solid #000;
  z-index: 1000;
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

  const fetchBirthday = async (token:any) => {
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
    } catch (error:any) {
      console.error('Error fetching birthday:', error.response ? error.response.data : error.message);
      return '';
    }
  };

  const registerUser = async (username:any, email:any, avatar:any, dob:any, password:any, callback:any) => {
    try {
      const res = await axios.post('http://localhost:3000/user/register', {
        username,
        email,
        avatar,
        dob,
        password
      });

      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        setPopupMessage('Registration successful and logged in!');
        setIsLoggedIn(true);
        setUserId(userId);
        setShowPopup(true);
        if (callback) callback(userId);
      }
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.error === 'Email already exists') {
        setPopupMessage('Email already exists.');
      } else {
        setPopupMessage('Registration successful. Please sign in.');
      }
      setShowPopup(true);
    }
  };

  const loginUser = async (email:any, password:any, callback:any) => {
    try {
      const res = await axios.post('http://localhost:3000/user/login', { email, password });
      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserId(userId);
        setPopupMessage('Login successful!');
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error) {
      setPopupMessage('Login failed.');
      setShowPopup(true);
    }
  };

  const onLoginSuccess = async (googleUser:any, token:any) => {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    const username = profile.getName();
    const avatar = profile.getImageUrl();
    const dob = await fetchBirthday(token);
    const callback = () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });

    if (isSignup) {
      await registerUser(username, email, avatar, dob, password, callback);
      console.log('Date of Birth:', dob);
    } else {
      await loginUser(email, password, callback);
    }
  };

  const onLoginFailure = (error:any) => {
    console.error('Login Failed:', error);
    setPopupMessage('Login failed.');
    setShowPopup(true);
  };

  const handleGoogleLogin = () => {
    gapi.auth2.getAuthInstance().signIn()
      .then(async (googleUser:any) => {
        const token = googleUser.getAuthResponse().access_token;
        console.log('Access token acquired:', token);
        await onLoginSuccess(googleUser, token);
      })
      .catch(onLoginFailure);
  };

  const handleGoogleLogout = () => {
    gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/hypemode');
      })
      .catch((error:any) => {
        console.error('Logout Failed:', error);
      });
  };

  const clientId = "854144808645-t4jd10ehpngjnfvki8mcuq7q0uvr2kjo.apps.googleusercontent.com";

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'https://www.googleapis.com/auth/user.birthday.read email profile',
      }).then(() => {
        console.log('Google API client initialized.');
      }).catch((error:any) => {
        console.error('Error initializing Google API client:', error);
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubscriptionClick = (subscriptionType:any) => {
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