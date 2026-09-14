-- ==============================================================================
-- SURPRISESPARK: INITIAL SEED DATA (PHASE 2)
-- ==============================================================================

-- 1. Initial Categories
-- Only 'Birthday & Celebrations' is initially active.
insert into public.categories (id, name, description, icon_name, badge_color, accent_color, is_active, sort_order)
values
  ('birthday', 'Birthday & Celebrations', 'Cakes, candles to blow out, confetti pop, and emotional polaroids.', 'Cake', 'bg-pink-500/10 text-pink-600 border-pink-200', 'from-pink-500 to-rose-500', true, 1),
  ('love', 'Love', 'Romantic starfield, floating origami hearts, and love notes.', 'Heart', 'bg-rose-500/10 text-rose-600 border-rose-200', 'from-rose-500 to-red-500', false, 2),
  ('anniversary', 'Anniversary', 'Timeline of our memories, glowing lanterns, and heartfelt letters.', 'HeartHandshake', 'bg-purple-500/10 text-purple-600 border-purple-200', 'from-purple-500 to-indigo-500', false, 3),
  ('friendship', 'Friendship', 'Inside jokes, memorable roast cards, and quirky celebration themes.', 'Smile', 'bg-amber-500/10 text-amber-600 border-amber-200', 'from-amber-500 to-orange-500', false, 4),
  ('proposal', 'Proposal', 'Immersive ring box opening with soft cinematic orchestral music.', 'Gem', 'bg-cyan-500/10 text-cyan-600 border-cyan-200', 'from-cyan-500 to-blue-500', false, 5),
  ('wedding', 'Wedding', 'Floral archways, golden confetti, and congratulations guestbook.', 'Sparkles', 'bg-emerald-500/10 text-emerald-600 border-emerald-200', 'from-emerald-500 to-teal-500', false, 6),
  ('congratulations', 'Congratulations', 'Fireworks celebration, trophy reveal, and achievement highlights.', 'Trophy', 'bg-yellow-500/10 text-yellow-600 border-yellow-200', 'from-yellow-500 to-amber-500', false, 7),
  ('thank-you', 'Thank You', 'Gratitude tree blooming with petals and heartfelt thank you notes.', 'HandHeart', 'bg-teal-500/10 text-teal-600 border-teal-200', 'from-teal-500 to-emerald-500', false, 8),
  ('festivals', 'Festivals', 'Diwali diyas, Christmas snowfall, Durga Puja dhak, and holiday countdowns.', 'Flame', 'bg-violet-500/10 text-violet-600 border-violet-200', 'from-violet-500 to-fuchsia-500', false, 9)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

-- 2. Initial Themes
insert into public.themes (id, name, slug, primary_color, secondary_color, accent_color, background_gradient, css_tokens)
values
  ('11111111-1111-1111-1111-111111111111', 'Cosmic Starlight', 'cosmic-starlight', '#ec4899', '#8b5cf6', '#3b82f6', 'from-slate-950 via-purple-950 to-slate-900', '{"glow": "0 0 25px rgba(236,72,153,0.35)"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'Whimsical Pastel', 'whimsical-pastel', '#f43f5e', '#fbbf24', '#a855f7', 'from-pink-900 via-rose-950 to-slate-950', '{"glow": "0 0 25px rgba(244,63,94,0.35)"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'Golden Twilight', 'golden-twilight', '#f59e0b', '#d97706', '#ec4899', 'from-amber-950 via-slate-950 to-stone-950', '{"glow": "0 0 25px rgba(245,158,11,0.35)"}'::jsonb)
on conflict (slug) do nothing;

-- 3. Initial Royalty-Free Music Tracks
insert into public.music_tracks (id, title, artist, duration_seconds, audio_url, category_id, is_royalty_free)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Acoustic Birthday Serenade', 'SurpriseSpark Music', 145, '/audio/acoustic-birthday.mp3', 'birthday', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Lo-Fi Cosmic Reverie', 'SurpriseSpark Music', 180, '/audio/lofi-cosmic.mp3', 'birthday', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Gentle Piano Memories', 'SurpriseSpark Music', 160, '/audio/piano-memories.mp3', 'anniversary', true)
on conflict (id) do nothing;

-- 4. Initial Templates
insert into public.templates (id, slug, name, category_id, description, tagline, cover_gradient, default_theme_id, default_music_id, is_featured, is_premium, is_active, tags)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'cosmic-birthday-blast',
    'Cosmic Cake & Starlight Blast',
    'birthday',
    'An ethereal 3D night sky with floating neon lanterns and a glowing birthday cake to blow out.',
    'Blast off into another magical year!',
    'from-indigo-600 via-purple-600 to-pink-500',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    true,
    false,
    true,
    array['3D Cake', 'Interactive Blow', 'Starfield', 'Lo-Fi Beats']
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'whimsical-confetti-pop',
    'Whimsical Confetti Pop',
    'birthday',
    'Cute pastel party room filled with bouncing balloons, party poppers, and a custom musical birthday tune.',
    'Pop the balloon for an instant smile!',
    'from-pink-400 via-rose-300 to-amber-300',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    true,
    false,
    true,
    array['Pastel', 'Balloons', 'Pop Audio', 'Cute']
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'memory-polaroid-walk',
    'Vintage Memory Polaroid Walk',
    'birthday',
    'A nostalgic 3D room with warm string fairy lights, hanging polaroids, and an interactive handwritten letter.',
    'Walk down memory lane together.',
    'from-amber-500 via-orange-400 to-rose-400',
    '33333333-3333-3333-3333-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    true,
    true,
    true,
    array['Nostalgic', 'Photo Reel', 'Warm Lights', 'Acoustic']
  )
on conflict (slug) do nothing;
