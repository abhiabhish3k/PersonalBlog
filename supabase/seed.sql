-- seed.sql: Sample seed content for abhi.writes

-- Settings with empty bio, currently, and writes_about as specified
update settings set 
  blog_name = 'abhi.writes',
  tagline = 'Slow thoughts for a fast internet.',
  author_name = 'Abhi',
  contact_email = 'abhi@example.com',
  bio = '',
  currently = '',
  writes_about = '',
  github_url = 'https://github.com',
  x_url = 'https://x.com',
  linkedin_url = 'https://linkedin.com',
  default_theme = 'sage'
where id = 1;

-- 1. Essay, sage: "Why I stopped chasing perfect side projects", 6 min, published
insert into posts (
  title, slug, excerpt, body_html, category, tags, status, featured, theme, reading_font, read_minutes, published_at
) values (
  'Why I stopped chasing perfect side projects',
  'why-i-stopped-chasing-perfect-side-projects',
  'For years, every new idea demanded a new domain, a fresh design system, and an elaborate roadmap. None of them shipped.',
  '<p class="text-2xl font-serif leading-relaxed mb-6">For years, every new idea demanded a new domain, a fresh design system, and an elaborate roadmap. None of them shipped. I had a digital graveyard filled with half-configured databases, customized ESLint rules, and landing page skeletons that never saw the light of a browser window.</p><p>Perfectionism wasn’t high standards—it was armor against judgment. If a project remains unfinished in your local repository, it cannot fail, nobody can criticize its typography, and nobody can ignore it. It remains pristine and potential-rich, safe from the friction of reality.</p><blockquote>"Real artists ship, but honest craftsmen simply release the work before it rots in private."</blockquote><p>I changed my metric of success from "how elegant is the architecture" to "does it exist in the public record". When you lower the stakes of every individual publication, you suddenly make room for momentum. An unvarnished essay published today will teach you ten times more than the masterpiece you promise to finish next winter.</p>',
  'Essay',
  ARRAY['creativity', 'craft', 'focus'],
  'published',
  true,
  'sage',
  'serif',
  6,
  now() - interval '2 days'
);

-- 2. Story, butter: "The night the power went out", 9 min, published
insert into posts (
  title, slug, excerpt, body_html, category, tags, status, featured, theme, reading_font, read_minutes, published_at
) values (
  'The night the power went out',
  'the-night-the-power-went-out',
  'When the hum of the refrigerator died, the entire apartment building plunged into an abrupt, eerie quiet.',
  '<p class="text-2xl font-serif leading-relaxed mb-6">When the hum of the refrigerator died, the entire apartment building plunged into an abrupt, eerie quiet. In an era where invisible alternating current sustains every screen, glow, and ventilation fan, total stillness feels almost physical.</p><p>Within ten minutes, people began opening their hallway doors. Strange, isn’t it, how an electrical failure creates an immediate social license? We spent three hours gathered on the front stoop with tea candles in empty peanut butter jars, sharing matches and talking with people whose names we had never bothered to learn across three leases.</p><blockquote>The city skyline looked like a charcoal sketch where someone had smudged away the stars with their thumb.</blockquote><p>By midnight, the air was cool and the street was silent except for the low murmur of conversation and distant bicycle bells. When the grid blinked back to life at 2 a.m., illuminating street lamps in an aggressive amber glare, there was a collective sigh of quiet regret.</p>',
  'Story',
  ARRAY['stories', 'city', 'memories'],
  'published',
  false,
  'butter',
  'serif',
  9,
  now() - interval '5 days'
);

-- 3. Note, lavender: "Notes on learning in public", 3 min, published
insert into posts (
  title, slug, excerpt, body_html, category, tags, status, featured, theme, reading_font, read_minutes, published_at
) values (
  'Notes on learning in public',
  'notes-on-learning-in-public',
  'Publishing your rough notes feels terrifying until you realize everyone else is just guessing too.',
  '<p class="text-2xl font-serif leading-relaxed mb-6">Publishing your rough notes feels terrifying until you realize everyone else is just guessing too. The biggest barrier to sharing what you learn is the subconscious belief that you must be an authority before you are permitted to speak.</p><p>In reality, the beginner’s perspective is rare and perishable. The moment you understand a concept deeply, you suffer from the curse of knowledge: you forget what was confusing about it in the first place.</p><p>Document your confusion. Write down the commands that didn’t work. Share the mental models that finally clicked. You aren’t lecturing; you are leaving trail markers for whoever walks this trail tomorrow morning.</p>',
  'Note',
  ARRAY['learning', 'writing', 'notes'],
  'published',
  false,
  'lavender',
  'sans',
  3,
  now() - interval '8 days'
);

-- 4. Draft, essay, peach: "A draft about slow mornings", draft
insert into posts (
  title, slug, excerpt, body_html, category, tags, status, featured, theme, reading_font, read_minutes, published_at
) values (
  'A draft about slow mornings',
  'a-draft-about-slow-mornings',
  'The urge to check notifications within seconds of opening one’s eyes is perhaps the greatest theft of modern peace.',
  '<p class="text-2xl font-serif leading-relaxed mb-6">The urge to check notifications within seconds of opening one’s eyes is perhaps the greatest theft of modern peace.</p><p>There is a sacred buffer between the subconscious world of dreams and the relentless queue of incoming demands. If you fill that buffer with someone else’s crisis before you have even boiled water, you have surrendered your day before it has begun.</p><p>A slow morning isn’t about luxury or waking up at 5 a.m. to do an eight-step routine. It’s simply about holding silence until your mind has arrived in the room.</p>',
  'Essay',
  ARRAY['reflections', 'habits'],
  'draft',
  false,
  'peach',
  'serif',
  4,
  null
);
