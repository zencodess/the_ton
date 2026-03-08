'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { Mail, MailOpen, PenTool, Flame } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function Foyer() {
  const [readLetters, setReadLetters] = useState<Set<string>>(new Set());
  const [lettersFeed, setLettersFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const supabase = createClient();

  const fetchLetters = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase
      .from('letter_deliveries')
      .select(`
        id,
        is_read,
        letter_id,
        letters (
          id,
          letter_date,
          body
        )
      `)
      .eq('user_id', userData.user.id)
      .not('delivered_at', 'is', null)
      .order('scheduled_for', { ascending: false });

    if (data && !error) {
      setLettersFeed(data);
      const alreadyRead = data.filter(d => d.is_read).map(d => d.letter_id);
      setReadLetters(new Set(alreadyRead));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  const markAsRead = async (deliveryId: string, letterId: string) => {
    setReadLetters(prev => new Set(prev).add(letterId));
    await supabase.from('letter_deliveries').update({ is_read: true }).eq('id', deliveryId);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: groupData } = await supabase.from('group_members').select('group_id').eq('user_id', userData.user.id).limit(1).single();

    if (!groupData) {
      alert('You are not in a group yet.');
      setGenerating(false);
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ group_id: groupData.group_id })
      });
      const json = await res.json();
      if (json.error) {
        alert("Error generating letter: " + json.error);
        console.error(json);
      } else if (json.message) {
        alert(json.message); // No whispers to summarize
      } else {
        alert("The Whistledown courier has arrived. Refreshing Foyer...");
        fetchLetters();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
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
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-5xl)' }}>
        <header className={styles.pageHeader} style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h1 className="text-display animate-fade-in" style={{ fontSize: '3rem', color: 'var(--ink)', marginBottom: 'var(--space-sm)' }}>
            Letters for you
          </h1>
          <p className="text-script" style={{ fontSize: '1.75rem', color: 'var(--ink)' }}>
            Read the latest from Lady Whistledown
          </p>
          <div className="flourish"></div>
        </header>

        <section className={styles.feed}>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--ink)' }}>Checking for couriers...</p>
          ) : lettersFeed.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--ink)' }}>Your mailbox is dreadfully empty. Perhaps someone should whisper a secret...</p>
          ) : (
            lettersFeed.map((delivery) => {
              const letter = Array.isArray(delivery.letters) ? delivery.letters[0] : delivery.letters;
              if (!letter) return null;

              const isRead = readLetters.has(letter.id);
              const preview = letter.body ? letter.body.substring(0, 60).replace(/\n/g, ' ') + '...' : 'Open to read...';

              return (
                <Link
                  href={`/letters/${letter.id}`}
                  target="_blank"
                  key={delivery.id}
                  onClick={() => markAsRead(delivery.id, letter.id)}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="card animate-fade-in"
                    style={{
                      marginBottom: 'var(--space-lg)',
                      padding: 'var(--space-md) var(--space-xl)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'rgba(253, 248, 240, 0.85)',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.border = '1px solid var(--wisteria)'}
                    onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flex: 1, overflow: 'hidden' }}>
                      <div className="wax-seal" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>W</div>
                      <h3 className="text-display" style={{ fontSize: '1.25rem', margin: 0, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                        Lady Whistledown's Society Papers
                      </h3>
                      <span className="text-display" style={{ color: 'var(--ink-light)', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        — {preview}
                      </span>
                    </div>
                    <div style={{ marginLeft: 'var(--space-md)', color: isRead ? 'var(--text-muted)' : 'var(--wisteria)' }}>
                      {isRead ? <MailOpen size={24} /> : <Mail size={24} />}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </section>

        <div style={{ position: 'fixed', bottom: 'var(--space-xl)', right: 'var(--space-xl)', zIndex: 100, display: 'flex', gap: '1rem', flexDirection: 'column' }}>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn btn-outline"
            style={{ borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', background: 'rgba(253, 248, 240, 0.95)', opacity: generating ? 0.7 : 1 }}>
            <Flame size={20} color="var(--velvet)" /> {generating ? "Summoning Courier..." : "TEST: Burn Whispers (Generate Letter)"}
          </button>

          <Link href="/whispers">
            <button className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', width: '100%', justifyContent: 'center' }}>
              <PenTool size={20} /> Pen a Whisper for Her
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
