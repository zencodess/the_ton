'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Coffee, Users, MessageCircleHeart, UserRound, LogOut, Settings } from 'lucide-react';
import styles from './Navbar.module.css';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [initial, setInitial] = useState('A');
    const [gender, setGender] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
                // Try to get from profile first
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('display_name, gender')
                    .eq('id', userData.user.id)
                    .single();

                if (profileData?.display_name) {
                    setInitial(profileData.display_name.charAt(0).toUpperCase());
                }
                if (profileData?.gender) {
                    setGender(profileData.gender);
                } else if (userData.user.user_metadata?.display_name) {
                    setInitial(userData.user.user_metadata.display_name.charAt(0).toUpperCase());
                } else if (userData.user.email) {
                    setInitial(userData.user.email.charAt(0).toUpperCase());
                }
            }
        };
        fetchUser();
    }, []);

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
                    <li>
                        <Link href="/settings" className={styles.navLink}>
                            <Settings size={18} />
                            Settings
                        </Link>
                    </li>
                </ul>

                <div className={styles.navProfile} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/profile">
                        {gender === 'man' ? (
                            <img src="/aesthetics/man_profile_pic.png" alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--wisteria)' }} />
                        ) : gender === 'woman' ? (
                            <img src="/aesthetics/woman_profile_pic.png" alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--wisteria)' }} />
                        ) : (
                            <div className="cameo cameo-sm">{initial}</div>
                        )}
                    </Link>
                    <button
                        onClick={async () => {
                            const sb = createClient();
                            await sb.auth.signOut();
                            window.location.href = '/login';
                        }}
                        title="Log Out"
                        style={{ background: 'none', border: 'none', color: 'var(--wisteria)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <LogOut size={22} />
                    </button>
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
