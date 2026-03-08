import styles from "@/app/page.module.css";
import { MailOpen } from 'lucide-react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function LetterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Server-side fetch letter
    const { data: letter, error } = await supabase
        .from('letters')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !letter) return notFound();

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundImage: 'url("/aesthetics/Letter.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--space-2xl) var(--space-md)'
        }}>
            <div className="card animate-fade-in" style={{
                maxWidth: '800px',
                width: '100%',
                background: 'rgba(253, 248, 240, 0.95)',
                padding: 'var(--space-2xl) var(--space-xl)',
                border: '2px solid var(--gold)',
                boxShadow: 'var(--shadow-hover)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <div className="wax-seal wax-seal-sm">W</div>
                        <h3 className="text-display" style={{ fontSize: '2rem', margin: 0, color: 'var(--ink)' }}>Lady Whistledown's Society Papers</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <span className="text-display" style={{ fontSize: '1.25rem', color: 'var(--ink-light)' }}>
                            {new Date(letter.letter_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <MailOpen size={28} color="var(--wisteria)" />
                    </div>
                </div>

                <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.5rem',
                    lineHeight: 1.8,
                    color: 'var(--ink)',
                    whiteSpace: 'pre-wrap'
                }}>
                    {letter.body}
                </div>
            </div>
        </div>
    );
}
