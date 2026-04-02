import React from 'react';
import PolicyMarket from './PolicyMarket';

const PolicyTiers = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PolicyMarket onPurchase={() => console.log("Policy Purchased")} />
    </div>
  );
};

export default PolicyTiers;
