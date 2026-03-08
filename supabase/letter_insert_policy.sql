-- Allow the API generation route to push new letters using the Anon Key
CREATE POLICY "Allow anon/authenticated insert for letters" 
ON public.letters FOR INSERT 
WITH CHECK (true);

-- Allow the API generation route to push deliveries using the Anon Key
CREATE POLICY "Allow anon/authenticated insert for deliveries" 
ON public.letter_deliveries FOR INSERT 
WITH CHECK (true);
