import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import Navbar from './navbar';
import { ReactNode } from 'react';

function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // You can add logic here to run after every route change if needed
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    const checkAuth = () => {
      const authToken = Cookies.get('auth_token');
      if (!authToken) {
        if (typeof window !== 'undefined') {
          alert('You are not logged in');
          window.location.href = '/pages/auth/login'; // Default redirect
        }
      }
    };

    checkAuth(); // Initial check on mount

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]); // Depend only on the router
}

const Layout = ({ children }: { children: ReactNode }) => {
  useRequireAuth(); // Use the hook in the Layout component

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;