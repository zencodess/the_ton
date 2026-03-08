'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "@/app/page.module.css";
import { Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SocietiesPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchGroups = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    group_id,
                    groups (
                        id,
                        name
                    )
                `)
                .eq('user_id', userData.user.id);

            if (data && !error) {
                // Format the result to match the expected structure
                const formattedGroups = data.map((d: any) => ({
                    id: d.groups.id,
                    name: d.groups.name,
                    member_count: "Many" // Count requires a separate function or complex join in Supabase
                }));
                setGroups(formattedGroups);
            }
            setLoading(false);
        };
        fetchGroups();
    }, [supabase]);

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundImage: 'url("/aesthetics/Group_1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <header className={styles.pageHeader} style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <h1 className="text-display animate-fade-in" style={{ fontSize: '3rem', color: 'var(--ink)', margin: 0, background: 'rgba(253, 248, 240, 0.85)', padding: '0.5rem 1rem', display: 'inline-block', borderRadius: 'var(--radius-lg)' }}>
                            Societies
                        </h1>
                        <p className="text-script" style={{ fontSize: '1.75rem', color: 'var(--ink)', background: 'rgba(253, 248, 240, 0.85)', padding: '0.25rem 1rem', display: 'inline-block', borderRadius: 'var(--radius-lg)', margin: 0 }}>
                            Exclusive groups within the Ton
                        </p>
                    </div>
                    <div className="flourish"></div>
                </header>

                <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--ink)' }}>Searching the parlor...</p>
                    ) : groups.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--ink)' }}>You are not a member of any societies yet.</p>
                    ) : (
                        groups.map((group) => (
                            <Link href={`/groups/${group.id}`} key={group.id} style={{ textDecoration: 'none' }}>
                                <div className="card animate-fade-in" style={{
                                    padding: 'var(--space-xl)',
                                    background: 'rgba(253, 248, 240, 0.95)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: '1px solid transparent'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.border = '1px solid var(--wisteria)'}
                                    onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
                                >
                                    <div>
                                        <h3 className="text-display" style={{ fontSize: '1.5rem', color: 'var(--ink)', marginBottom: 'var(--space-xs)' }}>
                                            {group.name}
                                        </h3>
                                        <p style={{ color: 'var(--ink-light)', margin: 0 }}>
                                            Private Parlor
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--wisteria)', background: 'var(--dusty-rose)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                                        <Users size={16} />
                                        <span>{group.member_count} Members</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}
