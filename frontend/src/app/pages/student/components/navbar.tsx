import Link from 'next/link';
import Cookies from 'js-cookie'; // Import js-cookie
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Navbar = () => {
  const router = useRouter();

  const handleSignOut = async()  => {
    try {
      // Make a POST request to signout
      await axios.post('http://localhost:3001/auth/signout', {}, { withCredentials: true });

      // Clear client-side cookies
      Cookies.remove('userId');
      Cookies.remove('userRole');
      Cookies.remove('userName');

      // Redirect to login page
      router.push('/pages/auth/login');
    } catch (error) {
      console.error('Error during signout:', error);
    }
  };

  return (
    <nav className="bg-[#1e1e1e] p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Hogwarts-E-learing
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/pages/student/home" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/pages/student/courses" className="hover:text-gray-300">
              Courses
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-300">
              Chat
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-300">
              Notifications
            </Link>
          </li>
          <li>
            <Link href="/pages/student/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </li>
          <li>
            <a href="#" onClick={handleSignOut} className="hover:text-gray-300">
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;