-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.3
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: uno | type: DATABASE --
-- DROP DATABASE IF EXISTS uno;
CREATE DATABASE uno;
-- ddl-end --


-- object: public.card | type: TABLE --
-- DROP TABLE IF EXISTS public.card CASCADE;
CREATE TABLE public.card (
	card_id serial NOT NULL,
	hand_id smallint,
	card_stack_id smallint,
	CONSTRAINT card_pk PRIMARY KEY (card_id)

);
-- ddl-end --
ALTER TABLE public.card OWNER TO postgres;
-- ddl-end --

-- object: public.hand | type: TABLE --
-- DROP TABLE IF EXISTS public.hand CASCADE;
CREATE TABLE public.hand (
	hand_id serial NOT NULL,
	CONSTRAINT hand_pk PRIMARY KEY (hand_id)

);
-- ddl-end --
ALTER TABLE public.hand OWNER TO postgres;
-- ddl-end --

-- object: public.player | type: TABLE --
-- DROP TABLE IF EXISTS public.player CASCADE;
CREATE TABLE public.player (
	player_id serial NOT NULL,
	hand_id smallint,
	game_room_id smallint,
	CONSTRAINT player_pk PRIMARY KEY (player_id)

);
-- ddl-end --
ALTER TABLE public.player OWNER TO postgres;
-- ddl-end --

-- object: public.card_stack | type: TABLE --
-- DROP TABLE IF EXISTS public.card_stack CASCADE;
CREATE TABLE public.card_stack (
	card_stack_id serial NOT NULL,
	CONSTRAINT card_stack_pk PRIMARY KEY (card_stack_id)

);
-- ddl-end --
ALTER TABLE public.card_stack OWNER TO postgres;
-- ddl-end --

-- object: public.game_room | type: TABLE --
-- DROP TABLE IF EXISTS public.game_room CASCADE;
CREATE TABLE public.game_room (
	game_room_id serial NOT NULL,
	CONSTRAINT game_room_pk PRIMARY KEY (game_room_id)

);
-- ddl-end --
ALTER TABLE public.game_room OWNER TO postgres;
-- ddl-end --

-- object: "card_hand_FK" | type: CONSTRAINT --
-- ALTER TABLE public.card DROP CONSTRAINT IF EXISTS "card_hand_FK" CASCADE;
ALTER TABLE public.card ADD CONSTRAINT "card_hand_FK" FOREIGN KEY (hand_id)
REFERENCES public.hand (hand_id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: card_card_stack_id | type: CONSTRAINT --
-- ALTER TABLE public.card DROP CONSTRAINT IF EXISTS card_card_stack_id CASCADE;
ALTER TABLE public.card ADD CONSTRAINT card_card_stack_id FOREIGN KEY (card_stack_id)
REFERENCES public.card_stack (card_stack_id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: player_hand_id | type: CONSTRAINT --
-- ALTER TABLE public.player DROP CONSTRAINT IF EXISTS player_hand_id CASCADE;
ALTER TABLE public.player ADD CONSTRAINT player_hand_id FOREIGN KEY (hand_id)
REFERENCES public.hand (hand_id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "player_game_room_FK" | type: CONSTRAINT --
-- ALTER TABLE public.player DROP CONSTRAINT IF EXISTS "player_game_room_FK" CASCADE;
ALTER TABLE public.player ADD CONSTRAINT "player_game_room_FK" FOREIGN KEY (game_room_id)
REFERENCES public.game_room (game_room_id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


