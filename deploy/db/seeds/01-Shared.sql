--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Debian 11.3-1.pgdg90+1)
-- Dumped by pg_dump version 11.3 (Debian 11.3-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: shared; Type: SCHEMA; Schema: -; Owner: simplify
--

CREATE SCHEMA shared;


ALTER SCHEMA shared OWNER TO simplify;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Tenant; Type: TABLE; Schema: shared; Owner: simplify
--

CREATE TABLE shared."Tenant" (
    key character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    "numberOfLicense" integer DEFAULT 0 NOT NULL,
    "salesPerson" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE shared."Tenant" OWNER TO simplify;

--
-- Name: TABLE "Tenant"; Type: COMMENT; Schema: shared; Owner: simplify
--

COMMENT ON TABLE shared."Tenant" IS 'Store tenant information';


--
-- Name: User; Type: TABLE; Schema: shared; Owner: simplify
--

CREATE TABLE shared."User" (
    id integer NOT NULL,
    "loginName" character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    concurrency integer DEFAULT 1 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    lock boolean DEFAULT false NOT NULL,
    "invalidLogin" integer DEFAULT 0 NOT NULL,
    "TenantKey" character varying(255)
);


ALTER TABLE shared."User" OWNER TO simplify;

--
-- Name: TABLE "User"; Type: COMMENT; Schema: shared; Owner: simplify
--

COMMENT ON TABLE shared."User" IS 'User stores all the information required for login';


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: shared; Owner: simplify
--

CREATE SEQUENCE shared."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shared."User_id_seq" OWNER TO simplify;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: shared; Owner: simplify
--

ALTER SEQUENCE shared."User_id_seq" OWNED BY shared."User".id;


--
-- Name: User id; Type: DEFAULT; Schema: shared; Owner: simplify
--

ALTER TABLE ONLY shared."User" ALTER COLUMN id SET DEFAULT nextval('shared."User_id_seq"'::regclass);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: shared; Owner: simplify
--

ALTER TABLE ONLY shared."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (key);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: shared; Owner: simplify
--

ALTER TABLE ONLY shared."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);

--
-- Name: User User_loginName_unique; Type: UNIQUE CONSTRAINT; Schema: shared; Owner: simplify
--

ALTER TABLE ONLY shared."User"
    ADD CONSTRAINT "User_loginName_unique" UNIQUE ("loginName");

--
-- Name: User User_TenantKey_fkey; Type: FK CONSTRAINT; Schema: shared; Owner: simplify
--

ALTER TABLE ONLY shared."User"
    ADD CONSTRAINT "User_TenantKey_fkey" FOREIGN KEY ("TenantKey") REFERENCES shared."Tenant"(key) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

