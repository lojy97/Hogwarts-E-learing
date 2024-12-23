import Navbar from './homenav';
import { ReactNode } from 'react';

const LayoutWithoutHome = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
   
    </div>
  );
};

export default LayoutWithoutHome;