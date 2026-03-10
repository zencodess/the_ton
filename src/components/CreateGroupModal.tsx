import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('other');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) throw new Error('You must be logged in to create a society.');

            // 1. Check if user has already created 10 groups
            const { count, error: countError } = await supabase
                .from('groups')
                .select('*', { count: 'exact', head: true })
                .eq('created_by', userData.user.id);

            if (countError) throw countError;
            if (count !== null && count >= 10) {
                throw new Error('You can only create up to 10 societies.');
            }

            const newGroupId = crypto.randomUUID();
            const newInviteCode = crypto.randomUUID().split('-')[0];

            // 2. Create the group
            const { error: groupError } = await supabase
                .from('groups')
                .insert({
                    id: newGroupId,
                    invite_code: newInviteCode,
                    name,
                    dynamic: category,
                    created_by: userData.user.id,
                });

            if (groupError) throw groupError;

            // 3. Add user as admin
            const { error: memberError } = await supabase
                .from('group_members')
                .insert({
                    group_id: newGroupId,
                    user_id: userData.user.id,
                    role: 'admin'
                });

            if (memberError) throw memberError;

            // Show success logic
            setInviteLink(`${window.location.origin}/invite/${newInviteCode}`);
            onSuccess(); // Refresh the list in the background
        } catch (err: any) {
            console.error("Supabase Error Full Object:", err);
            const detailedError = err.message
                ? `${err.message} ${err.details ? `(Details: ${err.details})` : ''} ${err.hint ? `(Hint: ${err.hint})` : ''}`
                : JSON.stringify(err);
            setError(detailedError || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'auto'
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(4px)'
                        }}
                        onClick={inviteLink ? undefined : onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-md bg-[var(--parchment)] rounded-2xl p-6 shadow-2xl mx-4 ornate-border"
                        style={{
                            position: 'relative', width: '100%', maxWidth: '28rem',
                            background: 'var(--parchment)',
                            borderRadius: '1rem', padding: '1.5rem',
                            boxShadow: 'var(--shadow-card)',
                            margin: '0 1rem'
                        }}
                    >
                        {!inviteLink && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors p-2"
                                style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--ink-light)', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        )}

                        {!inviteLink ? (
                            <>
                                <h2 className="text-display text-2xl text-[var(--velvet)] mb-1 text-center" style={{ fontSize: '1.5rem', color: 'var(--velvet)', marginBottom: '0.25rem', textAlign: 'center' }}>
                                    Found a Society
                                </h2>
                                <p className="text-center text-[var(--ink-light)] mb-6" style={{ textAlign: 'center', color: 'var(--ink-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    Establish a new private parlor. (Max 10 members)
                                </p>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-[var(--velvet)] mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--velvet)', marginBottom: '0.25rem' }}>
                                            Society Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            maxLength={50}
                                            placeholder="e.g. The Hastings Circle"
                                            className="w-full px-4 py-2 rounded-xl transition-all outline-none"
                                            style={{
                                                width: '100%', padding: '0.5rem 1rem', borderRadius: '0.75rem',
                                                border: '1px solid var(--gold)', backgroundColor: 'var(--cream)',
                                                outline: 'none', boxSizing: 'border-box', color: 'var(--velvet)'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-[var(--velvet)] mb-1" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--velvet)', marginBottom: '0.25rem' }}>
                                            Dynamic (Category)
                                        </label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl transition-all outline-none text-[var(--velvet)]"
                                            style={{
                                                width: '100%', padding: '0.5rem 1rem', borderRadius: '0.75rem',
                                                border: '1px solid var(--gold)', backgroundColor: 'var(--cream)',
                                                outline: 'none', color: 'var(--velvet)', boxSizing: 'border-box',
                                                fontFamily: 'var(--font-body)', fontSize: '1.125rem'
                                            }}
                                        >
                                            <option value="besties">Besties</option>
                                            <option value="family">Family</option>
                                            <option value="office">Office / Colleagues</option>
                                            <option value="college">College Friends</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm mt-1" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !name.trim()}
                                        className="btn btn-primary w-full mt-4 flex justify-center items-center gap-2"
                                        style={{
                                            width: '100%', marginTop: '1rem',
                                            opacity: loading || !name.trim() ? 0.7 : 1,
                                            cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                                        }}
                                    >
                                        {loading ? 'Publishing...' : 'Found Society'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center" style={{ textAlign: 'center' }}>
                                <div className="mx-auto mb-4" style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--duck-egg-light)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--velvet)' }}>
                                    <Users size={32} />
                                </div>
                                <h2 className="text-display text-2xl text-[var(--velvet)] mb-2" style={{ fontSize: '1.5rem', color: 'var(--velvet)', marginBottom: '0.5rem' }}>
                                    Society Founded!
                                </h2>
                                <p className="text-[var(--ink-light)] mb-6 text-sm" style={{ color: 'var(--ink-light)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                    Share this invite link with up to 9 others to join your parlor.
                                </p>

                                <div className="flex items-center gap-2 p-3 bg-white/60 rounded-xl mb-6" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '0.75rem', border: '1px solid var(--duck-egg-dark)', marginBottom: '1.5rem' }}>
                                    <input
                                        type="text"
                                        value={inviteLink}
                                        readOnly
                                        className="w-full bg-transparent text-sm text-[var(--velvet)] outline-none"
                                        style={{ width: '100%', backgroundColor: 'transparent', fontSize: '0.875rem', color: 'var(--velvet)', outline: 'none', border: 'none' }}
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 rounded-lg transition-colors"
                                        style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: copied ? 'var(--duck-egg)' : 'transparent', color: 'var(--velvet)', border: 'none', cursor: 'pointer' }}
                                        title="Copy Link"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="btn btn-primary w-full"
                                    style={{ width: '100%', borderRadius: '0.75rem' }}
                                >
                                    Enter Parlor
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
