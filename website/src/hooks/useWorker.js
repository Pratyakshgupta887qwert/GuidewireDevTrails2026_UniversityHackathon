import { useState, useEffect } from 'react';

export const useWorker = () => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockWorkerData = {
      id: 'W12345',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      zone: 'South Delhi',
      dailyEarnings: 850,
      expectedEarnings: 8500,
      totalEarningsProtected: 2450,
      riskScore: 'Medium Risk',
      activePolicy: true,
      policyEndDate: '2026-03-22',
      trustScore: 92,
      completedDeliveries: 1250,
      claimsProcessed: 5,
    };

    setTimeout(() => {
      setWorker(mockWorkerData);
      setLoading(false);
    }, 500);
  }, []);

  return { worker, loading, error };
};