import { SessionProvider } from 'next-auth/react';
import SideBar from './_components/SideBar';


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="h-screen">
        <SideBar />
        <div className="w-full lg:ps-64">
          <div className="my-2 p-4 sm:p-6 space-y-4 sm:space-y-6">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}