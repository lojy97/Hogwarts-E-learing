import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/dummy', { withCredentials: true });
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          // Redirect using window.location.href on client-side only
          if (typeof window !== 'undefined') {
            alert('You are not authorized to view this page. Please log in.'); // Show an alert
            window.location.href = '/pages/auth/login';
          } else {
            setError('Authentication error'); // Indicate an error occurred
          }
        } else {
          setError('An unexpected error occurred'); // Handle other errors
          console.error('An error occurred:', err);
        }
      } finally {
        setIsLoading(false); // Update loading state
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;