import React from 'react';

// Define the types for the props expected by the component
interface PlanSelectorProps {
  onSelectPlan: (planId: string) => void;  // Assuming 'planId' is a string identifier for the plan
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ onSelectPlan }) => {
  return (
    <div>
      <button onClick={() => onSelectPlan("basic")}>Select Basic Plan</button>
      <button onClick={() => onSelectPlan("premium")}>Select Premium Plan</button>
    </div>
  );
};

export default PlanSelector;
