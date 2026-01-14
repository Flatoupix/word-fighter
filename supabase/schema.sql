-- Online prototype tables (public schema)
create table if not exists rooms (
  id text primary key,
  host_id text,
  status text not null default 'lobby',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references rooms(id) on delete cascade,
  player_id text not null,
  name text not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default now()
);

create unique index if not exists players_room_player on players(room_id, player_id);

-- Open policies for prototype (adjust for production)
alter table rooms enable row level security;
alter table players enable row level security;

create policy "rooms_read" on rooms for select using (true);
create policy "rooms_write" on rooms for insert with check (true);
create policy "rooms_update" on rooms for update using (true);

create policy "players_read" on players for select using (true);
create policy "players_write" on players for insert with check (true);
create policy "players_update" on players for update using (true);
