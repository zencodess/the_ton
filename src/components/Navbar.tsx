'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Coffee, Users, MessageCircleHeart, UserRound } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <nav className={styles.navbar}>
                <Link href="/" className={styles.navBrand}>
                    The <span>Ton</span>
                </Link>

                <ul className={styles.navLinks}>
                    <li>
                        <Link href="/" className={styles.navLink}>
                            <Coffee size={18} />
                            Letters for you
                        </Link>
                    </li>
                    <li>
                        <Link href="/groups" className={styles.navLink}>
                            <Users size={18} />
                            Societies
                        </Link>
                    </li>
                    <li>
                        <Link href="/whispers" className={styles.navLink}>
                            <MessageCircleHeart size={18} />
                            My Whispers
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" className={styles.navLink}>
                            <UserRound size={18} />
                            Calling Card
                        </Link>
                    </li>
                </ul>

                <div className={styles.navProfile}>
                    <Link href="/profile">
                        <div className="cameo cameo-sm">A</div>
                    </Link>
                </div>

                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>
            </nav>

            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
                <Link
                    href="/"
                    className={styles.navLink}
                    onClick={() => setMobileOpen(false)}
                >
                    <Coffee size={18} /> Letters for you
                </Link>
                <Link
                    href="/groups"
                    className={styles.navLink}
                    onClick={() => setMobileOpen(false)}
                >
                    <Users size={18} /> Societies
                </Link>
                <Link
                    href="/whispers"
                    className={styles.navLink}
                    onClick={() => setMobileOpen(false)}
                >
                    <MessageCircleHeart size={18} /> My Whispers
                </Link>
                <Link
                    href="/profile"
                    className={styles.navLink}
                    onClick={() => setMobileOpen(false)}
                >
                    <UserRound size={18} /> Calling Card
                </Link>
            </div>
        </>
    );
}
