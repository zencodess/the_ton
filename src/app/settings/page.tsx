'use client';

import { useState } from 'react';
import { LogOut, Trash2, Download, AlertTriangle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import styles from "@/app/page.module.css";

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const handleExport = async () => {
        if (!confirm("Are you sure you want to request a copy of your personal data? The administration will compile and send this to you.")) {
            return;
        }

        setIsExporting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/user/export', { method: 'POST' });
            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: "Your data export request has been lodged with administration." });
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to submit request." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "A network error occurred." });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("WARNING: Are you absolutely certain you wish to permanently delete your account? All your whispers, society memberships, and identity will be lost forever. This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/user/delete', { method: 'POST' });
            const data = await response.json();

            if (response.ok) {
                // The API also clears the session, so we just redirect
                router.push('/login?message=Your account has been permanently erased. Farewell.');
            } else {
                setMessage({ type: 'error', text: data.error || "Failed to delete account." });
                setIsDeleting(false);
            }
        } catch (error) {
            setMessage({ type: 'error', text: "A network error occurred." });
            setIsDeleting(false);
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
            paddingTop: 'var(--space-2xl)',
            paddingBottom: 'var(--space-3xl)'
        }}>
            <div className="container container-narrow card animate-fade-in" style={{ backgroundColor: 'rgba(253, 248, 240, 0.95)', border: '2px solid var(--wisteria)' }}>
                <header className={styles.pageHeader} style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <h1 className="text-display" style={{ fontSize: '2.5rem', color: 'var(--ink)' }}>Account Settings</h1>
                    <div className="flourish"></div>
                </header>

                {message && (
                    <div style={{
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-lg)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        border: `1px solid ${message.type === 'success' ? '#4CAF50' : '#f44336'}`,
                        color: 'var(--ink)',
                        textAlign: 'center',
                        fontFamily: 'var(--font-body)'
                    }}>
                        {message.text}
                    </div>
                )}

                <section style={{ marginBottom: 'var(--space-2xl)' }}>
                    <h2 className="text-script" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', color: 'var(--ink)' }}>General</h2>

                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', width: '100%' }}
                    >
                        <LogOut size={18} /> Exit the Ton (Sign Out)
                    </button>
                </section>

                <section style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 'var(--space-xl)',
                    marginBottom: 'var(--space-xl)'
                }}>
                    <h2 className="text-script" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)', color: 'var(--ink)' }}>Data & Privacy (GDPR)</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <div>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', width: '100%', marginBottom: 'var(--space-xs)' }}
                            >
                                <Download size={18} /> {isExporting ? "Requesting..." : "Request Data Export"}
                            </button>
                            <p style={{ fontSize: '0.875rem', color: 'var(--ink-light)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
                                Administration will compile your personal records and contact you.
                            </p>
                        </div>

                        <div style={{
                            padding: 'var(--space-md)',
                            border: '1px solid #ffcccc',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'rgba(255, 235, 238, 0.5)'
                        }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: '#d32f2f', margin: '0 0 var(--space-sm) 0', fontSize: '1.1rem', fontFamily: 'var(--font-body)' }}>
                                <AlertTriangle size={18} /> Danger Zone
                            </h3>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    width: '100%',
                                    backgroundColor: '#d32f2f',
                                    color: 'white',
                                    border: 'none',
                                    marginBottom: 'var(--space-xs)'
                                }}
                            >
                                <Trash2 size={18} /> {isDeleting ? "Erasing..." : "Permanently Delete Account"}
                            </button>
                            <p style={{ fontSize: '0.875rem', color: '#c62828', fontFamily: 'var(--font-body)', textAlign: 'center', margin: 0 }}>
                                This action is instantaneous and irreversible.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
