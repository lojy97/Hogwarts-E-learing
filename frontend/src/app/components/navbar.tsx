import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-[#1e1e1e] p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Hogwarts-E-learing
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/pages/auth/login" className="hover:text-gray-300">
              Login
            </Link>
          </li>
          <li>
            <Link href="/pages/auth/signup" className="hover:text-gray-300">
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;