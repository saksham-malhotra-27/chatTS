import React, { PropsWithChildren } from 'react';
import Nav from './Nav';
import Footer from './Footer';

type LayoutProps = PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
