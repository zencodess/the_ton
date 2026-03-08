DROP POLICY IF EXISTS "Group members can view their groups" ON public.groups;

CREATE POLICY "Group members can view their groups"
    ON public.groups FOR SELECT
    TO authenticated
    USING (
        created_by = auth.uid() OR 
        id IN (
            SELECT group_id FROM public.group_members
            WHERE user_id = auth.uid()
        )
    );
