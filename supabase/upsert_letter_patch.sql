-- Create a secure PostgreSQL function to upsert a letter and its deliveries
-- This runs with "SECURITY DEFINER", bypassing standard RLS to safely handle unique constraints
-- and allow updates to today's existing letter if the Admin tests Generation multiple times.

CREATE OR REPLACE FUNCTION upsert_daily_letter(
    p_group_id UUID,
    p_body TEXT,
    p_letter_date DATE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_letter_id UUID;
BEGIN
    -- Only allow authenticated users to run this
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Check if a letter already exists for this group today
    SELECT id INTO v_letter_id 
    FROM public.letters 
    WHERE group_id = p_group_id AND letter_date = p_letter_date;

    IF v_letter_id IS NOT NULL THEN
        -- Update the existing letter's body
        UPDATE public.letters
        SET body = p_body
        WHERE id = v_letter_id;
    ELSE
        -- Insert a new letter
        v_letter_id := gen_random_uuid();
        INSERT INTO public.letters (id, group_id, letter_date, body)
        VALUES (v_letter_id, p_group_id, p_letter_date, p_body);
        
        -- And insert the deliveries for all members of the group
        INSERT INTO public.letter_deliveries (letter_id, user_id, scheduled_for, delivered_at, is_read)
        SELECT v_letter_id, user_id, now(), now(), false
        FROM public.group_members
        WHERE group_id = p_group_id;
    END IF;

    RETURN v_letter_id;
END;
$$;
