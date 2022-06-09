create table urls(
    "id" serial primary key,
    "url" text not null,
    "shorten" text not null unique,
    "views" integer not null default 0,
    "userId" bigint not null references "users"(id),
    "createdAt" timestamp without time zone not null default now()
);
