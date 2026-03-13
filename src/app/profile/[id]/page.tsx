'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function PublicProfile() {
    const params = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const idToFetch = typeof params.id === 'string' ? params.id : params.id?.[0];
            if (!idToFetch) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', idToFetch)
                .single();

            if (data && !error) {
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [params.id, supabase]);

    if (!loading && !profile) return notFound();

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundImage: 'url("/aesthetics/Profile.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            <div className="container container-narrow" style={{ paddingBottom: 'var(--space-3xl)', paddingTop: 'var(--space-3xl)' }}>
                <div className="card card-parchment animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
                        <div className="cameo cameo-lg" style={{ background: 'var(--duck-egg)' }}>
                            {profile?.gender === 'man' ? (
                                <img src="/aesthetics/man_profile_pic.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : profile?.gender === 'woman' ? (
                                <img src="/aesthetics/woman_profile_pic.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                profile?.display_name?.slice(0, 1) || '?'
                            )}
                        </div>
                    </div>

                    <h1 className="text-display" style={{ fontSize: '3rem', marginBottom: 'var(--space-xs)', color: 'var(--ink)' }}>
                        {profile?.title ? `${profile.title} ` : ''}{profile?.display_name}
                    </h1>
                    
                    <p className="text-script" style={{ fontSize: '1.75rem', color: 'var(--wisteria)', marginBottom: 'var(--space-xl)' }}>
                        {profile?.bio || 'A mysterious member of the Ton...'}
                    </p>

                    <div className="flourish"></div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-xl)' }}>
                        <div style={{ textAlign: 'left' }}>
                            <h3 className="text-display" style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: 'var(--space-xs)' }}>Interests</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                                {profile?.interests?.length > 0 ? profile.interests.map((i: string) => (
                                    <span key={i} className="tag" style={{ border: '1px solid var(--wisteria)', color: 'var(--ink)' }}>{i}</span>
                                )) : <span style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>None disclosed</span>}
                            </div>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h3 className="text-display" style={{ fontSize: '1.25rem', color: 'var(--gold)', marginBottom: 'var(--space-xs)' }}>Timezone</h3>
                            <p style={{ color: 'var(--ink)', fontSize: '1.1rem' }}>{profile?.timezone || 'GMT (London)'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
