import { useState, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Layout } from "../components";
import { useNavigate } from 'react-router-dom';
import { decodeToken } from "../utilities/helperfFunction";

const MainContainer = styled.div`
  display: flex;
  height: 80vh;
  background: linear-gradient(to right, #ffffa1 0%, #ffc800 100%);
  justify-content: center;
  align-items: center;
`;


const RightContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
`;


const SubscriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  width: 900px;
`;
const SubscriptionContainers = styled.div`
  background: linear-gradient(to right, #ffffa1 0%, #ffc800 100%);
`;


const SubscriptionBox = styled.div`
    padding: 20px;
  border: 2px dashed #000;
  text-align: center;
  width: 300px;
  margin: 0 20px;
  background-color: #fff;
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
  margin-top: 40px;
  margin-left: 400px;

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
  const token = localStorage.getItem("token") || null;
  const tokenData = decodeToken(token);

  console.log(tokenData);
  const fetchBirthday = async (token:any) => {
    try {
      const res = await axios.get('https://people.googleapis.com/v1/people/me?personFields=birthdays', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const birthday = res.data.birthdays?.[0]?.date;
      return birthday ? `${birthday.year}-${birthday.month}-${birthday.day}` : '';
    } catch (error) {
      console.error('Error fetching birthday:', error);
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

      console.log('User registered successfully:', res.data);
      const token = tokenData;
      const userId = token.userid; // Assuming userId is returned from 
      
      if (token) {
        setIsLoggedIn(true);
        setUserId(userId); // Set userId state
        setPopupMessage('Registration successful and logged in!');
        setShowPopup(true);
        if (callback) callback(userId);
      }
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.error === 'Email already exists') {
        setPopupMessage('Email already exists.');
      } else {
        setPopupMessage('Registration successful Go back to Signin.');
      }
      setShowPopup(true);
    }
  };

  const loginUser = async (email:any, password:any, callback:any) => {
    try {
      const res = await axios.post('http://localhost:3000/user/login', { email, password });
      const token = res.data.token;
      const userId = res.data.id; // Assuming userId is returned from backend
      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUserId(userId); // Set userId state
        setPopupMessage('Login successful!');
        setShowPopup(true);
        if (callback) callback();
      }
    } catch (error) {
      setPopupMessage('Login failed.');
      setShowPopup(true);
    }
  };

  const onLoginSuccess = async (response:any) => {
    console.log('Login Success:', response.profileObj);

    const { email, name: username, imageUrl: avatar } = response.profileObj;
    const token = response.tokenObj.access_token;

    const dob = await fetchBirthday(token);
    const callback = () => navigate('/payment', { state: { subscriptionType: selectedSubscription, amount: selectedSubscription === 'user' ? 5 : 10, userId } });

    if (isSignup) {
      await registerUser(username, email, avatar, dob, password, callback);
    } else {
      await loginUser(email, password, callback);
    }
  };

  const onLoginFailure = (response:any) => {
    console.error('Login Failed:', response);
  };

  const onLogoutSuccess = () => {
    console.log('Logout successful');
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/hypemode');
  };

  const clientId = "854144808645-t4jd10ehpngjnfvki8mcuq7q0uvr2kjo.apps.googleusercontent.com";

 
  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubscriptionClick = async (subscriptionType:any) => {
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
      <SubscriptionContainers>

      <ToggleButton onClick={toggleSignupSignin}>
                {isSignup ? "Already have account ? Switch to Sign in" : "Don't have account? Switch to Sign up"}
              </ToggleButton>
      </SubscriptionContainers>

      <MainContainer>
        
      
        {/* <LeftContainer>
          <InfoText>
            Success starts here
            <ul>
              <ListItem>The hypemode for our premium users</ListItem>
              <ListItem>To sell and buy scripts</ListItem>
              <ListItem>Access to new early advance features</ListItem>
            </ul>
          </InfoText>
        </LeftContainer> */}
        <RightContainer>
          {isLoggedIn ? (
            <SubscriptionContainer>
              <SubscriptionBox>
                <Title>Logout</Title>
                <GoogleLogout
                  clientId={clientId}
                  buttonText="Logout"
                  onLogoutSuccess={onLogoutSuccess}
                />
              </SubscriptionBox>
              
            </SubscriptionContainer>
          ) : (
            
            <SubscriptionContainer>
             
              <SubscriptionBox onClick={() => handleSubscriptionClick('user')}>
                <Title>User Subscription</Title>
                <Description>$5 a month to buy and sell films and scripts</Description>
                <GoogleLogin
                  clientId={clientId}
                  buttonText={isSignup ? "Sign up with Google" : "Sign in with Google"}
                  onSuccess={onLoginSuccess}
                  onFailure={onLoginFailure}
                  cookiePolicy={'single_host_origin'}
                  scope="email profile https://www.googleapis.com/auth/user.birthday.read"
                />
              </SubscriptionBox>
              <SubscriptionBox onClick={() => handleSubscriptionClick('studio')}>
                <Title>Studio Subscription</Title>
                <Description>$10 a month to buy and sell, get early access to new features</Description>
                <GoogleLogin
                  clientId={clientId}
                  buttonText={isSignup ? "Sign up with Google" : "Sign in with Google"}
                  onSuccess={onLoginSuccess}
                  onFailure={onLoginFailure}
                  cookiePolicy={'single_host_origin'}
                  scope="email profile https://www.googleapis.com/auth/user.birthday.read"
                />
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
