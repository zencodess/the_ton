import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <div className="container container-narrow card animate-fade-in" style={{ backgroundColor: 'rgba(253, 248, 240, 0.95)' }}>
                <h1 className="text-display" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-lg)' }}>Privacy Policy</h1>

                <div style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6, color: 'var(--ink)' }}>
                    <p><strong>Effective Date:</strong> March 2026</p>

                    <p>This Privacy Policy describes how The Ton ("we", "us", or "our") collects, uses, and shares your personal data when you use our web application, in compliance with the General Data Protection Regulation (GDPR / AVG).</p>

                    <h2 className="text-display" style={{ fontSize: '1.5rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>1. Data We Collect</h2>
                    <ul>
                        <li><strong>Authentication Data:</strong> Phone numbers (for OTP login and account creation).</li>
                        <li><strong>Profile Data:</strong> Display names, titles, and gender preferences you provide.</li>
                        <li><strong>User Content:</strong> Anonymous "whispers" and group affiliations you create.</li>
                    </ul>

                    <h2 className="text-display" style={{ fontSize: '1.5rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>2. How We Use Your Data</h2>
                    <p>We process your data exclusively to operate the application, authenticate your identity, and group your submitted content for the generative AI (Lady Whistledown) to create society papers.</p>

                    <h2 className="text-display" style={{ fontSize: '1.5rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>3. Cookies</h2>
                    <p>We use strictly necessary session cookies provided by our authentication partner (Supabase) to keep you logged in. We do not use tracking or advertising cookies.</p>

                    <h2 className="text-display" style={{ fontSize: '1.5rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>4. Third-Party Processors</h2>
                    <p>To provide our service, we share necessary data with trusted third parties:</p>
                    <ul>
                        <li><strong><a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--wisteria)' }}>Supabase</a>:</strong> Database hosting and authentication.</li>
                        <li><strong><a href="https://openai.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--wisteria)' }}>OpenAI</a>:</strong> Anonymous whisper text is processed by OpenAI's Moderation and Generative models. Explicit identities are never sent to OpenAI.</li>
                    </ul>

                    <h2 className="text-display" style={{ fontSize: '1.5rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>5. Your Rights (AVG/GDPR)</h2>
                    <p>You have the right to request access to, correction of, or permanent deletion of your personal data. You may lodge a Data Export or Account Deletion request securely at any time through your <strong>Settings</strong> page.</p>
                    <p>For your security and privacy, these requests are logged directly to our internal database (avoiding insecure email transit) and are fulfilled manually by our administrators within the legally mandated 30-day processing window.</p>

                    <h2 className="text-display" style={{ fontSize: '1.5rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>6. Contact Us & Reporting</h2>
                    <p>If you encounter abusive content, please use the <strong>Report Society or Content</strong> button located on any group page. These reports are logged securely in our internal database for administrative review.</p>
                    <p>For privacy-related questions, please contact the repository owner or society administration directly.</p>

                    <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--cloud)' }}>
                        <Link href="/" style={{ color: 'var(--wisteria)', textDecoration: 'underline' }}>Return to the Foyer</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
