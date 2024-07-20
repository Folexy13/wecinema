import  { useState } from 'react';
import '../components/header/drowpdown.css';
import axios from 'axios';
import {  Layout } from "../components";
const CustomerCarePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/user/contact', formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setError('');
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
		<Layout expand={false} hasHeader={false}>

    <div className="contact-form-container">
      <h2>Contact Us</h2>
      {isSubmitted && <div className="success-message">Message sent successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>

      <div className="whatsapp-button">
        <a href="https://wa.me/1234567890?text=Hello!%20I%20need%20help%20with%20customer%20care." target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
        </a>
      </div>
    </div>
</Layout>

  );
};


export default CustomerCarePage;
