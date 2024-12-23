import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[#202020] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Hogwarts-E-learning</Link>
        </div>
        <div className="flex space-x-6">
          <Link href="/pages/student/courses" className="hover:text-gray-400">Courses</Link>
          <Link href="/pages/student/chats" className="hover:text-gray-400">Chats</Link>
          <Link href="/pages/notifications" className="hover:text-gray-400">Notifications</Link>
          <Link href="/pages/student/profile" className="hover:text-gray-400">Profile</Link>
          <Link href="/logout" className="hover:text-gray-400">Sign Out</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
