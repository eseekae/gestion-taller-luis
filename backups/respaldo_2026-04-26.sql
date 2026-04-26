--
-- PostgreSQL database dump
--

\restrict Qbwue7RHgPeJae2QDvZ1Of0puoGGafgEkdbClP18W3vE7aomIGM1sGcYvk0J3SI

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: descontar_stock(uuid, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.descontar_stock(prod_id uuid, cant numeric) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE inventario
  SET stock = stock - cant
  WHERE id = prod_id;
END;
$$;


ALTER FUNCTION public.descontar_stock(prod_id uuid, cant numeric) OWNER TO postgres;

--
-- Name: entregar_stock(uuid, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.entregar_stock(prod_id uuid, cant numeric) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN 
  UPDATE inventario SET stock = stock - cant, stock_reservado = COALESCE(stock_reservado, 0) - cant WHERE id = prod_id; 
END;
$$;


ALTER FUNCTION public.entregar_stock(prod_id uuid, cant numeric) OWNER TO postgres;

--
-- Name: reservar_stock(uuid, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reservar_stock(prod_id uuid, cant numeric) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN 
  UPDATE inventario SET stock_reservado = COALESCE(stock_reservado, 0) + cant WHERE id = prod_id; 
END;
$$;


ALTER FUNCTION public.reservar_stock(prod_id uuid, cant numeric) OWNER TO postgres;

--
-- Name: revertir_entrega_stock(uuid, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.revertir_entrega_stock(prod_id uuid, cant numeric) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN 
  UPDATE inventario SET stock = stock + cant, stock_reservado = COALESCE(stock_reservado, 0) + cant WHERE id = prod_id; 
END;
$$;


ALTER FUNCTION public.revertir_entrega_stock(prod_id uuid, cant numeric) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario text NOT NULL,
    accion text NOT NULL,
    detalles text,
    fecha timestamp with time zone DEFAULT now()
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    telefono text,
    colegio text,
    rut text
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: colegios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colegios (
    id bigint NOT NULL,
    nombre text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.colegios OWNER TO postgres;

--
-- Name: colegios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.colegios ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.colegios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: detalles_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_pedido (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    producto_id uuid,
    cantidad numeric DEFAULT 1,
    talla text,
    precio_unitario numeric,
    estado text DEFAULT 'Pendiente'::text,
    cantidad_entregada integer DEFAULT 0,
    pedido_id bigint
);


ALTER TABLE public.detalles_pedido OWNER TO postgres;

--
-- Name: historial_entregas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_entregas (
    id bigint NOT NULL,
    pedido_id bigint,
    items_entregados jsonb,
    fecha timestamp with time zone DEFAULT timezone('utc'::text, now()),
    creado_por text
);


ALTER TABLE public.historial_entregas OWNER TO postgres;

--
-- Name: historial_entregas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historial_entregas ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.historial_entregas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre text NOT NULL,
    stock numeric DEFAULT 0,
    precio_unitario numeric DEFAULT 0,
    categoria text DEFAULT 'General'::text,
    created_at timestamp with time zone DEFAULT now(),
    precio_base numeric DEFAULT 0,
    precio_especial_extra numeric DEFAULT 2000,
    talla text DEFAULT 'Estándar'::text,
    stock_reservado numeric DEFAULT 0,
    colegio text,
    creado_por text
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pedido_id bigint,
    monto integer NOT NULL,
    fecha_pago date DEFAULT CURRENT_DATE,
    metodo_pago text,
    created_at timestamp with time zone DEFAULT now(),
    creado_por text,
    CONSTRAINT pagos_metodo_pago_check CHECK ((metodo_pago = ANY (ARRAY['Transferencia'::text, 'Efectivo'::text, 'Débito'::text, 'Crédito'::text])))
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    cliente_id uuid,
    fecha_creacion timestamp with time zone DEFAULT timezone('utc'::text, now()),
    estado text DEFAULT 'Pendiente'::text,
    abono integer DEFAULT 0,
    total_final integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    producto text,
    talla text,
    es_especial boolean DEFAULT false,
    cantidad numeric DEFAULT 1,
    producto_id uuid,
    colegio text DEFAULT 'Particular'::text,
    fecha_entrega date,
    observaciones text,
    creado_por text,
    id bigint NOT NULL,
    motivo_anulacion text
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pedidos ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.pedidos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditoria (id, usuario, accion, detalles, fecha) FROM stdin;
44da9620-b357-4562-a654-bd944e0421ef	Sistema/Anónimo	Luis creó venta de $143000	Pedido #1	2026-04-03 21:52:35.427085+00
f2d5c2ff-53ff-469a-af84-b4985809cf36	Sistema/Anónimo	Luis creó venta de $56200	Pedido #2	2026-04-03 21:59:26.520513+00
71c7c12b-35a4-4aa4-ae8f-cfdc2cec0304	Sistema/Anónimo	Avisó a cliente: Luis Tapia	Pedido 2	2026-04-03 22:00:02.447339+00
154da52c-8f4d-4b26-879f-73dc4076694e	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:30.487423+00
d1b94cc3-5fec-4858-805f-2e3f5edb8ec9	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:31.762982+00
2909d23a-263e-44f7-a80f-b6f19c8f4507	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:33.602147+00
f6d97dfe-89cf-42ab-ad54-5c0355014979	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:34.03769+00
b729d445-5da3-4eab-a708-bbd6306fb465	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:40.087461+00
c02c4d2f-b059-4a7f-a544-0325e0e2940d	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:41.631403+00
cb201a42-5784-4990-a10a-b6cdd15645c4	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-03 22:00:45.826634+00
5308f507-2472-47e9-ab7f-a498d534013e	Sistema/Anónimo	Restó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-03 22:00:49.313589+00
f16c427b-d27f-448b-8dab-9a70b705acfe	Sistema/Anónimo	Entregó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-03 22:00:50.575782+00
0cc79e5f-7543-4df3-8f48-806241bf0d0f	Sistema/Anónimo	Restó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-03 22:01:01.76456+00
6a569a56-6d74-4e70-8da9-57d573a556f3	Sistema/Anónimo	Restó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-03 22:01:02.649228+00
f12bbe31-f100-4876-b75d-99be865691a5	Sistema/Anónimo	Entregó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-03 22:01:03.425796+00
077e3071-92bc-4456-9202-52ce46c0e6e1	Sistema/Anónimo	Restó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-03 22:01:05.939412+00
f50e05ab-b1f9-40aa-be26-e23a6bed8683	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/C	Pedido 2	2026-04-03 22:01:09.641005+00
ed4c22cf-4e1d-40bb-940a-2d6c89d2b675	Sistema/Anónimo	Exportó Excel de pedidos	Reporte detallado con pagos y horas	2026-04-03 22:04:49.788821+00
18b9794f-c025-4254-b8d1-6ef07e1d69ee	Sistema/Anónimo	Exportó Excel de pedidos	Reporte detallado con pagos y horas	2026-04-03 22:15:36.978482+00
454ac644-6e8e-42f4-913b-65ad52c72249	Sistema/Anónimo	 creó venta de $44600	Pedido #3	2026-04-03 22:44:17.078391+00
178a4b5d-7acb-45f5-aa7c-89010c40b8ef	Sistema/Anónimo	Avisó a cliente: Gaspar	Pedido 3	2026-04-03 22:45:06.876362+00
f9bbd3f5-80f2-4a98-82ac-bc8d522ee0e8	Sistema/Anónimo	Luis creó venta de $39000	Pedido #4	2026-04-03 23:04:38.22001+00
56f3b00a-9fdb-4df2-89bd-5f1ea7f51287	Sistema/Anónimo	Registró pago de $39000 (Débito)	Cliente: María Juana 2	2026-04-03 23:05:24.711882+00
cd7fc3da-2311-46d3-a0a0-7018ff9c0795	Sistema/Anónimo	CORRIGIÓ/DESCONTÓ pago de $25000 (Débito)	Cliente: María Juana 2	2026-04-03 23:16:44.899216+00
853d77a5-736c-4238-bdf8-1d3d81bf3bff	Sistema/Anónimo	CORRIGIÓ/DESCONTÓ pago de $25000 (Débito)	Cliente: María Juana 2	2026-04-03 23:16:45.962939+00
f7c6447d-043a-4163-ac33-3fc0a7d8a43f	Sistema/Anónimo	Registró pago de $20000 (Débito)	Cliente: María Juana 2	2026-04-03 23:17:15.559588+00
761c2aee-589d-45bf-80ff-0f4888fa3a9e	Sistema/Anónimo	CORRIGIÓ/DESCONTÓ pago de $1000000 (Débito)	Cliente: María Juana 2	2026-04-03 23:18:01.001146+00
a64f2bf5-13d8-4a40-b2a1-70bbf235541a	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 4	2026-04-03 23:23:20.902823+00
8334b05c-306c-432c-a05a-63f8d5b34af0	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 4	2026-04-03 23:23:22.450294+00
1bb60c4a-7526-4dfa-b6c6-ac1e125f0ca5	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 4	2026-04-03 23:23:24.777767+00
c246c974-32da-4491-b808-df28ce34f658	Sistema/Anónimo	Restó 1 unidad(es) de PANTALON BUZO	Pedido 4	2026-04-03 23:23:27.66418+00
87f7e740-5647-494a-b246-e631254ecb02	Sistema/Anónimo	Avisó a cliente: María Juana 2	Pedido 4	2026-04-03 23:23:38.710519+00
fc20cf29-46d0-42e1-85d3-ac25b429a276	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 4	2026-04-03 23:23:41.021108+00
201fc849-a8b9-4980-8fb9-91eb648cbc6b	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 4	2026-04-03 23:23:43.256764+00
adcacb9d-9b55-486d-a2fd-5001681d2ecb	Sistema/Anónimo	ENTREGA TOTAL a María Juana 2	Pedido 4	2026-04-03 23:23:48.98446+00
b6d293b3-81a8-4694-8b7b-aad36c146904	Sistema/Anónimo	Luis creó venta de $34200	Pedido #5	2026-04-03 23:28:19.712083+00
dfc00664-2881-4fae-9863-db6d9569f8d4	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-03 23:29:03.09207+00
75692d0f-143b-4309-b2af-8058b269fdbb	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-03 23:29:05.398646+00
e9d91308-7765-477b-9d2f-734bc9ede7b4	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:14:16.700376+00
e1a2c3c4-239f-40ef-8c38-4a768d6d7b0c	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:14:19.597048+00
0469f640-e86f-4bb9-969d-19a8e14e8564	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:14:30.345351+00
0945bc68-e86e-4992-a0de-88f6ee042ae4	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:14:32.666058+00
98be681f-600d-42bf-b8c0-4a067b7491c3	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:18:13.728248+00
25cb5461-b458-4937-be96-2b66449480ce	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:18:13.754736+00
cd8928e2-ff33-4378-b81a-11b1ae30863a	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:18:15.3524+00
b6c84285-a832-4cda-b9e3-03e719390ca9	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:18:15.660142+00
98d2f206-13d2-4323-b520-20c8a96fca5e	Sistema/Anónimo	ENTREGA TOTAL a María juana	Pedido 5	2026-04-04 00:18:22.822928+00
ebfa07f0-381a-4b3e-b4b1-8353a41b9358	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:18:40.395875+00
c8d07f06-a72b-4f06-a0b0-68758aeaeee4	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 00:18:42.118526+00
c0bb2e8e-6415-46db-a7cb-07d67af53ece	Sistema/Anónimo	Luis creó venta de $19300	Pedido #6	2026-04-04 00:30:50.961172+00
9384a6db-44d5-444d-a6d3-4b157502fa06	Sistema/Anónimo	CORRIGIÓ/DESCONTÓ pago de $20000 (Transferencia)	Cliente: Doña juana	2026-04-04 01:17:44.581677+00
9f4980ca-db93-44be-ac07-76dfdc252cc1	Sistema/Anónimo	Registró pago de $20000 (Transferencia)	Cliente: Doña juana	2026-04-04 01:17:52.653396+00
b0c8588f-a8fc-4132-9f77-f183e490a5bd	Sistema/Anónimo	CORRIGIÓ/DESCONTÓ pago de $10000 (Transferencia)	Cliente: Doña juana	2026-04-04 01:19:36.049939+00
605efac5-7947-40d5-95d2-1daf9d1e74e4	Sistema/Anónimo	Registró pago de $4300 (Crédito)	Cliente: Doña juana	2026-04-04 01:19:55.100569+00
0a688fbf-a6ef-43fa-9fcb-20a55d2020d9	Sistema/Anónimo	Admin movió a STOCK CLIENTE: POLERA USO DIARIO M/L	Reservado para: Luis Tapia (ID: 7ee783dc-e2be-4f2c-8b63-43fc139770e0)	2026-04-04 01:24:48.656298+00
4f47dab5-3020-4c81-8c94-f42711833e96	Sistema/Anónimo	Admin creó venta de $125290	Pedido #7	2026-04-04 01:28:12.612922+00
79578fc6-d1ad-429b-b33f-a2ddd6fd7dd3	Sistema/Anónimo	 creó venta de $20500	Pedido #8	2026-04-04 02:10:04.063299+00
99188dc2-1973-4315-bef6-c062e4257745	Sistema/Anónimo	Restó 1 unidad(es) de PANTALON BUZO	Pedido 8	2026-04-04 02:11:00.187097+00
80961d5b-3ac9-4098-bd92-d1b02bb18a04	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 8	2026-04-04 02:11:04.051139+00
68a1968b-b686-4983-b5c1-cee23ad54cfb	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 8	2026-04-04 02:11:11.48441+00
d1083b4f-e607-41f3-bc14-caa1a096b83f	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 8	2026-04-04 02:11:12.758011+00
825e216c-a138-404a-80b6-695936a4fd92	Sistema/Anónimo	ENTREGA TOTAL a María Juana 3	Pedido 8	2026-04-04 02:11:18.023506+00
030b3dda-6465-44bb-bbd1-ed6a1152c2a1	Sistema/Anónimo	Luis movió a STOCK CLIENTE: BUZO COMPLETO	Reservado para: Luis Tapia (ID: fe8868bf-8b7c-4c8e-9e3e-26d22eecd85c)	2026-04-04 02:24:04.682282+00
e68571df-c491-4034-98f9-8b11d236d1db	Sistema/Anónimo	Luis movió a STOCK CLIENTE: POLERA USO DIARIO M/C	Reservado para: Luis Tapia (ID: 7b9d39be-3a73-48d7-8e8c-5a80b880c14a)	2026-04-04 02:24:10.51104+00
9174bca9-c883-4355-9f07-fbe3827bdd07	Sistema/Anónimo	Luis movió a STOCK CLIENTE: PANTALON BUZO	Reservado para: Doña juana (ID: 58e00ba3-0a16-476f-a3fb-753568ee4275)	2026-04-04 02:24:18.173409+00
e2aeda9f-3e40-4528-980d-24a975ff4525	Sistema/Anónimo	Luis movió a STOCK CLIENTE: BUZO COMPLETO	Reservado para: Prueba (ID: 453c20c4-c0db-4eb2-97e8-78b1fc587d50)	2026-04-04 02:24:33.256694+00
5bc0f2d0-5360-42ec-a26a-98a843362643	Sistema/Anónimo	Luis movió a STOCK CLIENTE: POLERA USO DIARIO M/L	Reservado para: María juana (ID: b572e5b1-7dd5-42fb-9eab-7c0a14812d4f)	2026-04-04 02:24:14.216584+00
e66b845a-e167-4035-857f-bf08c3bc8698	Sistema/Anónimo	Luis movió a STOCK CLIENTE: POLERA USO DIARIO M/L	Reservado para: Doña juana (ID: 81794da8-936d-4430-bb3d-47596c4fbf48)	2026-04-04 02:24:22.608168+00
b6de8d29-98db-4a43-9913-75ace45ecf77	Sistema/Anónimo	Restó 1 unidad(es) de PANTALON BUZO	Pedido 8	2026-04-04 02:46:21.494206+00
a3ffd054-377f-4db8-a851-152027a539ad	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 8	2026-04-04 02:46:22.311131+00
3a8f5889-7772-42f0-83e8-2ca6f3614780	Sistema/Anónimo	ENTREGA TOTAL a María Juana 3	Pedido 8	2026-04-04 02:47:31.81861+00
d9215230-1003-48e0-b4b2-a2f9beb4b430	Sistema/Anónimo	ENTREGA TOTAL a María Juana 3	Pedido 8	2026-04-04 02:47:35.649545+00
71469be6-3631-4d3e-b9d3-aa73330bc263	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 8	2026-04-04 02:49:03.630443+00
1d12312c-73cf-435d-bae0-708e627f19e3	Sistema/Anónimo	Restó 1 unidad(es) de PANTALON BUZO	Pedido 8	2026-04-04 02:49:06.424794+00
b867f3b0-6ff7-4dbb-a969-b2cb6cd81cbe	Sistema/Anónimo	ENTREGA TOTAL a María Juana 3	Pedido 8	2026-04-04 02:49:43.401353+00
4005b3eb-090a-4707-ab4e-e0dc12ecd120	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/C	Pedido 1	2026-04-04 03:39:07.763685+00
1292f321-3569-4399-bf29-07305943ad5c	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/C	Pedido 1	2026-04-04 03:39:08.536884+00
f67b38b1-f442-45a6-be31-dd661c62d142	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 6	2026-04-04 04:02:55.247304+00
b536d6ad-fe28-4af5-8e56-ad873357f17d	Sistema/Anónimo	Admin pasó a LISTO PARA RETIRO: POLERA USO DIARIO M/C	Pedido #55a2f146-ea65-4a15-b91d-a572bf37aaaa - Cliente: Luis tapia	2026-04-04 04:06:41.551491+00
c8498ec0-8007-4acb-bc16-329a58f5944e	Sistema/Anónimo	Avisó a cliente: María juana	Pedido 5	2026-04-04 04:07:09.308782+00
c178fa8f-659e-462f-8878-0477d31340b5	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 04:07:19.386384+00
d50131fc-2c7c-42a8-a08d-34adf1d9647a	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 04:07:21.680428+00
ca538beb-bc2d-45ed-b967-34d2f6c81e25	Sistema/Anónimo	ENTREGA TOTAL a María juana	Pedido 5	2026-04-04 04:07:25.334977+00
bd89a459-4bbc-4d9d-9035-4fdd7ba6e287	Sistema/Anónimo	Restó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 04:07:29.351495+00
f9c7468e-c5c5-4774-940e-454d7d98898c	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 5	2026-04-04 04:07:31.549996+00
c3debab9-e23c-4df9-8a39-0102ba6269c3	Sistema/Anónimo	ENTREGA TOTAL a María juana	Pedido 5	2026-04-04 04:07:36.44617+00
05a01089-9739-4c5f-bad3-c94565249e7f	Sistema/Anónimo	Avisó a cliente: María juana	Pedido 5	2026-04-04 04:07:38.227074+00
d58ac518-ed9f-48ea-a2a4-74f72d840c1c	Sistema/Anónimo	Restó 1 unidad(es) de PANTALON BUZO	Pedido 8	2026-04-04 04:07:57.197678+00
f444de6f-e620-44dd-9cf0-3de0c31406f5	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 8	2026-04-04 04:07:59.106403+00
66955976-ed92-4d44-a5ea-8ab9e7768e6e	Sistema/Anónimo	ENTREGA TOTAL a Prueba	Pedido 7	2026-04-04 04:30:12.754626+00
0db06706-ab1f-480a-8f1b-b334952d6f48	Sistema/Anónimo	Registró pago de $75290 (Transferencia)	Cliente: Prueba	2026-04-04 04:30:35.284565+00
2a627965-4548-4cc4-9105-de7713504291	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 6	2026-04-04 04:31:24.419436+00
4e6c4990-e817-44e5-b9f7-24ccd413eada	Sistema/Anónimo	ENTREGA TOTAL a María Juana 2	Pedido 4	2026-04-04 04:31:51.832064+00
d3b43a8c-04bf-47da-84bb-c71c213509a7	Sistema/Anónimo	Registró pago de $1030000 (Transferencia)	Cliente: María Juana 2	2026-04-04 04:32:12.127773+00
a741a825-4f0a-43ee-aaa2-266ac406ea7e	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/C	Pedido 2	2026-04-04 04:33:02.391677+00
33f9d764-e26e-4857-94a1-9c77b187379c	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 2	2026-04-04 04:33:05.424627+00
10a3d1e8-cbde-490e-97fc-fa4b23a29c1e	Sistema/Anónimo	Entregó 1 unidad(es) de BUZO COMPLETO	Pedido 2	2026-04-04 04:33:07.872067+00
80cdbee3-ee84-4c23-8bfb-8df939f8f1ce	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/C	Pedido 1	2026-04-04 04:34:09.93038+00
aad3d2ec-ab72-4a29-9178-a4d3a4087c68	Sistema/Anónimo	ENTREGA TOTAL a Luis tapia	Pedido 1	2026-04-04 04:35:05.152381+00
6a28f1b2-0546-4ed1-b050-c8c99b4e55af	Sistema/Anónimo	Registró pago de $43000 (Transferencia)	Cliente: Luis tapia	2026-04-04 04:35:21.1697+00
050306a6-6e51-4a0e-9b42-66cc4e593479	Sistema/Anónimo	Luis creó venta INMEDIATA de $33600	Pedido #9	2026-04-04 04:41:43.82537+00
b608bee1-c931-4f89-9506-523e00edae2d	Sistema/Anónimo	Luis creó venta AGENDADA de $19620	Pedido #10	2026-04-04 04:46:01.922349+00
12ef9d4d-ab2a-4300-a894-9eb1940dc0d9	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 10	2026-04-04 04:46:12.42308+00
c22f7aea-2f55-4911-8b7b-dd8507dd3aa7	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 10	2026-04-04 04:47:09.06434+00
10517902-fd53-40ac-ae46-792c5b8e40d1	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 10	2026-04-04 04:47:11.341174+00
f736e879-5a34-4c4c-ab35-78763ffa6f86	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 10	2026-04-04 04:53:55.783001+00
ba1067da-cbe4-4ae7-b5c7-5da1c9aa1405	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 10	2026-04-04 04:53:56.364312+00
ddd5f40f-1b76-46ba-820c-f50848223a7e	Sistema/Anónimo	Luis creó venta INMEDIATA de $44300	Pedido #11	2026-04-04 23:23:15.178303+00
3a81f83e-43d3-4fbc-9bf1-64a85b19470a	Sistema/Anónimo	Luis creó venta INMEDIATA de $25000	Pedido #12	2026-04-04 23:26:20.623973+00
9149856c-3910-40cc-bc83-f02db933905d	Sistema/Anónimo	Luis creó venta INMEDIATA de $28100	Pedido #13	2026-04-04 23:31:00.982025+00
c3db5fcc-a9bd-4dfa-a3ea-4feb115c823d	Sistema/Anónimo	Exportó Excel de pedidos	Reporte detallado con pagos y horas	2026-04-05 03:02:51.617672+00
b8e1b75c-bb0e-41dd-990d-b700352a720a	Sistema/Anónimo	Luis creó venta INMEDIATA de $122500	Pedido #14	2026-04-05 15:41:51.974709+00
0609123e-21ed-4d14-aa15-6b4553785e82	Sistema/Anónimo	Eliminó pedido de María Juana 8	ID: 14	2026-04-05 15:42:24.665128+00
2c574b06-6b02-4ad9-ae6b-741bea40fa63	Sistema/Anónimo	Exportó Excel de pedidos	Reporte detallado con pagos y horas	2026-04-05 15:52:30.513582+00
c1e2d8f1-3e82-4d2e-a443-53e2035b26ca	Sistema/Anónimo	Restó 1 unidad(es) de PANTALON BUZO	Pedido 13	2026-04-05 18:57:12.770101+00
e7a2c9ab-3088-4598-8463-349384dbeb57	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 13	2026-04-05 18:57:15.458878+00
526b1b9c-4338-4d50-a128-89aabae6f6d8	Sistema/Anónimo	Luis creó venta INMEDIATA de $57400	Pedido #15	2026-04-05 19:06:20.385137+00
6fa6adda-fdac-429b-96d6-6d44219cd3dd	Sistema/Anónimo	Luis creó venta AGENDADA de $43400	Pedido #16	2026-04-05 19:17:15.899952+00
edb78b39-4ec7-457b-9374-cd6a8c3ce16d	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/C	Pedido 16	2026-04-05 19:17:56.724843+00
1ea50a8f-9ddb-4947-a423-e463eed44161	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 16	2026-04-05 19:17:58.838484+00
7cde2536-0ad4-4151-a76e-effa0b997908	Sistema/Anónimo	Luis creó venta AGENDADA de $34600	Pedido #17	2026-04-06 13:55:02.912403+00
5f80e142-b6b6-4939-bce8-dc9ddffa0291	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/C	Pedido 17	2026-04-06 13:56:40.256447+00
11ff0106-aea9-47cf-9f78-614620cf57ad	Sistema/Anónimo	Entregó 1 unidad(es) de PANTALON BUZO	Pedido 17	2026-04-06 13:56:46.039469+00
326c5f2d-6260-4d72-9bd3-2d66df4eeb88	Sistema/Anónimo	Luis creó venta INMEDIATA de $21800	Pedido #18	2026-04-07 00:19:57.763083+00
e8464b3b-c92f-4071-bb10-598c4889f6ea	Sistema/Anónimo	Anuló pedido #18 de María Juana 12. Motivo: No pagó	ID: 18	2026-04-08 05:06:44.587758+00
81fb4a31-58f0-452c-8ba7-d4a5f7f8e664	Sistema/Anónimo	Exportó Excel de pedidos	Reporte detallado con pagos y horas	2026-04-08 05:07:35.29346+00
2a7072b2-0832-4208-8234-2f617dd05a09	Sistema/Anónimo	Exportó Excel de pedidos	Reporte detallado con pagos y horas	2026-04-08 05:10:56.581035+00
13b062ff-c615-4e68-a588-ca632354d2a8	Sistema/Anónimo	Admin INGRESÓ 23 unid. a BUZO COMPLETO (Talla 10). Stock anterior: -23, Nuevo: 0	Entrada Inventario	2026-04-08 05:45:26.554192+00
33048635-593a-494e-addc-0b4c02784e66	Sistema/Anónimo	Admin INGRESÓ 1 unid. a BUZO COMPLETO (Talla 12). Stock anterior: -1, Nuevo: 0	Entrada Inventario	2026-04-08 05:45:29.786979+00
e6e96bd8-e3d0-4086-bc19-a7aeb5d915d3	Sistema/Anónimo	Admin INGRESÓ 1 unid. a POLERA DEPORTES M/C (Talla 6). Stock anterior: -1, Nuevo: 0	Entrada Inventario	2026-04-08 05:45:50.616779+00
e1869505-1f47-4e02-b57e-1620959c5f2f	Sistema/Anónimo	Admin INGRESÓ 3 unid. a PANTALON BUZO (Talla 8). Stock anterior: -3, Nuevo: 0	Entrada Inventario	2026-04-08 05:45:58.380003+00
67500748-7982-491f-b34c-6f57d39240e1	Sistema/Anónimo	Editó datos del cliente: María Juana 11	ID Cliente: 36dfac59-4d56-4963-a491-4e0d2e077221	2026-04-08 06:28:03.548121+00
1d161fb0-bd76-4fc6-afbd-202bed033679	Sistema/Anónimo	Admin INGRESÓ 1 unid. a BUZO COMPLETO (Talla 4). Stock anterior: 0, Nuevo: 1	Entrada Inventario	2026-04-08 06:29:21.971118+00
c37a75bd-9e23-401c-b8b4-f0c59dc585f3	Sistema/Anónimo	Editó datos del cliente: María Juana 11	ID Cliente: 36dfac59-4d56-4963-a491-4e0d2e077221	2026-04-08 06:33:50.069871+00
3ff42f0d-1d89-44b2-a79c-32d361b03af6	Sistema/Anónimo	Luis creó venta INMEDIATA de $34500	Pedido #19	2026-04-08 11:05:40.221059+00
9de16729-d390-4836-ad33-13d9755a07a9	Sistema/Anónimo	Luis INGRESÓ 6 unid. a POLERA USO DIARIO M/C (Talla 14). Stock anterior: 0, Nuevo: 6	Entrada Inventario	2026-04-08 11:14:03.008482+00
4701f748-a15c-4eb2-b1ca-878d8cf1d0e8	Sistema/Anónimo	Luis INGRESÓ 6 unid. a POLERA USO DIARIO M/C (Talla 16). Stock anterior: 0, Nuevo: 6	Entrada Inventario	2026-04-08 11:14:12.599366+00
8eaee0f6-f796-4774-8b1c-32ffcd74e34f	Sistema/Anónimo	Luis INGRESÓ 4 unid. a POLERA USO DIARIO M/C (Talla 10). Stock anterior: 0, Nuevo: 4	Entrada Inventario	2026-04-08 11:14:27.471129+00
5db10a97-3f6f-4fc1-ba94-3bdf75d45dc2	Sistema/Anónimo	Luis creó venta AGENDADA de $17800	Pedido #20	2026-04-08 12:21:52.247515+00
adc238f8-dcfb-420c-a03b-6ebb15488b69	Sistema/Anónimo	Luis creó venta AGENDADA de $45000	Pedido #21	2026-04-08 12:23:12.309842+00
894eab63-20d5-49f7-a953-f9c594253585	Sistema/Anónimo	Luis creó venta INMEDIATA de $51400	Pedido #22	2026-04-08 14:27:45.394502+00
92e50bf7-0cea-4baf-a621-48b5ad6a8d84	Sistema/Anónimo	Registró pago de $51400 (Transferencia)	Cliente: María Juana 15	2026-04-08 14:30:32.969686+00
0b861886-9de7-4f75-bfce-8a7f172c88d8	Sistema/Anónimo	Registró pago de $51400 (Transferencia)	Cliente: María Juana 15	2026-04-08 14:30:34.216006+00
a0a097a8-1a60-4206-a726-5b0bd536ca6d	Sistema/Anónimo	Luis pasó a LISTO PARA RETIRO: POLERA USO DIARIO M/C	Pedido #6f2c4140-ae89-421e-b909-d53ac021c2a7 - Cliente: María Juana 10	2026-04-08 14:40:51.846655+00
12e12fd0-2064-42f5-9f50-3f5426a97dbe	Sistema/Anónimo	Luis pasó a LISTO PARA RETIRO: PANTALON BUZO	Pedido #7720ebeb-c60d-42f2-8719-646bbb7ba4eb - Cliente: María Juana 10	2026-04-08 14:40:55.938163+00
fc31b315-ae4c-4e84-9e94-23db19a21e7b	Sistema/Anónimo	Luis INGRESÓ 5 unid. a BUZO COMPLETO (Talla 4). Stock anterior: 1, Nuevo: 6	Entrada Inventario	2026-04-08 14:45:42.659864+00
efc144c4-45b4-41b2-b728-d686a0404f61	Sistema/Anónimo	Anuló pedido #22 de María Juana 15. Motivo: no responde 	ID: 22	2026-04-09 02:07:04.927678+00
dda4af27-8de0-454e-a202-870fcb699e6b	Sistema/Anónimo	Luis creó venta INMEDIATA de $15600	Pedido #23	2026-04-09 02:08:42.336165+00
9eb81582-571a-41cc-be61-3436ed5206fa	Sistema/Anónimo	Admin creó venta PARCIAL de $80500	Pedido #24	2026-04-09 03:49:28.637519+00
1af40e03-7bab-4d8e-9a69-0e7a381f96c2	Sistema/Anónimo	Anuló pedido #24 de PRUEBA. Motivo: PRUEBA	ID: 24	2026-04-09 03:49:57.757354+00
f33ee658-c623-42a1-bcd6-7f8a23270997	Sistema/Anónimo	Registró pago de $15000 (Efectivo)	Cliente: María juana	2026-04-09 03:59:38.82205+00
0bd8835d-200b-4dfd-8c0d-4e8082786288	Sistema/Anónimo	Luis creó venta PARCIAL de $21800	Pedido #25	2026-04-09 04:07:18.980177+00
de7f0373-3a17-40e2-8b58-6265ca9e2642	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:31.124935+00
415d17c0-87fc-4e18-a065-882673674cb5	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:31.843963+00
d1e77f33-6cdc-4467-978f-9d8a2d42866a	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:32.422485+00
776403ee-b658-4d4b-b9f0-5e8c217e3bf2	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:36.468611+00
d4a2efc4-2a60-49ad-b355-48cab6108cb6	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:38.084998+00
08ac2561-182a-4284-be66-529c19ebc18f	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:39.775104+00
9aa1e2db-e6da-4d12-9526-d6a374b5166f	Sistema/Anónimo	Restó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:41.750136+00
369d3ce6-82b0-4976-9178-5504cd2ba6d5	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:45.054295+00
8f871dc5-b961-4c49-b8d2-4582d9142afc	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:49.587649+00
33954a30-d12e-4203-8c32-e45dbf98d52e	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA DEPORTES M/L	Pedido 25	2026-04-09 04:07:50.49908+00
9647c766-55a7-41b5-b31d-e21daf107545	Sistema/Anónimo	Editó datos del cliente: María Juana 16	ID Cliente: cc2b4f02-a362-4747-aef6-ad6368a0bad6	2026-04-09 04:08:17.743562+00
9453cb10-8715-4e66-9a92-9b99939b7496	Sistema/Anónimo	Luis creó venta INMEDIATA de $26700	Pedido #26	2026-04-09 04:22:49.893232+00
e867e6c9-af55-4ef5-a6fa-f8ba149f18f6	Sistema/Anónimo	Luis creó venta ANTIGUO de $140040	Pedido #27	2026-04-09 12:05:05.289549+00
e56b98d8-6372-4342-816b-95ab0a05b4a8	Sistema/Anónimo	Luis creó venta ANTIGUO de $40000	Pedido #28	2026-04-09 12:12:37.553974+00
01efc112-0578-450b-8418-5eae279f8bb4	Sistema/Anónimo	Luis creó venta ANTIGUO de $11200	Pedido #29	2026-04-09 12:15:20.667204+00
ae10b6e2-911a-452d-b86f-4dde1bc2ec04	Sistema/Anónimo	Luis creó venta AGENDADA de $61500	Pedido #30	2026-04-09 13:40:32.623673+00
7bd6d452-1844-4c3b-a242-39ecfe81b72c	Sistema/Anónimo	Admin creó venta ANTIGUO de $55200	Pedido #31	2026-04-09 23:39:16.24809+00
9dbcfef5-1cdc-46e8-99bb-1f3bebe8edcf	Sistema/Anónimo	Admin creó venta INMEDIATA de $22500	Pedido #32	2026-04-09 23:41:12.258586+00
7f3d0b10-1243-4862-b7f6-666baf7986b3	Sistema/Anónimo	Admin INGRESÓ 5 unid. a BUZO COMPLETO (Talla 4). Stock anterior: 5, Nuevo: 10	Entrada Inventario	2026-04-09 23:41:46.940967+00
057ed530-1fe3-4deb-9a98-7edcf60060fc	Sistema/Anónimo	Admin creó venta INMEDIATA de $112500	Pedido #33	2026-04-09 23:42:14.387033+00
e5bb0a68-b5ce-40a4-9fec-de3cee145bc3	Sistema/Anónimo	Admin creó venta PARCIAL de $20000	Pedido #34	2026-04-09 23:47:47.623362+00
3307f0d3-362a-4e7a-98ae-45428bb594cd	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 30	2026-04-09 23:54:12.085645+00
27b5dec9-4b3c-4f2a-b0cb-cec12ad45581	Sistema/Anónimo	Entregó 1 unidad(es) de POLERA USO DIARIO M/L	Pedido 30	2026-04-09 23:54:14.156119+00
44922a0c-2a80-44c6-96e2-62c358019c4c	Sistema/Anónimo	Registró pago de $10000 (Transferencia)	Cliente: NN	2026-04-10 00:04:36.526761+00
32894cd2-258e-4b75-b375-e60bea719763	Sistema/Anónimo	Registró pago de $10000 (Débito)	Cliente: NN	2026-04-10 00:04:45.889102+00
c3ff6d2a-4931-43e6-a47f-11a15eec662c	Sistema/Anónimo	Anuló pedido #34 de NN. Motivo: anulado por prueba 	ID: 34	2026-04-10 02:15:27.639033+00
2870f27c-4a7c-4281-836c-b0246564179a	Sistema/Anónimo	Luis creó venta INMEDIATA de $82000	Pedido #35	2026-04-10 02:20:02.312028+00
fd16de35-b9f6-46bc-a56c-5a89e9ac8713	Sistema/Anónimo	Registró pago de $30000 (Débito)	Cliente: Xxxxx	2026-04-10 02:21:24.866668+00
f3e8f242-4ae2-48ba-93e2-82e49cc5de17	Sistema/Anónimo	Registró pago de $32000 (Transferencia)	Cliente: Xxxxx	2026-04-10 02:21:55.030603+00
f06602a1-9d03-446d-8c80-1c7da3faeb13	Sistema/Anónimo	Registró pago de $32000 (Transferencia)	Cliente: Xxxxx	2026-04-10 02:21:55.340063+00
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nombre, telefono, colegio, rut) FROM stdin;
eb3b67f4-2487-4723-bd58-9241d8ca601c	Luis tapia	+56979133576	\N	
cf9b3195-69a9-4f16-a4db-88f426a72aca	Luis Tapia	+56979133576	\N	Luis Tapia
5e618c4a-8d30-4dfb-bb4e-e3626aa3acfe	Gaspar	+56979133576	\N	
76e9f827-4ece-4b83-b174-7662d9401e33	María Juana 2	+56979133576	\N	
ed511b3d-0da3-4f2e-91de-633fd3fb089f	María juana	+56979133576	\N	
782a64d1-1d3e-4def-9cac-e4e88de8568c	Doña juana	+56979133576	\N	
dd682f14-bc04-4645-8758-eb6b80733342	Prueba	+56987654321	\N	12.345.678-9
53d5f340-9f21-4541-b032-9e5f63bf60a4	María Juana 3	+56979133576	\N	
fe7d47d2-a209-4ede-9e5c-899751b8251f	María Juana 4	+56979133576	\N	
1e01db9d-c9fd-4aaa-a796-ea8be14b8b72	María Juana 5	+56979133576	\N	
87a0795c-b7e8-4554-85bd-d3e6c713c2ac	María Juana 5	+56979133576	\N	
ac36a606-2417-4086-a02b-75828ab737cf	María Juana 7	+56979133576	\N	
febba76f-2dc8-4903-a9d6-0bd6cc770224	María Juana 8	+56979133576	\N	
9a6d7279-03f7-47e9-96cd-f7c418b10c72	María Juana 8	+56992471366	\N	
59d432f4-91d8-40f5-b980-5aa59973fdf9	María Juana 9	+56992471366	\N	
c289a3a1-4f97-4498-bffe-bcc7b06de00b	María Juana 10	+56992471366	\N	
509be71c-5ddd-425b-b46e-4d09ddfc36ac	María Juana 12	+56979133576	\N	
36dfac59-4d56-4963-a491-4e0d2e077221	María Juana 11	+56979133576	\N	99999
371745c5-fd71-4d2f-b1b3-482fe3c5767a	María Juana 12	+56979133576	\N	
9cca0c9e-662b-468d-91c1-13a75bfc0273	María Juana 13	+56979133576	\N	
f8ea462c-3e5a-462a-ab9c-11ae81de9287	María juana	+56979133576	\N	
02ad0e09-2699-4a30-8570-56c78f655425	María Juana 15	+56979133576	\N	
d6e2bacf-62ef-48a5-97ca-883b94019d1f	Luis tapia 	+56992471366	\N	
c1d3d316-8d32-4b31-aeca-c375e69623f0	PRUEBA	+56900000000	\N	PRUEBA
cc2b4f02-a362-4747-aef6-ad6368a0bad6	María Juana 16	+56992471366	\N	
4e637034-e0ac-48b1-948d-723cc4dba917	Luis Tapia 1	+56979133576	\N	
21c940de-0f21-4dc7-a17b-c78ce26a19b5	Carla vargas	+56984554370	\N	
9dd279f1-d14c-4467-9d6f-830b7985c405	Jacqueline	+56989319293	\N	
fd22c99f-df4f-47ab-92b6-21416174113c	NN	+56911111111	\N	
a1b744d4-43e8-4b48-a11e-c31fd6b3165c	Luis Tapia	+56911111111	\N	
63fb18a9-5273-4f5c-8c30-32cc2623ceab	NN	+56999999999	\N	000000000
68f8d947-15f2-42e8-b250-bffa7d2df174	nn	+56999999999	\N	000000
4084d6f3-a00e-409c-b0e0-a7fb88154ebb	nn	+56999999999	\N	0000000
cf48f82c-0303-4e62-9108-04955a480f03	NN	+56900000000	\N	00000000
5173dbeb-3543-4fd7-8d9a-f5d0c05d111a	Xxxxx	+56911111111	\N	
\.


--
-- Data for Name: colegios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colegios (id, nombre, created_at) FROM stdin;
6	BELLAVISTA	2026-04-03 19:00:09.963644+00
9	COLEGIO CHILE	2026-04-07 22:43:59.501841+00
10	FRAY CAMILO	2026-04-08 04:38:01.12035+00
11	INSTITUTO NACIONAL	2026-04-08 04:40:03.963582+00
12	POETA NERUDA	2026-04-08 04:41:20.842886+00
7	HAYDN	2026-04-07 22:11:02.844644+00
\.


--
-- Data for Name: detalles_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_pedido (id, producto_id, cantidad, talla, precio_unitario, estado, cantidad_entregada, pedido_id) FROM stdin;
6d6f66b5-d032-4fe2-b5bf-c18e1ed9b4e4	df84efe0-2a4a-43cd-a387-e60927cc0b86	1	10	15700	Entregado	1	1
2702222a-fb8d-44b3-a96c-a4f625582792	72205a3e-5dd9-4647-83d9-5550a40b0ecc	1	10	12900	Entregado	1	1
03936125-678d-4d1b-8f14-2ffa63de8509	c201c00e-9ae8-456a-be87-ee502a7f4227	1	12	9900	Entregado	1	2
90c40dc9-ffd1-4948-8925-03b8b3519d69	74f24c28-5530-491b-a9bc-4739c080849b	1	16	11200	Entregado	1	29
3ac74a87-0585-44b8-bbcc-d683b45496d9	0b5252d1-e675-4999-b056-3d71b912c43c	1	8	11000	Entregado	1	8
471457b4-1c51-4833-a8b6-c1d7ba54a6f0	363635e4-7747-402d-810a-e278eb14d7aa	2	6	8400	Parcial	1	17
58e00ba3-0a16-476f-a3fb-753568ee4275	7c4d2118-f8f5-409c-902a-5c84386af91d	1	6	8900	Entregado	1	6
bb1e0bb4-8de5-4f3e-b5e2-71972444e48c	7c4d2118-f8f5-409c-902a-5c84386af91d	2	6	8900	Parcial	1	17
5e4d8d23-5f14-46d2-8477-99adf3ec16fb	4da2340b-3783-4653-bf4d-cc109e274f28	1	10	10400	Entregado	1	18
ea38cf1b-776e-40b8-aaf3-b87a7264af17	1f8aade4-8fc4-4289-a840-3d19f497c73c	1	10	11400	Entregado	1	18
e8dce9ee-4121-4e66-bf14-f98adb062794	f4242f20-b4d9-44d2-9504-75ed7e4231e9	1	6	24100	Entregado	1	19
c7be4433-c2f8-4e52-8085-67aef29db994	d7d6ad03-3d3b-45b9-bf9e-89b17f01f4bb	1	6	10400	Entregado	1	19
f5c67390-2e77-4d3e-ba58-fbaddbc370ea	a8535e23-7aac-4d62-8367-36653caa7c34	1	16	11700	Entregado	1	3
e713ed97-5d2d-48b7-a31d-f1b53f0e027a	0830ddf9-b647-4bb8-b57b-7e918d39aa1e	1	L	14000	Entregado	1	3
b635918e-24bd-4904-abb1-b47e54aaf121	6c2e459c-d267-4a98-8920-68cbcb9047ce	1	L	18900	Entregado	1	3
b572e5b1-7dd5-42fb-9eab-7c0a14812d4f	1f8aade4-8fc4-4289-a840-3d19f497c73c	3	10	11400	Entregado	3	5
279330f1-2ac8-4815-86ab-f9997d17883e	23c199ec-c127-4a24-9af6-05f47db29c12	2	4	8900	Pendiente	0	20
2a893e46-a39b-4e5b-9a3a-ba0ce33dff9f	301667b4-a5a5-4d58-9dfe-3d56a0ca88b5	1	8	9500	Entregado	1	8
360c6147-cfcd-498e-a25f-d60921470767	11a33c86-b9ee-4996-86db-1757e770769b	2	S	8500	Entregado	2	7
453c20c4-c0db-4eb2-97e8-78b1fc587d50	cd34e5a3-0200-4dc7-92f6-1398e471c32e	1	10	24500	Entregado	1	7
8fe3cbe8-6a1e-4fdf-ab69-c2664b1257c7	16991b00-fc17-4c8e-af7a-ae9a5adc80f2	2	10	10300	Entregado	2	7
d8d17168-0bdf-4472-97a4-81d61a729de6	301667b4-a5a5-4d58-9dfe-3d56a0ca88b5	2	8	9500	Entregado	2	4
99ad03b9-032c-45ff-8662-2610a412f814	edf28094-e9d0-43d2-a515-2d08db5ab020	2	8	10000	Entregado	2	4
e69bfce6-215c-478e-ae60-c7e19af8d142	a0e70fe1-d936-40a6-b37e-c8b30353b2ae	4	2XL	16500	Entregado	4	7
81794da8-936d-4430-bb3d-47596c4fbf48	734e2216-ba83-432a-8cc4-2f16e7cdd7b6	1	6	10400	Entregado	1	6
7b9d39be-3a73-48d7-8e8c-5a80b880c14a	4da2340b-3783-4653-bf4d-cc109e274f28	1	10	10400	Entregado	1	2
7ee783dc-e2be-4f2c-8b63-43fc139770e0	1f8aade4-8fc4-4289-a840-3d19f497c73c	1	10	11400	Entregado	1	2
fe8868bf-8b7c-4c8e-9e3e-26d22eecd85c	cd34e5a3-0200-4dc7-92f6-1398e471c32e	1	10	24500	Entregado	1	2
55a2f146-ea65-4a15-b91d-a572bf37aaaa	4da2340b-3783-4653-bf4d-cc109e274f28	11	10	10400	Entregado	11	1
e03fa04e-1995-4cd2-b8f0-1d9ea0b49e1f	16991b00-fc17-4c8e-af7a-ae9a5adc80f2	1	10	10300	Entregado	1	9
e9d0f036-8716-4c24-8307-358d55a88f23	88454a3e-e32f-4e34-9193-60c8d58d5739	1	10	10400	Entregado	1	9
782f2f17-fc97-4e1e-8f5a-9a922307cd9f	72205a3e-5dd9-4647-83d9-5550a40b0ecc	1	10	12900	Entregado	1	9
561323e5-1838-4d2a-9d25-e2be7de3b67d	28256ffd-89b4-4f8f-9c70-25f4bfd13904	1	4	22500	Pendiente	0	21
f5bc8112-d1cc-4261-b906-c89801756929	28256ffd-89b4-4f8f-9c70-25f4bfd13904	1	4	22500	Pendiente	0	21
6601a2de-62e3-4f73-b9e9-3d6f0e66947a	36b78660-7502-4fa2-9485-33d4e2d7916e	1	8	15500	Entregado	1	22
c945bfc6-5568-4702-af25-4a444c7718a1	1f8aade4-8fc4-4289-a840-3d19f497c73c	1	10	11400	Entregado	1	10
f2cd41a5-0210-4398-ba7d-659a8c7a0c6a	095b0112-17f1-4070-a385-1a5852e1adfe	1	8	8600	Entregado	1	22
8a739db1-f720-4054-b11b-6e955b3b1132	88454a3e-e32f-4e34-9193-60c8d58d5739	1	10	10400	Entregado	1	10
14202095-4202-4a74-be98-11673fdef47e	ad1dd3b0-6e0a-4569-8eb7-2d6461ede51c	1	6	7300	Entregado	1	22
cde939b3-5f0f-4355-a7f3-56c87ce81efa	3889b96b-1712-4b0a-ae53-f3cf48c3a8e2	1	ESPECIAL	20000	Entregado	1	22
6f2c4140-ae89-421e-b909-d53ac021c2a7	47e5566e-12c9-444b-8746-e30d8365329d	2	12	10900	Listo para retiro	1	16
7720ebeb-c60d-42f2-8719-646bbb7ba4eb	98206752-7bbb-405f-949a-2893d9d3c701	2	12	10800	Listo para retiro	1	16
41db5a6d-7353-406d-bfbf-c8911fef4581	ad1dd3b0-6e0a-4569-8eb7-2d6461ede51c	1	6	7300	Entregado	1	23
b7d0a09e-cdab-4cd9-8272-a0c69219f62c	d9e0aaf4-6a79-4146-81c4-c9b568a904be	1	6	8300	Entregado	1	23
75760218-e7e9-4173-b9fd-613cb2d43a3f	5be1542c-ce61-49f8-8783-3178425f8d14	3	8	23500	Pendiente	2	24
2910238e-2db2-44f2-9d9b-01a3350c6957	a5ad6ef4-d685-434c-b1e5-fcb062849c4a	1	12	10000	Pendiente	0	24
507454ca-ca53-42cd-a96d-74ee5624c557	cd34e5a3-0200-4dc7-92f6-1398e471c32e	1	10	24500	Entregado	1	11
d1c4bf10-5117-46f3-8605-230395b8146f	4da2340b-3783-4653-bf4d-cc109e274f28	1	10	10400	Entregado	1	11
e3ce2863-3dd3-4a44-b8a1-4bae35793bba	8028e67e-38eb-4e6e-ae73-86b9886970e5	1	10	9400	Entregado	1	11
b8523c9b-03b0-4164-b3a1-321453b217d4	52598cb0-9d4b-42ec-bbaa-fca898feab68	1	12	25000	Entregado	1	12
2ecd45f8-c68d-4a23-91d3-f19dd7a7c092	9d77480b-c1ef-4c2a-82c8-3beb6fdea62f	1	14	16800	Entregado	1	13
92f0d57e-d4c0-47b6-b4ed-ce3cf884c932	7cb421f7-fc46-46d9-99af-cfd8484e9d70	1	4	6600	Entregado	1	25
b19820e2-faf4-48ba-bac8-f3f760af0e51	76b75015-f3a8-4429-bc44-baa5035779a1	1	14	11300	Entregado	1	13
94d5caa2-172b-4b99-9868-ee398940f661	7c4d2118-f8f5-409c-902a-5c84386af91d	2	6	8900	Entregado	2	15
8e6b9f7f-8796-4fb1-9ba8-36fbb840219d	87be1090-33a9-4344-989d-acea6ce43749	2	6	9400	Entregado	2	15
67931ba7-1bc4-4515-9027-a6a18f1086dc	734e2216-ba83-432a-8cc4-2f16e7cdd7b6	2	6	10400	Entregado	2	15
a02925fe-75ca-4589-8982-e1a428d38faf	18779945-30c2-4908-a645-24a20a2a85c6	2	16	11700	Pendiente	0	30
59f77036-4f4a-4fca-83b9-6a6df35876bf	00e72f5e-8b12-4b2b-98f9-3af481530be6	2	4	7600	Entregado	2	25
1183aae4-3208-4c22-941c-3f25996576a0	6a8ece84-e207-4130-be9a-3ea112f27881	2	4	8900	Entregado	2	26
6c9df2c0-1051-46be-b06c-2df62beb08ef	6a8ece84-e207-4130-be9a-3ea112f27881	1	4	8900	Entregado	1	26
f26301d4-e209-46b0-97c7-a06931f7fe70	a1ea41ab-15fa-4b43-a9d9-310ffed233be	2	6	24100	Entregado	2	27
c8e02841-bc16-43e6-b009-9ba1011dbcad	76649627-9dfe-4063-9da5-1f35439ffc2e	1	4	22500	Entregado	1	31
0a8c932b-fd47-487b-ab75-ac60ebdc8fba	ad1dd3b0-6e0a-4569-8eb7-2d6461ede51c	3	6	7300	Entregado	3	27
bb0316ff-ac9f-44c5-92f0-eb1f5e13d6c9	0e62da3f-1aac-41a1-abc2-71c42b7be8a8	2	16	28800	Entregado	2	27
12960b65-f96b-4fad-a127-cd58ac48c193	e2642978-67db-4ebb-ab96-f62f10e37494	3	16	9300	Entregado	3	27
91514433-34d2-4c49-adb7-bb22482fba3e	5eb0ce00-63f3-4fac-8122-c029bd874a90	1	8	10000	Entregado	1	28
51b15657-0230-4431-a83e-3b5216566239	a67f0307-8ad5-4ac8-9915-964160a1e2bf	1	8	9000	Entregado	1	28
19134f05-8e1f-4c13-9667-6df823b72750	0677e09f-b411-4de8-ac9b-6ea48c0b0578	1	8	9500	Entregado	1	28
e94836e6-6ec3-4389-a9e9-5a808de13adb	2b54e02d-61cf-49e2-8979-4b0dde23db38	1	8	15500	Entregado	1	28
d211016f-bb78-404f-b1c8-a4f94433c6ae	47e5566e-12c9-444b-8746-e30d8365329d	3	12	10900	Entregado	3	31
f3dbbfc9-1c19-4a9d-a0c7-cb5c728e6b42	76649627-9dfe-4063-9da5-1f35439ffc2e	1	4	22500	Entregado	1	32
ae24670f-2fd4-4dfd-a927-7f2bb722cde5	76649627-9dfe-4063-9da5-1f35439ffc2e	5	4	22500	Entregado	5	33
61fb2b91-b432-465b-9f49-1655ce3d5561	a5ad6ef4-d685-434c-b1e5-fcb062849c4a	2	12	10000	Pendiente	0	34
f59612d1-3e5f-47e3-b85c-64c0885562f8	21d0a5dd-505f-4345-b70c-026aeda5e5a9	3	16	12700	Parcial	2	30
ce8c6e92-9218-4fbc-9f39-dea3037dd8a3	9dc3f678-a28f-4281-a9d1-e008d269ea98	5	4	8200	Entregado	5	35
3cdb7bbc-a9e1-4a19-8341-4cccd462d7ac	9dc3f678-a28f-4281-a9d1-e008d269ea98	5	4	8200	Entregado	5	35
\.


--
-- Data for Name: historial_entregas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_entregas (id, pedido_id, items_entregados, fecha, creado_por) FROM stdin;
\.


--
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (id, nombre, stock, precio_unitario, categoria, created_at, precio_base, precio_especial_extra, talla, stock_reservado, colegio, creado_por) FROM stdin;
a4688819-3cda-4b1e-9f64-032d96952a5e	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	8500	2000	4	0	BELLAVISTA	\N
cdff6be7-6994-4d65-a4dc-b583971ca553	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	9400	2000	6	0	BELLAVISTA	\N
28242fbc-8bbf-4228-85ba-8a64282e5ef4	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	10900	2000	12	0	BELLAVISTA	\N
6e039910-e2b9-4917-a991-89b6ceb8db64	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	11400	2000	14	0	BELLAVISTA	\N
a86b1c3c-2bab-42f2-ace8-f3886dca17bb	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	12000	2000	S	0	BELLAVISTA	\N
93f12630-9ab2-41b8-89d4-cc86099342fd	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	12500	2000	M	0	BELLAVISTA	\N
32f13404-3049-4d52-8bde-586f23a4e393	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	13000	2000	L	0	BELLAVISTA	\N
1a994e8c-355a-43a3-9ef4-14acab1fc010	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	13000	2000	XL	0	BELLAVISTA	\N
fe486907-4d70-4e07-bcc4-b9c299b4ce83	POLERA DEPORTES M/L	0	0	General	2026-04-03 18:58:44.960568+00	15500	2000	2XL	0	BELLAVISTA	\N
e6e66f78-e884-48fd-a909-d9534fb786b7	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	14800	2000	4	0	BELLAVISTA	\N
023940e1-37c1-42d3-844c-3d16b8aeb8e2	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	15200	2000	6	0	BELLAVISTA	\N
e12c89e6-6a88-4631-8ef5-5bf511d62467	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	15500	2000	8	0	BELLAVISTA	\N
bb97c0b7-e9ea-4e82-81f3-516605449552	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	16300	2000	12	0	BELLAVISTA	\N
b7a4dc2a-457c-4a00-8f6a-1b49c1ebbe31	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	17300	2000	16	0	BELLAVISTA	\N
7911f8f6-db58-43f7-8395-f7708c2e45f9	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	17800	2000	S	0	BELLAVISTA	\N
8fea4dd1-c4bf-40e4-89d7-ce4ef381b4e6	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	21000	2000	XL	0	BELLAVISTA	\N
0561bbf2-b22f-49fb-8820-a0e8c2772f8d	POLERON CON CIERRE	0	0	General	2026-04-03 18:58:44.960568+00	22000	2000	2XL	0	BELLAVISTA	\N
f0ee06a0-c13f-4511-99f8-ce893e9ff0f1	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	8900	2000	4	0	BELLAVISTA	\N
7d5b802c-ebc0-4c3d-8523-5c9470b8ac98	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	10000	2000	8	0	BELLAVISTA	\N
93e45fbe-d93a-484c-948c-32d10c5189d5	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	11490	2000	14	0	BELLAVISTA	\N
bf750006-bd1f-4f15-842d-ff4363a37172	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	11700	2000	16	0	BELLAVISTA	\N
76649627-9dfe-4063-9da5-1f35439ffc2e	BUZO COMPLETO	5	0	General	2026-04-03 18:58:52.357533+00	22500	2000	4	-6	BELLAVISTA	\N
4b88555d-97c5-43e1-b516-160f3c86c856	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	12700	2000	M	0	BELLAVISTA	\N
741ecab8-a274-48e9-8815-f5f4424369b5	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	13000	2000	L	0	BELLAVISTA	\N
e4539c36-9e59-490d-a990-fd6c255d7d7e	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	13900	2000	XL	0	BELLAVISTA	\N
363814a7-001d-4c37-b897-cfd0faf6d463	POLERA USO DIARIO M/C	0	0	General	2026-04-03 18:58:52.357533+00	15500	2000	2XL	0	BELLAVISTA	\N
96649e1c-a4f1-4dcc-970f-04a46f678183	POLERA USO DIARIO M/L	0	0	General	2026-04-03 18:58:52.357533+00	9900	2000	4	0	BELLAVISTA	\N
dcedc0b0-8363-46c0-a8d3-82b3eeee3968	POLERA USO DIARIO M/L	0	0	General	2026-04-03 18:58:52.357533+00	11900	2000	12	0	BELLAVISTA	\N
6a5d5cd8-8cb2-42ee-a607-45bace0cac78	POLERA USO DIARIO M/L	0	0	General	2026-04-03 18:58:52.357533+00	12490	2000	14	0	BELLAVISTA	\N
66412808-94a3-4e60-a6cc-4f5e18a32b30	POLERA USO DIARIO M/L	0	0	General	2026-04-03 18:58:52.357533+00	12700	2000	16	0	BELLAVISTA	\N
5ea3bf82-aeb2-4aa3-b341-f2283125710c	POLERA USO DIARIO M/L	0	0	General	2026-04-03 18:58:52.357533+00	13000	2000	S	0	BELLAVISTA	\N
d5f25ea4-da62-4db4-a231-82cc5cddd8db	POLERA USO DIARIO M/L	0	0	General	2026-04-03 18:58:52.357533+00	14900	2000	XL	0	BELLAVISTA	\N
c9b02c21-f4e9-4dc6-b370-a737e01ece23	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	7900	2000	4	0	BELLAVISTA	\N
0db1b4a1-a4f3-4a47-af62-2b72bcc20dc3	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	9000	2000	8	0	BELLAVISTA	\N
3bdc0e70-a128-4d56-98a4-6baabb40711f	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	10400	2000	14	0	BELLAVISTA	\N
d1749134-35ce-463b-a8a8-cd8d349045d4	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	10700	2000	16	0	BELLAVISTA	\N
4927a4e2-3d4c-468e-8c3d-821d7b73f2e1	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	11500	2000	M	0	BELLAVISTA	\N
6944b7ee-b2c8-46d1-ab03-e4f1fb44368e	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	12000	2000	L	0	BELLAVISTA	\N
addab6c3-83ae-4067-872f-870d043858f1	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	12000	2000	XL	0	BELLAVISTA	\N
3537a2e5-6fd2-429d-8620-3ba2dee60307	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	14500	2000	2XL	0	BELLAVISTA	\N
d6bc131c-c9bc-4746-b214-471fd2cb848b	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	23400	2000	6	0	BELLAVISTA	\N
6c2e459c-d267-4a98-8920-68cbcb9047ce	POLERON CON CIERRE	-3	0	General	2026-04-03 18:58:44.960568+00	18900	2000	L	-3	BELLAVISTA	\N
edf28094-e9d0-43d2-a515-2d08db5ab020	POLERA DEPORTES M/L	-2	0	General	2026-04-03 18:58:44.960568+00	10000	2000	8	-2	BELLAVISTA	\N
0cef9b36-73ab-42ec-8605-8efff1b96914	POLERA DEPORTES M/C	-2	0	General	2026-04-03 18:58:52.357533+00	11000	2000	S	-1	BELLAVISTA	\N
cf732f37-1dab-46fa-afdc-23fd32ee4f3c	POLERA USO DIARIO M/L	-4	0	General	2026-04-03 18:58:52.357533+00	13700	2000	M	-4	BELLAVISTA	\N
9d77480b-c1ef-4c2a-82c8-3beb6fdea62f	POLERON CON CIERRE	-1	0	General	2026-04-03 18:58:44.960568+00	16800	2000	14	-1	BELLAVISTA	\N
88454a3e-e32f-4e34-9193-60c8d58d5739	POLERA DEPORTES M/L	-3	0	General	2026-04-03 18:58:44.960568+00	10400	2000	10	-2	BELLAVISTA	\N
df84efe0-2a4a-43cd-a387-e60927cc0b86	POLERON CON CIERRE	-1	0	General	2026-04-03 18:58:44.960568+00	15700	2000	10	-1	BELLAVISTA	\N
a8535e23-7aac-4d62-8367-36653caa7c34	POLERA DEPORTES M/L	-1	0	General	2026-04-03 18:58:44.960568+00	11700	2000	16	-1	BELLAVISTA	\N
c201c00e-9ae8-456a-be87-ee502a7f4227	POLERA DEPORTES M/C	-1	0	General	2026-04-03 18:58:52.357533+00	9900	2000	12	-1	BELLAVISTA	\N
0830ddf9-b647-4bb8-b57b-7e918d39aa1e	POLERA USO DIARIO M/L	-3	0	General	2026-04-03 18:58:52.357533+00	14000	2000	L	-3	BELLAVISTA	\N
8028e67e-38eb-4e6e-ae73-86b9886970e5	POLERA DEPORTES M/C	-3	0	General	2026-04-03 18:58:52.357533+00	9400	2000	10	-1	BELLAVISTA	\N
4da2340b-3783-4653-bf4d-cc109e274f28	POLERA USO DIARIO M/C	-13	0	General	2026-04-03 18:58:52.357533+00	10400	2000	10	-13	BELLAVISTA	\N
0b5252d1-e675-4999-b056-3d71b912c43c	POLERA USO DIARIO M/L	-1	0	General	2026-04-03 18:58:52.357533+00	11000	2000	8	-1	BELLAVISTA	\N
a0e70fe1-d936-40a6-b37e-c8b30353b2ae	POLERA USO DIARIO M/L	-4	0	General	2026-04-03 18:58:52.357533+00	16500	2000	2XL	0	BELLAVISTA	\N
1f8aade4-8fc4-4289-a840-3d19f497c73c	POLERA USO DIARIO M/L	-8	0	General	2026-04-03 18:58:52.357533+00	11400	2000	10	-7	BELLAVISTA	\N
87be1090-33a9-4344-989d-acea6ce43749	POLERA USO DIARIO M/C	-2	0	General	2026-04-03 18:58:52.357533+00	9400	2000	6	-2	BELLAVISTA	\N
734e2216-ba83-432a-8cc4-2f16e7cdd7b6	POLERA USO DIARIO M/L	-3	0	General	2026-04-03 18:58:52.357533+00	10400	2000	6	-2	BELLAVISTA	\N
47e5566e-12c9-444b-8746-e30d8365329d	POLERA USO DIARIO M/C	-1	0	General	2026-04-03 18:58:52.357533+00	10900	2000	12	1	BELLAVISTA	\N
27a1f352-5671-4a15-96c4-bd904034f8fd	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	26000	2000	14	0	BELLAVISTA	\N
aa4fd15c-a701-4c48-bd0b-dba184229bfd	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	27000	2000	16	0	BELLAVISTA	\N
f6dcdfb9-971b-4e4c-a0b2-7bc0440f7874	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	28000	2000	S	0	BELLAVISTA	\N
99ab37fc-f502-4f5c-a97b-4f950af4ec45	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	29500	2000	M	0	BELLAVISTA	\N
633b4d96-a4b1-4196-92d3-cb9f5b1640ad	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	31100	2000	L	0	BELLAVISTA	\N
53acd790-1711-49e1-b523-173487f0baf0	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	34900	2000	2XL	0	BELLAVISTA	\N
d1875b0f-b98d-4acd-952c-e79d9d9609d7	PANTALON BUZO	0	0	General	2026-04-03 18:58:52.357533+00	11500	2000	16	0	BELLAVISTA	\N
a687a841-3fc3-44bc-8c57-47b8273d4ff7	PANTALON BUZO	0	0	General	2026-04-03 18:58:52.357533+00	12600	2000	M	0	BELLAVISTA	\N
8b0c720e-7a61-430c-98cc-7716c8f9aa89	PANTALON BUZO	0	0	General	2026-04-03 18:58:52.357533+00	13100	2000	L	0	BELLAVISTA	\N
6a55d54d-624c-40ea-85b9-c7c554bd805d	PANTALON BUZO	0	0	General	2026-04-03 18:58:52.357533+00	13700	2000	XL	0	BELLAVISTA	\N
2f3595e5-67e6-414e-bed6-e7aef91ca7d5	PANTALON BUZO	0	0	General	2026-04-03 18:58:52.357533+00	14900	2000	2XL	0	BELLAVISTA	\N
a174897a-4e24-491e-99c7-b0254a85e5b6	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	4900	2000	4	0	BELLAVISTA	\N
3006da71-8237-46f1-bdbc-0ac50a54a5dc	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	5200	2000	6	0	BELLAVISTA	\N
d3691043-9f84-4d41-8a01-9ae88971e99d	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	6300	2000	8	0	BELLAVISTA	\N
0de2010c-c5a5-4cbc-be91-c32a377f0e8e	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	7400	2000	12	0	BELLAVISTA	\N
86f83397-750a-4b90-9d7f-20b9d07370cf	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	8000	2000	14	0	BELLAVISTA	\N
4fc9af1e-4f62-4744-b73c-e9ad583ae308	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	8500	2000	M	0	BELLAVISTA	\N
9e5f8ef3-362c-4c07-ae7d-c54247e78447	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	9000	2000	L	0	BELLAVISTA	\N
d1fadadb-7c36-42b7-8abd-6c2be361b38c	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	9000	2000	XL	0	BELLAVISTA	\N
49e02c49-d686-484f-8115-33d730507254	SHORT	0	0	General	2026-04-03 18:58:52.357533+00	9900	2000	2XL	0	BELLAVISTA	\N
72c1e235-235a-40c8-ae23-51696321611e	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	9900	2000	4	0	BELLAVISTA	\N
eccfaa44-c5a2-4dda-9e97-0350047a64ee	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	11900	2000	6	0	BELLAVISTA	\N
b920a02d-72d3-4bd3-b7a6-50da109fdca1	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	11900	2000	8	0	BELLAVISTA	\N
fd7fdadd-62e5-4dfd-91a0-db7e51835d78	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	12900	2000	12	0	BELLAVISTA	\N
24f69d48-f181-4931-aae0-bc3d9c4681b0	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	14400	2000	14	0	BELLAVISTA	\N
926ab901-46f3-490a-80b4-26441ee6cb1e	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	14400	2000	16	0	BELLAVISTA	\N
557f4c33-18ff-4106-b2ea-b5591475eff4	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	15400	2000	S	0	BELLAVISTA	\N
46a4544e-005c-43f9-91b0-a287a82fa955	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	15400	2000	M	0	BELLAVISTA	\N
3413b275-774b-4872-9fc8-ede617922d90	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	17500	2000	L	0	BELLAVISTA	\N
d821560d-1760-4315-8859-049349f87fb4	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	17500	2000	XL	0	BELLAVISTA	\N
be5fb278-5bba-48aa-93c4-80d4633ea663	POLERON DE POLAR	0	0	General	2026-04-03 18:58:52.357533+00	19500	2000	2XL	0	BELLAVISTA	\N
24fe3e59-c5a1-493a-84a1-284889f22e88	SHORT	0	0		2026-04-03 20:04:32.294174+00	8000	2000	16	0	BELLAVISTA	\N
20e83716-5edf-4aa5-94b7-960450781d8c	BUZO COMPLETO	0	0	General	2026-04-03 20:06:12.987786+00	22500	2000	5	0	BELLAVISTA	\N
792ffa6c-8dcd-4636-890b-29a6ae016e79	POLERON CON CIERRE	0	0	General	2026-04-03 20:10:43.97051+00	14800	2000	5	0	BELLAVISTA	\N
0d0d1d4f-4ce4-46c7-b22a-63be9868828f	POLERON DE POLAR	0	0	General	2026-04-03 20:11:30.365021+00	9900	2000	5	0	BELLAVISTA	\N
6626b44e-0b8c-4ec5-8ff8-602a723e5759	PANTALON BUZO	0	0	General	2026-04-03 20:07:22.972609+00	8200	2000	5	0	BELLAVISTA	\N
52598cb0-9d4b-42ec-bbaa-fca898feab68	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	25000	2000	12	-1	BELLAVISTA	\N
7c4d2118-f8f5-409c-902a-5c84386af91d	PANTALON BUZO	-4	0	General	2026-04-03 18:58:52.357533+00	8900	2000	6	-1	BELLAVISTA	\N
76b75015-f3a8-4429-bc44-baa5035779a1	PANTALON BUZO	-1	0	General	2026-04-03 18:58:52.357533+00	11300	2000	14	-1	BELLAVISTA	\N
b2e5701a-f3bb-432b-9371-0f44af3e258d	PANTALON BUZO	-1	0	General	2026-04-03 18:58:52.357533+00	12000	2000	S	-1	BELLAVISTA	\N
2ec1c93e-a460-4544-98c1-40da4be230e5	POLERA USO DIARIO M/C	-1	0	General	2026-04-03 18:58:52.357533+00	12000	2000	S	-1	BELLAVISTA	\N
8ca51523-f40e-4010-a927-50a99b8f23a0	POLERON CON CIERRE	-1	0	General	2026-04-03 18:58:44.960568+00	18300	2000	M	-1	BELLAVISTA	\N
78598470-c50b-46ca-a937-71da4999a4f0	SHORT	0	0	General	2026-04-03 20:01:47.930391+00	4900	2000	5	0	BELLAVISTA	\N
16991b00-fc17-4c8e-af7a-ae9a5adc80f2	PANTALON BUZO	-6	0	General	2026-04-03 18:58:52.357533+00	10300	2000	10	-2	BELLAVISTA	\N
72205a3e-5dd9-4647-83d9-5550a40b0ecc	POLERON DE POLAR	-2	0	General	2026-04-03 18:58:52.357533+00	12900	2000	10	-2	BELLAVISTA	\N
e01ff920-4135-4abb-a1d4-fb7f706366ef	BUZO COMPLETO	-6	0	General	2026-04-03 18:58:52.357533+00	33000	2000	XL	-3	BELLAVISTA	\N
bc67b68c-4665-42b9-9eb7-7c722ed2eb6c	SHORT	-2	0	General	2026-04-03 18:58:52.357533+00	6900	2000	10	-1	BELLAVISTA	\N
3dd50c50-d55e-4c68-b5a2-d48c7f74bc44	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	7900	2000	10	0	HAYDN	\N
301667b4-a5a5-4d58-9dfe-3d56a0ca88b5	PANTALON BUZO	0	0	General	2026-04-03 18:58:52.357533+00	9500	2000	8	-3	BELLAVISTA	\N
11a33c86-b9ee-4996-86db-1757e770769b	SHORT	-2	0	General	2026-04-03 18:58:52.357533+00	8500	2000	S	0	BELLAVISTA	\N
98206752-7bbb-405f-949a-2893d9d3c701	PANTALON BUZO	-1	0	General	2026-04-03 18:58:52.357533+00	10800	2000	12	1	BELLAVISTA	\N
cd34e5a3-0200-4dc7-92f6-1398e471c32e	BUZO COMPLETO	0	0	General	2026-04-03 18:58:52.357533+00	24500	2000	10	-22	BELLAVISTA	\N
5be1542c-ce61-49f8-8783-3178425f8d14	BUZO COMPLETO	-2	0	General	2026-04-03 18:58:52.357533+00	23500	2000	8	-1	BELLAVISTA	\N
9dc3f678-a28f-4281-a9d1-e008d269ea98	PANTALON BUZO	-10	0	General	2026-04-03 18:58:52.357533+00	8200	2000	4	-10	BELLAVISTA	\N
49bfa035-8127-45e0-9ea8-faa6375a596e	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	26000	2000	10	0	HAYDN	\N
f3680939-4682-4125-bfce-18818b566400	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	27100	2000	12	0	HAYDN	\N
f288f09b-ace0-4819-ac0a-8727d58bfc42	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	9400	2000	6	0	COLEGIO CHILE	\N
5eb0ce00-63f3-4fac-8122-c029bd874a90	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	10000	2000	8	0	COLEGIO CHILE	\N
88d36523-499a-42ba-bfff-b051cfd5e89c	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	10900	2000	12	0	COLEGIO CHILE	\N
93fff70d-d151-48af-9437-2b5d9bf76522	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	12000	2000	S	0	COLEGIO CHILE	\N
f5718bb8-450e-46c9-a412-d739e3e76960	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	12700	2000	M	0	COLEGIO CHILE	\N
ed0adb45-efc4-4a60-b6d0-d5e7038d1a29	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	13000	2000	L	0	COLEGIO CHILE	\N
5bd61332-01d4-4ee1-a2f8-5a0563a78383	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	13900	2000	XL	0	COLEGIO CHILE	\N
f725909d-02c3-4025-8113-75fc16f8c94a	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	15500	2000	2XL	0	COLEGIO CHILE	\N
0a1f3e0d-0e32-47c6-9a39-ad5018cc4fd3	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	9900	2000	4	0	COLEGIO CHILE	\N
5410cee6-ff83-41b3-be48-3330272c3323	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	11000	2000	8	0	COLEGIO CHILE	\N
96e56811-d477-40b8-8451-fef6b443f0ac	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	11400	2000	10	0	COLEGIO CHILE	\N
5e3765e2-32cd-45b8-8603-b94ee14b6066	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	11900	2000	12	0	COLEGIO CHILE	\N
50d12b99-01ba-407b-88ff-54bb88df7f1d	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	12490	2000	14	0	COLEGIO CHILE	\N
cdb9c2f9-ef1f-498f-b67c-e2c310209791	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	12700	2000	16	0	COLEGIO CHILE	\N
f0057dde-96e0-4c77-874a-31cc4585c1a6	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	13000	2000	S	0	COLEGIO CHILE	\N
ba0ee5a5-862a-43d6-a76e-d8ad8449df95	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	13700	2000	M	0	COLEGIO CHILE	\N
96b5f54c-d529-4961-b7af-6679f7f0eacf	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	14000	2000	L	0	COLEGIO CHILE	\N
5ce60e35-c01c-4c9f-be3b-af14b295b4e3	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	14900	2000	XL	0	COLEGIO CHILE	\N
1c960a80-5897-41f6-8dde-e87f8de05622	POLERA USO DIARIO M/L	0	0	General	2026-04-07 22:43:59.501841+00	16500	2000	2XL	0	COLEGIO CHILE	\N
501aef75-60e4-491c-9ca0-66563c232fd3	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	7900	2000	4	0	COLEGIO CHILE	\N
5331db24-bea8-419b-a48c-eb12935180ca	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	8400	2000	6	0	COLEGIO CHILE	\N
a67f0307-8ad5-4ac8-9915-964160a1e2bf	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	9000	2000	8	0	COLEGIO CHILE	\N
e01fc577-9d52-41c4-b423-36d045a15aa6	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	9400	2000	10	0	COLEGIO CHILE	\N
6ada9577-4538-42c2-92d9-cf1e33d1c0c3	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	9900	2000	12	0	COLEGIO CHILE	\N
119dc745-8d5e-44c2-b6b6-b8a8e263b222	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	10400	2000	14	0	COLEGIO CHILE	\N
0a9c6313-8733-4c04-a423-ddda97b8b35b	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	10700	2000	16	0	COLEGIO CHILE	\N
f2970c9d-2950-4db6-b07f-6dcc0f2412da	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	11000	2000	S	0	COLEGIO CHILE	\N
2924be57-20df-4874-8147-a058cea7a0d1	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	11500	2000	M	0	COLEGIO CHILE	\N
76e40211-93d7-4c15-84ce-8bae091e7194	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	12000	2000	L	0	COLEGIO CHILE	\N
d7c69a54-4619-4703-abc9-296ebc9f0835	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	12000	2000	XL	0	COLEGIO CHILE	\N
81ccc57a-0c39-471b-87f9-fc2b0d20c99d	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:43:59.501841+00	14500	2000	2XL	0	COLEGIO CHILE	\N
159f00f6-b3a3-4fcf-ab3d-1074a3c9140e	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	8900	2000	4	0	COLEGIO CHILE	\N
6a2cd8f7-0d03-41a3-95b9-28285ad5459e	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	9400	2000	6	0	COLEGIO CHILE	\N
1367a6a8-bea4-4118-babb-3c0c6e760094	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	10000	2000	8	0	COLEGIO CHILE	\N
48af421e-b11b-4669-945b-f83733757132	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	10400	2000	10	0	COLEGIO CHILE	\N
0633fb1b-792d-4aad-81d0-3ae561609e33	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	10900	2000	12	0	COLEGIO CHILE	\N
c00cce3a-9e85-4e54-9114-7b72301302f7	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	11400	2000	14	0	COLEGIO CHILE	\N
f57e98a2-11e6-40e3-b051-22de80b16921	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	11700	2000	16	0	COLEGIO CHILE	\N
f66e5777-69ac-4952-970d-4df1be15fa7a	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	12000	2000	S	0	COLEGIO CHILE	\N
f909e5d1-1b16-4ce2-895e-ed08571ada73	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	12500	2000	M	0	COLEGIO CHILE	\N
cd1451d1-6a57-4840-b47c-782a4985807a	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	13000	2000	L	0	COLEGIO CHILE	\N
22c8d651-545e-4e8d-99cc-180a2ae517a7	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	13000	2000	XL	0	COLEGIO CHILE	\N
9035d309-2274-47b2-9efc-9f032eaf21c3	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:43:59.501841+00	15500	2000	2XL	0	COLEGIO CHILE	\N
ad79c708-fbfc-48b4-a1b6-d2f298b99d70	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	23000	2000	4	0	COLEGIO CHILE	\N
cc8a29cf-05b4-4120-9604-5df57b2a1b6f	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	23000	2000	5	0	COLEGIO CHILE	\N
308ea959-3edd-40c1-a9b0-673e673048ec	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	25000	2000	8	0	COLEGIO CHILE	\N
d7d6ad03-3d3b-45b9-bf9e-89b17f01f4bb	POLERA USO DIARIO M/L	-1	0	General	2026-04-07 22:43:59.501841+00	10400	2000	6	-1	COLEGIO CHILE	\N
45d8335f-f294-47ea-a1e6-b4fb2e2cbe31	POLERA USO DIARIO M/C	6	0	General	2026-04-07 22:43:59.501841+00	11490	2000	14	0	COLEGIO CHILE	\N
d67ec34a-abe3-43d0-abe6-d4f42fdb15b4	POLERA USO DIARIO M/C	6	0	General	2026-04-07 22:43:59.501841+00	11700	2000	16	0	COLEGIO CHILE	\N
24c8b01d-765b-484a-b508-011b385c0bdd	POLERA USO DIARIO M/C	4	0	General	2026-04-07 22:43:59.501841+00	10400	2000	10	0	COLEGIO CHILE	\N
23c199ec-c127-4a24-9af6-05f47db29c12	POLERA USO DIARIO M/C	0	0	General	2026-04-07 22:43:59.501841+00	8900	2000	4	2	COLEGIO CHILE	\N
3cd03694-2d8a-4660-9e01-69edac9a03fb	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	12900	2000	10	0	HAYDN	\N
ed7b536a-4c5b-4f27-a19e-6e16827432c3	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	26000	2000	10	0	COLEGIO CHILE	\N
ff3a1b21-dec1-4001-a941-e04a2d2e5026	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	27100	2000	12	0	COLEGIO CHILE	\N
3d3a8908-a960-4355-b5fa-3d40b447d2b4	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	28100	2000	14	0	COLEGIO CHILE	\N
b28dc6a7-bb5d-4f8e-a3b7-aca2679964f7	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	28800	2000	16	0	COLEGIO CHILE	\N
40c1140e-7a90-481c-8fef-510a27c5b841	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	29800	2000	S	0	COLEGIO CHILE	\N
0c2a8c99-8e08-4f39-8711-bdd70cda9a98	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	30900	2000	M	0	COLEGIO CHILE	\N
caea0465-578c-4b97-9515-c7c581b003cc	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	32000	2000	L	0	COLEGIO CHILE	\N
6cee6385-b701-4187-802f-6c48e4b89803	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	34700	2000	XL	0	COLEGIO CHILE	\N
158de7e4-68d9-4017-8d3b-b7528499dabe	BUZO COMPLETO	0	0	General	2026-04-07 22:43:59.501841+00	37900	2000	2XL	0	COLEGIO CHILE	\N
e448f326-bccb-4d05-ac38-95aac5283c3c	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	14800	2000	4	0	COLEGIO CHILE	\N
c1038886-0334-4e98-b39a-0ce60e2db152	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	14800	2000	5	0	COLEGIO CHILE	\N
043eb71e-7f82-473d-8526-3b5c1b2153dd	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	15200	2000	6	0	COLEGIO CHILE	\N
2b54e02d-61cf-49e2-8979-4b0dde23db38	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	15500	2000	8	0	COLEGIO CHILE	\N
fb0e3d05-e47d-4b20-96ee-37e957e27a6d	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	15700	2000	10	0	COLEGIO CHILE	\N
da6a709d-0728-4430-896b-b09a0609f706	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	16300	2000	12	0	COLEGIO CHILE	\N
60cbc8d2-5dc9-4f52-b9ba-daf0d39884e4	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	16800	2000	14	0	COLEGIO CHILE	\N
f213e33f-52f2-4814-ad7c-cf930a547bab	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	17300	2000	16	0	COLEGIO CHILE	\N
20e69e7f-2690-4d82-a18d-4ba38d9a2ae1	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	17800	2000	S	0	COLEGIO CHILE	\N
88026cf8-c4cf-4192-bbe4-2a1ea868827e	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	18300	2000	M	0	COLEGIO CHILE	\N
c28cb1bf-5968-4af2-8e0a-ab7c1bc1b161	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	18900	2000	L	0	COLEGIO CHILE	\N
f33b06e7-d841-49c8-899f-6250796b32d8	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	21000	2000	XL	0	COLEGIO CHILE	\N
12d424dd-dc5d-40cc-aeaa-635650a6fe87	POLERON CON CIERRE	0	0	General	2026-04-07 22:43:59.501841+00	23000	2000	2XL	0	COLEGIO CHILE	\N
9265f93a-3b1f-4b46-a7f8-61ffa15a084f	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	8200	2000	4	0	COLEGIO CHILE	\N
ba4d68a1-c331-4a01-84ef-685cb33c5af0	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	8200	2000	5	0	COLEGIO CHILE	\N
0bcc9de0-f9d9-4cac-b3f6-2000c54e02bc	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	8900	2000	6	0	COLEGIO CHILE	\N
0677e09f-b411-4de8-ac9b-6ea48c0b0578	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	9500	2000	8	0	COLEGIO CHILE	\N
32baf10b-cfe4-432a-81af-be6f792ba1fc	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	10300	2000	10	0	COLEGIO CHILE	\N
4863c256-f4c3-43c9-baa8-39c1dcf38506	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	10800	2000	12	0	COLEGIO CHILE	\N
ba713875-4509-4966-b64b-2bda5de73109	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	11300	2000	14	0	COLEGIO CHILE	\N
f88b7c0a-f8c6-4ce2-9f6d-79983c7b94b1	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	11500	2000	16	0	COLEGIO CHILE	\N
b8160033-d2ec-4349-aa5d-50f21a51344d	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	12000	2000	S	0	COLEGIO CHILE	\N
db22583a-2d3c-49e2-ba35-88b3a0cfad64	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	12600	2000	M	0	COLEGIO CHILE	\N
f2e21ee7-4f07-4b3d-a6a5-d5b3ce99692e	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	13100	2000	L	0	COLEGIO CHILE	\N
c4aafe9c-dfe1-4613-aec1-22f56a5f1da2	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	13700	2000	XL	0	COLEGIO CHILE	\N
8095ff9c-c371-4628-b6f7-34084858133f	PANTALON BUZO	0	0	General	2026-04-07 22:43:59.501841+00	14900	2000	2XL	0	COLEGIO CHILE	\N
e9bde79c-d548-4f0b-a563-ff3f4790c53d	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	4900	2000	4	0	COLEGIO CHILE	\N
cf3634f9-cf3c-40d1-aff5-711ad7d38e74	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	4900	2000	5	0	COLEGIO CHILE	\N
d5d7df00-575a-4467-a4ef-ce77adda7f56	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	5200	2000	6	0	COLEGIO CHILE	\N
d0e8933d-74f0-4b15-95dd-e3d8950f6735	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	6300	2000	8	0	COLEGIO CHILE	\N
22b33923-279c-4065-b192-0dfecaae660c	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	6900	2000	10	0	COLEGIO CHILE	\N
b76103c6-aa27-4faa-bde0-6fb05a359add	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	7400	2000	12	0	COLEGIO CHILE	\N
0a6c85a3-da37-4715-a168-8baf262993ba	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	8000	2000	14	0	COLEGIO CHILE	\N
dac49e9a-1c73-4e3b-b107-5b7fecde966d	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	8000	2000	16	0	COLEGIO CHILE	\N
c62c0b5d-9d84-4ebf-bdf2-c7d4fe3f05dc	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	8500	2000	S	0	COLEGIO CHILE	\N
7fcfdbe0-828b-466e-b871-c56a6db574cc	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	8500	2000	M	0	COLEGIO CHILE	\N
5262d152-b75d-461d-96ab-8062a0b437f5	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	9000	2000	L	0	COLEGIO CHILE	\N
16e97af7-1da2-4805-b68d-3e859c62fda7	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	9000	2000	XL	0	COLEGIO CHILE	\N
b08723d5-f939-4094-8485-5e09e3f0219e	SHORT	0	0	General	2026-04-07 22:43:59.501841+00	9900	2000	2XL	0	COLEGIO CHILE	\N
1c9ea628-514c-476f-8bf0-f72b5f4a4323	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	9900	2000	4	0	COLEGIO CHILE	\N
bc839dd2-dcf9-417d-992e-ee2c6cf76a0a	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	9900	2000	5	0	COLEGIO CHILE	\N
a6fc2056-2345-44e4-aeee-f076d77fb68a	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	11900	2000	6	0	COLEGIO CHILE	\N
b08bc1a8-c024-4fe6-9bef-4b1e8a4606d9	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	11900	2000	8	0	COLEGIO CHILE	\N
c971a4e8-3f8c-4fb3-ac48-b459d4b6d87a	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	12900	2000	10	0	COLEGIO CHILE	\N
6ef383d1-ca94-477e-9390-7ba0a4481745	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	12900	2000	12	0	COLEGIO CHILE	\N
77b1c2c7-52dc-4cb8-b8ed-f0afc71a4fc9	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	14400	2000	14	0	COLEGIO CHILE	\N
72d42c38-bffe-4b45-84de-e9ca69728c61	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	14400	2000	16	0	COLEGIO CHILE	\N
d90cfe45-e44f-4034-bc94-ef77b7419753	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	15400	2000	S	0	COLEGIO CHILE	\N
15b3591f-8d09-4be8-a90d-4eb0f18f8df2	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	15400	2000	M	0	COLEGIO CHILE	\N
3559cd4d-a86c-4f4e-980a-1649e925e760	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	17500	2000	L	0	COLEGIO CHILE	\N
0d731ef2-9f22-4eda-b4f1-5c1287d27ebb	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	17500	2000	XL	0	COLEGIO CHILE	\N
4b12e519-ca31-4296-a1cb-3f745ee79364	POLERON DE POLAR	0	0	General	2026-04-07 22:43:59.501841+00	19500	2000	2XL	0	COLEGIO CHILE	\N
03f96221-39ac-444a-9a07-421cd3fe5e77	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	9400	2000	6	0	FRAY CAMILO	\N
af525c43-950a-4c52-a3bc-7454b16695a2	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	10000	2000	8	0	FRAY CAMILO	\N
be0be563-1f5b-4ff6-93a5-cf1bd953ac75	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	10400	2000	10	0	FRAY CAMILO	\N
ef8b7d1c-e490-404e-a691-fe869bae75ae	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	10900	2000	12	0	FRAY CAMILO	\N
e77e5b7a-21fe-41ca-a4f7-732c799ce54b	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	11490	2000	14	0	FRAY CAMILO	\N
74f24c28-5530-491b-a9bc-4739c080849b	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	11700	2000	16	0	FRAY CAMILO	\N
851f999b-6d39-4731-a1eb-16658a2a1c30	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	12000	2000	S	0	FRAY CAMILO	\N
1746951a-2178-49a2-8d1b-9e363b299d2b	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	12700	2000	M	0	FRAY CAMILO	\N
bb939fe0-fbba-4d6a-8590-46f7629b4de7	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	13000	2000	L	0	FRAY CAMILO	\N
c07f8639-b13c-4003-aef6-fc2c4e3d3fa6	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	13900	2000	XL	0	FRAY CAMILO	\N
0892e62e-c85a-4e01-bbd8-d4bee296ac17	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:38:01.12035+00	15500	2000	2XL	0	FRAY CAMILO	\N
65546a5b-b221-4828-ab0a-a70a8666dc5a	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	9900	2000	4	0	FRAY CAMILO	\N
7ab84867-c827-4071-9dc7-6d63f4fb3066	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	10400	2000	6	0	FRAY CAMILO	\N
f3103a28-8253-4eb0-bb0f-42b8d8ef2b00	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	11000	2000	8	0	FRAY CAMILO	\N
51b0eaa5-52d9-4e77-b684-5ceb34f14fa8	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	11400	2000	10	0	FRAY CAMILO	\N
f4befb7c-cb10-4a1a-90e8-2096363a2dc0	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	11900	2000	12	0	FRAY CAMILO	\N
65a076db-fb30-4ca1-8894-126ff81b7edb	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	12490	2000	14	0	FRAY CAMILO	\N
0fee5e08-ac55-407a-aa1c-70f4a5e28eec	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	12700	2000	16	0	FRAY CAMILO	\N
d94e2794-43b8-4948-b5cf-baca19d923fa	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	13000	2000	S	0	FRAY CAMILO	\N
95561b1d-d654-4568-b3b5-94977cd1b13c	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	13700	2000	M	0	FRAY CAMILO	\N
7f6f847b-7a16-4b6c-94f2-8a9037beb91a	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	14000	2000	L	0	FRAY CAMILO	\N
83ee6299-c4b4-49a5-808a-81661ac5eef1	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	14900	2000	XL	0	FRAY CAMILO	\N
cbdc62c0-ff47-46c4-885d-687dcd74e89c	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:38:01.12035+00	16500	2000	2XL	0	FRAY CAMILO	\N
040ef30b-7f07-4898-9592-5f61d6ca1cd5	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	6600	2000	4	0	FRAY CAMILO	\N
3d5eecdf-7afe-44bc-80ee-8d0902dd8e8f	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	7300	2000	6	0	FRAY CAMILO	\N
57dec6ee-20cb-404c-b2b9-89746c70dc0f	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	7600	2000	8	0	FRAY CAMILO	\N
e1aa4b14-5726-4498-854c-756f4a14b8a1	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	7900	2000	10	0	FRAY CAMILO	\N
9ddb2626-9072-4293-8dea-6782c87a5fe8	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	8800	2000	12	0	FRAY CAMILO	\N
5a73f41a-9eea-425f-b616-4b4f6c309686	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	9100	2000	14	0	FRAY CAMILO	\N
e00443ee-b7bb-41af-96be-e3f84f78f565	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	9300	2000	16	0	FRAY CAMILO	\N
755fe773-07a2-4445-a47a-19c70c991b86	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	9600	2000	S	0	FRAY CAMILO	\N
46eb8f64-c9a7-429e-b1e2-9ab49b409baa	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	9900	2000	M	0	FRAY CAMILO	\N
fa19f1e1-6899-423d-b594-d43b22409acc	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	10400	2000	L	0	FRAY CAMILO	\N
6b27fdb1-ac22-4634-9e73-ee30d33bad00	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	11500	2000	XL	0	FRAY CAMILO	\N
2fd2048c-0055-4887-824a-39410a50988e	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:38:01.12035+00	13500	2000	2XL	0	FRAY CAMILO	\N
48abe103-9b49-4d2d-8954-40024c83ab57	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	7600	2000	4	0	FRAY CAMILO	\N
fbf8fa7d-fdaa-4f7b-89a9-5ddea4e40c5e	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	8300	2000	6	0	FRAY CAMILO	\N
f0f20392-2234-45a6-95e0-fc31756edec6	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	8600	2000	8	0	FRAY CAMILO	\N
c3e5c675-56b1-4e93-b692-0f819ec099b3	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	8900	2000	10	0	FRAY CAMILO	\N
a532afc2-4dd6-4ab3-a0ea-ed415de0b701	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	9800	2000	12	0	FRAY CAMILO	\N
736e6fe9-60f4-4c94-815d-cb2eef796796	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	10100	2000	14	0	FRAY CAMILO	\N
23e0daca-d5a4-4ae4-b7e5-468081b3f296	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	10300	2000	16	0	FRAY CAMILO	\N
2edbf6c1-bf36-4941-a132-91b834596afd	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	10600	2000	S	0	FRAY CAMILO	\N
6a232fdc-84eb-4a2a-9c5e-0cf5aab6569f	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	10900	2000	M	0	FRAY CAMILO	\N
657d5a3d-2740-41ea-acca-9361ebd5d112	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	11400	2000	L	0	FRAY CAMILO	\N
f1fd71d0-d21f-460e-aba4-c43cbc8ff4d7	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	12500	2000	XL	0	FRAY CAMILO	\N
57f689c1-1a01-4c0a-8999-d92a03e5f42e	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:38:01.12035+00	14500	2000	2XL	0	FRAY CAMILO	\N
6c461b07-f6f2-46e0-926e-73fa5ad4c765	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	23400	2000	5	0	FRAY CAMILO	\N
170a1b98-f84f-484e-be42-7a6e17b17279	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	23400	2000	6	0	FRAY CAMILO	\N
8984cb47-7c08-4c20-9f6c-2d12f42d1ac4	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	23500	2000	8	0	FRAY CAMILO	\N
8d36f7e5-705b-4f17-b5dd-aafda3831cd7	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	24500	2000	10	0	FRAY CAMILO	\N
a4c01ec0-aa28-427c-aa57-822d2b20cf6f	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	25000	2000	12	0	FRAY CAMILO	\N
2175344b-6161-4efb-b583-78878f1c9c37	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	26000	2000	14	0	FRAY CAMILO	\N
a205b68b-d1d0-459c-a0d3-db381b3363b6	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	27000	2000	16	0	FRAY CAMILO	\N
06f99ec9-68f8-499d-b673-09590251104f	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	28000	2000	S	0	FRAY CAMILO	\N
134a81fe-4f52-442e-af01-ada631f8e682	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	29500	2000	M	0	FRAY CAMILO	\N
d967ea7c-f11d-4f7f-9169-9251be1815ad	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	31100	2000	L	0	FRAY CAMILO	\N
f1e797f7-b1f7-4f32-a88d-1c140b787461	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	33000	2000	XL	0	FRAY CAMILO	\N
fc9dc5e8-2c74-4aaa-ab3f-f7b0b2bf356b	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	34900	2000	2XL	0	FRAY CAMILO	\N
54157309-3b6b-48ae-8e0a-c400370be1e4	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	14800	2000	4	0	FRAY CAMILO	\N
c0b7fc82-862e-46e7-b7a0-0e06b1dab684	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	14800	2000	5	0	FRAY CAMILO	\N
aaa9b818-cc0b-411b-93af-8f83b5e8c2fb	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	15200	2000	6	0	FRAY CAMILO	\N
da640597-87c6-43b7-99a7-666d331d3cee	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	15500	2000	8	0	FRAY CAMILO	\N
22bbe1df-807c-4381-be6d-1b46d07385c5	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	15700	2000	10	0	FRAY CAMILO	\N
87a789d1-4ae5-4742-aba7-949c1c48e079	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	16300	2000	12	0	FRAY CAMILO	\N
89365ed6-bc6e-46e7-8b1d-b5911510b14e	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	16800	2000	14	0	FRAY CAMILO	\N
b667677a-9381-4e53-8728-d72ffc268ed6	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	17300	2000	16	0	FRAY CAMILO	\N
cf39662c-c38d-4d62-a08d-ad3a97cb74f8	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	17800	2000	S	0	FRAY CAMILO	\N
9a520419-3997-4b45-9225-6031576b84f0	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	18300	2000	M	0	FRAY CAMILO	\N
32eee9d7-9d11-4626-8365-114defa1328b	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	18900	2000	L	0	FRAY CAMILO	\N
f7f3e17b-3f24-4589-8d92-93646ee2530f	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	21000	2000	XL	0	FRAY CAMILO	\N
f6347194-1aa4-48d3-89ba-beb72cbf579f	POLERON CON CIERRE	0	0	General	2026-04-08 04:38:01.12035+00	23000	2000	2XL	0	FRAY CAMILO	\N
b6e0ab00-a7a5-42db-b143-e4e54f7dcf37	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	8200	2000	4	0	FRAY CAMILO	\N
566ec852-9140-45e7-bf9c-3f043fc3494b	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	8200	2000	5	0	FRAY CAMILO	\N
00035ce2-e827-4675-8dc6-26ac0d119076	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	8700	2000	6	0	FRAY CAMILO	\N
369330a0-c3b3-444f-a19b-a1608874a6d7	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	9300	2000	8	0	FRAY CAMILO	\N
e214fdda-dc99-48ee-bacd-ee6711c54451	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	9800	2000	10	0	FRAY CAMILO	\N
ed1a2e05-6244-4bc5-808b-eb140edbd582	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	10400	2000	12	0	FRAY CAMILO	\N
c57a3017-9c19-493a-acad-be38f9dfddb7	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	10900	2000	14	0	FRAY CAMILO	\N
bdcf9ed6-3b9f-4eec-a1cb-cda9f8b77cf8	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	11500	2000	16	0	FRAY CAMILO	\N
b7a6f7de-7e18-41ab-99d9-205ac5ea60d6	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	12000	2000	S	0	FRAY CAMILO	\N
13d46bc8-815d-4bbb-ad51-0c50dae79a05	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	12600	2000	M	0	FRAY CAMILO	\N
0f2a24c3-19bd-4dbe-9633-b48638e078eb	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	13100	2000	L	0	FRAY CAMILO	\N
c158a840-b39d-4367-b925-8ad96a5ef7d6	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	13700	2000	XL	0	FRAY CAMILO	\N
56559d81-7f8e-412d-9be1-1639e879ffe7	PANTALON BUZO	0	0	General	2026-04-08 04:38:01.12035+00	14900	2000	2XL	0	FRAY CAMILO	\N
49dfb5fb-d905-4f25-a849-492cdef17043	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	4900	2000	4	0	FRAY CAMILO	\N
20e58cec-4026-4d3c-a730-243fbd38da62	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	4900	2000	5	0	FRAY CAMILO	\N
5c642d96-b7a4-4cb5-ba33-b7cb5cc83151	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	5200	2000	6	0	FRAY CAMILO	\N
bd7a31d1-2a16-46e6-be78-c99cb85ce8f3	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	6300	2000	8	0	FRAY CAMILO	\N
4cd1fee0-4a86-4a91-a43f-f6c5ed5cb5e3	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	6900	2000	10	0	FRAY CAMILO	\N
3aa96d86-e5df-44cb-a0e2-b9ce6719bf57	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	7400	2000	12	0	FRAY CAMILO	\N
a1272c4d-e3b4-4b1a-9540-b7f7a00e8149	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	8000	2000	14	0	FRAY CAMILO	\N
00769c79-2fb9-4d6f-afc7-2009280d16d7	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	8000	2000	16	0	FRAY CAMILO	\N
4e495e75-6ce2-4883-bb05-bc9fadc493d0	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	8500	2000	S	0	FRAY CAMILO	\N
34e83c07-490d-4950-b4ac-fbddd2387cc3	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	8500	2000	M	0	FRAY CAMILO	\N
6ec98c90-24d6-4ba5-89a6-bde4029156fe	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	9000	2000	L	0	FRAY CAMILO	\N
358abe37-5605-4887-87fe-21bfa1fd8183	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	9000	2000	XL	0	FRAY CAMILO	\N
bc3fad21-b4f5-4648-86e4-1a8037a8086a	SHORT	0	0	General	2026-04-08 04:38:01.12035+00	9900	2000	2XL	0	FRAY CAMILO	\N
7e8613c3-79a1-432b-9e83-3bbe7c49e4ea	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	9900	2000	4	0	FRAY CAMILO	\N
81969016-afc1-4710-9c3d-b05047e76ea3	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	9900	2000	5	0	FRAY CAMILO	\N
c4012fc6-b59c-4020-9c83-32e5962d615e	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	11900	2000	6	0	FRAY CAMILO	\N
76b9f94a-4637-48c0-88d2-667c22329a8b	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	11900	2000	8	0	FRAY CAMILO	\N
6fac125e-6ea2-4e0a-b7b3-b80a3b9e9464	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	12900	2000	10	0	FRAY CAMILO	\N
c54e6cbf-968e-4c9d-8de4-cf909c7205ac	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	12900	2000	12	0	FRAY CAMILO	\N
4178b9c3-2618-44cb-bc83-eecb0142476e	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	14400	2000	14	0	FRAY CAMILO	\N
aca05a2d-10d5-439c-a9dc-202afe59bbae	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	14400	2000	16	0	FRAY CAMILO	\N
75663c14-eedf-490b-86e2-b0eab490e664	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	15400	2000	S	0	FRAY CAMILO	\N
67784eec-ed34-45f8-8599-41df0f3ac5e4	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	15400	2000	M	0	FRAY CAMILO	\N
81a9e87e-26d8-49af-8851-c1d3f30ed48e	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	17500	2000	L	0	FRAY CAMILO	\N
44b522aa-067d-4acc-aa0f-96e266379a1a	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	17500	2000	XL	0	FRAY CAMILO	\N
c0bae846-07bb-46a3-ad84-58b5403dd210	POLERON DE POLAR	0	0	General	2026-04-08 04:38:01.12035+00	19500	2000	2XL	0	FRAY CAMILO	\N
d866358f-6a0c-4d81-a14b-adec957622d7	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	12000	2000	12	0	INSTITUTO NACIONAL	\N
908276e4-2fb4-428b-aa83-3a9b30be0cef	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	12000	2000	14	0	INSTITUTO NACIONAL	\N
e64db4cd-9e7d-409d-a9d7-ff2a7599f6d4	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	12500	2000	16	0	INSTITUTO NACIONAL	\N
4857921e-9948-4b33-9ea7-bef24202c019	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	12500	2000	S	0	INSTITUTO NACIONAL	\N
94908020-8130-44a8-8614-f0e7c677e1ee	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	13000	2000	M	0	INSTITUTO NACIONAL	\N
6b760ef3-64e6-4592-a7bc-627316bdde14	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	13000	2000	L	0	INSTITUTO NACIONAL	\N
32eaafb2-83ba-42e9-a975-c29123913b22	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	14500	2000	XL	0	INSTITUTO NACIONAL	\N
88cbb8ac-f080-44a5-acad-e67ba1a009be	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:40:03.963582+00	14500	2000	2XL	0	INSTITUTO NACIONAL	\N
da2aed5a-2c20-4e95-806e-89bf76a7c891	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	13000	2000	12	0	INSTITUTO NACIONAL	\N
cad4b4c6-0bb0-42f2-9474-6e1a51c73036	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	13000	2000	14	0	INSTITUTO NACIONAL	\N
0316cc3a-d0e6-4be8-93aa-e0642be684f0	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	13500	2000	16	0	INSTITUTO NACIONAL	\N
5deb4070-3763-4f07-a7c1-63ff08d7df7e	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	13500	2000	S	0	INSTITUTO NACIONAL	\N
5bef3155-fd92-4285-9465-18a7733e529a	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	14000	2000	M	0	INSTITUTO NACIONAL	\N
34a23aa9-8f7d-48a9-a919-3046cb6b9f59	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	14000	2000	L	0	INSTITUTO NACIONAL	\N
bc1e0275-31d1-466b-b16f-1679c8e335b1	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	15500	2000	XL	0	INSTITUTO NACIONAL	\N
dd1c7837-f654-4502-b293-9657ca39c237	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:40:03.963582+00	15500	2000	2XL	0	INSTITUTO NACIONAL	\N
33757ac3-535f-4116-bd6e-da54d5b099c8	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	14	0	INSTITUTO NACIONAL	\N
d6a3ed19-60f9-4fa5-8098-5f3c1f4c8281	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	16	0	INSTITUTO NACIONAL	\N
29df4991-464e-407e-941e-18951788f9f2	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	S	0	INSTITUTO NACIONAL	\N
2da9c0ff-f7fa-472f-a9ce-46467716e990	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	M	0	INSTITUTO NACIONAL	\N
df0a5027-a8de-4a4b-ac6a-78e16c2266b6	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	L	0	INSTITUTO NACIONAL	\N
abb7aa34-a723-4af4-ae18-ce848faaabb9	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	XL	0	INSTITUTO NACIONAL	\N
2fa7d5fe-ddce-439b-af02-8c5deb83cac9	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	2XL	0	INSTITUTO NACIONAL	\N
b26f7993-4282-4a70-a64b-3fbb74cfe346	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	12	0	INSTITUTO NACIONAL	\N
0b6bae32-364c-403c-aa4f-ee4da600f523	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	14	0	INSTITUTO NACIONAL	\N
02abef6d-942b-441f-b50d-429339a36147	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	16	0	INSTITUTO NACIONAL	\N
6704d8c0-7a10-4ca4-b789-e1f0a7cffe2d	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	S	0	INSTITUTO NACIONAL	\N
536aaabf-35fd-4079-9ad4-5b23649e92dd	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	M	0	INSTITUTO NACIONAL	\N
9a6e93d0-aac2-459f-a3c1-1945f1bc9e18	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	L	0	INSTITUTO NACIONAL	\N
c937d712-6663-40fe-b14b-30b5f277a1d2	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	XL	0	INSTITUTO NACIONAL	\N
79f52520-d80c-4bfc-9cf2-08eed45c6de1	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:40:03.963582+00	11000	2000	2XL	0	INSTITUTO NACIONAL	\N
07e0287b-f7f8-4686-8de3-dd12f9b6992f	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	8900	2000	4	0	POETA NERUDA	\N
0d6c78ea-a7eb-4f03-8274-1d7b795225f0	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	9400	2000	6	0	POETA NERUDA	\N
b2ba38ca-085f-41dc-a6e9-ca01777bef80	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	10000	2000	8	0	POETA NERUDA	\N
b53a03c2-97da-40a3-b531-76c32c9d99ea	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	10400	2000	10	0	POETA NERUDA	\N
cb79fc2d-f789-487b-9f04-fba2f2e41a9b	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	10900	2000	12	0	POETA NERUDA	\N
1b0d6c29-8b2d-4dde-9afe-8b9ae67e6bcc	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	11490	2000	14	0	POETA NERUDA	\N
8e153771-8e49-4619-80ef-6d031963540e	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	12000	2000	S	0	POETA NERUDA	\N
58bd61c6-7c89-4d4f-aecc-883452bc3007	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	12700	2000	M	0	POETA NERUDA	\N
da12aa4c-42e1-4508-b046-cdad151e7a29	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	13000	2000	L	0	POETA NERUDA	\N
60be6b44-2825-4879-8245-d33a3299b782	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	13900	2000	XL	0	POETA NERUDA	\N
9b7d6ee0-e545-4ea1-b6e5-b7ddee60c26a	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	15500	2000	2XL	0	POETA NERUDA	\N
8590e95f-b4a0-4ed8-a4c8-531c424f191a	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	9900	2000	4	0	POETA NERUDA	\N
fce377d6-58b0-4ae3-a179-3498350f514f	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	10400	2000	6	0	POETA NERUDA	\N
6c9b6fd0-b5ec-41f1-84df-6baa3e756bca	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	11000	2000	8	0	POETA NERUDA	\N
d9556bd7-9b51-45f6-b095-7a9be1ab0396	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	11400	2000	10	0	POETA NERUDA	\N
61878bed-1e5c-43d0-9226-ef2e2177dfcb	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	11900	2000	12	0	POETA NERUDA	\N
f47c197e-4134-45f0-9de2-61a17126159b	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	12490	2000	14	0	POETA NERUDA	\N
15d4dc79-fb7b-44c7-9a10-0ef0021fb6b0	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	13000	2000	S	0	POETA NERUDA	\N
1eb5b42e-de0a-4d71-818a-c2c3658c56db	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	13700	2000	M	0	POETA NERUDA	\N
b357ac2a-cde2-4d76-a6f9-1af18c0b3f32	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	14000	2000	L	0	POETA NERUDA	\N
683357d5-380f-4cbc-accd-08273fac87aa	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	14900	2000	XL	0	POETA NERUDA	\N
22b73c9a-9280-45a3-b828-1de8a3de2a66	POLERA USO DIARIO M/L	0	0	General	2026-04-08 04:41:20.842886+00	16500	2000	2XL	0	POETA NERUDA	\N
c2a7cd48-ecdc-4be7-878e-c27059a05dec	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	6600	2000	4	0	POETA NERUDA	\N
3ed2ef07-c5ee-4ed1-94e8-73fbfa0fea15	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	7300	2000	6	0	POETA NERUDA	\N
dd8f3134-fcb1-476d-b8db-57862f38fee3	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	7600	2000	8	0	POETA NERUDA	\N
a64a6881-5978-4746-8df7-c5b8bfcab1ba	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	7900	2000	10	0	POETA NERUDA	\N
149930f5-b0eb-4cd8-87b2-bb5ca317ae4f	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	8800	2000	12	0	POETA NERUDA	\N
9df6bed7-f4c6-4a6b-94ab-ebacacc9e9f9	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	9100	2000	14	0	POETA NERUDA	\N
9918e8b4-e2aa-4c1b-87b4-64bbdb5e7bed	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	9300	2000	16	0	POETA NERUDA	\N
bd29f00e-d3a5-4bf4-86d8-1f2c266948ab	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	9600	2000	S	0	POETA NERUDA	\N
4bd4aa5c-9d5d-4796-bf26-d61b5bacee0f	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	9900	2000	M	0	POETA NERUDA	\N
12436c7c-db65-4241-8a37-cc823e88ab76	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	10400	2000	L	0	POETA NERUDA	\N
4cfaf960-51e1-4cc4-b1cb-cc399383301e	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	11500	2000	XL	0	POETA NERUDA	\N
ee6a42d0-48cb-4621-a590-11d82de8c928	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:41:20.842886+00	13500	2000	2XL	0	POETA NERUDA	\N
336470b6-1a45-4eb0-a2f4-2ed42bfe6ab2	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	7600	2000	4	0	POETA NERUDA	\N
e0666e57-9e31-4256-8a61-ccc19f3ce197	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	8300	2000	6	0	POETA NERUDA	\N
48a4a067-22a6-4a95-9a5a-17cb3d8906b3	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	8600	2000	8	0	POETA NERUDA	\N
fd7931d8-fd3d-4bba-8c1a-87826065a099	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	8900	2000	10	0	POETA NERUDA	\N
8b41ea3c-919f-4edc-b9c7-575d98835e27	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	9800	2000	12	0	POETA NERUDA	\N
b259f65e-fc5b-47bc-b2d5-6a36931073f9	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	10100	2000	14	0	POETA NERUDA	\N
24d19a17-ca7a-4e6f-a8bf-619350e50228	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	10300	2000	16	0	POETA NERUDA	\N
de781297-d7f5-49ad-a397-f78b0ff9f919	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	10600	2000	S	0	POETA NERUDA	\N
05353cc6-0cb3-46c8-b707-d6c52f3b8d3e	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	10900	2000	M	0	POETA NERUDA	\N
18779945-30c2-4908-a645-24a20a2a85c6	POLERA USO DIARIO M/C	0	0	General	2026-04-08 04:41:20.842886+00	11700	2000	16	2	POETA NERUDA	\N
b7321598-4580-4f1b-8506-91a37b902135	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	11400	2000	L	0	POETA NERUDA	\N
1cb5ae70-8161-4f6e-a0c9-b3e9fbf99993	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	12500	2000	XL	0	POETA NERUDA	\N
8e14d9ff-1c93-414b-8832-58ef2830bb3d	POLERA DEPORTES M/L	0	0	General	2026-04-08 04:41:20.842886+00	14500	2000	2XL	0	POETA NERUDA	\N
87880af9-cf4c-41d1-9023-7c2a8dda4757	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	22500	2000	4	0	POETA NERUDA	\N
4bcb7c85-7004-4e9b-9b3b-a09e8af96d0b	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	23400	2000	5	0	POETA NERUDA	\N
1303a7be-453a-4091-958f-978763b5c3ce	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	23400	2000	6	0	POETA NERUDA	\N
4fadedcd-90c7-4cdd-96ab-8eafd0685ecb	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	23500	2000	8	0	POETA NERUDA	\N
561ffd99-3fc2-4edb-af17-90b8b08f0f65	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	24500	2000	10	0	POETA NERUDA	\N
bfe50693-cb02-4bd4-b21d-faf90cc7b5a2	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	25000	2000	12	0	POETA NERUDA	\N
bb840d6f-eded-4e94-b6a0-be282322d641	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	26000	2000	14	0	POETA NERUDA	\N
57dca172-f000-4624-9a4f-072c3aee1695	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	27000	2000	16	0	POETA NERUDA	\N
2fe020e2-f3d0-449f-b3bc-a0432ed596fa	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	28000	2000	S	0	POETA NERUDA	\N
5b16346c-ea76-4832-932a-a29a1b2d6f07	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	29500	2000	M	0	POETA NERUDA	\N
6e0148f0-d863-4ba7-9a77-c2008761fdbb	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	31100	2000	L	0	POETA NERUDA	\N
acfbfeb1-4520-4238-ab71-a67388b4bd47	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	33000	2000	XL	0	POETA NERUDA	\N
1452662b-d210-4e89-a4d9-9cd440e5448a	BUZO COMPLETO	0	0	General	2026-04-08 04:41:20.842886+00	34900	2000	2XL	0	POETA NERUDA	\N
602ad11b-1a0f-48fd-abfd-e678616e0956	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	14800	2000	4	0	POETA NERUDA	\N
81ecd1e5-ddb2-48f3-bba7-b64b0e337a41	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	14800	2000	5	0	POETA NERUDA	\N
a0e821cb-a68f-432a-a4d0-b6989761485e	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	15200	2000	6	0	POETA NERUDA	\N
b599fbc5-222b-418a-b441-b34239af9e30	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	15500	2000	8	0	POETA NERUDA	\N
3348e1c5-4360-4a01-9513-1f803ee27357	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	15700	2000	10	0	POETA NERUDA	\N
b45deec5-1b14-4789-b1bd-bb3bfacd5606	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	16300	2000	12	0	POETA NERUDA	\N
6c527575-f16b-4695-ad06-4f8b6c211587	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	16800	2000	14	0	POETA NERUDA	\N
9fb75a59-7ec6-4167-b08c-7f0f25fa5098	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	17300	2000	16	0	POETA NERUDA	\N
8255f51a-4940-49b7-9c3e-bd05055f3518	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	17800	2000	S	0	POETA NERUDA	\N
3748277d-8a27-4732-85fc-a27ef661252e	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	18300	2000	M	0	POETA NERUDA	\N
56a5b3f5-3967-4ba8-b83a-a81d601f3968	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	18900	2000	L	0	POETA NERUDA	\N
62527ac3-e107-4612-b06b-a96984f64457	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	21000	2000	XL	0	POETA NERUDA	\N
5b84b838-fb56-4ff5-9317-da078ee97e1e	POLERON CON CIERRE	0	0	General	2026-04-08 04:41:20.842886+00	23000	2000	2XL	0	POETA NERUDA	\N
ca24f88d-f4af-46a2-a474-6fccf099dca8	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	8200	2000	4	0	POETA NERUDA	\N
bc833403-be15-4af6-ac0d-54e1f3bf8d97	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	8200	2000	5	0	POETA NERUDA	\N
27c6e745-ff3c-4520-9d53-0f24c14fac69	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	8700	2000	6	0	POETA NERUDA	\N
1ebf310c-5406-4547-a476-17ad8299f209	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	9300	2000	8	0	POETA NERUDA	\N
bcfd6712-ec07-41ef-882f-9bbfde535f3c	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	9800	2000	10	0	POETA NERUDA	\N
018be6a8-8b7f-47a1-b542-cfcb3be39772	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	10400	2000	12	0	POETA NERUDA	\N
1401bad7-f0b0-49c0-82cd-fa8481e77767	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	10900	2000	14	0	POETA NERUDA	\N
ac6815da-0492-4999-8be5-ab8e5b2f03f8	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	11500	2000	16	0	POETA NERUDA	\N
3f6c5fb8-e75e-46f4-9bfe-681df351ab38	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	12000	2000	S	0	POETA NERUDA	\N
f033e0cf-2ccd-4d40-af64-87657d54ebf4	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	12600	2000	M	0	POETA NERUDA	\N
89c858b2-5916-48cf-9bd3-436296fb9274	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	13100	2000	L	0	POETA NERUDA	\N
63d3ce6b-172b-4cc2-86a5-e27a90f3164a	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	13700	2000	XL	0	POETA NERUDA	\N
061b7cfa-f44d-43d8-8d83-4059bcec9abc	PANTALON BUZO	0	0	General	2026-04-08 04:41:20.842886+00	14900	2000	2XL	0	POETA NERUDA	\N
44bb525a-fde1-42d2-83c5-364fdfc51e68	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	4900	2000	4	0	POETA NERUDA	\N
79bbc101-1ef9-4823-8ac7-b6bce38db5d0	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	4900	2000	5	0	POETA NERUDA	\N
381fdd50-d90e-44dc-a672-f678ca372af7	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	5200	2000	6	0	POETA NERUDA	\N
e506cb70-2e4c-4177-a796-9d4d5a958128	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	6300	2000	8	0	POETA NERUDA	\N
ffcad7b2-d50f-48dc-aba1-e61df810c0e8	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	6900	2000	10	0	POETA NERUDA	\N
97d4a143-8051-4eb3-987a-4db82bd8066f	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	7400	2000	12	0	POETA NERUDA	\N
12bc36bb-e793-4436-a872-75ac68fb9e79	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	8000	2000	14	0	POETA NERUDA	\N
f781521a-2e7d-4c5d-bfdd-746657a0d685	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	8000	2000	16	0	POETA NERUDA	\N
9147385a-7138-492b-9b6b-6a7110cdd552	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	8500	2000	S	0	POETA NERUDA	\N
5d5486f8-7ba0-41a2-a9e0-0472e7cfc588	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	8500	2000	M	0	POETA NERUDA	\N
66e5cf39-4811-4787-895c-e67ae1c98804	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	9000	2000	L	0	POETA NERUDA	\N
91e0701c-2b13-40a6-b293-5ec43cf76f2f	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	9000	2000	XL	0	POETA NERUDA	\N
ec705163-7c91-4506-a19a-ef03f73c33fc	SHORT	0	0	General	2026-04-08 04:41:20.842886+00	9900	2000	2XL	0	POETA NERUDA	\N
0277ef5b-0cfc-4be9-8121-1e6295b97744	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	9900	2000	4	0	POETA NERUDA	\N
8709862e-aec2-4da2-ba25-d322140383bd	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	9900	2000	5	0	POETA NERUDA	\N
567a3122-4f74-4f45-9d42-22c7e5f6e6e8	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	11900	2000	6	0	POETA NERUDA	\N
0d63c513-224f-488e-a30f-8884554a7757	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	11900	2000	8	0	POETA NERUDA	\N
27b63e9c-08c0-415f-b8e4-00233d3ca605	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	12900	2000	10	0	POETA NERUDA	\N
6422fcf6-d00e-4e2f-85ed-a56c42fd3442	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	12900	2000	12	0	POETA NERUDA	\N
b3008038-4453-4d4c-b98b-ea160ee6a9d8	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	14400	2000	14	0	POETA NERUDA	\N
3f4e5f16-8b55-409c-82a4-5e58ae05736b	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	14400	2000	16	0	POETA NERUDA	\N
2b7213ad-e3f2-44f9-8e62-1e486717dc39	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	15400	2000	S	0	POETA NERUDA	\N
baeb3aef-98e7-4359-9551-2f8cf1171a29	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	15400	2000	M	0	POETA NERUDA	\N
39372b26-0212-41e1-b2e8-d8ec2c7dee5f	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	17500	2000	L	0	POETA NERUDA	\N
19778fcc-6c6b-4b70-9a33-fc9c6d933c5d	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	17500	2000	XL	0	POETA NERUDA	\N
40d6ec12-b790-4d86-aec6-bd65da988642	POLERON DE POLAR	0	0	General	2026-04-08 04:41:20.842886+00	19500	2000	2XL	0	POETA NERUDA	\N
363635e4-7747-402d-810a-e278eb14d7aa	POLERA DEPORTES M/C	0	0	General	2026-04-03 18:58:52.357533+00	8400	2000	6	1	BELLAVISTA	\N
f4242f20-b4d9-44d2-9504-75ed7e4231e9	BUZO COMPLETO	-1	0	General	2026-04-07 22:43:59.501841+00	24100	2000	6	-1	COLEGIO CHILE	\N
28256ffd-89b4-4f8f-9c70-25f4bfd13904	BUZO COMPLETO	0	0	General	2026-04-08 04:38:01.12035+00	22500	2000	4	2	FRAY CAMILO	\N
39c3715b-6645-45ec-a6fe-6f3c4770c718	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	28100	2000	14	0	HAYDN	\N
0e62da3f-1aac-41a1-abc2-71c42b7be8a8	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	28800	2000	16	0	HAYDN	\N
4d6684fd-08ee-48dc-8fd9-7908205e2d4c	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	36900	2000	2XL	0	HAYDN	\N
36dd43b6-28c3-449a-9e13-5b66506450d3	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	23000	2000	4	0	HAYDN	\N
87ad7c51-2401-46ce-9c19-3dedf28f42af	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	24100	2000	5	0	HAYDN	\N
a1ea41ab-15fa-4b43-a9d9-310ffed233be	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	24100	2000	6	0	HAYDN	\N
456d1cef-fe16-4fa2-9f99-e3f252d5df57	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	25000	2000	8	0	HAYDN	\N
209ea111-b4fb-4405-b975-915021ba2513	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	32000	2000	L	0	HAYDN	\N
c334560e-6d35-423e-8061-393fcb287d4a	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	30900	2000	M	0	HAYDN	\N
d48a1625-4ac9-4a4b-b343-dabac011234d	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	29800	2000	S	0	HAYDN	\N
58bd62fe-9ace-4de2-9e9c-1c7c339c174d	BUZO COMPLETO	0	0	General	2026-04-07 22:31:36.029601+00	34700	2000	XL	0	HAYDN	\N
66771a5a-25a0-4a3b-bf1a-fb7ebdfe9a96	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	9800	2000	10	0	HAYDN	\N
a3061317-5e32-47b0-805c-dad841b0617a	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	10400	2000	12	0	HAYDN	\N
301eae91-f8ad-442e-8f3b-31224b7d4c8d	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	10900	2000	14	0	HAYDN	\N
40a87d14-28db-4453-81be-e084d375c89d	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	11500	2000	16	0	HAYDN	\N
23f354bd-c73f-44a7-a37d-3a6f787dc4e4	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	14900	2000	2XL	0	HAYDN	\N
3889b96b-1712-4b0a-ae53-f3cf48c3a8e2	PANTALON BUZO	-1	0	General	2026-04-07 22:31:36.029601+00	8200	2000	4	-1	HAYDN	\N
11da1722-1c5e-4a58-80a5-b67aef24203a	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	8200	2000	5	0	HAYDN	\N
1c97aef5-a5b5-480c-b7f0-12ae4993a242	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	8700	2000	6	0	HAYDN	\N
56e15fd9-7e2b-4d64-9d32-2b93635409c9	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	9300	2000	8	0	HAYDN	\N
06dd13af-5c6d-4d55-9769-e333f2e27a9f	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	13100	2000	L	0	HAYDN	\N
c917293a-478c-4e19-a0ab-97c32820a89c	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	12600	2000	M	0	HAYDN	\N
8a09206d-a7ad-444c-a9fc-bdafa17615b3	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	12000	2000	S	0	HAYDN	\N
aa7deea0-75b5-4987-853d-bbecf4212938	PANTALON BUZO	0	0	General	2026-04-07 22:31:36.029601+00	13700	2000	XL	0	HAYDN	\N
5ed0c088-64fe-4ca6-a024-7435d4a2b628	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	8800	2000	12	0	HAYDN	\N
6f28b0da-ad1f-4da7-aad9-a11d18117640	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	9100	2000	14	0	HAYDN	\N
e2642978-67db-4ebb-ab96-f62f10e37494	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	9300	2000	16	0	HAYDN	\N
43180453-8e53-434e-8674-d48f8f8c6b0c	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	13500	2000	2XL	0	HAYDN	\N
ad1dd3b0-6e0a-4569-8eb7-2d6461ede51c	POLERA DEPORTES M/C	-2	0	General	2026-04-07 22:31:36.029601+00	7300	2000	6	-2	HAYDN	\N
9e1828bd-6909-4f03-8faa-9a2413df725d	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	7600	2000	8	0	HAYDN	\N
bd3a133c-871a-482c-88f0-2669c0ef3e81	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	10400	2000	L	0	HAYDN	\N
8f72304c-dea6-4412-b927-7d83b51dce3f	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	9900	2000	M	0	HAYDN	\N
c580d0ad-08a9-493b-9892-bc19915a77bd	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	9600	2000	S	0	HAYDN	\N
16b8b219-92f8-4124-8349-b09c7b8abca7	POLERA DEPORTES M/C	0	0	General	2026-04-07 22:31:36.029601+00	11500	2000	XL	0	HAYDN	\N
95b5a5b2-a700-40c8-8ac1-9c72ae55ba2f	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	8900	2000	10	0	HAYDN	\N
f6ace064-6935-4fa9-b9e1-37ead299f746	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	9800	2000	12	0	HAYDN	\N
e83bffc8-672a-41ae-a4c9-1c87a225fc7d	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	10100	2000	14	0	HAYDN	\N
3a638ee2-de4e-41bd-953e-c3b6b2ffa3be	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	10300	2000	16	0	HAYDN	\N
58cfabd4-82fc-4d23-9974-067dee2dca7b	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	14500	2000	2XL	0	HAYDN	\N
d9e0aaf4-6a79-4146-81c4-c9b568a904be	POLERA DEPORTES M/L	-1	0	General	2026-04-07 22:31:36.029601+00	8300	2000	6	-1	HAYDN	\N
095b0112-17f1-4070-a385-1a5852e1adfe	POLERA DEPORTES M/L	-1	0	General	2026-04-07 22:31:36.029601+00	8600	2000	8	-1	HAYDN	\N
88139fb5-a37d-4f99-87fa-1311b47fa35c	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	11400	2000	L	0	HAYDN	\N
e66ba2d8-7793-4fae-8868-a65bc98cc4b8	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	10900	2000	M	0	HAYDN	\N
b83927b0-e494-42a8-8030-f7c4cda6a123	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	10600	2000	S	0	HAYDN	\N
4077f124-7076-428a-aa0c-92733efca7ef	POLERA DEPORTES M/L	0	0	General	2026-04-07 22:31:36.029601+00	12500	2000	XL	0	HAYDN	\N
66256679-1742-4709-99a5-f2a8ce4b00b0	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	15700	2000	10	0	HAYDN	\N
6418ec38-c4b8-401a-b1ee-95af2221edaf	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	16300	2000	12	0	HAYDN	\N
df7cd829-be84-4ad2-abe2-64fabec47540	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	16800	2000	14	0	HAYDN	\N
f8f130e3-5469-47eb-8e19-8ed8f8c511dc	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	17300	2000	16	0	HAYDN	\N
84d8b65d-ae35-42f7-8fe2-084ef455c3a6	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	23000	2000	2XL	0	HAYDN	\N
8f0f37d6-1dcb-43aa-a652-ba7472c112c4	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	14800	2000	4	0	HAYDN	\N
e1b58bcd-bb88-4e95-9386-d67cae28a1b2	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	14800	2000	5	0	HAYDN	\N
470d644d-6ccd-46cc-81df-ca0438d01889	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	15200	2000	6	0	HAYDN	\N
36b78660-7502-4fa2-9485-33d4e2d7916e	POLERON CON CIERRE	-1	0	General	2026-04-07 22:31:36.029601+00	15500	2000	8	-1	HAYDN	\N
1443e4a9-b29a-46db-8c20-08961b1e68cc	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	18900	2000	L	0	HAYDN	\N
a1da1e00-145d-442f-a252-97330dd35bb4	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	18300	2000	M	0	HAYDN	\N
7cb421f7-fc46-46d9-99af-cfd8484e9d70	POLERA DEPORTES M/C	-1	0	General	2026-04-07 22:31:36.029601+00	6600	2000	4	-1	HAYDN	\N
00e72f5e-8b12-4b2b-98f9-3af481530be6	POLERA DEPORTES M/L	-1	0	General	2026-04-07 22:31:36.029601+00	7600	2000	4	0	HAYDN	\N
6c8ace30-ae45-4a97-92d4-268d426d5f43	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	17800	2000	S	0	HAYDN	\N
c4a25a1b-7c49-4ab6-80ba-226e635498aa	POLERON CON CIERRE	0	0	General	2026-04-07 22:31:36.029601+00	21000	2000	XL	0	HAYDN	\N
80a4d734-0ff0-4a6c-af0f-36ea752649f5	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	12900	2000	12	0	HAYDN	\N
8ce993d2-33ab-4bf3-b686-4bf9b4644d24	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	14400	2000	14	0	HAYDN	\N
8a27a8d0-48ea-4b5d-b31d-90d11f82aa21	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	14400	2000	16	0	HAYDN	\N
42ff56b8-fe06-4025-b745-b3ba90d39847	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	19500	2000	2XL	0	HAYDN	\N
ab87c91d-86be-400c-8112-eb1d6ca2dde8	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	9900	2000	4	0	HAYDN	\N
0fe7ce58-633f-45fb-800d-422b0bd6412a	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	9900	2000	5	0	HAYDN	\N
b4a7ab20-ac52-45e8-b4e8-e92418f6bebb	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	11900	2000	6	0	HAYDN	\N
79ff5da3-63e8-49e9-b4d9-e32839b9a6a6	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	11900	2000	8	0	HAYDN	\N
e63083c1-48d2-456a-93bf-f261f975f7d0	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	17500	2000	L	0	HAYDN	\N
54f2dd45-53f5-4f15-a9aa-ae58c38ef81a	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	15400	2000	M	0	HAYDN	\N
39046b4f-030e-4c1d-91b7-3f09316231b5	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	15400	2000	S	0	HAYDN	\N
68ccd3a7-587e-4f1e-83f0-321d555b9108	POLERON DE POLAR	0	0	General	2026-04-07 22:31:36.029601+00	17500	2000	XL	0	HAYDN	\N
7256ff4b-8181-4d1e-a56c-32b0e9dfa8b5	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	6900	2000	10	0	HAYDN	\N
0b9b03ac-0eb5-42d4-8aa0-5ecfed645a75	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	7400	2000	12	0	HAYDN	\N
8ea3d56a-570c-492b-b288-d0b06101b975	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	8000	2000	14	0	HAYDN	\N
ff7b2d38-0d53-42a8-ae9d-b849a19a481d	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	8000	2000	16	0	HAYDN	\N
999edda8-daf5-4a2c-a72a-28d5471e4f74	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	9900	2000	2XL	0	HAYDN	\N
d53722c4-c25d-4c0b-86c6-8ca5898f5678	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	4900	2000	4	0	HAYDN	\N
2d2b3c8b-509a-469c-bf90-73319d11bbe7	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	4900	2000	5	0	HAYDN	\N
c997486d-5d67-4427-b8b1-2a808628d2a1	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	5200	2000	6	0	HAYDN	\N
b61c95bb-762d-4186-a20a-1079c30097b9	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	6300	2000	8	0	HAYDN	\N
4062d54e-c0db-410e-89f3-3d7f4bb3af78	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	9000	2000	L	0	HAYDN	\N
0017c4b1-ee91-4845-a4af-9f84ab43b080	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	8500	2000	M	0	HAYDN	\N
13f050c3-80cd-4283-a305-fbb18b953b94	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	8500	2000	S	0	HAYDN	\N
fab68e28-a6a7-4c4b-bcda-412116b5f76d	SHORT	0	0	General	2026-04-07 22:31:36.029601+00	9000	2000	XL	0	HAYDN	\N
6a8ece84-e207-4130-be9a-3ea112f27881	POLERA USO DIARIO M/C	-3	0	General	2026-04-08 04:38:01.12035+00	8900	2000	4	-3	FRAY CAMILO	\N
a5ad6ef4-d685-434c-b1e5-fcb062849c4a	POLERA DEPORTES M/C	0	0	General	2026-04-08 04:40:03.963582+00	10000	2000	12	3	INSTITUTO NACIONAL	\N
21d0a5dd-505f-4345-b70c-026aeda5e5a9	POLERA USO DIARIO M/L	-2	0	General	2026-04-08 04:41:20.842886+00	12700	2000	16	1	POETA NERUDA	\N
\.


--
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, pedido_id, monto, fecha_pago, metodo_pago, created_at, creado_por) FROM stdin;
a8e16cc5-b58b-4a27-a75e-6a9155ccf54f	1	100000	2026-04-03	Transferencia	2026-04-03 21:52:34.174921+00	Luis
9b6b6793-b02f-4a2c-ab21-eb9503781e6f	2	56200	2026-04-03	Débito	2026-04-03 21:59:24.651435+00	Luis
a5aa37fa-d812-44c9-a02a-fb870ba859e9	3	44600	2026-04-03	Débito	2026-04-03 22:44:15.418773+00	
7cdeac40-c5a8-4ed6-a253-db70eb3394b6	4	39000	2026-04-03	Débito	2026-04-03 23:05:24.316453+00	Luis
82807e5d-96a6-4e64-862d-339e9c9b3a1c	4	-25000	2026-04-03	Débito	2026-04-03 23:16:44.380868+00	Luis
3ad2f9c2-0dbf-465d-ac1d-eacd6c38c33b	4	-25000	2026-04-03	Débito	2026-04-03 23:16:45.264067+00	Luis
fde39577-07ef-4d12-baec-85e72390187a	4	20000	2026-04-03	Débito	2026-04-03 23:17:14.547155+00	Luis
a95810a3-374e-4a54-aaac-57ca5b73a2ed	4	-1000000	2026-04-03	Débito	2026-04-03 23:18:00.574494+00	Luis
214660af-0ce7-41f3-b9d0-401c7b9f263b	5	34200	2026-04-03	Transferencia	2026-04-03 23:28:19.025221+00	Luis
f37beecc-1de7-4012-8743-20bae1cd5a43	6	25000	2026-04-04	Transferencia	2026-04-04 00:30:49.795017+00	Luis
df1628f3-0bdb-41b1-9efe-08a90e164839	6	-20000	2026-04-04	Transferencia	2026-04-04 01:17:44.270813+00	Admin
ac4c6e5f-82e0-47f3-b492-59a881401fe8	6	20000	2026-04-04	Transferencia	2026-04-04 01:17:51.92995+00	Admin
1a90e947-3a3c-4d40-9db9-116a1e099d0c	6	-10000	2026-04-04	Transferencia	2026-04-04 01:19:35.790612+00	Admin
94c2030d-b9d1-41fa-8238-ba4082787431	6	4300	2026-04-04	Crédito	2026-04-04 01:19:54.845052+00	Admin
5045da7a-45cd-494f-9066-3bb95c3c7826	7	50000	2026-04-04	Débito	2026-04-04 01:28:11.359122+00	Admin
d34a5c57-487b-4298-b94f-55a4aada4b60	8	20500	2026-04-04	Transferencia	2026-04-04 02:10:02.603938+00	
f68a1f6e-4614-429a-b443-69538782134c	7	75290	2026-04-04	Transferencia	2026-04-04 04:30:34.978559+00	Luis
51305e7d-a3c0-48d6-9461-73e2c58bea31	4	1030000	2026-04-03	Transferencia	2026-04-04 04:32:11.820795+00	Luis
ee4917a2-f8b9-475b-a51b-8f94dc6f800c	1	43000	2026-04-04	Transferencia	2026-04-04 04:35:20.842547+00	Luis
08bf38a1-bc5d-41c0-b390-f1cd42a6d1b9	9	33600	2026-04-04	Transferencia	2026-04-04 04:41:42.237791+00	Luis
bc530c65-c5d6-40ae-bff4-d437c81c03d3	10	19620	2026-04-04	Efectivo	2026-04-04 04:46:00.863419+00	Luis
61729dda-f8a4-4050-9d43-8a85b7d8c01c	11	44300	2026-04-04	Débito	2026-04-04 23:23:13.998816+00	Luis
fc3e8806-37e3-479f-b1c8-0183ac132fea	12	25000	2026-04-04	Débito	2026-04-04 23:26:20.075867+00	Luis
f47c5033-2a5a-41b9-a99b-390f65690277	13	15000	2026-04-04	Débito	2026-04-04 23:31:00.18709+00	Luis
b8d5803a-8108-4ac1-a7ce-171b7f6be31b	15	57400	2026-04-05	Débito	2026-04-05 19:06:19.176994+00	Luis
1e9162d9-c77e-44bf-ac67-ce5b60d8ecd0	16	43400	2026-04-05	Efectivo	2026-04-05 19:17:13.69817+00	Luis
6bcaed9d-aaa3-4ad1-9ac4-2045d5a0c6b3	17	34600	2026-04-06	Débito	2026-04-06 13:55:01.84562+00	Luis
50d82f6f-326b-4f00-a91b-c2df8e27535f	18	21800	2026-04-07	Crédito	2026-04-07 00:19:56.633051+00	Luis
aeada65c-fd5a-447a-b51e-ee196ad0f9d8	19	34500	2026-04-08	Débito	2026-04-08 11:05:39.185627+00	Luis
ff25072a-0378-410f-8354-96ce79ce793d	22	51400	2026-04-08	Transferencia	2026-04-08 14:30:32.670571+00	Luis
c5c7e13e-12c9-47ed-8d99-885dd33ca2de	22	51400	2026-04-08	Transferencia	2026-04-08 14:30:33.859363+00	Luis
9c2c08e3-9d44-4cf0-be97-121e04bc728b	23	15600	2026-04-09	Transferencia	2026-04-09 02:08:41.439098+00	Luis
d2ba93c7-6ddc-457f-8ff7-f3a8e084b199	24	1000	2026-04-09	Transferencia	2026-04-09 03:49:27.303581+00	Admin
ca78458b-e42a-4698-8511-107de0bd1939	21	15000	2026-04-09	Efectivo	2026-04-09 03:59:38.565424+00	Admin
956350a8-2069-4138-a27f-d662f8d7e5f8	25	21800	2026-04-09	Débito	2026-04-09 04:07:17.375509+00	Luis
67f08be3-0fca-41d1-9300-12e2654fcc54	26	26700	2026-04-09	Transferencia	2026-04-09 04:22:48.850148+00	Luis
d5af60da-bb75-4e75-9bb8-0685f8665a14	27	140040	2025-12-22	Transferencia	2026-04-09 12:05:04.953557+00	Luis
1f542016-68f4-49b2-8ad8-39a654a00a45	28	40000	2025-12-22	Transferencia	2026-04-09 12:12:37.032463+00	Luis
b81d90e3-b523-4da9-ab10-76d211ed83b4	29	11200	2025-12-23	Efectivo	2026-04-09 12:15:20.300631+00	Luis
f1b0bfef-f9df-4750-bd58-a6cba87ebcdb	30	61500	2026-04-09	Transferencia	2026-04-09 13:40:29.346275+00	Luis
e07b82a7-32b7-4500-9b66-8b4012d09c4d	32	22500	2026-04-09	Débito	2026-04-09 23:41:11.539882+00	Admin
34f19e80-1787-4cfb-8015-06d9a79d3834	34	10000	2026-04-10	Transferencia	2026-04-10 00:04:36.072182+00	Admin
9fb26639-1c4d-4ea2-9246-cd422d19cd66	34	10000	2026-04-10	Débito	2026-04-10 00:04:45.581813+00	Admin
77889415-de1e-4cc7-a8db-8e5dd2e79094	35	20000	2026-04-10	Efectivo	2026-04-10 02:20:00.822549+00	Luis
524ae7e8-ff57-4224-921e-4365fb479296	35	30000	2026-04-10	Débito	2026-04-10 02:21:24.562751+00	Luis
b44fa25a-b216-4960-a009-c0c95c9d9320	35	32000	2026-04-10	Transferencia	2026-04-10 02:21:50.607593+00	Luis
ad50e5bb-802a-45a9-9915-a39b2e074217	35	32000	2026-04-10	Transferencia	2026-04-10 02:21:55.032942+00	Luis
\.


--
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (cliente_id, fecha_creacion, estado, abono, total_final, created_at, producto, talla, es_especial, cantidad, producto_id, colegio, fecha_entrega, observaciones, creado_por, id, motivo_anulacion) FROM stdin;
cf9b3195-69a9-4f16-a4db-88f426a72aca	2026-04-03 21:59:23.850662+00	Completado	0	56200	2026-04-03 21:59:23.850662+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-03		Luis	2	\N
5e618c4a-8d30-4dfb-bb4e-e3626aa3acfe	2026-04-03 22:44:14.454691+00	Completado	0	44600	2026-04-03 22:44:14.454691+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-03			3	\N
782a64d1-1d3e-4def-9cac-e4e88de8568c	2026-04-04 00:30:49.067737+00	Pendiente	0	19300	2026-04-04 00:30:49.067737+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-17		Luis	6	\N
53d5f340-9f21-4541-b032-9e5f63bf60a4	2026-04-04 02:10:01.842419+00	Completado	0	20500	2026-04-04 02:10:01.842419+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-04			8	\N
ed511b3d-0da3-4f2e-91de-633fd3fb089f	2026-04-03 23:28:18.300718+00	Completado	0	34200	2026-04-03 23:28:18.300718+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-03		Luis	5	\N
dd682f14-bc04-4645-8758-eb6b80733342	2026-04-04 01:28:10.752506+00	Completado	0	125290	2026-04-04 01:28:10.752506+00	\N	\N	f	1	\N	BELLAVISTA	2025-04-15	 [Dscto: $12.810] [Ajuste: $10.000]	Admin	7	\N
76e9f827-4ece-4b83-b174-7662d9401e33	2026-04-03 23:04:35.996653+00	Completado	0	39000	2026-04-03 23:04:35.996653+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-03	Entrega en anexo	Luis	4	\N
eb3b67f4-2487-4723-bd58-9241d8ca601c	2026-04-03 21:52:33.504211+00	Completado	0	143000	2026-04-03 21:52:33.504211+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-03		Luis	1	\N
fe7d47d2-a209-4ede-9e5c-899751b8251f	2026-04-04 04:41:41.455769+00	Completado	0	33600	2026-04-04 04:41:41.455769+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-04		Luis	9	\N
1e01db9d-c9fd-4aaa-a796-ea8be14b8b72	2026-04-04 04:46:00.177294+00	Pendiente	0	19620	2026-04-04 04:46:00.177294+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-06	 [Dscto: $2,180]	Luis	10	\N
87a0795c-b7e8-4554-85bd-d3e6c713c2ac	2026-04-04 23:23:13.318332+00	Completado	0	44300	2026-04-04 23:23:13.318332+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-04		Luis	11	\N
ac36a606-2417-4086-a02b-75828ab737cf	2026-04-04 23:26:19.51143+00	Completado	0	25000	2026-04-04 23:26:19.51143+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-04		Luis	12	\N
febba76f-2dc8-4903-a9d6-0bd6cc770224	2026-04-04 23:30:59.599972+00	Completado	0	28100	2026-04-04 23:30:59.599972+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-04		Luis	13	\N
59d432f4-91d8-40f5-b980-5aa59973fdf9	2026-04-05 19:06:18.355163+00	Completado	0	57400	2026-04-05 19:06:18.355163+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-05	Pendientes poleras manga larga	Luis	15	\N
c289a3a1-4f97-4498-bffe-bcc7b06de00b	2026-04-05 19:17:12.494907+00	Pendiente	0	43400	2026-04-05 19:17:12.494907+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-15		Luis	16	\N
36dfac59-4d56-4963-a491-4e0d2e077221	2026-04-06 13:55:01.069219+00	Pendiente	0	34600	2026-04-06 13:55:01.069219+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-24		Luis	17	\N
509be71c-5ddd-425b-b46e-4d09ddfc36ac	2026-04-07 00:19:55.755569+00	Anulado	0	21800	2026-04-07 00:19:55.755569+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-07		Luis	18	No pagó
371745c5-fd71-4d2f-b1b3-482fe3c5767a	2026-04-08 11:05:38.449038+00	Completado	0	34500	2026-04-08 11:05:38.449038+00	\N	\N	f	1	\N	COLEGIO CHILE	2026-04-08	María segundo b	Luis	19	\N
9cca0c9e-662b-468d-91c1-13a75bfc0273	2026-04-08 12:21:51.232806+00	Pendiente	0	17800	2026-04-08 12:21:51.232806+00	\N	\N	f	1	\N	COLEGIO CHILE	2026-04-15		Luis	20	\N
f8ea462c-3e5a-462a-ab9c-11ae81de9287	2026-04-08 12:23:11.143278+00	Pendiente	0	45000	2026-04-08 12:23:11.143278+00	\N	\N	f	1	\N	FRAY CAMILO	2026-04-15		Luis	21	\N
02ad0e09-2699-4a30-8570-56c78f655425	2026-04-08 14:27:43.24551+00	Anulado	0	51400	2026-04-08 14:27:43.24551+00	\N	\N	f	1	\N	HAYDN	2026-04-08		Luis	22	no responde 
d6e2bacf-62ef-48a5-97ca-883b94019d1f	2026-04-09 02:08:40.753618+00	Completado	0	15600	2026-04-09 02:08:40.753618+00	\N	\N	f	1	\N	HAYDN	2026-04-09		Luis	23	\N
c1d3d316-8d32-4b31-aeca-c375e69623f0	2026-04-09 03:49:26.530609+00	Anulado	0	80500	2026-04-09 03:49:26.530609+00	\N	\N	f	1	\N	INSTITUTO NACIONAL	2028-12-12	[ENTREGA PARCIAL] PRUEBA	Admin	24	PRUEBA
cc2b4f02-a362-4747-aef6-ad6368a0bad6	2026-04-09 04:07:16.5777+00	Pendiente	0	21800	2026-04-09 04:07:16.5777+00	\N	\N	f	1	\N	HAYDN	2026-04-10	[ENTREGA PARCIAL] 	Luis	25	\N
4e637034-e0ac-48b1-948d-723cc4dba917	2026-04-09 04:22:47.976149+00	Completado	0	26700	2026-04-09 04:22:47.976149+00	\N	\N	f	1	\N	FRAY CAMILO	2026-04-09		Luis	26	\N
21c940de-0f21-4dc7-a17b-c78ce26a19b5	2026-04-09 12:05:03.644671+00	Completado	0	140040	2025-12-22 12:00:00+00	\N	\N	f	1	\N	HAYDN	2025-12-22	[PEDIDO ANTIGUO]  [Dscto: $15,560]	Luis	27	\N
9dd279f1-d14c-4467-9d6f-830b7985c405	2026-04-09 12:12:36.504648+00	Completado	0	40000	2025-12-22 12:00:00+00	\N	\N	f	1	\N	COLEGIO CHILE	2025-12-22	[PEDIDO ANTIGUO] B396 [Dscto: $4,000]	Luis	28	\N
fd22c99f-df4f-47ab-92b6-21416174113c	2026-04-09 12:15:18.781528+00	Completado	0	11200	2025-12-23 12:00:00+00	\N	\N	f	1	\N	FRAY CAMILO	2025-12-23	[PEDIDO ANTIGUO] 	Luis	29	\N
a1b744d4-43e8-4b48-a11e-c31fd6b3165c	2026-04-09 13:40:28.71815+00	Pendiente	0	61500	2026-04-09 13:40:28.71815+00	\N	\N	f	1	\N	POETA NERUDA	2026-04-16		Luis	30	\N
63fb18a9-5273-4f5c-8c30-32cc2623ceab	2026-04-09 23:39:15.259649+00	Completado	0	55200	2025-12-12 12:00:00+00	\N	\N	f	1	\N	BELLAVISTA	2025-12-15	[PEDIDO ANTIGUO] 	Admin	31	\N
68f8d947-15f2-42e8-b250-bffa7d2df174	2026-04-09 23:41:10.929833+00	Completado	0	22500	2026-04-09 23:41:10.929833+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-09		Admin	32	\N
4084d6f3-a00e-409c-b0e0-a7fb88154ebb	2026-04-09 23:42:12.962911+00	Completado	0	112500	2026-04-09 23:42:12.962911+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-09		Admin	33	\N
cf48f82c-0303-4e62-9108-04955a480f03	2026-04-09 23:47:46.316596+00	Anulado	0	20000	2026-04-09 23:47:46.316596+00	\N	\N	f	1	\N	INSTITUTO NACIONAL	\N	[ENTREGA PARCIAL] 	Admin	34	anulado por prueba 
5173dbeb-3543-4fd7-8d9a-f5d0c05d111a	2026-04-10 02:19:57.24692+00	Completado	0	82000	2026-04-10 02:19:57.24692+00	\N	\N	f	1	\N	BELLAVISTA	2026-04-10		Luis	35	\N
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-03-11 01:10:24
20211116045059	2026-03-11 01:10:24
20211116050929	2026-03-11 01:10:25
20211116051442	2026-03-11 01:10:25
20211116212300	2026-03-11 01:10:25
20211116213355	2026-03-11 01:10:25
20211116213934	2026-03-11 01:10:25
20211116214523	2026-03-11 01:10:26
20211122062447	2026-03-11 01:10:26
20211124070109	2026-03-11 01:10:26
20211202204204	2026-03-11 01:10:26
20211202204605	2026-03-11 01:10:26
20211210212804	2026-03-11 01:10:27
20211228014915	2026-03-11 01:10:27
20220107221237	2026-03-11 01:10:27
20220228202821	2026-03-11 01:10:28
20220312004840	2026-03-11 01:10:28
20220603231003	2026-03-11 01:10:28
20220603232444	2026-03-11 01:10:28
20220615214548	2026-03-11 01:10:28
20220712093339	2026-03-11 01:10:29
20220908172859	2026-03-11 01:10:29
20220916233421	2026-03-11 01:10:29
20230119133233	2026-03-11 01:10:29
20230128025114	2026-03-11 01:10:29
20230128025212	2026-03-11 01:10:30
20230227211149	2026-03-11 01:10:30
20230228184745	2026-03-11 01:10:30
20230308225145	2026-03-11 01:10:30
20230328144023	2026-03-11 01:10:30
20231018144023	2026-03-11 01:10:31
20231204144023	2026-03-11 01:10:31
20231204144024	2026-03-11 01:10:31
20231204144025	2026-03-11 01:10:31
20240108234812	2026-03-11 01:10:31
20240109165339	2026-03-11 01:10:32
20240227174441	2026-03-11 01:10:32
20240311171622	2026-03-11 01:10:32
20240321100241	2026-03-11 01:10:33
20240401105812	2026-03-11 01:10:33
20240418121054	2026-03-11 01:10:33
20240523004032	2026-03-11 01:10:34
20240618124746	2026-03-11 01:10:34
20240801235015	2026-03-11 01:10:35
20240805133720	2026-03-11 01:10:35
20240827160934	2026-03-11 01:10:35
20240919163303	2026-03-11 01:10:35
20240919163305	2026-03-11 01:10:35
20241019105805	2026-03-11 01:10:36
20241030150047	2026-03-11 01:10:36
20241108114728	2026-03-11 01:10:37
20241121104152	2026-03-11 01:10:37
20241130184212	2026-03-11 01:10:37
20241220035512	2026-03-11 01:10:37
20241220123912	2026-03-11 01:10:37
20241224161212	2026-03-11 01:10:37
20250107150512	2026-03-11 01:10:38
20250110162412	2026-03-11 01:10:38
20250123174212	2026-03-11 01:10:38
20250128220012	2026-03-11 01:10:38
20250506224012	2026-03-11 01:10:38
20250523164012	2026-03-11 01:10:39
20250714121412	2026-03-11 01:10:39
20250905041441	2026-03-11 01:10:39
20251103001201	2026-03-11 01:10:39
20251120212548	2026-03-11 01:10:39
20251120215549	2026-03-11 01:10:40
20260218120000	2026-03-11 01:10:40
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-03-11 01:10:37.785628
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-03-11 01:10:37.791987
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-03-11 01:10:37.796712
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-03-11 01:10:37.809657
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-03-11 01:10:37.817452
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-03-11 01:10:37.821064
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-03-11 01:10:37.825318
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-03-11 01:10:37.829674
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-03-11 01:10:37.832993
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-03-11 01:10:37.836611
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-03-11 01:10:37.840371
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-03-11 01:10:37.844309
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-03-11 01:10:37.848336
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-03-11 01:10:37.851889
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-03-11 01:10:37.855848
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-03-11 01:10:37.884429
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-03-11 01:10:37.888151
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-03-11 01:10:37.892981
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-03-11 01:10:37.896347
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-03-11 01:10:37.903741
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-03-11 01:10:37.907435
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-03-11 01:10:37.913073
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-03-11 01:10:37.925423
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-03-11 01:10:37.936114
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-03-11 01:10:37.940173
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-03-11 01:10:37.943765
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-03-11 01:10:37.947915
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-03-11 01:10:37.951356
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-03-11 01:10:37.954596
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-03-11 01:10:37.957798
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-03-11 01:10:37.9623
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-03-11 01:10:37.966154
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-03-11 01:10:37.969304
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-03-11 01:10:37.972343
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-03-11 01:10:37.975919
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-03-11 01:10:37.978954
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-03-11 01:10:37.982216
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-03-11 01:10:37.985542
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-03-11 01:10:37.989665
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-03-11 01:10:37.996688
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-03-11 01:10:37.999769
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-03-11 01:10:38.002871
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-03-11 01:10:38.005928
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-03-11 01:10:38.009044
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-03-11 01:10:38.012139
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-03-11 01:10:38.016487
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-03-11 01:10:38.02559
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-03-11 01:10:38.029642
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-03-11 01:10:38.033504
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-03-11 01:10:38.046686
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-11 01:10:38.052225
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-11 01:10:38.065059
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-11 01:10:38.066809
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-11 01:10:38.074554
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-11 01:10:38.076758
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-11 01:10:38.078383
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-03-11 01:10:38.082432
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-07 22:11:00.172466
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-07 22:11:00.216866
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: colegios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colegios_id_seq', 12, true);


--
-- Name: historial_entregas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_entregas_id_seq', 1, false);


--
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 35, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: colegios colegios_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colegios
    ADD CONSTRAINT colegios_nombre_key UNIQUE (nombre);


--
-- Name: colegios colegios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colegios
    ADD CONSTRAINT colegios_pkey PRIMARY KEY (id);


--
-- Name: detalles_pedido detalles_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_pkey PRIMARY KEY (id);


--
-- Name: historial_entregas historial_entregas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_entregas
    ADD CONSTRAINT historial_entregas_pkey PRIMARY KEY (id);


--
-- Name: inventario inventario_nombre_colegio_talla_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_nombre_colegio_talla_key UNIQUE (nombre, colegio, talla);


--
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id);


--
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id);


--
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- Name: inventario unique_colegio_producto_talla; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT unique_colegio_producto_talla UNIQUE (colegio, nombre, talla);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: detalles_pedido detalles_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id);


--
-- Name: detalles_pedido detalles_pedido_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.inventario(id) ON DELETE SET NULL;


--
-- Name: historial_entregas historial_entregas_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_entregas
    ADD CONSTRAINT historial_entregas_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- Name: pagos pagos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id) ON DELETE CASCADE;


--
-- Name: pedidos pedidos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- Name: pedidos pedidos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.inventario(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: auditoria Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.auditoria FOR SELECT USING (true);


--
-- Name: clientes Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.clientes FOR SELECT USING (true);


--
-- Name: detalles_pedido Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.detalles_pedido FOR SELECT USING (true);


--
-- Name: pagos Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.pagos FOR SELECT USING (true);


--
-- Name: pedidos Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public.pedidos FOR SELECT USING (true);


--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION descontar_stock(prod_id uuid, cant numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.descontar_stock(prod_id uuid, cant numeric) TO anon;
GRANT ALL ON FUNCTION public.descontar_stock(prod_id uuid, cant numeric) TO authenticated;
GRANT ALL ON FUNCTION public.descontar_stock(prod_id uuid, cant numeric) TO service_role;


--
-- Name: FUNCTION entregar_stock(prod_id uuid, cant numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.entregar_stock(prod_id uuid, cant numeric) TO anon;
GRANT ALL ON FUNCTION public.entregar_stock(prod_id uuid, cant numeric) TO authenticated;
GRANT ALL ON FUNCTION public.entregar_stock(prod_id uuid, cant numeric) TO service_role;


--
-- Name: FUNCTION reservar_stock(prod_id uuid, cant numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.reservar_stock(prod_id uuid, cant numeric) TO anon;
GRANT ALL ON FUNCTION public.reservar_stock(prod_id uuid, cant numeric) TO authenticated;
GRANT ALL ON FUNCTION public.reservar_stock(prod_id uuid, cant numeric) TO service_role;


--
-- Name: FUNCTION revertir_entrega_stock(prod_id uuid, cant numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.revertir_entrega_stock(prod_id uuid, cant numeric) TO anon;
GRANT ALL ON FUNCTION public.revertir_entrega_stock(prod_id uuid, cant numeric) TO authenticated;
GRANT ALL ON FUNCTION public.revertir_entrega_stock(prod_id uuid, cant numeric) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE auditoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.auditoria TO anon;
GRANT ALL ON TABLE public.auditoria TO authenticated;
GRANT ALL ON TABLE public.auditoria TO service_role;


--
-- Name: TABLE clientes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clientes TO anon;
GRANT ALL ON TABLE public.clientes TO authenticated;
GRANT ALL ON TABLE public.clientes TO service_role;


--
-- Name: TABLE colegios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.colegios TO anon;
GRANT ALL ON TABLE public.colegios TO authenticated;
GRANT ALL ON TABLE public.colegios TO service_role;


--
-- Name: SEQUENCE colegios_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.colegios_id_seq TO anon;
GRANT ALL ON SEQUENCE public.colegios_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.colegios_id_seq TO service_role;


--
-- Name: TABLE detalles_pedido; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.detalles_pedido TO anon;
GRANT ALL ON TABLE public.detalles_pedido TO authenticated;
GRANT ALL ON TABLE public.detalles_pedido TO service_role;


--
-- Name: TABLE historial_entregas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.historial_entregas TO anon;
GRANT ALL ON TABLE public.historial_entregas TO authenticated;
GRANT ALL ON TABLE public.historial_entregas TO service_role;


--
-- Name: SEQUENCE historial_entregas_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.historial_entregas_id_seq TO anon;
GRANT ALL ON SEQUENCE public.historial_entregas_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.historial_entregas_id_seq TO service_role;


--
-- Name: TABLE inventario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventario TO anon;
GRANT ALL ON TABLE public.inventario TO authenticated;
GRANT ALL ON TABLE public.inventario TO service_role;


--
-- Name: TABLE pagos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pagos TO anon;
GRANT ALL ON TABLE public.pagos TO authenticated;
GRANT ALL ON TABLE public.pagos TO service_role;


--
-- Name: TABLE pedidos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pedidos TO anon;
GRANT ALL ON TABLE public.pedidos TO authenticated;
GRANT ALL ON TABLE public.pedidos TO service_role;


--
-- Name: SEQUENCE pedidos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pedidos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.pedidos_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.pedidos_id_seq TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict Qbwue7RHgPeJae2QDvZ1Of0puoGGafgEkdbClP18W3vE7aomIGM1sGcYvk0J3SI

