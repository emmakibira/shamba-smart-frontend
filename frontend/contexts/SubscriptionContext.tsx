
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  communityPostsThisMonth: number;
  maxCommunityPosts: number;
  canPostToCommunity: boolean;
  addCommunityPost: () => void;
  upgradeToPremium: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [communityPostsThisMonth, setCommunityPostsThisMonth] = useState(2);

  const maxCommunityPosts = isPremium ? Infinity : 5;
  const canPostToCommunity = isPremium || communityPostsThisMonth < maxCommunityPosts;

  const addCommunityPost = () => {
    if (canPostToCommunity) {
      setCommunityPostsThisMonth(prev => prev + 1);
    }
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        communityPostsThisMonth,
        maxCommunityPosts,
        canPostToCommunity,
        addCommunityPost,
        upgradeToPremium,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}