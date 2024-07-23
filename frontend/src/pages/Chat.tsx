import { useState, useEffect, CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, serverTimestamp, remove, set } from 'firebase/database';
import { Layout } from "../components";
import { decodeToken } from '../utilities/helperfFunction';
import Modal from 'react-modal';
import '../App.css'; // Import CSS file

interface Order {
  description: string;
  price: string;
  type: string;
  deliveryTime: string;
}

interface FormErrors {
  description?: string;
  price?: string;
  type?: string;
  deliveryTime?: string;
}

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

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [newOrder, setNewOrder] = useState<Order>({
    description: "",
    price: "",
    type: "Script",
    deliveryTime: ""
  });
  const [username, setUsername] = useState<string>("anonymous");
  const [avatar, setAvatar] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenData = decodeToken(token);
      setUsername(tokenData.username);
      setAvatar(tokenData.avatar);
    }

    const chatRef = ref(database, `chats/${chatId}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const chatMessages = data ? Object.values(data.messages || {}) : [];
      const chatOrders = data ? Object.entries(data.orders || {}) : [];
      setMessages(chatMessages);
      setOrders(chatOrders);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching chat data:", error);
      setIsLoading(false);
    });
  }, [chatId]);

  const sendMessage = async () => {
    try {
      const chatRef = ref(database, `chats/${chatId}/messages`);
      await push(chatRef, {
        sender: username,
        avatar,
        message: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createOrder = async () => {
    try {
      let formErrors: FormErrors = {};
      if (!newOrder.description) {
        formErrors.description = "Description is required";
      }
      if (!newOrder.price) {
        formErrors.price = "Price is required";
      }
      if (!newOrder.type) {
        formErrors.type = "Type is required";
      }
      if (!newOrder.deliveryTime) {
        formErrors.deliveryTime = "Delivery Time is required";
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      const ordersRef = ref(database, `chats/${chatId}/orders`);
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, {
        description: newOrder.description,
        price: newOrder.price,
        type: newOrder.type,
        deliveryTime: newOrder.deliveryTime,
        status: "pending"
      });
      setNewOrder({
        description: "",
        price: "",
        type: "Script",
        deliveryTime: ""
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const orderRef = ref(database, `chats/${chatId}/orders/${orderId}/status`);
      await set(orderRef, "accepted");
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const withdrawOrder = async (orderId: string) => {
    try {
      const orderRef = ref(database, `chats/${chatId}/orders/${orderId}`);
      await remove(orderRef);
    } catch (error) {
      console.error("Error withdrawing order:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout expand={false} hasHeader={false}>
      <div style={styles.chatContainer}>
        <div style={styles.messageBox}>
          {messages.map((msg, index) => (
            <div key={index} style={styles.message}>
              <img src={msg.avatar} alt={msg.sender} style={styles.avatar} />
              <div style={styles.messageContent}>
                <span style={msg.sender === username ? styles.mySender : styles.otherSender}>
                  {msg.sender}
                </span>
                <div style={styles.messageText}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.orderContainer}>
          {orders.map(([orderId, order], index) => (
            <div key={index} style={styles.order}>
              <div>Description: {order.description}</div>
              <div>Price: {order.price}</div>
              <div>Type: {order.type}</div>
              <div>Delivery Time: {order.deliveryTime}</div>
              <div>Status: {order.status}</div>
              {order.status === "pending" && (
                <>
                  <button onClick={() => acceptOrder(orderId)} style={styles.acceptButton}>
                    Accept Order
                  </button>
                  <button onClick={() => withdrawOrder(orderId)} style={styles.withdrawButton}>
                    Withdraw Order
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>Send</button>
          <button onClick={() => setIsModalOpen(true)} style={styles.createOfferButton}>Create Offer</button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={modalStyles}
        >
          <h3>Create New Order</h3>
          <div style={styles.modalContent}>
            <label>Description:</label>
            <input
              type="text"
              value={newOrder.description}
              onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
              style={styles.input}
            />
            {errors.description && <div style={styles.errorText}>{errors.description}</div>}
            
            <label>Price:</label>
            <input
              type="text"
              value={newOrder.price}
              onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
              style={styles.input}
            />
            {errors.price && <div style={styles.errorText}>{errors.price}</div>}
            
            <label>Type:</label>
            <select
              value={newOrder.type}
              onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value })}
              style={styles.select}
            >
              <option value="Script">Script</option>
              <option value="Design">Design</option>
              <option value="Content">Content</option>
            </select>
            {errors.type && <div style={styles.errorText}>{errors.type}</div>}
            
            <label>Delivery Time:</label>
            <input
              type="text"
              value={newOrder.deliveryTime}
              onChange={(e) => setNewOrder({ ...newOrder, deliveryTime: e.target.value })}
              style={styles.input}
            />
            {errors.deliveryTime && <div style={styles.errorText}>{errors.deliveryTime}</div>}
            
            <button onClick={createOrder} style={styles.createOfferButton}>Create Order</button>
            <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>Close</button>
          </div>
        </Modal>
        <Modal
          isOpen={isPaymentSuccessModalOpen}
          onRequestClose={() => setIsPaymentSuccessModalOpen(false)}
          style={modalStyles}
        >
          <h3>Payment Successful</h3>
          <p>Your payment has been successfully processed.</p>
          <button onClick={() => setIsPaymentSuccessModalOpen(false)} style={styles.closeButton}>Close</button>
        </Modal>
      </div>
    </Layout>
  );
};

const styles: { [key: string]: CSSProperties } = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '10px',
    marginTop: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  messageBox: {
    border: '1px solid #e5e5e5',
    padding: '10px',
    flex: 1,
    overflowY: 'auto',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  mySender: {
    color: '#007bff',
  },
  otherSender: {
    color: '#333',
  },
  messageText: {
    marginTop: '5px',
    padding: '5px 10px',
    borderRadius: '5px',
    backgroundColor: '#f1f1f1',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #e5e5e5',
    borderRadius: '5px',
    marginRight: '10px',
    outline: 'none',
    marginBottom: '10px',  // Adjust margin for spacing
  },
  sendButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '10px',  // Adjust margin for spacing
  },
  createOfferButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    marginBottom: '10px',  // Adjust margin for spacing
  },
  orderContainer: {
    marginTop: '20px',
  },
  order: {
    border: '1px solid #e5e5e5',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
  },
  acceptButton: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  withdrawButton: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ffc107',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  closeButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  select: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #e5e5e5',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  errorText: {
    color: 'red',
    marginBottom: '5px',
  },
};

const modalStyles: { content: CSSProperties } = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    width: '80%', // Increase the width of the modal
    maxWidth: '500px',
    maxHeight: '500px', // Maximum width of the modal
    marginTop: '50px', // Add margin top here
  },
};

export default Chat;
