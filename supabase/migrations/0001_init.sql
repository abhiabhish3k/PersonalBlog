-- 0001_init.sql: abhi.writes database schema and row level security

-- 1. Profiles Table
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'reader' check (role in ('reader','admin'))
);

create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- 2. Posts Table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body_html text not null default '',
  body_json jsonb,
  category text not null default 'Essay' check (category in ('Essay','Story','Note')),
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','scheduled','unlisted')),
  featured boolean not null default false,
  theme text not null default 'sage' check (theme in ('sage','butter','lavender','peach','midnight')),
  reading_font text not null default 'serif' check (reading_font in ('serif','sans')),
  cover_url text,
  read_minutes int not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_status_published on posts (status, published_at desc);

-- 3. Media Table
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- 4. Subscribers Table
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- 5. Messages Table
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- 6. Settings Table
create table if not exists settings (
  id int primary key default 1 check (id = 1),
  blog_name text default 'abhi.writes',
  tagline text default 'Slow thoughts for a fast internet.',
  author_name text default 'Abhi',
  contact_email text,
  bio text,
  currently text,
  writes_about text,
  github_url text default 'https://github.com',
  x_url text default 'https://twitter.com',
  linkedin_url text default 'https://linkedin.com',
  portrait_url text,
  default_theme text default 'sage' check (default_theme in ('sage','butter','lavender','peach','midnight'))
);

insert into settings (id) values (1) on conflict do nothing;

-- 7. Row Level Security (RLS)
alter table profiles enable row level security;
alter table posts enable row level security;
alter table media enable row level security;
alter table subscribers enable row level security;
alter table messages enable row level security;
alter table settings enable row level security;

-- Profiles Policies
create policy "Users may read their own profile" on profiles
  for select using (auth.uid() = id);

-- Posts Policies
create policy "Anyone can read published posts" on posts
  for select using (
    status = 'published' or 
    (status = 'scheduled' and published_at <= now())
  );

create policy "Admins have full access to posts" on posts
  for all using (is_admin());

-- Media Policies
create policy "Admins have full access to media" on media
  for all using (is_admin());

-- Subscribers Policies
create policy "Anyone can subscribe" on subscribers
  for insert with check (true);

create policy "Admins can view and manage subscribers" on subscribers
  for all using (is_admin());

-- Messages Policies
create policy "Anyone can send a message" on messages
  for insert with check (true);

create policy "Admins can view and manage messages" on messages
  for all using (is_admin());

-- Settings Policies
create policy "Anyone can view settings" on settings
  for select using (true);

create policy "Admins can update settings" on settings
  for update using (is_admin());
