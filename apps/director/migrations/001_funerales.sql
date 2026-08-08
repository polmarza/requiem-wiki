-- Archivo persistente de funerales celebrados. Solo el director (service role)
-- escribe aquí; la web lee con la clave anon. Ver docs/data-model.md.

create table if not exists funerales (
  id uuid primary key,
  wiki text not null,
  dominio text not null,
  titulo text not null,
  ns integer not null,
  causa text not null,
  usuario_admin text not null,
  hora_muerte timestamptz not null,
  elegia text not null,
  flores integer not null default 0,
  dolientes_max integer not null default 0,
  velado_en timestamptz not null default now(),
  ensayo boolean not null default false
);

create index if not exists funerales_velado_en_idx on funerales (velado_en desc);
create index if not exists funerales_wiki_idx on funerales (wiki);

alter table funerales enable row level security;

-- El archivo es público por diseño: cualquiera puede leer el cementerio.
create policy "funerales_select_publico"
  on funerales for select
  to anon, authenticated
  using (true);

-- Nadie escribe desde el cliente. Solo el service role (el director) inserta.
-- No se crea ninguna policy de insert/update/delete para anon/authenticated:
-- sin policy, esas operaciones quedan denegadas por defecto con RLS activo.
