'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import { PenTool } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function MyWhispers() {
    const [feed, setFeed] = useState<any[]>([]);
    const [isComposing, setIsComposing] = useState(false);
    const [newWhisperText, setNewWhisperText] = useState("");
    const [loading, setLoading] = useState(true);
    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const supabase = createClient();

    useEffect(() => {
        const fetchWhispers = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            // Fetch user's groups for the dropdown when composing
            const { data: groupMemberData } = await supabase
                .from('group_members')
                .select('group_id, groups(id, name)')
                .eq('user_id', userData.user.id);

            if (groupMemberData) {
                const groups = groupMemberData.map((gm: any) => gm.groups).filter(Boolean);
                setUserGroups(groups);
                if (groups.length > 0) setSelectedGroupId(groups[0].id);
            }

            const { data, error } = await supabase
                .from('whispers')
                .select('*, groups(name)')
                .eq('author_id', userData.user.id)
                .order('created_at', { ascending: false });

            if (data && !error) setFeed(data);
            setLoading(false);
        };
        fetchWhispers();
    }, []);

    const handleSubmit = async () => {
        if (!newWhisperText.trim()) return;

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        // The 'groups' table has a foreign key to 'profiles'. 
        // We must ensure the user has a profile row before they can create a group.
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: userData.user.id,
            display_name: userData.user.user_metadata?.display_name || 'Anonymous'
        });

        if (profileError) {
            console.error("Profile creation error:", profileError);
            alert("Database error: Could not confirm your identity profile. \n" + JSON.stringify(profileError, null, 2));
            return;
        }

        // Fetch the selected group (from the dropdown) or fall back to first group
        let targetGroupId = selectedGroupId;

        if (!targetGroupId) {
            const { data: groupData } = await supabase.from('group_members').select('group_id').eq('user_id', userData.user.id).limit(1).single();
            targetGroupId = groupData?.group_id;
        }

        // We no longer auto-create a fallback group — user should create/join one first.
        if (!targetGroupId) {
            alert('You are not in any society yet. Please create or join one from the Societies page.');
            return;
        }

        if (targetGroupId) {
            try {
                const response = await fetch('/api/whispers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        group_id: targetGroupId,
                        content: newWhisperText
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    const groupName = userGroups.find(g => g.id === targetGroupId)?.name || 'Society';
                    const localWhisperData = {
                        id: data.id,
                        group_id: targetGroupId,
                        author_id: userData.user.id,
                        content: newWhisperText,
                        created_at: new Date().toISOString(),
                        groups: { name: groupName }
                    };
                    setFeed([localWhisperData, ...feed]);
                    setNewWhisperText("");
                    setIsComposing(false);
                } else {
                    console.error("Whisper submission API error:", data);
                    if (data.strike) {
                        alert("⚠️ COMMUNITY GUIDELINE VIOLATION\n\n" + data.error);
                    } else {
                        alert("Failed to deliver whisper: " + (data.error || "Unknown error"));
                    }
                }
            } catch (err) {
                console.error("Network error submitting whisper:", err);
                alert("Network error: Failed to connect to the Whispers courier service.");
            }
        }
    };

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundImage: 'url("/aesthetics/Foyer.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}>
            <div className="container container-narrow" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
                <header className={styles.pageHeader} style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <h1 className="text-display animate-fade-in" style={{ fontSize: '3rem', color: 'var(--ink)', margin: 0, background: 'rgba(253, 248, 240, 0.85)', display: 'inline-block', padding: '0.25rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                            My Whispers
                        </h1>
                        <p className="text-script" style={{ fontSize: '1.5rem', color: 'var(--ink)', background: 'rgba(253, 248, 240, 0.85)', display: 'inline-block', padding: '0.25rem 1rem', borderRadius: 'var(--radius-lg)', margin: 0 }}>
                            Your confidential submissions to the Ton
                        </p>
                    </div>
                    <div className="flourish"></div>
                </header>

                <section>
                    {isComposing && (
                        <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-xl)', background: 'rgba(253, 248, 240, 0.95)', border: '2px solid var(--wisteria)' }}>
                            <h3 className="text-display" style={{ marginBottom: 'var(--space-md)', color: 'var(--ink)' }}>Pen a Whisper</h3>

                            {userGroups.length > 1 && (
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--ink-light)', marginBottom: '0.25rem' }}>Whisper to Society:</label>
                                    <select
                                        className="input"
                                        value={selectedGroupId}
                                        onChange={(e) => setSelectedGroupId(e.target.value)}
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {userGroups.map((g: any) => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {userGroups.length === 1 && (
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--ink-light)', marginBottom: 'var(--space-sm)' }}>
                                    Whispering to: <strong>{userGroups[0]?.name}</strong>
                                </p>
                            )}
                            <textarea
                                className="input"
                                placeholder="What is the latest scandal?"
                                value={newWhisperText}
                                onChange={(e) => setNewWhisperText(e.target.value)}
                                rows={4}
                                style={{ resize: 'none', marginBottom: 'var(--space-md)' }}
                            />
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                                <button className="btn btn-outline" onClick={() => setIsComposing(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSubmit}>Publish to Lady Whistledown</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.feed}>
                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--ink)', fontStyle: 'italic' }}>Fetching the latest tea...</p>
                        ) : feed.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--ink)', fontStyle: 'italic', background: 'rgba(253, 248, 240, 0.85)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>You have penned no whispers yet.</p>
                        ) : (
                            feed.map((whisper) => (
                                <div key={whisper.id} className="card animate-fade-in" style={{ marginBottom: 'var(--space-lg)', background: 'rgba(253, 248, 240, 0.95)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {whisper.groups?.name && (
                                                <span style={{ background: 'var(--wisteria)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                                                    {whisper.groups.name}
                                                </span>
                                            )}
                                            <span className="tag" style={{ color: 'var(--ink-light)', border: '1px solid var(--ink-light)' }}>
                                                {new Date(whisper.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={{ fontFamily: 'var(--font-script)', fontSize: '1.75rem', lineHeight: 1.4, color: 'var(--ink)' }}>
                                        "{whisper.content}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <div style={{ position: 'fixed', bottom: 'var(--space-xl)', right: 'var(--space-xl)', zIndex: 100 }}>
                    <button
                        className="btn btn-primary btn-lg"
                        style={{ borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
                        onClick={() => {
                            setIsComposing(true);
                            window.scroll({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <PenTool size={18} /> Submit New Whisper
                    </button>
                </div>
            </div>
        </div>
    );
}
