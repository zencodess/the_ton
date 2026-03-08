-- =============================================================================
-- The Ton — Database Schema
-- =============================================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This creates all tables, RLS policies, and helper functions.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS (extends Supabase auth.users)
-- =============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    interests TEXT[] DEFAULT '{}',
    timezone TEXT DEFAULT 'UTC',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can read all profiles, but only edit their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- =============================================================================
-- GROUPS ("The Drawing Room")
-- =============================================================================
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    dynamic TEXT CHECK (dynamic IN ('office', 'family', 'college', 'besties', 'other')) DEFAULT 'other',
    home_timezone TEXT NOT NULL DEFAULT 'UTC',
    invite_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    max_members INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups will be defined below after group_members is created

CREATE POLICY "Authenticated users can create groups"
    ON public.groups FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Allow reading group by invite code (for joining)
CREATE POLICY "Anyone can view group by invite code"
    ON public.groups FOR SELECT
    TO authenticated
    USING (true);

-- =============================================================================
-- GROUP MEMBERS
-- =============================================================================
CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view membership"
    ON public.group_members FOR SELECT
    TO authenticated
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join groups"
    ON public.group_members FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Now we can safely add the policy for groups since group_members exists
CREATE POLICY "Group members can view their groups"
    ON public.groups FOR SELECT
    TO authenticated
    USING (
        id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

-- =============================================================================
-- WHISPERS ("Spilling the Tea")
-- =============================================================================
CREATE TABLE public.whispers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    content TEXT NOT NULL CHECK (char_length(content) <= 280),
    whisper_date DATE NOT NULL DEFAULT CURRENT_DATE,
    moderation_passed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.whispers ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Users can see whispers in their groups but NEVER see author_id
-- This is enforced by a VIEW, not direct table access
CREATE POLICY "No direct whisper reads"
    ON public.whispers FOR SELECT
    TO authenticated
    USING (false);

CREATE POLICY "Users can insert whispers in their groups"
    ON public.whispers FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = author_id
        AND group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );

-- Anonymous view: strips author_id from whispers
CREATE VIEW public.anonymous_whispers AS
SELECT
    id,
    group_id,
    content,
    whisper_date,
    created_at
FROM public.whispers
WHERE moderation_passed = true;

-- =============================================================================
-- LETTERS ("Lady Whistledown's Society Papers")
-- =============================================================================
CREATE TABLE public.letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    letter_date DATE NOT NULL,
    body TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, letter_date)
);

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- RLS Policy for reading letters will be defined below after letter_deliveries is created

-- =============================================================================
-- LETTER DELIVERIES (7:00 AM per-user scheduling)
-- =============================================================================
CREATE TABLE public.letter_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES public.letters(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    scheduled_for TIMESTAMPTZ NOT NULL,
    delivered_at TIMESTAMPTZ,
    is_read BOOLEAN DEFAULT false,
    UNIQUE(letter_id, user_id)
);

ALTER TABLE public.letter_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own deliveries"
    ON public.letter_deliveries FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can mark own letters as read"
    ON public.letter_deliveries FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Now we can safely add the policy for letters since letter_deliveries exists
CREATE POLICY "Group members can read delivered letters"
    ON public.letters FOR SELECT
    TO authenticated
    USING (
        group_id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
        AND id IN (
            SELECT letter_id FROM public.letter_deliveries
            WHERE user_id = auth.uid()
            AND delivered_at IS NOT NULL
        )
    );

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Count whispers per user per group per day (for 3/day limit)
CREATE OR REPLACE FUNCTION public.get_whisper_count(
    p_group_id UUID,
    p_user_id UUID,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS INT AS $$
    SELECT COUNT(*)::INT
    FROM public.whispers
    WHERE group_id = p_group_id
    AND author_id = p_user_id
    AND whisper_date = p_date;
$$ LANGUAGE sql SECURITY DEFINER;

-- Count group members (for 10-member cap)
CREATE OR REPLACE FUNCTION public.get_member_count(p_group_id UUID)
RETURNS INT AS $$
    SELECT COUNT(*)::INT
    FROM public.group_members
    WHERE group_id = p_group_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Anonymous'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
