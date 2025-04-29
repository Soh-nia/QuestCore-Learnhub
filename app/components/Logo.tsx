import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
      <Link href="/">
        <Image
            src="/Logo.png"
            width={150}
            height={50}
            alt="logo"
          />
      </Link>
  );
}

export function SideBarLogo() {
  return (
    <div className="px-6 pt-4 flex items-center mb-5 mt-10 lg:mt-0">
      <Link href="/">
        <Image
            src="/Logo.png"
            width={200}
            height={50}
            alt="logo"
          />
      </Link>
    </div>
  );
}
