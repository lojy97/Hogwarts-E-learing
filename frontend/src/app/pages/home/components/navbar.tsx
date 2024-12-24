import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '10px', 
      background: '#333', // Dark gray background
      color: '#fff' // White text
    }}>
      <div className="text-xl font-bold">
          <Link href="/">Hogwarts-E-learning</Link>
        </div>
      <div>
        <Link href="auth/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
        <Link href="auth/signup" style={{ color: '#fff', marginLeft: '15px', textDecoration: 'none' }}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
