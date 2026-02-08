"use client";

import React from 'react';

export default function WhopLogin() {
  const loginWithWhop = () => {
    const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/callback');
    const whopUrl = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
    window.location.href = whopUrl;
  };

  return (
    <button 
      onClick={loginWithWhop}
      className="whop-login-btn"
    >
      Login with Whop
    </button>
  );
}
