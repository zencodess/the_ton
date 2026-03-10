import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function InvitePage({ params }: { params: { code: string } }) {
    const supabase = await createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    // Get group info by invite code
    const { data: group } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', params.code)
        .single();

    if (!group) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
                <h1 className="text-display" style={{ color: 'var(--velvet)', marginBottom: '1rem' }}>Society Not Found</h1>
                <p style={{ color: 'var(--ink)' }}>This invitation link appears to be invalid or expired.</p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return to the Foyer</Link>
            </div>
        );
    }

    // Check expiration (48 hours from group creation)
    const createdAt = new Date(group.created_at);
    const now = new Date();
    const hoursDifference = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDifference > 48) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
                <div className="card ornate-border" style={{ background: 'var(--cream)', padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
                    <h1 className="text-display" style={{ color: 'var(--velvet)', marginBottom: '1rem' }}>Invitation Expired</h1>
                    <p style={{ color: 'var(--ink)' }}>This invitation link expired after 48 hours. Please ask the founder for a new parlor.</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return to the Foyer</Link>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to login with a returnUrl to this invite
        redirect(`/login?returnUrl=/invite/${params.code}`);
    }

    // Check if already a member
    const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single();

    if (existingMember) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
                <div className="card ornate-border" style={{ background: 'var(--cream)', padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
                    <h1 className="text-display" style={{ color: 'var(--velvet)', marginBottom: '1rem' }}>You are already in this Society!</h1>
                    <p style={{ color: 'var(--ink)' }}>You are already a member of <strong>{group.name}</strong>.</p>
                    <Link href="/groups" className="btn btn-primary" style={{ marginTop: '2rem' }}>Enter the Parlor</Link>
                </div>
            </div>
        );
    }

    // Count members to enforce the 10-person limit
    const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);

    if (count !== null && count >= 10) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
                <div className="card ornate-border" style={{ background: 'var(--cream)', padding: '3rem', textAlign: 'center', maxWidth: '500px' }}>
                    <h1 className="text-display" style={{ color: 'var(--velvet)', marginBottom: '1rem' }}>Society is Full</h1>
                    <p style={{ color: 'var(--ink)' }}><strong>{group.name}</strong> has already reached its maximum capacity of 10 members.</p>
                    <Link href="/groups" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return to My Societies</Link>
                </div>
            </div>
        );
    }

    // Handle Join
    const joinSociety = async () => {
        'use server';
        const sbClient = await createClient();
        const { data: authData } = await sbClient.auth.getUser();
        if (!authData.user) return;

        await sbClient.from('group_members').insert({
            group_id: group.id,
            user_id: authData.user.id,
            role: 'member'
        });

        redirect('/groups');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'url("/aesthetics/Foyer.jpg") center/cover fixed' }}>
            <div className="card ornate-border" style={{ background: 'var(--parchment)', padding: '3rem', textAlign: 'center', maxWidth: '500px', boxShadow: 'var(--shadow-card)' }}>
                <h2 className="text-display" style={{ fontSize: '1.25rem', color: 'var(--ink-light)', marginBottom: '0.5rem' }}>You have been invited to join</h2>
                <h1 className="text-display" style={{ fontSize: '2.5rem', color: 'var(--velvet)', margin: '1rem 0' }}>{group.name}</h1>
                <p style={{ color: 'var(--ink)', marginBottom: '2rem' }}>Current Members: {count || 0} / 10</p>

                <form action={joinSociety}>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Accept Invitation</button>
                </form>
            </div>
        </div>
    );
}
