'use client';

import { useState, useEffect } from 'react';
import styles from "@/app/page.module.css";
import { UserPlus } from 'lucide-react';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function GroupPage() {
    const params = useParams();
    const [group, setGroup] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviteCopied, setInviteCopied] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchGroup = async () => {
            const idToFetch = typeof params.id === 'string' ? params.id : params.id?.[0];
            if (!idToFetch) return;
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            const { data, error } = await supabase
                .from('groups')
                .select('*')
                .eq('id', idToFetch)
                .single();

            const { data: memberData } = await supabase
                .from('group_members')
                .select('role')
                .eq('group_id', idToFetch)
                .eq('user_id', userData.user.id)
                .single();

            if (data && !error) setGroup(data);
            if (memberData) setRole(memberData.role);

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
                        <div style={{ marginTop: 'var(--space-md)' }}>
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
                                        console.log("Current user ID:", userData.user?.id);
                                        console.log("Group created_by:", group.created_by, "Group ID:", group.id);
                                        console.log("Role:", role);

                                        const { error, count } = await supabase
                                            .from('groups')
                                            .delete({ count: 'exact' })
                                            .eq('id', group.id);

                                        console.log("Delete result — error:", error, "count:", count);

                                        if (error) {
                                            alert("Failed to disband:\n" + JSON.stringify(error, null, 2));
                                        } else if (count === 0) {
                                            alert(`Disband blocked by database (RLS policy). 0 rows deleted.\nGroup ID: ${group.id}\nCreated by: ${group.created_by}\nYour ID: ${userData.user?.id}`);
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
