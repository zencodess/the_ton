'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import { UserPlus, Users, Trash2 } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function GroupPage() {
    const params = useParams();
    const [group, setGroup] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviteCopied, setInviteCopied] = useState(false);
    const supabase = createClient();

    const fetchGroupAndMembers = async () => {
        const idToFetch = typeof params.id === 'string' ? params.id : params.id?.[0];
        if (!idToFetch) return;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', idToFetch)
            .single();

        const { data: memberData, error: memberError } = await supabase
            .from('group_members')
            .select(`
                user_id,
                role,
                profiles (
                    id,
                    display_name,
                    title
                )
            `)
            .eq('group_id', idToFetch);

        if (data && !error) setGroup(data);
        if (memberData && !memberError) {
            setMembers(memberData);
            const currentUserMembership = memberData.find((m: any) => m.user_id === userData.user.id);
            if (currentUserMembership) setRole(currentUserMembership.role);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchGroupAndMembers();
    }, [params.id, supabase]);

    const handleRemoveMember = async (targetUserId: string, targetName: string) => {
        if (!window.confirm(`Are you sure you wish to banish ${targetName} from the society?`)) return;

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', group.id)
            .eq('user_id', targetUserId);

        if (error) {
            alert("Failed to remove member: " + error.message);
        } else {
            setMembers(members.filter(m => m.user_id !== targetUserId));
        }
    };

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
                        {loading ? null : role ? (
                            <p className="text-script" style={{ fontSize: '1.75rem', color: 'var(--ink)', background: 'rgba(253, 248, 240, 0.85)', padding: '0.25rem 1rem', display: 'inline-block', borderRadius: 'var(--radius-lg)', margin: 0 }}>
                                {group?.description || `A private parlor for members of the Ton`}
                            </p>
                        ) : (
                            <p className="text-script" style={{ fontSize: '1.75rem', color: 'var(--velvet)', background: 'rgba(253, 248, 240, 0.85)', padding: '0.25rem 1rem', display: 'inline-block', borderRadius: 'var(--radius-lg)', margin: 0 }}>
                                This parlor is private.
                            </p>
                        )}
                    </div>
                    <div className="flourish"></div>
                </header>

                <section>
                    {!role && !loading ? (
                        <div className="card card-parchment animate-fade-in" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                            <h2 className="text-display" style={{ color: 'var(--ink)', marginBottom: 'var(--space-md)' }}>A Closed Door</h2>
                            <p className="text-script" style={{ fontSize: '1.5rem', color: 'var(--ink-light)' }}>
                                This parlor is reserved for members of {group?.name}. One must be properly introduced to enter!
                            </p>
                            <Link href="/groups" style={{ marginTop: 'var(--space-xl)', display: 'inline-block' }}>
                                <button className="btn btn-outline">Return to My Societies</button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="card card-parchment animate-fade-in" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', color: 'var(--wisteria)' }}>
                                    <Users size={24} />
                                    <h2 className="text-display" style={{ fontSize: '1.75rem', margin: 0 }}>Society Members</h2>
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto var(--space-lg) auto', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                    {members.map((member) => (
                                        <li key={member.user_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.4)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--duck-egg-dark)' }}>
                                            <Link href={`/profile/${member.user_id}`} style={{ textDecoration: 'none', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                                                <span className="text-script" style={{ fontSize: '1.25rem' }}>
                                                    {member.profiles?.title ? `${member.profiles.title} ` : ''}{member.profiles?.display_name || 'Anonymous Member'}
                                                </span>
                                                {member.role === 'admin' && <span style={{ fontSize: '0.65rem', background: 'var(--gold)', color: 'white', padding: '1px 5px', borderRadius: '3px', textTransform: 'uppercase' }}>Admin</span>}
                                            </Link>
                                            
                                            {role === 'admin' && member.role !== 'admin' && (
                                                <button 
                                                    onClick={() => handleRemoveMember(member.user_id, member.profiles?.display_name)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--velvet)', opacity: 0.6, transition: 'opacity 0.2s' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                                                    title="Banish from Society"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ marginTop: 'var(--space-lg)', display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)' }}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
                                        onClick={() => {
                                            if (group?.invite_code) {
                                                const inviteUrl = `${window.location.origin}/invite/${group.invite_code}`;
                                                navigator.clipboard.writeText(inviteUrl);
                                                setInviteCopied(true);
                                                setTimeout(() => setInviteCopied(false), 2000);
                                            }
                                        }}
                                    >
                                        <UserPlus size={18} /> {inviteCopied ? "Copied Link!" : "Invite a Member"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
                        <button
                            onClick={async () => {
                                const reason = window.prompt(`Please briefly describe why you are reporting "${group?.name}" (e.g. Hate speech, abusive content):`);
                                if (reason && reason.trim()) {
                                    try {
                                        const response = await fetch('/api/report', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ group_id: group.id, group_name: group.name, reason })
                                        });
                                        if (response.ok) {
                                            alert("Your report has been securely submitted to administration for review.");
                                        } else {
                                            alert("Failed to submit report.");
                                        }
                                    } catch (e) {
                                        alert("Network error. Could not submit report.");
                                    }
                                }
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
                        >
                            Report Society or Content
                        </button>
                    </div>

                    {role === 'admin' && (
                        <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>Admin Controls</p>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#b33939', color: 'white', border: 'none' }}
                                onClick={async () => {
                                    const confirmed = window.confirm("Are you absolutely sure you want to disband this Society? All whispers and memberships will be lost forever.");
                                    if (confirmed) {
                                        const { data: userData } = await supabase.auth.getUser();
                                        const { error, count } = await supabase
                                            .from('groups')
                                            .delete({ count: 'exact' })
                                            .eq('id', group.id);

                                        if (error) {
                                            alert("Failed to disband:\n" + JSON.stringify(error, null, 2));
                                        } else if (count === 0) {
                                            alert(`Disband blocked by database (RLS policy).`);
                                        } else {
                                            window.location.href = '/groups';
                                        }
                                    }
                                }}
                            >
                                Disband Society
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
