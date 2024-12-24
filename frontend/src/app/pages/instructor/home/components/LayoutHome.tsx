import { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarHome from './NavbarHome';
import { ReactNode } from 'react';

const LayoutHome = ({ children }: { children: ReactNode }) => {
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
            alert('You are not authorized to view this page. Please log in.');
            window.location.href = '/pages/auth/login';
          } else {
            setError('Authentication error');
          }
        } else {
          setError('An unexpected error occurred');
          console.error('An error occurred:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarHome />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default LayoutHome;
