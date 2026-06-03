-- Create website_reviews table
CREATE TABLE IF NOT EXISTS public.website_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.website_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public select access
DROP POLICY IF EXISTS "Allow public select on website_reviews" ON public.website_reviews;
CREATE POLICY "Allow public select on website_reviews"
ON public.website_reviews FOR SELECT
TO public
USING (true);

-- Policy: Allow authenticated insert access
DROP POLICY IF EXISTS "Allow authenticated insert on website_reviews" ON public.website_reviews;
CREATE POLICY "Allow authenticated insert on website_reviews"
ON public.website_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete/update their own reviews
DROP POLICY IF EXISTS "Allow users to update their own website_reviews" ON public.website_reviews;
CREATE POLICY "Allow users to update their own website_reviews"
ON public.website_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to delete their own website_reviews" ON public.website_reviews;
CREATE POLICY "Allow users to delete their own website_reviews"
ON public.website_reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
