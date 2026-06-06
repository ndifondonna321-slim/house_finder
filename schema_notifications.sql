-- Create the global notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read notifications (since they are global)
CREATE POLICY "Anyone can view notifications"
    ON public.notifications FOR SELECT
    USING (true);

-- Allow authenticated users (Admins/Landlords) to insert notifications
CREATE POLICY "Authenticated users can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for the notifications table so the frontend can subscribe
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
