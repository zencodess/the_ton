'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import { Edit2, Save } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [timezone, setTimezone] = useState('');
    const [interestsText, setInterestsText] = useState('');
    const [bio, setBio] = useState('A mysterious member of the Ton...');
    const [displayName, setDisplayName] = useState('Anonymous');
    const [title, setTitle] = useState('');
    const [gender, setGender] = useState('other');

    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            // Use the fallback display name from metadata if no profile row yet
            setDisplayName(userData.user.user_metadata?.display_name || 'Anonymous');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.user.id)
                .single();

            if (data && !error) {
                setProfile(data);
                if (data.timezone) setTimezone(data.timezone);
                if (data.interests) setInterestsText(data.interests.join(", "));
                if (data.bio) setBio(data.bio);
                if (data.display_name) setDisplayName(data.display_name);
                if (data.title) setTitle(data.title);
                if (data.gender) setGender(data.gender);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    const handleSave = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { error } = await supabase.from('profiles').upsert({
            id: userData.user.id,
            display_name: displayName,
            bio: bio,
            timezone: timezone,
            interests: interestsText.split(',').map(i => i.trim()).filter(Boolean),
            title: title,
            gender: gender
        });

        if (error) {
            alert('Failed to save calling card details.');
            console.error(error);
        } else {
            setIsEditing(false);
        }
        setLoading(false);
    };

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundImage: 'url("/aesthetics/Profile.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            <div className="container container-narrow" style={{ paddingBottom: 'var(--space-3xl)', paddingTop: 'var(--space-2xl)' }}>
                <header className={styles.pageHeader} style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                        <div className="cameo cameo-lg" style={{ background: 'var(--duck-egg)' }}>
                            {gender === 'man' ? (
                                <img src="/aesthetics/man_profile_pic.png" alt="Man Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : gender === 'woman' ? (
                                <img src="/aesthetics/woman_profile_pic.png" alt="Woman Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                displayName.slice(0, 1)
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <select
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input"
                                style={{ width: 'auto', textAlign: 'center', background: 'transparent', border: '1px dashed var(--wisteria)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)' }}
                            >
                                <option value="">No Title</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="King">King</option>
                                <option value="Queen">Queen</option>
                                <option value="Prince">Prince</option>
                                <option value="Princess">Princess</option>
                                <option value="Duke">Duke</option>
                                <option value="Duchess">Duchess</option>
                                <option value="Marquess">Marquess</option>
                                <option value="Marchioness">Marchioness</option>
                                <option value="Count/Earl">Count/Earl</option>
                                <option value="Countess">Countess</option>
                                <option value="Viscount">Viscount</option>
                                <option value="Viscountess">Viscountess</option>
                                <option value="Baron">Baron</option>
                                <option value="Baroness">Baroness</option>
                            </select>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="text-display animate-fade-in input"
                                style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)', color: 'var(--ink)', textAlign: 'center', background: 'transparent', border: '1px dashed var(--wisteria)' }}
                            />
                        </div>
                    ) : (
                        <h1 className="text-display animate-fade-in" style={{ marginBottom: 'var(--space-sm)', color: 'var(--ink)' }}>
                            {title ? `${title} ` : ''}{displayName}
                        </h1>
                    )}

                    {isEditing ? (
                        <input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="text-script input"
                            style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center', background: 'transparent', border: '1px dashed var(--wisteria)', width: '80%' }}
                        />
                    ) : (
                        <p className="text-script" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                            {bio}
                        </p>
                    )}
                    <div className="flourish"></div>
                </header>

                <section>
                    <h2 className="text-display" style={{ marginBottom: 'var(--space-md)', color: 'var(--ink)' }}>Your Calling Card</h2>
                    <div className="card card-parchment animate-fade-in" style={{ marginBottom: 'var(--space-xl)' }}>

                        {!isEditing ? (
                            <>
                                <p style={{ color: 'var(--ink)' }}><strong>Timezone:</strong> {timezone}</p>
                                <div style={{ marginTop: 'var(--space-md)' }}>
                                    <strong style={{ color: 'var(--ink)' }}>Interests:</strong>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
                                        {interestsText.split(',').map(interest => interest.trim()).filter(Boolean).map(interest => (
                                            <span key={interest} className="tag" style={{ border: '1px solid var(--wisteria)', color: 'var(--ink)' }}>{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--ink)' }}><strong>Gender:</strong></label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                                    >
                                        <option value="man">Man</option>
                                        <option value="woman">Woman</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--ink)' }}><strong>Timezone:</strong></label>
                                    <input
                                        type="text"
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', color: 'var(--ink)' }}><strong>Interests (comma separated):</strong></label>
                                    <input
                                        type="text"
                                        value={interestsText}
                                        onChange={(e) => setInterestsText(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 'var(--space-lg)' }}>
                            <button
                                className={isEditing ? "btn btn-primary" : "btn btn-outline"}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)' }}
                                onClick={handleSave}
                                disabled={loading && isEditing}
                            >
                                {loading && isEditing ? "Saving..." : isEditing ? <><Save size={18} /> Save Details</> : <><Edit2 size={18} /> Edit Details</>}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
