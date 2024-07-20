// App.js
import React, { useState } from 'react';
import GoogleSignInComponent from './hypemodepage';
import SubscriptionSelectionComponent from './subscription';
import PaymentComponent from './payment';

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleLoginSuccess = (response:any) => {
    console.log('Login Successful:', response);
    setUser(response.profileObj);
  };

  const handleLoginFailure = (response:any) => {
    console.error('Login Failed:', response);
  };

  const handleSelectPlan = (plan:any) => {
    setSelectedPlan(plan);
  };

  return (
    <div>
      {!user && (
        <GoogleSignInComponent
          onLoginSuccess={handleLoginSuccess}
          onLoginFailure={handleLoginFailure}
        />
      )}
      {user && !selectedPlan && (
        <SubscriptionSelectionComponent onSelectPlan={handleSelectPlan} />
      )}
      {user && selectedPlan && (
        <PaymentComponent plan={selectedPlan} />
      )}
    </div>
  );
};

export default App;
