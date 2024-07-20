import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Layout } from "../components";
import styled from 'styled-components';
import axios from 'axios';
import { decodeToken } from "../utilities/helperfFunction";
import { getRequest } from "../api"; // Assuming getRequest is used for fetching data
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 100px 20px;
  background: linear-gradient(to right, #ffffa1 0%, #ffc800 100%);
  color: #333;
`;

const SubscriptionBox = styled.div`
  padding: 40px;
  border: 2px dashed #000;
  text-align: center;
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
`;

const Popup = styled.div`
  position: fixed;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  background: #fff;
  border: 2px solid #000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
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

const Button = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background 0.3s;
  margin-top: 20px;

  &:hover {
    background: #218838;
  }
`;

const TransactionPopup = ({ message, onClose, isError }) => (
  <>
    <Overlay onClick={onClose} />
    <Popup>
      <h3>{isError ? 'Error' : 'Success'}!</h3>
      <p>{message}</p>
      <Button onClick={onClose}>Close</Button>
    </Popup>
  </>
);

const PayPalButtonWrapper = ({ amount, userId, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{ "clientId": "ATCFEkRI4lCXYSceFX1O3WVIym-HN0raTtEpXUUH8hTDI5kmPbbaWqI6I0K6nLRap16jZJoO33HtcFy7" }}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          if (actions.order) {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: amount.toString(),
                },
                custom_id: userId,
              }],
            });
          }
          return Promise.reject(new Error("actions.order is undefined"));
        }}
        onApprove={async (data, actions) => {
          if (actions && actions.order) {
            return actions.order.capture().then(details => {
              console.log('Payment successful:', details);
              onSuccess(details);
            }).catch(error => {
              console.error('Capture error:', error);
              onError('Capture error. Please try again.');
              throw error; // Throw error to handle in onError
            });
          }
          return Promise.reject(new Error("actions.order is undefined"));
        }}
        onError={(err) => {
          console.error('PayPal payment error:', err);
          onError('PayPal payment error. Please try again.');
        }}
      />
    </PayPalScriptProvider>
  );
};

const PaymentComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subscriptionType, amount } = location.state as { subscriptionType: string, amount: number };

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [userHasPaid, setUserHasPaid] = useState(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Extract data from token
  const token = localStorage.getItem("token") || null;
  let userId = null;
  let username = null;

  if (token) {
    const tokenData = decodeToken(token);
    console.log('Token Data:', tokenData);

    userId = tokenData.userId;
    username = tokenData.username;

    console.log("User ID:", userId);
    console.log("Username:", username);
  }

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not defined.');
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getRequest("/user/" + userId, setLoading);
        console.log('Fetched user data:', result);
        setUser(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();

    const checkUserPaymentStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/payment-status/${userId}`);
        const { hasPaid, lastPaymentDate } = response.data;

        // Check if the subscription has expired
        const today:any = new Date();
        const lastPayment:any = new Date(lastPaymentDate);
        const diffTime = Math.abs(today - lastPayment);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
          // Subscription expired
          setUserHasPaid(false);
          await axios.post(`http://localhost:3000/user/update-payment-status`, { userId, hasPaid: false });
          setPopupMessage('Your subscription has expired. Please renew to continue.');
          setIsError(true);
          setShowPopup(true);
        } else {
          setUserHasPaid(hasPaid);

        }
      } catch (error) {
        console.error('Error fetching user payment status:', error);
      }
    };

    checkUserPaymentStatus();
  }, [userId]);

  const handlePaymentSuccess = async (details:any) => {
    try {
      console.log('Payment details:', details);
      
      if (!details.id || !details.payer) {
        throw new Error('Incomplete transaction details');
      }

      const response = await axios.post('http://localhost:3000/user/save-transaction', {
        userId: userId,
        username: username,
        email: details.payer.email_address,
        orderId: details.id,
        payerId: details.payer.payer_id,
        amount: amount,
        currency: 'USD',
      });
      console.log('Transaction saved:', response.data);

      setPopupMessage('Transaction completed successfully!');
      setIsError(false);
      setShowPopup(true);
      setUserHasPaid(true);
      toast.success('Transaction successful! Redirecting to profile...');

      
    } catch (error) {
      console.error('Failed to save transaction:', error);
      handlePaymentError('Failed to save transaction. Please try again.');
    }
  };

  const handlePaymentError = (message:any) => {
    setPopupMessage(message);
    setIsError(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide the popup after 3 seconds
  };

  return (
    <Layout hasHeader={false}>
      <Container>
        {!userHasPaid ? (
          <>
            <SubscriptionBox>
              <div>
                <Title>Proceed to Payment</Title>
                <Description>Your subscription type: {subscriptionType}</Description>
                <Description>UserID: {userId}</Description>
                <Description>Amount: ${amount}</Description>
                <Description>Pay with PayPal or Debit Card</Description>
                <PayPalButtonWrapper amount={amount} userId={userId} onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
              </div>
            </SubscriptionBox>
            {showPopup && <TransactionPopup message={popupMessage} onClose={() => setShowPopup(false)} isError={isError} />}
          </>
        ) : (
          <SubscriptionBox>
            <Title>Go back to Home</Title>
            <Description>Congratulatons you successfully subscribed hypemode.</Description>
          </SubscriptionBox>
        )}
      </Container>
    </Layout>
  );
};

export default PaymentComponent;
