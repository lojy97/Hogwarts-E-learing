import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f5f5f5' }}>
      <div>
        <Link href="/"><a>Home</a></Link>
        <Link href="/courses"><a style={{ marginLeft: '15px' }}>Courses</a></Link>
        <Link href="/instructors"><a style={{ marginLeft: '15px' }}>Instructors</a></Link>
      </div>
      <div>
        <Link href="/login"><a>Login</a></Link>
        <Link href="/signup"><a style={{ marginLeft: '15px' }}>Sign Up</a></Link>
      </div>
    </nav>
  );
};

export default Navbar;
