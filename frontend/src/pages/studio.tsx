import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  Layout } from "../components";
import styled from 'styled-components';

interface HypeModeTabProps {
	userId?: string;
  }
  

const StudioMode: React.FC<HypeModeTabProps> = ({ userId }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = () => {
    axios.get('/subscription/status')
      .then(response => setIsSubscribed(response.data.isSubscribed))
      .catch(error => console.error('Subscription status error:', error));
  };

  const handleSubscribe = () => {
    axios.post('/subscription/subscribe', { subscriptionType: 'HypeMode' })
      .then(response => {
        setIsSubscribed(true);
        // Optionally, redirect to HypeMode tab after subscribing
      })
      .catch(error => console.error('Subscription error:', error));
  };

  // Styled components
  const Section = styled.div`
  background: linear-gradient(to right, #1e5799, #2989d8, #207cca, #7db9e8);
  color: white;
  text-align: center;
  padding: 200px 20px;
  min-height: 600px;  // Minimum height
`;

  
  const Title = styled.h1`
    margin: 0;
    padding-bottom: 20px;
    font-size: 48px;
  `;
  
  const Subtitle = styled.p`
    font-size: 24px;
    margin: 0;
    padding-bottom: 20px;
  `;
  
  const Price = styled.p`
    font-size: 24px;
    margin: 0;
    padding-bottom: 20px;
  `;
  

  const Button = styled.button`
    font-size: 20px;
    padding: 10px 20px;
    background: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  
    &:hover {
      background-color: darkred;
    }
  `;
  const FeaturesContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  background-color: #000;
  color: #fff;
  padding: 20px 0;
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200px;
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  text-align: center;
  font-size: 14px;
  margin-top: 5px;
`;

  const features = [
    {
      icon: '..../assets/wecinema.png',
      description: 'Ad-free so you can immerse in your favorite videos without interruption'
    },
    {
      icon: '/path-to-icons/download-icon.png',
      description: 'Download videos to watch later when you\'re offline or on the go'
    },
    {
      icon: '/path-to-icons/background-play-icon.png',
      description: 'Background play so you can watch while using other apps or with your screen locked'
    },
    {
      icon: '/path-to-icons/music-stream-icon.png',
      description: 'Stream all the music you want to hear, ad-free on the YouTube Music app'
    }
  ];

  return (
	<Layout hasHeader={false}>

    <div className="hype-mode-profile">
      <h3>HypeMode Profile</h3>
      <Section>
      {/* <img src="/path-to-youtube-logo.png" alt="WeCinema Premium" style={{ maxWidth: '150px', marginBottom: '20px' }} /> */}
      <Title>All WeCinema. No interruptions.</Title>
      <Subtitle>For Studio, the 5 dollar subscription is so users can buy and sell their videos/scripts</Subtitle>
      <Subtitle>      and are now partnered with WeCinema. They also get early access to new features.      </Subtitle>

      <Price>$5/month • Cancel anytime</Price>
      <Button>Get WeCinema Premium</Button>
    </Section>
    {/* <FeaturesContainer>
      {features.map((feature, index) => (
        <Feature key={index}>
          <Icon src={feature.icon} alt="Feature icon" />
          <Description>{feature.description}</Description>
        </Feature>
      ))}
    </FeaturesContainer> */}
      {/* {!isSubscribed && (
        <div className="subscription-prompt">
          <p>This profile contains exclusive content. Subscribe now to unlock full access!</p>
          <button onClick={handleSubscribe}>Subscribe Now</button>
        </div>

      )}
      {/* Display content for subscribed users */}
      {isSubscribed && (
        <div className="subscribed-content">
          {/* Add content here for subscribed users */}
        </div>
      )} 
    </div>
	</Layout>

  );
};

export default StudioMode;
