'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import { UserPlus } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function GroupPage() {
    const params = useParams();
    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchGroup = async () => {
            const idToFetch = typeof params.id === 'string' ? params.id : params.id?.[0];
            if (!idToFetch) return;

            const { data, error } = await supabase
                .from('groups')
                .select('*')
                .eq('id', idToFetch)
                .single();

            if (data && !error) setGroup(data);
            setLoading(false);
        };
        fetchGroup();
    }, [params.id, supabase]);

    if (!loading && !group) return notFound();

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
                            {loading ? "Loading Parlor..." : group?.name}
                        </h1>
                        <p className="text-script" style={{ fontSize: '1.75rem', color: 'var(--ink)', background: 'rgba(253, 248, 240, 0.85)', padding: '0.25rem 1rem', display: 'inline-block', borderRadius: 'var(--radius-lg)', margin: 0 }}>
                            {loading ? "" : `A private parlor for group members`}
                        </p>
                    </div>
                    <div className="flourish"></div>
                </header>

                <section>
                    <div className="card card-parchment animate-fade-in" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--ink)' }}>
                            This space is reserved for hushed conversations within the {group?.name}.
                        </p>
                        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'center' }}>
                            <button
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
                                onClick={() => {
                                    alert("Invitation sent via Lady Whistledown's courier!");
                                }}
                            >
                                <UserPlus size={18} /> Invite a Member
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
