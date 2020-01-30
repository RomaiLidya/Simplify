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
-- Name: wellac; Type: SCHEMA; Schema: -; Owner: simplify
--

CREATE SCHEMA wellac;


ALTER SCHEMA wellac OWNER TO simplify;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Client; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Client" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "clientType" character varying(255) NOT NULL,
    "contactPerson" character varying(255) NOT NULL,
    "contactNumber" character varying(255) NOT NULL,
    "contactEmail" character varying(255) NOT NULL,
    "secondaryContactPerson" character varying(255),
    "secondaryContactNumber" character varying(255),
    "secondaryContactEmail" character varying(255),
    country character varying(255) NOT NULL,
    "billingAddress" character varying(255) NOT NULL,
    "billingPostal" character varying(255) NOT NULL,
    "needGST" boolean DEFAULT true NOT NULL,
    "paymentStatus" character varying(255) DEFAULT 'PENDING'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE wellac."Client" OWNER TO simplify;

--
-- Name: TABLE "Client"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Client" IS 'Clients information';


--
-- Name: Client_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Client_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Client_id_seq" OWNER TO simplify;

--
-- Name: Client_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Client_id_seq" OWNED BY wellac."Client".id;


--
-- Name: Job; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Job" (
    id integer NOT NULL,
    "jobDate" date NOT NULL,
    "startTime" time without time zone,
    "endTime" time without time zone,
    "jobStatus" character varying(255) DEFAULT 'UNASSIGNED'::character varying NOT NULL,
    remarks character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "assginedBy" integer,
    "assignedVehicle" integer,
    "serviceId" integer
);


ALTER TABLE wellac."Job" OWNER TO simplify;

--
-- Name: TABLE "Job"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Job" IS 'A job represent the day when the service is being delivered';


--
-- Name: Job_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Job_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Job_id_seq" OWNER TO simplify;

--
-- Name: Job_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Job_id_seq" OWNED BY wellac."Job".id;


--
-- Name: Permission; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Permission" (
    id integer NOT NULL,
    module character varying(255) NOT NULL,
    "accessLevel" character varying(255) NOT NULL
);


ALTER TABLE wellac."Permission" OWNER TO simplify;

--
-- Name: TABLE "Permission"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Permission" IS 'List of Permission for the whole applcation';


--
-- Name: Permission_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Permission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Permission_id_seq" OWNER TO simplify;

--
-- Name: Permission_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Permission_id_seq" OWNED BY wellac."Permission".id;


--
-- Name: Role; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Role" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE wellac."Role" OWNER TO simplify;

--
-- Name: TABLE "Role"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Role" IS 'User role, which contains a group of permission';


--
-- Name: RolePermission; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."RolePermission" (
    "roleId" integer NOT NULL,
    "permissionId" integer NOT NULL
);


ALTER TABLE wellac."RolePermission" OWNER TO simplify;

--
-- Name: TABLE "RolePermission"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."RolePermission" IS 'User role, which contains a group of permission';


--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Role_id_seq" OWNER TO simplify;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Role_id_seq" OWNED BY wellac."Role".id;


--
-- Name: Service; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Service" (
    id integer NOT NULL,
    "serviceType" character varying(255) NOT NULL,
    "serviceNumber" character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "termStart" date NOT NULL,
    "termEnd" date NOT NULL,
    "invoiceNumber" character varying(255),
    "discountType" character varying(255) DEFAULT 'NA'::character varying NOT NULL,
    "discountAmt" double precision DEFAULT '0'::double precision NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ClientId" integer,
    "ServiceAddressId" integer,
    "EntityId" integer
);


ALTER TABLE wellac."Service" OWNER TO simplify;

--
-- Name: TABLE "Service"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Service" IS 'A group of service item. Can be taken as contract';


--
-- Name: ServiceAddress; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."ServiceAddress" (
    id integer NOT NULL,
    "contactPerson" character varying(255) NOT NULL,
    "contactNumber" character varying(255) NOT NULL,
    "secondaryContactPerson" character varying(255),
    "secondaryContactNumber" character varying(255),
    country character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    "postalCode" character varying(255) NOT NULL,
    "ClientId" integer
);


ALTER TABLE wellac."ServiceAddress" OWNER TO simplify;

--
-- Name: TABLE "ServiceAddress"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."ServiceAddress" IS 'Client service address';


--
-- Name: ServiceAddress_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."ServiceAddress_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."ServiceAddress_id_seq" OWNER TO simplify;

--
-- Name: ServiceAddress_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."ServiceAddress_id_seq" OWNED BY wellac."ServiceAddress".id;


--
-- Name: ServiceItem; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."ServiceItem" (
    id integer NOT NULL,
    description character varying(255) NOT NULL,
    quantity double precision DEFAULT '0'::double precision NOT NULL,
    "unitPrice" double precision DEFAULT '0'::double precision NOT NULL,
    "discountType" character varying(255) DEFAULT 'NA'::character varying NOT NULL,
    "discountAmt" double precision DEFAULT '0'::double precision NOT NULL,
    "totalPrice" double precision DEFAULT '0'::double precision NOT NULL,
    "recurringPeriod" character varying(255) DEFAULT 'NONE'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ServiceId" integer
);


ALTER TABLE wellac."ServiceItem" OWNER TO simplify;

--
-- Name: TABLE "ServiceItem"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."ServiceItem" IS 'Each line item in a service';


--
-- Name: ServiceItemJob; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."ServiceItemJob" (
    "serviceItemId" integer NOT NULL,
    "jobId" integer NOT NULL
);


ALTER TABLE wellac."ServiceItemJob" OWNER TO simplify;

--
-- Name: TABLE "ServiceItemJob"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."ServiceItemJob" IS 'Each line item in a service';


--
-- Name: ServiceItemTemplate; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."ServiceItemTemplate" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "unitPrice" double precision NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE wellac."ServiceItemTemplate" OWNER TO simplify;

--
-- Name: TABLE "ServiceItemTemplate"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."ServiceItemTemplate" IS 'ServiceItem template for quick selection. Can be taken catelog.';


--
-- Name: ServiceItemTemplate_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."ServiceItemTemplate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."ServiceItemTemplate_id_seq" OWNER TO simplify;

--
-- Name: ServiceItemTemplate_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."ServiceItemTemplate_id_seq" OWNED BY wellac."ServiceItemTemplate".id;


--
-- Name: ServiceItem_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."ServiceItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."ServiceItem_id_seq" OWNER TO simplify;

--
-- Name: ServiceItem_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."ServiceItem_id_seq" OWNED BY wellac."ServiceItem".id;


--
-- Name: Service_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Service_id_seq" OWNER TO simplify;

--
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Service_id_seq" OWNED BY wellac."Service".id;


--
-- Name: UserProfile; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."UserProfile" (
    id integer NOT NULL,
    "displayName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "contactNumber" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE wellac."UserProfile" OWNER TO simplify;

--
-- Name: TABLE "UserProfile"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."UserProfile" IS 'UserProfile contains User metadata that are not related to log in';


--
-- Name: UserProfileJob; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."UserProfileJob" (
    "userProfileId" integer NOT NULL,
    "jobId" integer NOT NULL
);


ALTER TABLE wellac."UserProfileJob" OWNER TO simplify;

--
-- Name: TABLE "UserProfileJob"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."UserProfileJob" IS 'UserProfile contains User metadata that are not related to log in';


--
-- Name: UserProfileRole; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."UserProfileRole" (
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userProfileId" integer NOT NULL,
    "roleId" integer NOT NULL
);


ALTER TABLE wellac."UserProfileRole" OWNER TO simplify;

--
-- Name: TABLE "UserProfileRole"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."UserProfileRole" IS 'UserProfile contains User metadata that are not related to log in';


--
-- Name: Vehicle; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Vehicle" (
    id integer NOT NULL,
    model character varying(255),
    "carplateNumber" character varying(255) NOT NULL,
    "coeExpiryDate" date,
    "vehicleStatus" boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "employeeInCharge" integer
);


ALTER TABLE wellac."Vehicle" OWNER TO simplify;

--
-- Name: TABLE "Vehicle"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Vehicle" IS 'Company vehicles information';


--
-- Name: Vehicle_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Vehicle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Vehicle_id_seq" OWNER TO simplify;

--
-- Name: Vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Vehicle_id_seq" OWNED BY wellac."Vehicle".id;


--
-- Name: Entity; Type: TABLE; Schema: wellac; Owner: simplify
--

CREATE TABLE wellac."Entity" (
  id integer NOT NULL,
  "name" character varying(255) NOT NULL,
  "address" character varying(255) NOT NULL,
  "logo" character varying(255) NOT NULL,
  "contactNumber" character varying(255) NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
)
;


ALTER TABLE wellac."Entity" OWNER TO simplify;

--
-- Name: TABLE "Entity"; Type: COMMENT; Schema: wellac; Owner: simplify
--

COMMENT ON TABLE wellac."Entity" IS 'Entity for quick selection. Can be taken catalog';


--
-- Name: Entity_id_seq; Type: SEQUENCE; Schema: wellac; Owner: simplify
--

CREATE SEQUENCE wellac."Entity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE wellac."Entity_id_seq" OWNER TO simplify;

--
-- Name: Entity_id_seq; Type: SEQUENCE OWNED BY; Schema: wellac; Owner: simplify
--

ALTER SEQUENCE wellac."Entity_id_seq" OWNED BY wellac."Entity".id;

--
-- Name: Client id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Client" ALTER COLUMN id SET DEFAULT nextval('wellac."Client_id_seq"'::regclass);


--
-- Name: Job id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Job" ALTER COLUMN id SET DEFAULT nextval('wellac."Job_id_seq"'::regclass);


--
-- Name: Permission id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Permission" ALTER COLUMN id SET DEFAULT nextval('wellac."Permission_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Role" ALTER COLUMN id SET DEFAULT nextval('wellac."Role_id_seq"'::regclass);


--
-- Name: Service id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Service" ALTER COLUMN id SET DEFAULT nextval('wellac."Service_id_seq"'::regclass);


--
-- Name: ServiceAddress id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceAddress" ALTER COLUMN id SET DEFAULT nextval('wellac."ServiceAddress_id_seq"'::regclass);


--
-- Name: ServiceItem id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItem" ALTER COLUMN id SET DEFAULT nextval('wellac."ServiceItem_id_seq"'::regclass);


--
-- Name: ServiceItemTemplate id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItemTemplate" ALTER COLUMN id SET DEFAULT nextval('wellac."ServiceItemTemplate_id_seq"'::regclass);


--
-- Name: Vehicle id; Type: DEFAULT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Vehicle" ALTER COLUMN id SET DEFAULT nextval('wellac."Vehicle_id_seq"'::regclass);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_module_accessLevel_key; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Permission"
    ADD CONSTRAINT "Permission_module_accessLevel_key" UNIQUE (module, "accessLevel");


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: ServiceAddress ServiceAddress_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceAddress"
    ADD CONSTRAINT "ServiceAddress_pkey" PRIMARY KEY (id);


--
-- Name: ServiceItemJob ServiceItemJob_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItemJob"
    ADD CONSTRAINT "ServiceItemJob_pkey" PRIMARY KEY ("serviceItemId", "jobId");


--
-- Name: ServiceItemTemplate ServiceItemTemplate_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItemTemplate"
    ADD CONSTRAINT "ServiceItemTemplate_pkey" PRIMARY KEY (id);


--
-- Name: ServiceItem ServiceItem_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItem"
    ADD CONSTRAINT "ServiceItem_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: UserProfileJob UserProfileJob_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfileJob"
    ADD CONSTRAINT "UserProfileJob_pkey" PRIMARY KEY ("userProfileId", "jobId");


--
-- Name: UserProfileRole UserProfileRole_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfileRole"
    ADD CONSTRAINT "UserProfileRole_pkey" PRIMARY KEY ("userProfileId", "roleId");


--
-- Name: UserProfile UserProfile_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfile"
    ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id);


--
-- Name: Entity Entity_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Entity"
    ADD CONSTRAINT "Entity_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);

--
-- Name: Vehicle Vehicle_carplateNumber_unique; Type: UNIQUE CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Vehicle"
    ADD CONSTRAINT "Vehicle_carplateNumber_unique" UNIQUE ("carplateNumber");


--
-- Name: Job Job_assginedBy_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Job"
    ADD CONSTRAINT "Job_assginedBy_fkey" FOREIGN KEY ("assginedBy") REFERENCES wellac."UserProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Job Job_assignedVehicle_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Job"
    ADD CONSTRAINT "Job_assignedVehicle_fkey" FOREIGN KEY ("assignedVehicle") REFERENCES wellac."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Job Job_assignedVehicle_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Job" 
    ADD CONSTRAINT "Job_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES wellac."Service"(id) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES wellac."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES wellac."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceAddress ServiceAddress_ClientId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceAddress"
    ADD CONSTRAINT "ServiceAddress_ClientId_fkey" FOREIGN KEY ("ClientId") REFERENCES wellac."Client"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ServiceItemJob ServiceItemJob_jobId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItemJob"
    ADD CONSTRAINT "ServiceItemJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES wellac."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceItemJob ServiceItemJob_serviceItemId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItemJob"
    ADD CONSTRAINT "ServiceItemJob_serviceItemId_fkey" FOREIGN KEY ("serviceItemId") REFERENCES wellac."ServiceItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ServiceItem ServiceItem_ServiceId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."ServiceItem"
    ADD CONSTRAINT "ServiceItem_ServiceId_fkey" FOREIGN KEY ("ServiceId") REFERENCES wellac."Service"(id) ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Name: Service Service_ClientId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Service"
    ADD CONSTRAINT "Service_ClientId_fkey" FOREIGN KEY ("ClientId") REFERENCES wellac."Client"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_EntityId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Service"
    ADD CONSTRAINT "Service_EntityId_fkey" FOREIGN KEY ("EntityId") REFERENCES wellac."Entity"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_ServiceAddressId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Service"
    ADD CONSTRAINT "Service_ServiceAddressId_fkey" FOREIGN KEY ("ServiceAddressId") REFERENCES wellac."ServiceAddress"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserProfileJob UserProfileJob_jobId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfileJob"
    ADD CONSTRAINT "UserProfileJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES wellac."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProfileJob UserProfileJob_userProfileId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfileJob"
    ADD CONSTRAINT "UserProfileJob_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES wellac."UserProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProfileRole UserProfileRole_roleId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfileRole"
    ADD CONSTRAINT "UserProfileRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES wellac."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProfileRole UserProfileRole_userProfileId_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfileRole"
    ADD CONSTRAINT "UserProfileRole_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES wellac."UserProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProfile UserProfile_id_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."UserProfile"
    ADD CONSTRAINT "UserProfile_id_fkey" FOREIGN KEY (id) REFERENCES shared."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

--
-- Name: Vehicle Vehicle_employeeInCharge_fkey; Type: FK CONSTRAINT; Schema: wellac; Owner: simplify
--

ALTER TABLE ONLY wellac."Vehicle"
    ADD CONSTRAINT "Vehicle_employeeInCharge_fkey" FOREIGN KEY ("employeeInCharge") REFERENCES wellac."UserProfile" (id) ON DELETE SET NULL ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

