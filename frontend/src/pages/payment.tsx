import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from "../components";
import styled from 'styled-components';
import axios from 'axios';
import { decodeToken } from "../utilities/helperfFunction";
import { getRequest } from "../api"; // Assuming getRequest is used for fetching data
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PayPalButtonWrapper from './PayPalButtonWrapper'; // Import updated PayPalButtonWrapper

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

interface TransactionPopupProps {
  message: string;
  onClose: () => void;
  isError: boolean;
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({ message, onClose, isError }) => (
  <>
    <Overlay onClick={onClose} />
    <Popup>
      <h3>{isError ? 'Error' : 'Success'}!</h3>
      <p>{message}</p>
      <Button onClick={onClose}>Close</Button>
    </Popup>
  </>
);

const PaymentComponent = () => {
  const location = useLocation();
  const { subscriptionType, amount } = location.state as { subscriptionType: string, amount: number };

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [userHasPaid, setUserHasPaid] = useState(false);
  const [setLoading] = useState<any>({});
  const [setUser] = useState<any>({});

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
        const response = await axios.get(`https://wecinema.onrender.com/user/payment-status/${userId}`);
        const { hasPaid, lastPaymentDate } = response.data;

        // Check if the subscription has expired
        const today:any = new Date();
        const lastPayment:any = new Date(lastPaymentDate);
        const diffTime = Math.abs(today - lastPayment);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
          // Subscription expired
          setUserHasPaid(false);
          await axios.post(`https://wecinema.onrender.com/user/update-payment-status`, { userId, hasPaid: false });
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

      const response = await axios.post('https://wecinema.onrender.com/user/save-transaction', {
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
    <Layout expand={false} hasHeader={false}>
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
            <Description>Congratulations, you successfully subscribed to hypemode.</Description>
          </SubscriptionBox>
        )}
      </Container>
    </Layout>
  );
};

export default PaymentComponent;
