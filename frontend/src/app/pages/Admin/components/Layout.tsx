import Navbar from './Navbar';

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      {/* You can add a Footer component here if needed */}
    </div>
  );
};

export default Layout;