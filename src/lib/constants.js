// Design tokens and theme configuration matching the exact abhi.writes design system

export const THEME_COLORS = {
  sage: {
    bg: '#CFE0D2',
    secondary: '#F2C94C', // butter
    name: 'Sage',
    isDark: false,
    text: '#1F2A24',
  },
  butter: {
    bg: '#F5E3A8',
    secondary: '#8FB39A',
    name: 'Butter',
    isDark: false,
    text: '#1F2A24',
  },
  lavender: {
    bg: '#D8D2EA',
    secondary: '#F2C94C', // butter
    name: 'Lavender',
    isDark: false,
    text: '#1F2A24',
  },
  peach: {
    bg: '#F2C9B8',
    secondary: '#8FB39A',
    name: 'Peach',
    isDark: false,
    text: '#1F2A24',
  },
  midnight: {
    bg: '#1F2A24',
    secondary: '#F2C94C', // butter
    name: 'Midnight',
    isDark: true,
    text: '#EEF1EA',
  },
};

export const INITIAL_SETTINGS = {
  id: 1,
  blog_name: 'abhi.writes',
  tagline: 'Slow thoughts for a fast internet.',
  author_name: 'Abhi',
  contact_email: '',
  bio: '', // Intentionally empty in seed per prompt page 16
  currently: '', // Intentionally empty in seed per prompt page 16
  writes_about: '', // Intentionally empty in seed per prompt page 16
  github_url: 'https://github.com',
  x_url: 'https://x.com',
  linkedin_url: 'https://linkedin.com',
  portrait_url: '',
  default_theme: 'sage',
};

export const INITIAL_STORIES = [
  {
    id: 'story-1',
    title: 'Why I stopped chasing perfect side projects',
    slug: 'why-i-stopped-chasing-perfect-side-projects',
    excerpt: 'For years, every new idea demanded a new domain, a fresh design system, and an elaborate roadmap. None of them shipped.',
    body_html: `<p class="intro-p">For years, every new idea demanded a new domain, a fresh design system, and an elaborate roadmap. None of them shipped. I had a digital graveyard filled with half-configured databases, customized ESLint rules, and landing page skeletons that never saw the light of a browser window.</p>
<p>Perfectionism wasn't high standards—it was armor against judgment. If a project remains unfinished in your local repository, it cannot fail, nobody can criticize its typography, and nobody can ignore it. It remains pristine and potential-rich, safe from the friction of reality.</p>
<blockquote>"Real artists ship, but honest craftsmen simply release the work before it rots in private."</blockquote>
<p>I changed my metric of success from "how elegant is the architecture" to "does it exist in the public record". When you lower the stakes of every individual publication, you suddenly make room for momentum. An unvarnished essay published today will teach you ten times more than the masterpiece you promise to finish next winter.</p>`,
    category: 'Essay',
    tags: ['creativity', 'craft', 'focus'],
    status: 'published',
    featured: true,
    theme: 'sage',
    reading_font: 'serif',
    cover_url: '',
    read_minutes: 6,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'story-2',
    title: 'The night the power went out',
    slug: 'the-night-the-power-went-out',
    excerpt: 'When the hum of the refrigerator died, the entire apartment building plunged into an abrupt, eerie quiet.',
    body_html: `<p class="intro-p">When the hum of the refrigerator died, the entire apartment building plunged into an abrupt, eerie quiet. In an era where invisible alternating current sustains every screen, glow, and ventilation fan, total stillness feels almost physical.</p>
<p>Within ten minutes, people began opening their hallway doors. Strange, isn't it, how an electrical failure creates an immediate social license? We spent three hours gathered on the front stoop with tea candles in empty peanut butter jars, sharing matches and talking with people whose names we had never bothered to learn across three leases.</p>
<blockquote>The city skyline looked like a charcoal sketch where someone had smudged away the stars with their thumb.</blockquote>
<p>By midnight, the air was cool and the street was silent except for the low murmur of conversation and distant bicycle bells. When the grid blinked back to life at 2 a.m., illuminating street lamps in an aggressive amber glare, there was a collective sigh of quiet regret.</p>`,
    category: 'Story',
    tags: ['stories', 'city', 'memories'],
    status: 'published',
    featured: false,
    theme: 'butter',
    reading_font: 'serif',
    read_minutes: 9,
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'story-3',
    title: 'Notes on learning in public',
    slug: 'notes-on-learning-in-public',
    excerpt: 'Publishing your rough notes feels terrifying until you realize everyone else is just guessing too.',
    body_html: `<p class="intro-p">Publishing your rough notes feels terrifying until you realize everyone else is just guessing too. The biggest barrier to sharing what you learn is the subconscious belief that you must be an authority before you are permitted to speak.</p>
<p>In reality, the beginner's perspective is rare and perishable. The moment you understand a concept deeply, you suffer from the curse of knowledge: you forget what was confusing about it in the first place.</p>
<p>Document your confusion. Write down the commands that didn't work. Share the mental models that finally clicked. You aren't lecturing; you are leaving trail markers for whoever walks this trail tomorrow morning.</p>`,
    category: 'Note',
    tags: ['learning', 'writing', 'notes'],
    status: 'published',
    featured: false,
    theme: 'lavender',
    reading_font: 'sans',
    cover_url: '',
    read_minutes: 3,
    published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'story-4',
    title: 'A draft about slow mornings',
    slug: 'a-draft-about-slow-mornings',
    excerpt: 'The urge to check notifications within seconds of opening one’s eyes is perhaps the greatest theft of modern peace.',
    body_html: `<p class="intro-p">The urge to check notifications within seconds of opening one's eyes is perhaps the greatest theft of modern peace.</p>
<p>There is a sacred buffer between the subconscious world of dreams and the relentless queue of incoming demands. If you fill that buffer with someone else's crisis before you have even boiled water, you have surrendered your day before it has begun.</p>
<p>A slow morning isn't about luxury or waking up at 5 a.m. to do an eight-step routine. It's simply about holding silence until your mind has arrived in the room.</p>`,
    category: 'Essay',
    tags: ['reflections', 'habits'],
    status: 'draft',
    featured: false,
    theme: 'peach',
    reading_font: 'serif',
    cover_url: '',
    read_minutes: 4,
    published_at: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    body: 'Loved the essay on side projects. It inspired me to finally deploy my small botanical catalog instead of refactoring it for the sixth time.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_SUBSCRIBERS = [
  {
    id: 'sub-1',
    email: 'reader@example.com',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
