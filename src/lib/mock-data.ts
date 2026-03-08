// Mock data for development before Supabase is connected

export const mockUser = {
    id: '1',
    display_name: 'Lady Arabella',
    bio: 'A diamond of the first water',
    interests: ['Matcha', 'Reality TV', 'Ignoring Emails'],
    timezone: 'Europe/London',
    avatar_url: '',
};

export const whispers = [
    { id: 'w1', author: 'A Modest Mouse', content: 'Someone was seen dancing twice with the same suitor at the assembly...', createdAt: '2026-03-08T10:00:00Z', tags: ['scandal', 'dancing'] },
    { id: 'w2', author: 'The Wallflower', content: 'The lemon cakes at the office pantry disappeared within seconds today.', createdAt: '2026-03-08T09:30:00Z', tags: ['gluttony'] },
    { id: 'w3', author: 'Lord Sharp', content: 'An unexpected alliance has formed in the drafting department.', createdAt: '2026-03-07T15:00:00Z', tags: ['alliance'] }
];

export const mockGroups = [
    {
        id: 'g1',
        name: 'The Office Ton',
        dynamic: 'office' as const,
        home_timezone: 'Europe/London',
        invite_code: 'abc123',
        member_count: 6,
        has_unread: true,
    },
    {
        id: 'g2',
        name: 'Mayfair Society',
        dynamic: 'besties' as const,
        home_timezone: 'America/New_York',
        invite_code: 'def456',
        member_count: 4,
        has_unread: false,
    },
    {
        id: 'g3',
        name: 'The Family Circle',
        dynamic: 'family' as const,
        home_timezone: 'Asia/Kolkata',
        invite_code: 'ghi789',
        member_count: 8,
        has_unread: true,
    },
];

export const mockMembers = [
    { id: 'm1', display_name: 'Lady Arabella', initials: 'LA' },
    { id: 'm2', display_name: 'Lord Benedict', initials: 'LB' },
    { id: 'm3', display_name: 'Miss Charlotte', initials: 'MC' },
    { id: 'm4', display_name: 'Duke Edmund', initials: 'DE' },
    { id: 'm5', display_name: 'Countess Fiona', initials: 'CF' },
    { id: 'm6', display_name: 'Sir George', initials: 'SG' },
];

export const mockLetters = [
    {
        id: 'l1',
        letter_date: '2026-03-08',
        is_read: false,
        preview: 'Dearest Gentle Reader, it has come to my attention that a certain someone...',
        body: `Dearest Gentle Reader,

It has come to my attention that the corridors of your esteemed workplace have been positively buzzing with unspoken truths and delightful observations this past day. One can scarcely take a step without stumbling upon a whisper most tantalizing.

A certain member of your circle, known for their impeccable taste in afternoon beverages, was spotted performing an act of extraordinary kindness — though they would surely deny it if confronted directly. How very noble, and how very predictable. Meanwhile, whispers suggest that another among you has been harboring a secret talent that would make even the most accomplished members of the ton green with envy.

And let us not forget the matter of the mysteriously disappearing biscuits from the communal kitchen. This author has her suspicions, dear reader, but some secrets are best savored rather than revealed.

Yours Truly,
Lady Whistledown`,
    },
    {
        id: 'l2',
        letter_date: '2026-03-07',
        is_read: true,
        preview: 'Dearest Gentle Reader, another day dawns upon our merry band...',
        body: `Dearest Gentle Reader,

Another day dawns upon our merry band of confidants, and what a day it has been! The season continues to deliver its most splendid drama, and this author finds herself quite overwhelmed with material.

It appears that one amongst you has undergone a transformation most remarkable — emerging like a butterfly from its chrysalis, radiating a confidence that did not go unnoticed by your fellow companions. Bravo, dear friend. The ton approves.

In matters of the heart, it seems a quiet affection blooms between two members of your circle, expressed not in grand gestures but in the smallest of kindnesses. How utterly charming. This author shall be watching with great interest.

Yours Truly,
Lady Whistledown`,
    },
    {
        id: 'l3',
        letter_date: '2026-03-06',
        is_read: true,
        preview: 'Dearest Gentle Reader, the week draws to its conclusion...',
        body: '',
    },
];

export function getTimeUntil7AM(): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const tomorrow7am = new Date(now);
    tomorrow7am.setDate(tomorrow7am.getDate() + (now.getHours() >= 7 ? 1 : 0));
    tomorrow7am.setHours(7, 0, 0, 0);

    const diff = tomorrow7am.getTime() - now.getTime();
    return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}

export const dynamicLabels: Record<string, string> = {
    office: 'Office Friends',
    family: 'Family',
    college: 'College',
    besties: 'Besties',
    other: 'The Ton',
};

export const dynamicEmojis: Record<string, string> = {
    office: '🏢',
    family: '👨‍👩‍👧‍👦',
    college: '🎓',
    besties: '💜',
    other: '🪶',
};
