'use client';

import { useState, Suspense } from 'react';
import styles from "@/app/page.module.css";
import { login, signup } from './actions';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className="card animate-fade-in" style={{
            maxWidth: '500px',
            width: '100%',
            background: 'rgba(253, 248, 240, 0.95)',
            border: '2px solid var(--gold)',
            padding: 'var(--space-2xl)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <h1 className="text-display" style={{ fontSize: '3rem', color: 'var(--ink)', margin: 0 }}>
                    The Ton
                </h1>
                <p className="text-script" style={{ fontSize: '1.5rem', color: 'var(--ink)' }}>
                    Present Your Calling Card
                </p>
                <div className="flourish"></div>
            </div>

            {message && (
                <div style={{
                    padding: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(238, 219, 233, 0.5)',
                    border: '1px solid var(--wisteria)',
                    color: 'var(--ink)',
                    textAlign: 'center'
                }}>
                    {message}
                </div>
            )}

            <form className="form" action={isLogin ? login : signup}>
                {!isLogin && (
                    <div className="form-group">
                        <label className="text-display" style={{ fontSize: '1.25rem' }} htmlFor="display_name">Society Name</label>
                        <input
                            className="input"
                            id="display_name"
                            name="display_name"
                            placeholder="Lady Whistledown"
                            required={!isLogin}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label className="text-display" style={{ fontSize: '1.25rem' }} htmlFor="email">Email Address</label>
                    <input
                        className="input"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@mayfair.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="text-display" style={{ fontSize: '1.25rem' }} htmlFor="password">Secret Cipher (Password)</label>
                    <input
                        className="input"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                    {isLogin ? "Enter Society" : "Secure Introduction"}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
                <button
                    type="button"
                    className="text-script"
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.25rem',
                        color: 'var(--wisteria)',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Not yet known to the Ton? Register here." : "Already hold a calling card? Sign in."}
                </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-md)', fontSize: '0.875rem', color: 'var(--ink-light)', fontFamily: 'var(--font-body)' }}>
                By entering, you agree to our <a href="/terms" style={{ color: 'var(--wisteria)' }}>Terms of Service (16+)</a> and <a href="/privacy" style={{ color: 'var(--wisteria)' }}>Privacy Policy</a>.
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundImage: 'url("/aesthetics/Profile.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-md)'
        }}>
            <Suspense fallback={
                <div className="card" style={{ padding: 'var(--space-2xl)', background: 'rgba(253, 248, 240, 0.95)', border: '2px solid var(--gold)' }}>
                    <p className="text-script" style={{ fontSize: '1.5rem', textAlign: 'center' }}>Preparing your invitation...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
