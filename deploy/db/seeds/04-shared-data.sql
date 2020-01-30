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
-- Data for Name: Tenant; Type: TABLE DATA; Schema: shared; Owner: simplify
--

INSERT INTO shared."Tenant" (key, name, "numberOfLicense", "salesPerson", "createdAt", "updatedAt") VALUES ('WELLAC', 'Well Aircon Pte Lte', 10, 'David Yap', '2019-06-12 00:07:29.641+08', '2019-06-12 00:07:33.881+08');
INSERT INTO shared."Tenant" (key, name, "numberOfLicense", "salesPerson", "createdAt", "updatedAt") VALUES ('AIRPLE', 'Airple Pte Lte', 1, 'David Yap', '2019-06-12 00:07:29.641+08', '2019-06-12 00:07:33.881+08');

--
-- Data for Name: User; Type: TABLE DATA; Schema: shared; Owner: simplify
--

INSERT INTO shared."User" (id, "loginName", password, concurrency, active, lock, "invalidLogin", "TenantKey") VALUES (1, 'admin@wellac.com', '$argon2i$v=19$m=4096,t=3,p=1$02hnyP+WBJmmbyJgwkpeRg$R31ErRILNuxtBcHjWWFD7kZFaT4EBh7/XObVEQ9T7HQ', 99, true, false, 0, 'WELLAC');
INSERT INTO shared."User" (id, "loginName", password, concurrency, active, lock, "invalidLogin", "TenantKey") VALUES (2, 'employee01@wellac.com', '$argon2i$v=19$m=4096,t=3,p=1$02hnyP+WBJmmbyJgwkpeRg$R31ErRILNuxtBcHjWWFD7kZFaT4EBh7/XObVEQ9T7HQ', 99, true, false, 0, 'WELLAC');
INSERT INTO shared."User" (id, "loginName", password, concurrency, active, lock, "invalidLogin", "TenantKey") VALUES (3, 'employee02@wellac.com', '$argon2i$v=19$m=4096,t=3,p=1$02hnyP+WBJmmbyJgwkpeRg$R31ErRILNuxtBcHjWWFD7kZFaT4EBh7/XObVEQ9T7HQ', 99, true, false, 0, 'WELLAC');
INSERT INTO shared."User" (id, "loginName", password, concurrency, active, lock, "invalidLogin", "TenantKey") VALUES (4, 'employee03@wellac.com', '$argon2i$v=19$m=4096,t=3,p=1$02hnyP+WBJmmbyJgwkpeRg$R31ErRILNuxtBcHjWWFD7kZFaT4EBh7/XObVEQ9T7HQ', 99, true, false, 0, 'WELLAC');
INSERT INTO shared."User" (id, "loginName", password, concurrency, active, lock, "invalidLogin", "TenantKey") VALUES (5, 'employee04@wellac.com', '$argon2i$v=19$m=4096,t=3,p=1$02hnyP+WBJmmbyJgwkpeRg$R31ErRILNuxtBcHjWWFD7kZFaT4EBh7/XObVEQ9T7HQ', 99, true, false, 0, 'WELLAC');
INSERT INTO shared."User" (id, "loginName", password, concurrency, active, lock, "invalidLogin", "TenantKey") VALUES (6, 'employee05@wellac.com', '$argon2i$v=19$m=4096,t=3,p=1$02hnyP+WBJmmbyJgwkpeRg$R31ErRILNuxtBcHjWWFD7kZFaT4EBh7/XObVEQ9T7HQ', 99, true, false, 0, 'WELLAC');


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: shared; Owner: simplify
--

SELECT pg_catalog.setval('shared."User_id_seq"', 6, true);


--
-- PostgreSQL database dump complete
--
