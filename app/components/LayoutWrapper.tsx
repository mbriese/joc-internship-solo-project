'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide NavBar only on homepage
    const showNavBar = pathname !== '/';

    return (
        <>
            {showNavBar && <NavBar />}
            {children}
        </>
    );
}
