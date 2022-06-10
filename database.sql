create table "users"(
    "id" serial primary key,
    "name" text not null,
    "email" text unique not null,
    "password" text not null,
    "createAt" timestamp without time zone not null default now()
);

create table "sessions"(
    "id" serial primary key,
    "token" text not null unique,
    "userId" bigint not null references "users"(id),
    "createAt" timestamp without time zone not null default now()
);

create table urls(
    "id" serial primary key,
    "url" text not null,
    "shorten" text not null unique,
    "views" integer not null default 0,
    "userId" bigint not null references "users"(id),
    "createdAt" timestamp without time zone not null default now()
);
