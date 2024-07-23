import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HypemodeGallery} from "../components";
import { MdForwardToInbox } from "react-icons/md";
import { Layout } from "../components";
import { getRequest } from "../api";
import { decodeToken } from "../utilities/helperfFunction";
import Modal from 'react-modal';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database'

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
const database = getDatabase(app);

const GenrePage: React.FC = () => {
  const [setLoading] = useState<any>({});
  const [setUser] = useState<any>({});
  const [userHasPaid, setUserHasPaid] = useState(false);
  const [showPaidUsersModal, setShowPaidUsersModal] = useState(false);
  const [paidUsers, setPaidUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || null;
  let userId: string | null = null;
  let username: string | null = null;

  if (token) {
    const tokenData = decodeToken(token);
    userId = tokenData.userId;
    username = tokenData.username;
  }

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not defined.');
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getRequest(`/user/${userId}`, setLoading);
        setUser(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const checkUserPaymentStatus = async () => {
      try {
        const response = await axios.get(`https://wecinema.onrender.com/user/payment-status/${userId}`);
        const { hasPaid } = response.data;
        setUserHasPaid(hasPaid);
      } catch (error) {
        console.error('Error fetching user payment status:', error);
      }
    };

    const fetchPaidUsers = async () => {
      try {
        const response = await axios.get(`https://wecinema.onrender.com/user/paid-users`);
        const users = response.data;
        const filteredUsers = users.filter((paidUser: any) => paidUser._id !== userId);
        setPaidUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching paid users:', error);
      }
    };

    fetchData();
    checkUserPaymentStatus();
    fetchPaidUsers();
  }, [userId]);

  const handleCloseModal = () => {
    setShowPaidUsersModal(false);
    navigate('/hypemodeprofile');
  };

  const handleOpenPaidUsersModal = () => {
    setShowPaidUsersModal(true);
  };

  const startChat = (chatUserId: string) => {
    if (!userId || !chatUserId) {
      console.error('User ID or Chat User ID is not defined.');
      return;
    }

    const chatId = userId > chatUserId ? `${userId}_${chatUserId}` : `${chatUserId}_${userId}`;
    const chatRef = ref(database, `chats/${chatId}`);
    push(chatRef, {
      sender: username,
      message: "Hello!",
      timestamp: serverTimestamp()
    });
    navigate(`/chat/${chatId}`);
  };

  return (
    <Layout expand={false} hasHeader={false}>
      <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 999 }}>
        <button onClick={handleOpenPaidUsersModal} style={{
          padding: '5px 12px',
          background: '#f1c40f	',
          color: '#fff',
          border: 'none',
          borderRadius: '',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}>
          <MdForwardToInbox size="40"  />
        </button>
      </div>

      <Modal
        isOpen={showPaidUsersModal && userHasPaid}
        onRequestClose={handleCloseModal}
        contentLabel="Paid Users"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#f9f9f9',
            color: '#000',
            padding: '20px',
            borderRadius: '10px',
            border: 'none',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto',
          },
        }}
      >
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {paidUsers.map((paidUser) => (
            <li key={paidUser._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <Link to={`/user/${paidUser._id}`}>
                <img src={paidUser.avatar} alt={`${paidUser.username}'s avatar`} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
              </Link>
              <span style={{ fontWeight: 'bold' }}>{paidUser.username}</span>
              <button onClick={() => startChat(paidUser._id)} style={{
                marginLeft: '10px',
                padding: '5px 10px',
                background: '#f1c40f',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}>Start Chat</button>
            </li>
          ))}
        </ul>
        <button onClick={handleCloseModal} style={{ marginTop: '20px', padding: '10px 20px', background: '#f1c40f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Close
        </button>
      </Modal>

      {!userHasPaid && (
        <Modal
          isOpen={showPaidUsersModal}
          onRequestClose={handleCloseModal}
          contentLabel="Subscribe Now"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              color: '#fff',
              padding: '20px',
              borderRadius: '10px',
              border: 'none',
            },
          }}
        >
          <h2 style={{ marginBottom: '20px' }}>Subscribe to Access This Profile</h2>
          <p>You need to subscribe to access this profile.</p>
          <button onClick={handleCloseModal} style={{ marginTop: '20px', padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Close
          </button>
        </Modal>
      )}
                        			<HypemodeGallery title="Action" category="Action" length={5} isFirst />
			<HypemodeGallery title="Comedy" length={5} category="Comedy" />
			<HypemodeGallery title="Horror" length={5} category="Horror" />
			<HypemodeGallery title="Drama" length={5} category="Drama" />
			<HypemodeGallery title="Romance" length={5} category="Romance" />
			<HypemodeGallery title="Mystery" length={5} category="Mystery" />
			<HypemodeGallery title="Adventure" length={5} category="Adventure" />
			<HypemodeGallery title="Thriller " length={5} category="Thriller" />

    </Layout>
  );
};

export default GenrePage;