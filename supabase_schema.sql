-- Supabase PostgreSQL Database Schema for Techies Studio AI Video Editor

-- 1. Profiles Table (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'free' check (role in ('free', 'premium', 'admin'))
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Projects Table
create table public.projects (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  last_edited text not null,
  duration text not null,
  resolution text not null,
  file_size text not null,
  status text not null,
  thumbnail text,
  video_url text not null,
  captions jsonb default '[]'::jsonb,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Projects
alter table public.projects enable row level security;

create policy "Users can manage their own projects" on public.projects
  for all using (auth.uid() = user_id);


-- 3. Media Files Table
create table public.media_files (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  size text not null,
  type text not null check (type in ('video', 'audio', 'image', 'thumbnail', 'export')),
  upload_date text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Media Files
alter table public.media_files enable row level security;

create policy "Users can manage their own media files" on public.media_files
  for all using (auth.uid() = user_id);


-- 4. Exports Table
create table public.exports (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  url text not null,
  status text not null,
  progress integer default 0,
  date text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Exports
alter table public.exports enable row level security;

create policy "Users can manage their own exports" on public.exports
  for all using (auth.uid() = user_id);


-- 5. Analytics Table
create table public.analytics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Analytics
alter table public.analytics enable row level security;

create policy "Users can view and insert their own analytics" on public.analytics
  for all using (auth.uid() = user_id);


-- 6. Performance Indexes
create index idx_projects_user_id on public.projects(user_id);
create index idx_media_files_user_id on public.media_files(user_id);
create index idx_exports_user_id on public.exports(user_id);
create index idx_analytics_user_id on public.analytics(user_id);
create index idx_profiles_role on public.profiles(role);
