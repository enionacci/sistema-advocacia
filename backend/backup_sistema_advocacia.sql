--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

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

ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario DROP CONSTRAINT IF EXISTS escritorios_perfilusuario_user_id_214259f4_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario_papeis DROP CONSTRAINT IF EXISTS escritorios_perfilus_perfilusuario_id_22734229_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario_papeis DROP CONSTRAINT IF EXISTS escritorios_perfilus_papel_id_d35bb128_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario DROP CONSTRAINT IF EXISTS escritorios_perfilus_escritorio_id_6a37e7b1_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel_permissoes DROP CONSTRAINT IF EXISTS escritorios_papel_pe_permissao_id_6d8b95cb_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel_permissoes DROP CONSTRAINT IF EXISTS escritorios_papel_pe_papel_id_272c1a21_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel DROP CONSTRAINT IF EXISTS escritorios_papel_escritorio_id_3701344c_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_convite DROP CONSTRAINT IF EXISTS escritorios_convite_sender_id_31c674f2_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.escritorios_convite DROP CONSTRAINT IF EXISTS escritorios_convite_escritorio_id_fdeadcca_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_auditlog DROP CONSTRAINT IF EXISTS escritorios_auditlog_usuario_id_91d41d48_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.escritorios_auditlogretencao DROP CONSTRAINT IF EXISTS escritorios_auditlog_escritorio_id_6ae0da0a_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.escritorios_auditlog DROP CONSTRAINT IF EXISTS escritorios_auditlog_content_type_id_55746126_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.documentos_tag DROP CONSTRAINT IF EXISTS documentos_tag_escritorio_id_565b546d_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.documentos_documento DROP CONSTRAINT IF EXISTS documentos_documento_usuario_upload_id_0c70565f_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.documentos_documentoanaliseia DROP CONSTRAINT IF EXISTS documentos_documento_usuario_id_0bb9198f_fk_auth_user;
ALTER TABLE IF EXISTS ONLY public.documentos_documento_tags DROP CONSTRAINT IF EXISTS documentos_documento_tags_tag_id_b05a07ed_fk_documentos_tag_id;
ALTER TABLE IF EXISTS ONLY public.documentos_documento DROP CONSTRAINT IF EXISTS documentos_documento_escritorio_id_8ead4559_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.documentos_documentoanaliseia DROP CONSTRAINT IF EXISTS documentos_documento_escritorio_id_32e5ba2f_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.documentos_documento DROP CONSTRAINT IF EXISTS documentos_documento_documento_pai_id_01b7848f_fk_documento;
ALTER TABLE IF EXISTS ONLY public.documentos_documento_tags DROP CONSTRAINT IF EXISTS documentos_documento_documento_id_b651f438_fk_documento;
ALTER TABLE IF EXISTS ONLY public.documentos_documentoanaliseia DROP CONSTRAINT IF EXISTS documentos_documento_documento_id_7f86d302_fk_documento;
ALTER TABLE IF EXISTS ONLY public.documentos_documento DROP CONSTRAINT IF EXISTS documentos_documento_cliente_id_085ac5be_fk_clientes_cliente_id;
ALTER TABLE IF EXISTS ONLY public.documentos_documento DROP CONSTRAINT IF EXISTS documentos_documento_categoria_id_a460575a_fk_documento;
ALTER TABLE IF EXISTS ONLY public.documentos_categoria DROP CONSTRAINT IF EXISTS documentos_categoria_escritorio_id_3a0df945_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.consultas_consulta DROP CONSTRAINT IF EXISTS consultas_consulta_cliente_id_26891c7d_fk_clientes_cliente_id;
ALTER TABLE IF EXISTS ONLY public.clientes_cliente DROP CONSTRAINT IF EXISTS clientes_cliente_escritorio_id_115fc135_fk_escritori;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_6a12ed8b_fk_auth_user_id;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_group_id_97559544_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.analises_analiseia DROP CONSTRAINT IF EXISTS analises_analiseia_consulta_id_44b019bb_fk_consultas;
DROP INDEX IF EXISTS public.escritorios_usuario_ae6625_idx;
DROP INDEX IF EXISTS public.escritorios_timesta_178dea_idx;
DROP INDEX IF EXISTS public.escritorios_permissao_nome_54333de3_like;
DROP INDEX IF EXISTS public.escritorios_permissao_codename_c78bf81e_like;
DROP INDEX IF EXISTS public.escritorios_perfilusuario_papeis_perfilusuario_id_22734229;
DROP INDEX IF EXISTS public.escritorios_perfilusuario_papeis_papel_id_d35bb128;
DROP INDEX IF EXISTS public.escritorios_perfilusuario_escritorio_id_6a37e7b1;
DROP INDEX IF EXISTS public.escritorios_papel_permissoes_permissao_id_6d8b95cb;
DROP INDEX IF EXISTS public.escritorios_papel_permissoes_papel_id_272c1a21;
DROP INDEX IF EXISTS public.escritorios_papel_escritorio_id_3701344c;
DROP INDEX IF EXISTS public.escritorios_modelo__c7bc0b_idx;
DROP INDEX IF EXISTS public.escritorios_convite_sender_id_31c674f2;
DROP INDEX IF EXISTS public.escritorios_convite_escritorio_id_fdeadcca;
DROP INDEX IF EXISTS public.escritorios_auditlog_usuario_id_91d41d48;
DROP INDEX IF EXISTS public.escritorios_auditlog_timestamp_9615e900;
DROP INDEX IF EXISTS public.escritorios_auditlog_modelo_nome_1ebaea28_like;
DROP INDEX IF EXISTS public.escritorios_auditlog_modelo_nome_1ebaea28;
DROP INDEX IF EXISTS public.escritorios_auditlog_content_type_id_55746126;
DROP INDEX IF EXISTS public.escritorios_acao_3832dc_idx;
DROP INDEX IF EXISTS public.documentos_tag_escritorio_id_565b546d;
DROP INDEX IF EXISTS public.documentos_documentoanaliseia_usuario_id_0bb9198f;
DROP INDEX IF EXISTS public.documentos_documentoanaliseia_escritorio_id_32e5ba2f;
DROP INDEX IF EXISTS public.documentos_documentoanaliseia_documento_id_7f86d302;
DROP INDEX IF EXISTS public.documentos_documento_usuario_upload_id_0c70565f;
DROP INDEX IF EXISTS public.documentos_documento_tags_tag_id_b05a07ed;
DROP INDEX IF EXISTS public.documentos_documento_tags_documento_id_b651f438;
DROP INDEX IF EXISTS public.documentos_documento_escritorio_id_8ead4559;
DROP INDEX IF EXISTS public.documentos_documento_documento_pai_id_01b7848f;
DROP INDEX IF EXISTS public.documentos_documento_cliente_id_085ac5be;
DROP INDEX IF EXISTS public.documentos_documento_categoria_id_a460575a;
DROP INDEX IF EXISTS public.documentos_categoria_escritorio_id_3a0df945;
DROP INDEX IF EXISTS public.documentos__status_628dd8_idx;
DROP INDEX IF EXISTS public.documentos__hash_md_92da4f_idx;
DROP INDEX IF EXISTS public.documentos__escrito_fe0885_idx;
DROP INDEX IF EXISTS public.documentos__escrito_dff850_idx;
DROP INDEX IF EXISTS public.documentos__escrito_03c5eb_idx;
DROP INDEX IF EXISTS public.documentos__documen_937045_idx;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.consultas_consulta_cliente_id_26891c7d;
DROP INDEX IF EXISTS public.clientes_cliente_escritorio_id_115fc135;
DROP INDEX IF EXISTS public.clientes_cliente_email_6ec9cd8a_like;
DROP INDEX IF EXISTS public.clientes_cliente_cpf_7ee8eeb9_like;
DROP INDEX IF EXISTS public.clientes_cliente_cnpj_990e86fe_like;
DROP INDEX IF EXISTS public.auth_user_username_6821ab7c_like;
DROP INDEX IF EXISTS public.auth_user_user_permissions_user_id_a95ead1b;
DROP INDEX IF EXISTS public.auth_user_user_permissions_permission_id_1fbb5f2c;
DROP INDEX IF EXISTS public.auth_user_groups_user_id_6a12ed8b;
DROP INDEX IF EXISTS public.auth_user_groups_group_id_97559544;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
DROP INDEX IF EXISTS public.analises_analiseia_consulta_id_44b019bb;
ALTER TABLE IF EXISTS ONLY public.escritorios_permissao DROP CONSTRAINT IF EXISTS escritorios_permissao_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_permissao DROP CONSTRAINT IF EXISTS escritorios_permissao_nome_key;
ALTER TABLE IF EXISTS ONLY public.escritorios_permissao DROP CONSTRAINT IF EXISTS escritorios_permissao_codename_key;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario DROP CONSTRAINT IF EXISTS escritorios_perfilusuario_user_id_key;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario DROP CONSTRAINT IF EXISTS escritorios_perfilusuario_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario_papeis DROP CONSTRAINT IF EXISTS escritorios_perfilusuario_papeis_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_perfilusuario_papeis DROP CONSTRAINT IF EXISTS escritorios_perfilusuari_perfilusuario_id_papel_i_f9ff9b6e_uniq;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel DROP CONSTRAINT IF EXISTS escritorios_papel_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel_permissoes DROP CONSTRAINT IF EXISTS escritorios_papel_permissoes_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel_permissoes DROP CONSTRAINT IF EXISTS escritorios_papel_permis_papel_id_permissao_id_76762e9d_uniq;
ALTER TABLE IF EXISTS ONLY public.escritorios_papel DROP CONSTRAINT IF EXISTS escritorios_papel_nome_escritorio_id_95f51f95_uniq;
ALTER TABLE IF EXISTS ONLY public.escritorios_escritorio DROP CONSTRAINT IF EXISTS escritorios_escritorio_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_convite DROP CONSTRAINT IF EXISTS escritorios_convite_token_key;
ALTER TABLE IF EXISTS ONLY public.escritorios_convite DROP CONSTRAINT IF EXISTS escritorios_convite_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_auditlogretencao DROP CONSTRAINT IF EXISTS escritorios_auditlogretencao_pkey;
ALTER TABLE IF EXISTS ONLY public.escritorios_auditlogretencao DROP CONSTRAINT IF EXISTS escritorios_auditlogretencao_escritorio_id_key;
ALTER TABLE IF EXISTS ONLY public.escritorios_auditlog DROP CONSTRAINT IF EXISTS escritorios_auditlog_pkey;
ALTER TABLE IF EXISTS ONLY public.documentos_tag DROP CONSTRAINT IF EXISTS documentos_tag_pkey;
ALTER TABLE IF EXISTS ONLY public.documentos_tag DROP CONSTRAINT IF EXISTS documentos_tag_escritorio_id_nome_208a3242_uniq;
ALTER TABLE IF EXISTS ONLY public.documentos_documentoanaliseia DROP CONSTRAINT IF EXISTS documentos_documentoanaliseia_pkey;
ALTER TABLE IF EXISTS ONLY public.documentos_documento_tags DROP CONSTRAINT IF EXISTS documentos_documento_tags_pkey;
ALTER TABLE IF EXISTS ONLY public.documentos_documento_tags DROP CONSTRAINT IF EXISTS documentos_documento_tags_documento_id_tag_id_3c1224b1_uniq;
ALTER TABLE IF EXISTS ONLY public.documentos_documento DROP CONSTRAINT IF EXISTS documentos_documento_pkey;
ALTER TABLE IF EXISTS ONLY public.documentos_categoria DROP CONSTRAINT IF EXISTS documentos_categoria_pkey;
ALTER TABLE IF EXISTS ONLY public.documentos_categoria DROP CONSTRAINT IF EXISTS documentos_categoria_escritorio_id_nome_89ac7bd9_uniq;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.consultas_consulta DROP CONSTRAINT IF EXISTS consultas_consulta_pkey;
ALTER TABLE IF EXISTS ONLY public.clientes_cliente DROP CONSTRAINT IF EXISTS clientes_cliente_pkey;
ALTER TABLE IF EXISTS ONLY public.clientes_cliente DROP CONSTRAINT IF EXISTS clientes_cliente_email_key;
ALTER TABLE IF EXISTS ONLY public.clientes_cliente DROP CONSTRAINT IF EXISTS clientes_cliente_cpf_key;
ALTER TABLE IF EXISTS ONLY public.clientes_cliente DROP CONSTRAINT IF EXISTS clientes_cliente_cnpj_key;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_username_key;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_user_id_permission_id_14a6b632_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_user_permissions DROP CONSTRAINT IF EXISTS auth_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user DROP CONSTRAINT IF EXISTS auth_user_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_user_id_group_id_94350c0c_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_user_groups DROP CONSTRAINT IF EXISTS auth_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
ALTER TABLE IF EXISTS ONLY public.analises_analiseia DROP CONSTRAINT IF EXISTS analises_analiseia_pkey;
DROP TABLE IF EXISTS public.escritorios_permissao;
DROP TABLE IF EXISTS public.escritorios_perfilusuario_papeis;
DROP TABLE IF EXISTS public.escritorios_perfilusuario;
DROP TABLE IF EXISTS public.escritorios_papel_permissoes;
DROP TABLE IF EXISTS public.escritorios_papel;
DROP TABLE IF EXISTS public.escritorios_escritorio;
DROP TABLE IF EXISTS public.escritorios_convite;
DROP TABLE IF EXISTS public.escritorios_auditlogretencao;
DROP TABLE IF EXISTS public.escritorios_auditlog;
DROP TABLE IF EXISTS public.documentos_tag;
DROP TABLE IF EXISTS public.documentos_documentoanaliseia;
DROP TABLE IF EXISTS public.documentos_documento_tags;
DROP TABLE IF EXISTS public.documentos_documento;
DROP TABLE IF EXISTS public.documentos_categoria;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.consultas_consulta;
DROP TABLE IF EXISTS public.clientes_cliente;
DROP TABLE IF EXISTS public.auth_user_user_permissions;
DROP TABLE IF EXISTS public.auth_user_groups;
DROP TABLE IF EXISTS public.auth_user;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.analises_analiseia;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analises_analiseia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analises_analiseia (
    id bigint NOT NULL,
    contexto text NOT NULL,
    resultado text NOT NULL,
    data_criacao timestamp with time zone NOT NULL,
    consulta_id bigint NOT NULL
);


ALTER TABLE public.analises_analiseia OWNER TO postgres;

--
-- Name: analises_analiseia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.analises_analiseia ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.analises_analiseia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO postgres;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO postgres;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO postgres;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO postgres;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: clientes_cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes_cliente (
    id bigint NOT NULL,
    nome_completo character varying(255) NOT NULL,
    cpf character varying(14),
    email character varying(255) NOT NULL,
    telefone character varying(20),
    endereco character varying(255),
    observacoes text,
    escritorio_id bigint NOT NULL,
    advogado_responsavel character varying(255),
    area_interesse character varying(100),
    bairro character varying(100),
    cep character varying(9),
    cidade character varying(100),
    cnpj character varying(18),
    como_chegou character varying(255),
    complemento character varying(100),
    contato_emergencia character varying(255),
    data_cadastro timestamp with time zone NOT NULL,
    data_nascimento date,
    data_primeiro_atendimento date,
    email_alternativo character varying(255),
    estado character varying(2),
    estado_civil character varying(50),
    historico_relacionamento text,
    logradouro character varying(255),
    nome_conjuge character varying(255),
    nome_fantasia character varying(255),
    numero character varying(20),
    outros_advogados text,
    preferencia_contato character varying(50),
    profissao character varying(100),
    razao_social character varying(255),
    regime_bens character varying(50),
    representante_legal character varying(255),
    restricoes text,
    rg character varying(20),
    status_cliente character varying(50) NOT NULL,
    telefone_celular character varying(20),
    telefone_fixo character varying(20),
    ultima_atualizacao timestamp with time zone NOT NULL
);


ALTER TABLE public.clientes_cliente OWNER TO postgres;

--
-- Name: clientes_cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.clientes_cliente ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.clientes_cliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: consultas_consulta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultas_consulta (
    id bigint NOT NULL,
    audio_file character varying(100) NOT NULL,
    transcricao text,
    data_criacao timestamp with time zone NOT NULL,
    cliente_id bigint NOT NULL
);


ALTER TABLE public.consultas_consulta OWNER TO postgres;

--
-- Name: consultas_consulta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.consultas_consulta ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.consultas_consulta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO postgres;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO postgres;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- Name: documentos_categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_categoria (
    id bigint NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text NOT NULL,
    icone character varying(50) NOT NULL,
    cor character varying(20) NOT NULL,
    ordem integer NOT NULL,
    ativo boolean NOT NULL,
    data_criacao timestamp with time zone NOT NULL,
    escritorio_id bigint NOT NULL
);


ALTER TABLE public.documentos_categoria OWNER TO postgres;

--
-- Name: documentos_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documentos_categoria ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documentos_categoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documentos_documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_documento (
    id bigint NOT NULL,
    arquivo character varying(100),
    titulo character varying(255) NOT NULL,
    descricao text NOT NULL,
    nome_original character varying(255) NOT NULL,
    tipo_arquivo character varying(10) NOT NULL,
    tamanho bigint NOT NULL,
    hash_md5 character varying(32) NOT NULL,
    data_upload timestamp with time zone NOT NULL,
    data_documento date,
    data_atualizacao timestamp with time zone NOT NULL,
    confidencial boolean NOT NULL,
    ativo boolean NOT NULL,
    versao integer NOT NULL,
    visualizacoes integer NOT NULL,
    downloads integer NOT NULL,
    texto_extraido text NOT NULL,
    categoria_id bigint,
    cliente_id bigint,
    documento_pai_id bigint,
    escritorio_id bigint NOT NULL,
    usuario_upload_id integer
);


ALTER TABLE public.documentos_documento OWNER TO postgres;

--
-- Name: documentos_documento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documentos_documento ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documentos_documento_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documentos_documento_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_documento_tags (
    id bigint NOT NULL,
    documento_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


ALTER TABLE public.documentos_documento_tags OWNER TO postgres;

--
-- Name: documentos_documento_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documentos_documento_tags ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documentos_documento_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documentos_documentoanaliseia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_documentoanaliseia (
    id bigint NOT NULL,
    tipo_analise character varying(20) NOT NULL,
    prompt_personalizado text,
    status character varying(15) NOT NULL,
    resultado text NOT NULL,
    dados_estruturados jsonb NOT NULL,
    data_solicitacao timestamp with time zone NOT NULL,
    data_conclusao timestamp with time zone,
    tempo_processamento interval,
    mensagem_erro text NOT NULL,
    tokens_usados integer NOT NULL,
    custo_estimado numeric(10,4) NOT NULL,
    modelo_ia character varying(50) NOT NULL,
    documento_id bigint NOT NULL,
    escritorio_id bigint NOT NULL,
    usuario_id integer
);


ALTER TABLE public.documentos_documentoanaliseia OWNER TO postgres;

--
-- Name: documentos_documentoanaliseia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documentos_documentoanaliseia ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documentos_documentoanaliseia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: documentos_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_tag (
    id bigint NOT NULL,
    nome character varying(50) NOT NULL,
    cor character varying(7) NOT NULL,
    data_criacao timestamp with time zone NOT NULL,
    escritorio_id bigint NOT NULL
);


ALTER TABLE public.documentos_tag OWNER TO postgres;

--
-- Name: documentos_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documentos_tag ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.documentos_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_auditlog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_auditlog (
    id bigint NOT NULL,
    usuario_nome character varying(255) NOT NULL,
    escritorio_id integer,
    escritorio_nome character varying(255) NOT NULL,
    acao character varying(20) NOT NULL,
    descricao text NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    object_id integer,
    objeto_repr character varying(255) NOT NULL,
    modelo_nome character varying(100) NOT NULL,
    endpoint character varying(500) NOT NULL,
    metodo_http character varying(10) NOT NULL,
    ip_address inet,
    user_agent text NOT NULL,
    dados_antigos jsonb,
    dados_novos jsonb,
    campos_alterados jsonb,
    sucesso boolean NOT NULL,
    erro_mensagem text NOT NULL,
    content_type_id integer,
    usuario_id integer,
    CONSTRAINT escritorios_auditlog_object_id_check CHECK ((object_id >= 0))
);


ALTER TABLE public.escritorios_auditlog OWNER TO postgres;

--
-- Name: escritorios_auditlog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_auditlog ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_auditlog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_auditlogretencao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_auditlogretencao (
    id bigint NOT NULL,
    dias_retencao integer NOT NULL,
    habilitar_log_leitura boolean NOT NULL,
    habilitar_exportacao_automatica boolean NOT NULL,
    escritorio_id bigint NOT NULL,
    CONSTRAINT escritorios_auditlogretencao_dias_retencao_check CHECK ((dias_retencao >= 0))
);


ALTER TABLE public.escritorios_auditlogretencao OWNER TO postgres;

--
-- Name: escritorios_auditlogretencao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_auditlogretencao ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_auditlogretencao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_convite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_convite (
    id bigint NOT NULL,
    email character varying(254) NOT NULL,
    token uuid NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    escritorio_id bigint NOT NULL,
    sender_id integer NOT NULL
);


ALTER TABLE public.escritorios_convite OWNER TO postgres;

--
-- Name: escritorios_convite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_convite ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_convite_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_escritorio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_escritorio (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    data_criacao timestamp with time zone NOT NULL,
    data_expiracao_teste timestamp with time zone,
    status_assinatura character varying(20) NOT NULL,
    openai_api_key text,
    bairro character varying(100),
    cep character varying(9),
    cidade character varying(100),
    complemento character varying(100),
    estado character varying(2),
    logo character varying(100),
    logradouro character varying(255),
    numero character varying(20)
);


ALTER TABLE public.escritorios_escritorio OWNER TO postgres;

--
-- Name: escritorios_escritorio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_escritorio ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_escritorio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_papel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_papel (
    id bigint NOT NULL,
    nome character varying(100) NOT NULL,
    escritorio_id bigint NOT NULL
);


ALTER TABLE public.escritorios_papel OWNER TO postgres;

--
-- Name: escritorios_papel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_papel ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_papel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_papel_permissoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_papel_permissoes (
    id bigint NOT NULL,
    papel_id bigint NOT NULL,
    permissao_id bigint NOT NULL
);


ALTER TABLE public.escritorios_papel_permissoes OWNER TO postgres;

--
-- Name: escritorios_papel_permissoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_papel_permissoes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_papel_permissoes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_perfilusuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_perfilusuario (
    id bigint NOT NULL,
    escritorio_id bigint,
    user_id integer NOT NULL
);


ALTER TABLE public.escritorios_perfilusuario OWNER TO postgres;

--
-- Name: escritorios_perfilusuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_perfilusuario ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_perfilusuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_perfilusuario_papeis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_perfilusuario_papeis (
    id bigint NOT NULL,
    perfilusuario_id bigint NOT NULL,
    papel_id bigint NOT NULL
);


ALTER TABLE public.escritorios_perfilusuario_papeis OWNER TO postgres;

--
-- Name: escritorios_perfilusuario_papeis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_perfilusuario_papeis ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_perfilusuario_papeis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: escritorios_permissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.escritorios_permissao (
    id bigint NOT NULL,
    nome character varying(100) NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.escritorios_permissao OWNER TO postgres;

--
-- Name: escritorios_permissao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.escritorios_permissao ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.escritorios_permissao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: analises_analiseia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analises_analiseia (id, contexto, resultado, data_criacao, consulta_id) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add cliente	1	add_cliente
2	Can change cliente	1	change_cliente
3	Can delete cliente	1	delete_cliente
4	Can view cliente	1	view_cliente
5	Can add log entry	2	add_logentry
6	Can change log entry	2	change_logentry
7	Can delete log entry	2	delete_logentry
8	Can view log entry	2	view_logentry
9	Can add permission	3	add_permission
10	Can change permission	3	change_permission
11	Can delete permission	3	delete_permission
12	Can view permission	3	view_permission
13	Can add group	4	add_group
14	Can change group	4	change_group
15	Can delete group	4	delete_group
16	Can view group	4	view_group
17	Can add user	5	add_user
18	Can change user	5	change_user
19	Can delete user	5	delete_user
20	Can view user	5	view_user
21	Can add content type	6	add_contenttype
22	Can change content type	6	change_contenttype
23	Can delete content type	6	delete_contenttype
24	Can view content type	6	view_contenttype
25	Can add session	7	add_session
26	Can change session	7	change_session
27	Can delete session	7	delete_session
28	Can view session	7	view_session
29	Can add consulta	8	add_consulta
30	Can change consulta	8	change_consulta
31	Can delete consulta	8	delete_consulta
32	Can view consulta	8	view_consulta
33	Can add analise ia	9	add_analiseia
34	Can change analise ia	9	change_analiseia
35	Can delete analise ia	9	delete_analiseia
36	Can view analise ia	9	view_analiseia
37	Can add perfil usuario	10	add_perfilusuario
38	Can change perfil usuario	10	change_perfilusuario
39	Can delete perfil usuario	10	delete_perfilusuario
40	Can view perfil usuario	10	view_perfilusuario
41	Can add escritorio	11	add_escritorio
42	Can change escritorio	11	change_escritorio
43	Can delete escritorio	11	delete_escritorio
44	Can view escritorio	11	view_escritorio
45	Can add convite	12	add_convite
46	Can change convite	12	change_convite
47	Can delete convite	12	delete_convite
48	Can view convite	12	view_convite
49	Can add papel	13	add_papel
50	Can change papel	13	change_papel
51	Can delete papel	13	delete_papel
52	Can view papel	13	view_papel
53	Can add permissao	14	add_permissao
54	Can change permissao	14	change_permissao
55	Can delete permissao	14	delete_permissao
56	Can view permissao	14	view_permissao
57	Can add Log de Auditoria	15	add_auditlog
58	Can change Log de Auditoria	15	change_auditlog
59	Can delete Log de Auditoria	15	delete_auditlog
60	Can view Log de Auditoria	15	view_auditlog
61	Can add Configuração de Retenção	16	add_auditlogretencao
62	Can change Configuração de Retenção	16	change_auditlogretencao
63	Can delete Configuração de Retenção	16	delete_auditlogretencao
64	Can view Configuração de Retenção	16	view_auditlogretencao
65	Can add Documento	17	add_documento
66	Can change Documento	17	change_documento
67	Can delete Documento	17	delete_documento
68	Can view Documento	17	view_documento
69	Can add Tag	18	add_tag
70	Can change Tag	18	change_tag
71	Can delete Tag	18	delete_tag
72	Can view Tag	18	view_tag
73	Can add Categoria de Documento	19	add_categoria
74	Can change Categoria de Documento	19	change_categoria
75	Can delete Categoria de Documento	19	delete_categoria
76	Can view Categoria de Documento	19	view_categoria
77	Can add Análise de IA	20	add_documentoanaliseia
78	Can change Análise de IA	20	change_documentoanaliseia
79	Can delete Análise de IA	20	delete_documentoanaliseia
80	Can view Análise de IA	20	view_documentoanaliseia
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
15	pbkdf2_sha256$1000000$EWUp82TxdKQ1uYXM5hr239$yo4DAWEtNkyeZ1yfT8B9JxKWA+opSXi3tC+2VPI8koo=	\N	f	Guilherme2			guilherme@gmail.com	f	t	2025-10-04 17:06:56.708013+00
20	pbkdf2_sha256$1000000$6OyUUfCzRmcSM0QlAQkVPZ$DvpCmb0kCdUlC1TObltHWffeqGVs+58QcjOg4pM5ef8=	\N	f	adrianavillarhorta@gmail.com	Adriana Lopes de	Villar Horta	adrianavillarhorta@gmail.com	f	t	2025-10-04 18:36:05.311773+00
16	pbkdf2_sha256$1000000$lMTNVMcUgvDNOFgXxZq0A2$/GL7+yAJpDNBSwkTOQCzOl9FPuyvf2jB74IG6Fnolrk=	2025-10-04 21:23:42.890667+00	t	Enio			enio.perfil@gmail.com	t	t	2025-10-04 17:29:55.679042+00
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: clientes_cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes_cliente (id, nome_completo, cpf, email, telefone, endereco, observacoes, escritorio_id, advogado_responsavel, area_interesse, bairro, cep, cidade, cnpj, como_chegou, complemento, contato_emergencia, data_cadastro, data_nascimento, data_primeiro_atendimento, email_alternativo, estado, estado_civil, historico_relacionamento, logradouro, nome_conjuge, nome_fantasia, numero, outros_advogados, preferencia_contato, profissao, razao_social, regime_bens, representante_legal, restricoes, rg, status_cliente, telefone_celular, telefone_fixo, ultima_atualizacao) FROM stdin;
17	Zezito da Silva Sauro	\N	zezito@gmail.com	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-04 21:39:19.722479+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Ativo	\N	\N	2025-10-04 21:39:19.722479+00
18	Cliente Temporário (Teste Scanner IA)	00000000000	teste.scanner@sistema.com	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-06 00:19:15.061092+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Ativo	00000000000	\N	2025-10-06 00:19:15.061092+00
10	José João Melão da silva	\N	jose@gmail.com	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-04 17:56:29.094607+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Ativo	\N	\N	2025-10-04 17:56:29.094607+00
9	Adriana Lopes de Villar Horta	045.493.818-76	adrianavillarhorta@gmail.com	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-04 17:31:55.937089+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Ativo	(11) 98989-2715	\N	2025-10-04 19:43:37.929517+00
11	Teste de sistema	\N	testedesistema@teste.com	\N	\N	\N	9	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-10-04 21:19:37.207284+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Ativo	\N	\N	2025-10-04 21:19:37.207284+00
\.


--
-- Data for Name: consultas_consulta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultas_consulta (id, audio_file, transcricao, data_criacao, cliente_id) FROM stdin;
20	audio_consultas\\consulta_cliente_9.mp3	Estou testando para ver se a gravação do microfone voltou a funcionar e está funcionando de acordo.	2025-10-04 17:32:20.112959+00	9
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	clientes	cliente
2	admin	logentry
3	auth	permission
4	auth	group
5	auth	user
6	contenttypes	contenttype
7	sessions	session
8	consultas	consulta
9	analises	analiseia
10	escritorios	perfilusuario
11	escritorios	escritorio
12	escritorios	convite
13	escritorios	papel
14	escritorios	permissao
15	escritorios	auditlog
16	escritorios	auditlogretencao
17	documentos	documento
18	documentos	tag
19	documentos	categoria
20	documentos	documentoanaliseia
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-10-01 13:25:39.279319+00
2	auth	0001_initial	2025-10-01 13:25:39.357772+00
3	admin	0001_initial	2025-10-01 13:25:39.382962+00
4	admin	0002_logentry_remove_auto_add	2025-10-01 13:25:39.393493+00
5	admin	0003_logentry_add_action_flag_choices	2025-10-01 13:25:39.438371+00
6	contenttypes	0002_remove_content_type_name	2025-10-01 13:25:39.463515+00
7	auth	0002_alter_permission_name_max_length	2025-10-01 13:25:39.477033+00
8	auth	0003_alter_user_email_max_length	2025-10-01 13:25:39.489108+00
9	auth	0004_alter_user_username_opts	2025-10-01 13:25:39.50076+00
10	auth	0005_alter_user_last_login_null	2025-10-01 13:25:39.514874+00
11	auth	0006_require_contenttypes_0002	2025-10-01 13:25:39.519455+00
12	auth	0007_alter_validators_add_error_messages	2025-10-01 13:25:39.53203+00
13	auth	0008_alter_user_username_max_length	2025-10-01 13:25:39.552603+00
14	auth	0009_alter_user_last_name_max_length	2025-10-01 13:25:39.574431+00
15	auth	0010_alter_group_name_max_length	2025-10-01 13:25:39.600742+00
16	auth	0011_update_proxy_permissions	2025-10-01 13:25:39.62241+00
17	auth	0012_alter_user_first_name_max_length	2025-10-01 13:25:39.644145+00
18	clientes	0001_initial	2025-10-01 13:25:39.667477+00
19	sessions	0001_initial	2025-10-01 13:25:39.689499+00
20	consultas	0001_initial	2025-10-01 16:19:38.789481+00
21	analises	0001_initial	2025-10-02 12:34:38.942504+00
22	escritorios	0001_initial	2025-10-02 13:36:52.719689+00
23	clientes	0002_cliente_escritorio	2025-10-02 13:37:33.260576+00
24	escritorios	0002_auto_20251002_1038	2025-10-02 13:39:50.166505+00
25	clientes	0003_auto_20251002_1041	2025-10-02 13:41:48.199666+00
26	escritorios	0003_escritorio_data_expiracao_teste_and_more	2025-10-02 14:04:26.567244+00
27	escritorios	0004_escritorio_openai_api_key	2025-10-02 14:23:39.765789+00
28	escritorios	0005_convite	2025-10-02 14:48:36.722372+00
29	clientes	0004_remove_cliente_data_criacao_and_more	2025-10-03 15:00:42.122808+00
30	escritorios	0006_escritorio_bairro_escritorio_cep_escritorio_cidade_and_more	2025-10-04 14:14:30.392397+00
31	escritorios	0007_permissao_papel_perfilusuario_papeis	2025-10-04 15:04:43.051514+00
32	escritorios	0008_auto_20251004_1204	2025-10-04 15:05:22.224576+00
33	escritorios	0009_alter_perfilusuario_escritorio	2025-10-04 15:24:06.894801+00
34	escritorios	0010_auditlogretencao_auditlog	2025-10-04 21:17:00.677774+00
35	documentos	0001_initial	2025-10-05 14:12:29.753701+00
36	documentos	0002_documentoanaliseia	2025-10-05 23:14:33.14636+00
37	documentos	0003_alter_documento_arquivo	2025-10-05 23:24:26.639064+00
38	documentos	0004_alter_documentoanaliseia_prompt_personalizado	2025-10-06 00:49:23.80522+00
39	documentos	0005_alter_documento_cliente	2025-10-06 22:13:16.665976+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
4lk2p7pnvzwupidmbe92i2mt8gy3jg27	.eJxVjDsOwjAQBe_iGln-JfFS0ucM1mbtxQFkS3FSIe5OIqWA9s3Me4uA25rD1tIS5iiuQovL7zYhPVM5QHxguVdJtazLPMlDkSdtcqwxvW6n-3eQseW99p5Ul9g4dhqcdQmgJ9ZAXaSewCqcFKNVBJGG6HFAME4zMJve7bb4fAHlfTge:1v3yXZ:2GIE1lLEeNcUdjgoWex-U0_OeiXMPOjOrN5uyxg6sRY	2025-10-15 15:14:49.678382+00
4gftffqbhjy1eeo6qj6lf3nczi0njrrn	.eJxVjEEOwiAQRe_C2pCBUigu3XsGMsxMpWpoUtqV8e7apAvd_vfef6mE21rS1mRJE6uzMl6dfseM9JC6E75jvc2a5rouU9a7og_a9HVmeV4O9--gYCvfehijB28zdQwmWjAcB3YSyAfsEEwgRyjoRw4SrPTgYraGssvBA_dWvT8BLzf8:1v59jC:I6n-f17aP4hDsWNwPhpY-XEaAmvTs-S2TbaqPvWgaao	2025-10-18 21:23:42.898069+00
\.


--
-- Data for Name: documentos_categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_categoria (id, nome, descricao, icone, cor, ordem, ativo, data_criacao, escritorio_id) FROM stdin;
1	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.039154+00	2
2	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.064642+00	2
3	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.068186+00	2
4	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.070185+00	2
5	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.073696+00	2
6	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.076699+00	2
7	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.079705+00	2
8	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.082748+00	2
9	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.085759+00	2
10	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.088754+00	2
11	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.092252+00	1
12	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.095257+00	1
13	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.097797+00	1
14	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.102308+00	1
15	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.105313+00	1
16	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.108719+00	1
17	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.11172+00	1
18	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.114232+00	1
19	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.117232+00	1
20	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.120231+00	1
21	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.123229+00	3
22	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.126486+00	3
23	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.129044+00	3
24	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.132293+00	3
25	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.135321+00	3
26	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.138076+00	3
27	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.140287+00	3
28	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.143791+00	3
29	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.146384+00	3
30	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.149382+00	3
31	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.152381+00	4
32	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.155894+00	4
33	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.158014+00	4
34	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.161965+00	4
35	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.165475+00	4
36	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.168473+00	4
37	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.171474+00	4
38	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.174472+00	4
39	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.177058+00	4
40	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.180057+00	4
41	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.182628+00	5
42	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.184627+00	5
43	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.188104+00	5
44	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.191147+00	5
45	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.193704+00	5
46	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.196468+00	5
47	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.199473+00	5
48	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.202467+00	5
49	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.205978+00	5
50	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.208511+00	5
51	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.211512+00	6
52	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.215009+00	6
53	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.218014+00	6
54	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.221014+00	6
55	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.223593+00	6
56	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.227114+00	6
57	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.230113+00	6
58	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.232116+00	6
59	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.235621+00	6
60	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.238251+00	6
61	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.240719+00	7
62	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.243722+00	7
63	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.246746+00	7
64	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.248747+00	7
65	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.252745+00	7
66	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.255819+00	7
67	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.258824+00	7
68	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.261648+00	7
69	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.26392+00	7
70	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.267042+00	7
71	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.270579+00	8
72	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.273582+00	8
73	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.276085+00	8
74	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.279602+00	8
75	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.282611+00	8
76	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.285382+00	8
77	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.288449+00	8
78	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.291449+00	8
79	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.293448+00	8
80	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.296449+00	8
81	Contratos		Description	#1976d2	1	t	2025-10-05 14:18:11.299538+00	9
82	Procurações		Gavel	#d32f2f	2	t	2025-10-05 14:18:11.302079+00	9
83	Petições		Article	#7b1fa2	3	t	2025-10-05 14:18:11.305082+00	9
84	Documentos Pessoais		Badge	#388e3c	4	t	2025-10-05 14:18:11.307594+00	9
85	Decisões Judiciais		AccountBalance	#f57c00	5	t	2025-10-05 14:18:11.310594+00	9
86	Correspondências		Email	#0288d1	6	t	2025-10-05 14:18:11.314252+00	9
87	Comprovantes		Receipt	#5d4037	7	t	2025-10-05 14:18:11.317321+00	9
88	Laudos e Perícias		Science	#00796b	8	t	2025-10-05 14:18:11.320878+00	9
89	Fotos e Evidências		Photo	#c2185b	9	t	2025-10-05 14:18:11.323133+00	9
90	Outros		Folder	#616161	10	t	2025-10-05 14:18:11.326137+00	9
\.


--
-- Data for Name: documentos_documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_documento (id, arquivo, titulo, descricao, nome_original, tipo_arquivo, tamanho, hash_md5, data_upload, data_documento, data_atualizacao, confidencial, ativo, versao, visualizacoes, downloads, texto_extraido, categoria_id, cliente_id, documento_pai_id, escritorio_id, usuario_upload_id) FROM stdin;
2	documentos/escritorio_9/cliente_9/2025/10/Ingresso_-_SET_Expo_2025_-_70908588.pdf	Ingresso - SET Expo 2025 - 70908588	Ingresso SET Expo	Ingresso_-_SET_Expo_2025_-_70908588.pdf	pdf	173425	60956abd9e4db910d019cda12dd51174	2025-10-05 14:38:26.291947+00	2025-10-05	2025-10-05 14:44:14.462134+00	f	f	1	0	1		84	9	\N	9	16
1	documentos/escritorio_9/cliente_17/2025/10/CNIS_IZILDA.pdf	CNIS IZILDA	Esse é o CNIS da cliente Izilda.	CNIS IZILDA.pdf	pdf	3843412	395c00aafa06c7b7ccb2f84af1b58b5b	2025-10-05 14:23:24.457187+00	2025-10-05	2025-10-05 14:23:24.457187+00	f	t	1	105	0		87	17	\N	9	16
3	documentos/escritorio_9/cliente_17/2025/10/Ingresso_-_SET_Expo_2025_-_70908588.pdf	Ingresso - SET Expo 2025 - 70908588		Ingresso - SET Expo 2025 - 70908588.pdf	pdf	173425	60956abd9e4db910d019cda12dd51174	2025-10-05 14:59:37.052992+00	2025-10-05	2025-10-05 14:59:37.052992+00	f	t	1	8	1		\N	17	\N	9	16
4		Documento Escaneado - 06/10/2025 00:19		documento_escaneado.pdf	pdf	7196		2025-10-06 00:19:15.066406+00	\N	2025-10-06 00:19:15.066406+00	f	t	1	0	0	--- Página 1 ---\nagi\n2, N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\n\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\n240, onde recebe intimações, e endereço eletrônico\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\nExcelência propor\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\nfato e de direito a seguir expostos:\nDOS FATOS\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 2 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nà | DEFENSORIA PÚBLICA\nepi AR,\n\nA requerente e o requerido se conheceram em 2013, desenvolvendo\ninicialmente uma relação de amizade que posteriormente evoluiu para um\nrelacionamento amoroso. O casal manteve união estável por\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\n\nApós a separação, a requerente descobriu estar grávida, fruto do\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\nnascimento anexa.\n\nO menor encontra-se sob os cuidados exclusivos da genitora desde\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\nfinanceiro para o sustento da criança, que conta atualmente com poucos\ndias de vida.\n\nConsiderando a tenra idade do recém-nascido e a necessidade de\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\nnecessidades alimentares urgentes da criança, faz-se necessária a\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\ndas visitas paternas.\n\nDO DIREITO\n\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\nartigo 227 da Constituição Federal estabelece como dever da família, da\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\nalimentação, entre outros, com absoluta prioridade.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 3 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nÉ OAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\ntal direito após o nascimento da criança. O Estatuto da Criança e do\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\nguarda e educação dos filhos menores.\n\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\nser regulamentado considerando-se o melhor interesse da criança.\nDA GRATUIDADE PROCESSUAL\n\nA requerente encontra-se em situação de vulnerabilidade\neconômica, não possuindo condições de arcar com as custas processuais e\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\nDOS PEDIDOS\n\nDiante do exposto, requer a Vossa Excelência:\nI- DA GRATUIDADE PROCESSUAL\n\nA concessão dos benefícios da gratuidade processual, com\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 4 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nAB Issa nda SAB\nH - DA TUTELA DE URGÊNCIA\nA concessão de tutela de urgência para fixação de alimentos\n\nprovisórios em favor do menor RAVI, no valor correspondente a:\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\n\ncomprove vínculo empregatício formal; ou\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\n\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\n\nrequerido.\nHI - DO MÉRITO\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\nem valor adequado, considerando as necessidades do alimentando e as\npossibilidades do alimentante;\nb) A regulamentação das visitas paternas, considerando a tenra idade do\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\nampliação conforme desenvolvimento da criança;\nc) A condenação do requerido ao pagamento das custas processuais e\nhonorários advocatícios;\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\nforma e prazo legais;\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 5 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\ne) A intimação do representante do Ministério Público para que atue no feito\nnos termos do art. 178, II do CPC;\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\ndepósito em conta corrente a ser informada pela genitora;\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\nconta corrente /poupança para recebimento dos depósitos concernente aos\nalimentos.\nDA URGÊNCIA\n\nA tutela de urgência se justifica pela extrema necessidade da\ncriança recém-nascida, que demanda cuidados especiais, alimentação\nadequada, fraldas, medicamentos e demais itens essenciais à sua\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\npode causar danos irreparáveis ao menor.\n\nDO VALOR DA CAUSA\n\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\n\nProtesta provar todo o alegado por todos os meios de prova\nadmitidos no direito, em especial prova documental, testemunhal e\ndepoimentos pessoais.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 6 ---\nagi\n2 N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR\nTermos em que,\nPede deferimento.\nSalto, data da assinatura digital.\nENIO INÁCIO NACCI JUNIOR\nOAB/SP: 390.565\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(dadv.oabsp.org.br\n	\N	18	\N	1	15
5		Documento Escaneado - 06/10/2025 00:47		documento_escaneado.pdf	pdf	7196		2025-10-06 00:47:50.237366+00	\N	2025-10-06 00:47:50.237366+00	f	t	1	0	0	--- Página 1 ---\nagi\n2, N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\n\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\n240, onde recebe intimações, e endereço eletrônico\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\nExcelência propor\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\nfato e de direito a seguir expostos:\nDOS FATOS\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 2 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nà | DEFENSORIA PÚBLICA\nepi AR,\n\nA requerente e o requerido se conheceram em 2013, desenvolvendo\ninicialmente uma relação de amizade que posteriormente evoluiu para um\nrelacionamento amoroso. O casal manteve união estável por\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\n\nApós a separação, a requerente descobriu estar grávida, fruto do\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\nnascimento anexa.\n\nO menor encontra-se sob os cuidados exclusivos da genitora desde\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\nfinanceiro para o sustento da criança, que conta atualmente com poucos\ndias de vida.\n\nConsiderando a tenra idade do recém-nascido e a necessidade de\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\nnecessidades alimentares urgentes da criança, faz-se necessária a\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\ndas visitas paternas.\n\nDO DIREITO\n\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\nartigo 227 da Constituição Federal estabelece como dever da família, da\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\nalimentação, entre outros, com absoluta prioridade.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 3 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nÉ OAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\ntal direito após o nascimento da criança. O Estatuto da Criança e do\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\nguarda e educação dos filhos menores.\n\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\nser regulamentado considerando-se o melhor interesse da criança.\nDA GRATUIDADE PROCESSUAL\n\nA requerente encontra-se em situação de vulnerabilidade\neconômica, não possuindo condições de arcar com as custas processuais e\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\nDOS PEDIDOS\n\nDiante do exposto, requer a Vossa Excelência:\nI- DA GRATUIDADE PROCESSUAL\n\nA concessão dos benefícios da gratuidade processual, com\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 4 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nAB Issa nda SAB\nH - DA TUTELA DE URGÊNCIA\nA concessão de tutela de urgência para fixação de alimentos\n\nprovisórios em favor do menor RAVI, no valor correspondente a:\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\n\ncomprove vínculo empregatício formal; ou\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\n\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\n\nrequerido.\nHI - DO MÉRITO\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\nem valor adequado, considerando as necessidades do alimentando e as\npossibilidades do alimentante;\nb) A regulamentação das visitas paternas, considerando a tenra idade do\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\nampliação conforme desenvolvimento da criança;\nc) A condenação do requerido ao pagamento das custas processuais e\nhonorários advocatícios;\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\nforma e prazo legais;\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 5 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\ne) A intimação do representante do Ministério Público para que atue no feito\nnos termos do art. 178, II do CPC;\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\ndepósito em conta corrente a ser informada pela genitora;\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\nconta corrente /poupança para recebimento dos depósitos concernente aos\nalimentos.\nDA URGÊNCIA\n\nA tutela de urgência se justifica pela extrema necessidade da\ncriança recém-nascida, que demanda cuidados especiais, alimentação\nadequada, fraldas, medicamentos e demais itens essenciais à sua\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\npode causar danos irreparáveis ao menor.\n\nDO VALOR DA CAUSA\n\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\n\nProtesta provar todo o alegado por todos os meios de prova\nadmitidos no direito, em especial prova documental, testemunhal e\ndepoimentos pessoais.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 6 ---\nagi\n2 N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR\nTermos em que,\nPede deferimento.\nSalto, data da assinatura digital.\nENIO INÁCIO NACCI JUNIOR\nOAB/SP: 390.565\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(dadv.oabsp.org.br\n	\N	9	\N	9	16
6		Documento Escaneado - 06/10/2025 00:50		documento_escaneado.pdf	pdf	7196		2025-10-06 00:50:33.945273+00	\N	2025-10-06 00:50:33.945273+00	f	t	1	0	0	--- Página 1 ---\nagi\n2, N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\n\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\n240, onde recebe intimações, e endereço eletrônico\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\nExcelência propor\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\nfato e de direito a seguir expostos:\nDOS FATOS\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 2 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nà | DEFENSORIA PÚBLICA\nepi AR,\n\nA requerente e o requerido se conheceram em 2013, desenvolvendo\ninicialmente uma relação de amizade que posteriormente evoluiu para um\nrelacionamento amoroso. O casal manteve união estável por\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\n\nApós a separação, a requerente descobriu estar grávida, fruto do\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\nnascimento anexa.\n\nO menor encontra-se sob os cuidados exclusivos da genitora desde\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\nfinanceiro para o sustento da criança, que conta atualmente com poucos\ndias de vida.\n\nConsiderando a tenra idade do recém-nascido e a necessidade de\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\nnecessidades alimentares urgentes da criança, faz-se necessária a\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\ndas visitas paternas.\n\nDO DIREITO\n\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\nartigo 227 da Constituição Federal estabelece como dever da família, da\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\nalimentação, entre outros, com absoluta prioridade.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 3 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nÉ OAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\ntal direito após o nascimento da criança. O Estatuto da Criança e do\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\nguarda e educação dos filhos menores.\n\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\nser regulamentado considerando-se o melhor interesse da criança.\nDA GRATUIDADE PROCESSUAL\n\nA requerente encontra-se em situação de vulnerabilidade\neconômica, não possuindo condições de arcar com as custas processuais e\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\nDOS PEDIDOS\n\nDiante do exposto, requer a Vossa Excelência:\nI- DA GRATUIDADE PROCESSUAL\n\nA concessão dos benefícios da gratuidade processual, com\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 4 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nAB Issa nda SAB\nH - DA TUTELA DE URGÊNCIA\nA concessão de tutela de urgência para fixação de alimentos\n\nprovisórios em favor do menor RAVI, no valor correspondente a:\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\n\ncomprove vínculo empregatício formal; ou\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\n\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\n\nrequerido.\nHI - DO MÉRITO\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\nem valor adequado, considerando as necessidades do alimentando e as\npossibilidades do alimentante;\nb) A regulamentação das visitas paternas, considerando a tenra idade do\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\nampliação conforme desenvolvimento da criança;\nc) A condenação do requerido ao pagamento das custas processuais e\nhonorários advocatícios;\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\nforma e prazo legais;\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 5 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\ne) A intimação do representante do Ministério Público para que atue no feito\nnos termos do art. 178, II do CPC;\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\ndepósito em conta corrente a ser informada pela genitora;\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\nconta corrente /poupança para recebimento dos depósitos concernente aos\nalimentos.\nDA URGÊNCIA\n\nA tutela de urgência se justifica pela extrema necessidade da\ncriança recém-nascida, que demanda cuidados especiais, alimentação\nadequada, fraldas, medicamentos e demais itens essenciais à sua\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\npode causar danos irreparáveis ao menor.\n\nDO VALOR DA CAUSA\n\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\n\nProtesta provar todo o alegado por todos os meios de prova\nadmitidos no direito, em especial prova documental, testemunhal e\ndepoimentos pessoais.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 6 ---\nagi\n2 N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR\nTermos em que,\nPede deferimento.\nSalto, data da assinatura digital.\nENIO INÁCIO NACCI JUNIOR\nOAB/SP: 390.565\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(dadv.oabsp.org.br\n	\N	9	\N	9	16
7		Documento Escaneado - 06/10/2025 01:09		documento_escaneado.pdf	pdf	7196		2025-10-06 01:09:09.954511+00	\N	2025-10-06 01:09:09.954511+00	f	t	1	2	0	--- Página 1 ---\nagi\n2, N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\n\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\n240, onde recebe intimações, e endereço eletrônico\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\nExcelência propor\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\nfato e de direito a seguir expostos:\nDOS FATOS\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 2 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nà | DEFENSORIA PÚBLICA\nepi AR,\n\nA requerente e o requerido se conheceram em 2013, desenvolvendo\ninicialmente uma relação de amizade que posteriormente evoluiu para um\nrelacionamento amoroso. O casal manteve união estável por\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\n\nApós a separação, a requerente descobriu estar grávida, fruto do\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\nnascimento anexa.\n\nO menor encontra-se sob os cuidados exclusivos da genitora desde\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\nfinanceiro para o sustento da criança, que conta atualmente com poucos\ndias de vida.\n\nConsiderando a tenra idade do recém-nascido e a necessidade de\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\nnecessidades alimentares urgentes da criança, faz-se necessária a\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\ndas visitas paternas.\n\nDO DIREITO\n\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\nartigo 227 da Constituição Federal estabelece como dever da família, da\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\nalimentação, entre outros, com absoluta prioridade.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 3 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nÉ OAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\n\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\ntal direito após o nascimento da criança. O Estatuto da Criança e do\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\nguarda e educação dos filhos menores.\n\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\nser regulamentado considerando-se o melhor interesse da criança.\nDA GRATUIDADE PROCESSUAL\n\nA requerente encontra-se em situação de vulnerabilidade\neconômica, não possuindo condições de arcar com as custas processuais e\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\nDOS PEDIDOS\n\nDiante do exposto, requer a Vossa Excelência:\nI- DA GRATUIDADE PROCESSUAL\n\nA concessão dos benefícios da gratuidade processual, com\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\n\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 4 ---\nÓ\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\nAB Issa nda SAB\nH - DA TUTELA DE URGÊNCIA\nA concessão de tutela de urgência para fixação de alimentos\n\nprovisórios em favor do menor RAVI, no valor correspondente a:\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\n\ncomprove vínculo empregatício formal; ou\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\n\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\n\nrequerido.\nHI - DO MÉRITO\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\nem valor adequado, considerando as necessidades do alimentando e as\npossibilidades do alimentante;\nb) A regulamentação das visitas paternas, considerando a tenra idade do\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\nampliação conforme desenvolvimento da criança;\nc) A condenação do requerido ao pagamento das custas processuais e\nhonorários advocatícios;\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\nforma e prazo legais;\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 5 ---\nSI N A C C | DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR,\ne) A intimação do representante do Ministério Público para que atue no feito\nnos termos do art. 178, II do CPC;\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\ndepósito em conta corrente a ser informada pela genitora;\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\nconta corrente /poupança para recebimento dos depósitos concernente aos\nalimentos.\nDA URGÊNCIA\n\nA tutela de urgência se justifica pela extrema necessidade da\ncriança recém-nascida, que demanda cuidados especiais, alimentação\nadequada, fraldas, medicamentos e demais itens essenciais à sua\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\npode causar danos irreparáveis ao menor.\n\nDO VALOR DA CAUSA\n\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\n\nProtesta provar todo o alegado por todos os meios de prova\nadmitidos no direito, em especial prova documental, testemunhal e\ndepoimentos pessoais.\n\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(yadv.oabsp.org.br\n\n\n--- Página 6 ---\nagi\n2 N A C C l DR. ENIO INACIO NACCI JR.\nOAB/SP nº: 390.565\nAdvocacia & Assessoria Jurídica\naan AR\nTermos em que,\nPede deferimento.\nSalto, data da assinatura digital.\nENIO INÁCIO NACCI JUNIOR\nOAB/SP: 390.565\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\nWhatsApp: (11) 98858-7046\nemail: enio.nacci(dadv.oabsp.org.br\n	\N	9	\N	9	16
\.


--
-- Data for Name: documentos_documento_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_documento_tags (id, documento_id, tag_id) FROM stdin;
1	1	82
2	2	89
3	2	87
\.


--
-- Data for Name: documentos_documentoanaliseia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_documentoanaliseia (id, tipo_analise, prompt_personalizado, status, resultado, dados_estruturados, data_solicitacao, data_conclusao, tempo_processamento, mensagem_erro, tokens_usados, custo_estimado, modelo_ia, documento_id, escritorio_id, usuario_id) FROM stdin;
3	resumo	\N	concluido	Resumo Executivo:\n\nTipo de Documento:\nEste é um documento de petição inicial para uma ação de alimentos cumulada com regulamentação de visitas.\n\nPrincipais pontos e informações relevantes:\nA requerente, Amanda Santos, representando seu filho menor, Ravi Lucca Carvalho Santos, está processando o requerido, Anderson Carvalho Pereira, para obter apoio financeiro para o sustento da criança e também para regular as visitas paternas. A requerente e o requerido tiveram um relacionamento amoroso que durou aproximadamente 12 anos e terminou em fevereiro de 2025. A criança nasceu em 15 de agosto de 2025 e desde então tem estado sob os cuidados exclusivos da mãe. O pai não tem prestado qualquer auxílio financeiro.\n\nPartes envolvidas:\nAs partes envolvidas são a requerente Amanda Santos, representando seu filho Ravi Lucca Carvalho Santos, e o requerido Anderson Carvalho Pereira. O advogado representando a requerente é Dr. Enio Inacio Nacci Jr.\n\nValores e datas importantes:\nA requerente solicita uma tutela de urgência para fixação de alimentos provisórios em favor do menor Ravi, no valor correspondente a 30% dos rendimentos líquidos do requerido, caso comprove vínculo empregatício formal; ou 50% do salário mínimo nacional vigente (atualmente R$ 1.518,00), na hipótese de desemprego ou trabalho informal do requerido. O valor da causa é de R$ 9.108,00, correspondente a 12 parcelas dos alimentos pleiteados.\n\nConclusão/Síntese:\nA requerente está buscando apoio financeiro para o sustento de seu filho recém-nascido e também a regulamentação das visitas paternas. Ela também solicita a gratuidade processual devido à sua situação de vulnerabilidade econômica. O documento termina com uma solicitação para que o requerido seja citado para responder à ação dentro do prazo legal.	{}	2025-10-06 00:50:33.948272+00	2025-10-06 00:50:47.133896+00	00:00:12.883633		3028	0.0908	gpt-4	6	9	16
\.


--
-- Data for Name: documentos_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos_tag (id, nome, cor, data_criacao, escritorio_id) FROM stdin;
1	Urgente	#d32f2f	2025-10-05 14:18:35.06115+00	2
2	Importante	#f57c00	2025-10-05 14:18:35.068151+00	2
3	Revisão	#fbc02d	2025-10-05 14:18:35.08777+00	2
4	Aprovado	#388e3c	2025-10-05 14:18:35.091281+00	2
5	Assinado	#00796b	2025-10-05 14:18:35.094281+00	2
6	Original	#1976d2	2025-10-05 14:18:35.097282+00	2
7	Cópia	#5e35b1	2025-10-05 14:18:35.100505+00	2
8	Rascunho	#757575	2025-10-05 14:18:35.102505+00	2
9	Arquivado	#546e7a	2025-10-05 14:18:35.105053+00	2
10	Em Análise	#0288d1	2025-10-05 14:18:35.10806+00	2
11	Urgente	#d32f2f	2025-10-05 14:18:35.111573+00	1
12	Importante	#f57c00	2025-10-05 14:18:35.114574+00	1
13	Revisão	#fbc02d	2025-10-05 14:18:35.117573+00	1
14	Aprovado	#388e3c	2025-10-05 14:18:35.120634+00	1
15	Assinado	#00796b	2025-10-05 14:18:35.123639+00	1
16	Original	#1976d2	2025-10-05 14:18:35.126643+00	1
17	Cópia	#5e35b1	2025-10-05 14:18:35.12964+00	1
18	Rascunho	#757575	2025-10-05 14:18:35.132682+00	1
19	Arquivado	#546e7a	2025-10-05 14:18:35.136246+00	1
20	Em Análise	#0288d1	2025-10-05 14:18:35.139251+00	1
21	Urgente	#d32f2f	2025-10-05 14:18:35.14176+00	3
22	Importante	#f57c00	2025-10-05 14:18:35.144763+00	3
23	Revisão	#fbc02d	2025-10-05 14:18:35.14776+00	3
24	Aprovado	#388e3c	2025-10-05 14:18:35.151264+00	3
25	Assinado	#00796b	2025-10-05 14:18:35.15384+00	3
26	Original	#1976d2	2025-10-05 14:18:35.156843+00	3
27	Cópia	#5e35b1	2025-10-05 14:18:35.15984+00	3
28	Rascunho	#757575	2025-10-05 14:18:35.161841+00	3
29	Arquivado	#546e7a	2025-10-05 14:18:35.164891+00	3
30	Em Análise	#0288d1	2025-10-05 14:18:35.167436+00	3
31	Urgente	#d32f2f	2025-10-05 14:18:35.170442+00	4
32	Importante	#f57c00	2025-10-05 14:18:35.172953+00	4
33	Revisão	#fbc02d	2025-10-05 14:18:35.176953+00	4
34	Aprovado	#388e3c	2025-10-05 14:18:35.179952+00	4
35	Assinado	#00796b	2025-10-05 14:18:35.183013+00	4
36	Original	#1976d2	2025-10-05 14:18:35.185022+00	4
37	Cópia	#5e35b1	2025-10-05 14:18:35.188017+00	4
38	Rascunho	#757575	2025-10-05 14:18:35.19167+00	4
39	Arquivado	#546e7a	2025-10-05 14:18:35.194821+00	4
40	Em Análise	#0288d1	2025-10-05 14:18:35.198068+00	4
41	Urgente	#d32f2f	2025-10-05 14:18:35.20122+00	5
42	Importante	#f57c00	2025-10-05 14:18:35.203826+00	5
43	Revisão	#fbc02d	2025-10-05 14:18:35.20699+00	5
44	Aprovado	#388e3c	2025-10-05 14:18:35.210141+00	5
45	Assinado	#00796b	2025-10-05 14:18:35.212743+00	5
46	Original	#1976d2	2025-10-05 14:18:35.214974+00	5
47	Cópia	#5e35b1	2025-10-05 14:18:35.217978+00	5
48	Rascunho	#757575	2025-10-05 14:18:35.220979+00	5
49	Arquivado	#546e7a	2025-10-05 14:18:35.224491+00	5
50	Em Análise	#0288d1	2025-10-05 14:18:35.227491+00	5
51	Urgente	#d32f2f	2025-10-05 14:18:35.230077+00	6
52	Importante	#f57c00	2025-10-05 14:18:35.232077+00	6
53	Revisão	#fbc02d	2025-10-05 14:18:35.23659+00	6
54	Aprovado	#388e3c	2025-10-05 14:18:35.23859+00	6
55	Assinado	#00796b	2025-10-05 14:18:35.242589+00	6
56	Original	#1976d2	2025-10-05 14:18:35.245683+00	6
57	Cópia	#5e35b1	2025-10-05 14:18:35.249684+00	6
58	Rascunho	#757575	2025-10-05 14:18:35.252683+00	6
59	Arquivado	#546e7a	2025-10-05 14:18:35.254879+00	6
60	Em Análise	#0288d1	2025-10-05 14:18:35.25848+00	6
61	Urgente	#d32f2f	2025-10-05 14:18:35.261487+00	7
62	Importante	#f57c00	2025-10-05 14:18:35.265+00	7
63	Revisão	#fbc02d	2025-10-05 14:18:35.267001+00	7
64	Aprovado	#388e3c	2025-10-05 14:18:35.27+00	7
65	Assinado	#00796b	2025-10-05 14:18:35.273202+00	7
66	Original	#1976d2	2025-10-05 14:18:35.276258+00	7
67	Cópia	#5e35b1	2025-10-05 14:18:35.279257+00	7
68	Rascunho	#757575	2025-10-05 14:18:35.281267+00	7
69	Arquivado	#546e7a	2025-10-05 14:18:35.284763+00	7
70	Em Análise	#0288d1	2025-10-05 14:18:35.286772+00	7
71	Urgente	#d32f2f	2025-10-05 14:18:35.290389+00	8
72	Importante	#f57c00	2025-10-05 14:18:35.293389+00	8
73	Revisão	#fbc02d	2025-10-05 14:18:35.2969+00	8
74	Aprovado	#388e3c	2025-10-05 14:18:35.299901+00	8
75	Assinado	#00796b	2025-10-05 14:18:35.3029+00	8
76	Original	#1976d2	2025-10-05 14:18:35.306962+00	8
77	Cópia	#5e35b1	2025-10-05 14:18:35.30996+00	8
78	Rascunho	#757575	2025-10-05 14:18:35.312959+00	8
79	Arquivado	#546e7a	2025-10-05 14:18:35.316223+00	8
80	Em Análise	#0288d1	2025-10-05 14:18:35.319224+00	8
81	Urgente	#d32f2f	2025-10-05 14:18:35.322773+00	9
82	Importante	#f57c00	2025-10-05 14:18:35.32585+00	9
83	Revisão	#fbc02d	2025-10-05 14:18:35.328856+00	9
84	Aprovado	#388e3c	2025-10-05 14:18:35.331859+00	9
85	Assinado	#00796b	2025-10-05 14:18:35.334856+00	9
86	Original	#1976d2	2025-10-05 14:18:35.338018+00	9
87	Cópia	#5e35b1	2025-10-05 14:18:35.341016+00	9
88	Rascunho	#757575	2025-10-05 14:18:35.344018+00	9
89	Arquivado	#546e7a	2025-10-05 14:18:35.346522+00	9
90	Em Análise	#0288d1	2025-10-05 14:18:35.349528+00	9
\.


--
-- Data for Name: escritorios_auditlog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_auditlog (id, usuario_nome, escritorio_id, escritorio_nome, acao, descricao, "timestamp", object_id, objeto_repr, modelo_nome, endpoint, metodo_http, ip_address, user_agent, dados_antigos, dados_novos, campos_alterados, sucesso, erro_mensagem, content_type_id, usuario_id) FROM stdin;
1	Enio	9	Nacci Advocacia	CREATE	criou Clientes	2025-10-04 21:19:37.213096+00	\N			/api/clientes/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"id": 11, "rg": null, "cep": null, "cpf": null, "cnpj": null, "email": "testedesistema@teste.com", "bairro": null, "cidade": null, "estado": null, "numero": null, "endereco": null, "telefone": null, "profissao": null, "logradouro": null, "restricoes": null, "como_chegou": null, "complemento": null, "observacoes": null, "regime_bens": null, "estado_civil": null, "nome_conjuge": null, "razao_social": null, "data_cadastro": "2025-10-04T21:19:37.207284Z", "nome_completo": "Teste de sistema", "nome_fantasia": null, "telefone_fixo": null, "area_interesse": null, "status_cliente": "Ativo", "data_nascimento": null, "outros_advogados": null, "telefone_celular": null, "email_alternativo": null, "contato_emergencia": null, "ultima_atualizacao": "2025-10-04T21:19:37.207284Z", "preferencia_contato": null, "representante_legal": null, "advogado_responsavel": null, "historico_relacionamento": null, "data_primeiro_atendimento": null}	\N	t		\N	16
2	Enio	9	Nacci Advocacia	CREATE	criou Login	2025-10-04 21:22:29.19837+00	\N			/api-auth/login/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{}	\N	t		\N	16
3	Enio	9	Nacci Advocacia	UPDATE	editou Papeis	2025-10-04 21:23:02.027729+00	\N			/api/papeis/7/	PUT	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"id": 7, "nome": "Administrador", "permissoes": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 26]}	\N	t		\N	16
4	Enio	9	Nacci Advocacia	CREATE	criou Login	2025-10-04 21:23:42.896071+00	\N			/api-auth/login/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{}	\N	t		\N	16
5	enio.perfil@gmail.com	1	Escritório Padrão	CREATE	Criou o cliente Cliente Teste Auditoria	2025-10-04 21:30:07.679229+00	15	Cliente Teste Auditoria	Cliente	/api/clientes/	POST	127.0.0.1	Test Script	\N	{"cpf": "12345678901", "email": "teste@auditoria.com", "nome_completo": "Cliente Teste Auditoria", "telefone_celular": "11999999999"}	\N	t		1	16
6	enio.perfil@gmail.com	1	Escritório Padrão	UPDATE	Atualizou o cliente Cliente Teste Auditoria - ATUALIZADO	2025-10-04 21:30:07.69147+00	15	Cliente Teste Auditoria - ATUALIZADO	Cliente	/api/clientes/15/	PUT	127.0.0.1	Test Script	{"email": "teste@auditoria.com", "nome_completo": "Cliente Teste Auditoria"}	{"email": "teste.atualizado@auditoria.com", "nome_completo": "Cliente Teste Auditoria - ATUALIZADO"}	["nome_completo", "email"]	t		1	16
7	enio.perfil@gmail.com	1	Escritório Padrão	DELETE	Deletou o cliente Cliente Teste Auditoria - ATUALIZADO	2025-10-04 21:30:07.693474+00	15	Cliente Teste Auditoria - ATUALIZADO	Cliente	/api/clientes/15/	DELETE	127.0.0.1	Test Script	{"email": "teste.atualizado@auditoria.com", "nome_completo": "Cliente Teste Auditoria - ATUALIZADO"}	\N	\N	t		1	16
8	enio.perfil@gmail.com	1	Escritório Padrão	CREATE	Criou o cliente Cliente Teste Auditoria	2025-10-04 21:30:22.122817+00	16	Cliente Teste Auditoria	Cliente	/api/clientes/	POST	127.0.0.1	Test Script	\N	{"cpf": "12345678901", "email": "teste@auditoria.com", "nome_completo": "Cliente Teste Auditoria", "telefone_celular": "11999999999"}	\N	t		1	16
9	enio.perfil@gmail.com	1	Escritório Padrão	UPDATE	Atualizou o cliente Cliente Teste Auditoria - ATUALIZADO	2025-10-04 21:30:22.13678+00	16	Cliente Teste Auditoria - ATUALIZADO	Cliente	/api/clientes/16/	PUT	127.0.0.1	Test Script	{"email": "teste@auditoria.com", "nome_completo": "Cliente Teste Auditoria"}	{"email": "teste.atualizado@auditoria.com", "nome_completo": "Cliente Teste Auditoria - ATUALIZADO"}	["nome_completo", "email"]	t		1	16
10	enio.perfil@gmail.com	1	Escritório Padrão	DELETE	Deletou o cliente Cliente Teste Auditoria - ATUALIZADO	2025-10-04 21:30:22.137787+00	16	Cliente Teste Auditoria - ATUALIZADO	Cliente	/api/clientes/16/	DELETE	127.0.0.1	Test Script	{"email": "teste.atualizado@auditoria.com", "nome_completo": "Cliente Teste Auditoria - ATUALIZADO"}	\N	\N	t		1	16
11	Enio	9	Nacci Advocacia	CREATE	criou Clientes	2025-10-04 21:39:19.724479+00	\N			/api/clientes/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"id": 17, "rg": null, "cep": null, "cpf": null, "cnpj": null, "email": "zezito@gmail.com", "bairro": null, "cidade": null, "estado": null, "numero": null, "endereco": null, "telefone": null, "profissao": null, "logradouro": null, "restricoes": null, "como_chegou": null, "complemento": null, "observacoes": null, "regime_bens": null, "estado_civil": null, "nome_conjuge": null, "razao_social": null, "data_cadastro": "2025-10-04T21:39:19.722479Z", "nome_completo": "Zezito da Silva Sauro", "nome_fantasia": null, "telefone_fixo": null, "area_interesse": null, "status_cliente": "Ativo", "data_nascimento": null, "outros_advogados": null, "telefone_celular": null, "email_alternativo": null, "contato_emergencia": null, "ultima_atualizacao": "2025-10-04T21:39:19.722479Z", "preferencia_contato": null, "representante_legal": null, "advogado_responsavel": null, "historico_relacionamento": null, "data_primeiro_atendimento": null}	\N	t		\N	16
12	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-05 14:23:24.46732+00	\N			/api/documentos/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"titulo": "CNIS IZILDA", "arquivo": "http://127.0.0.1:8000/media/documentos/escritorio_9/cliente_17/2025/10/CNIS_IZILDA.pdf", "cliente": 17, "categoria": 87, "descricao": "Esse é o CNIS da cliente Izilda.", "confidencial": false, "data_documento": "2025-10-05"}	\N	t		\N	16
13	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-05 14:38:26.318032+00	\N			/api/documentos/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"titulo": "Ingresso - SET Expo 2025 - 70908588", "arquivo": "http://127.0.0.1:8000/media/documentos/escritorio_9/cliente_9/2025/10/Ingresso_-_SET_Expo_2025_-_70908588.pdf", "cliente": 9, "categoria": 84, "descricao": "Ingresso SET Expo", "confidencial": false, "data_documento": "2025-10-05"}	\N	t		\N	16
14	Enio	9	Nacci Advocacia	DELETE	excluiu Documento: Ingresso - SET Expo 2025 - 70908588 - Adriana Lopes de Villar Horta	2025-10-05 14:44:14.467211+00	2	Ingresso - SET Expo 2025 - 70908588 - Adriana Lopes de Villar Horta	Documento	/api/documentos/2/	DELETE	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	\N	\N	t		17	16
15	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:37.704381+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 1}	\N	t		17	16
16	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:38.651601+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 2}	\N	t		17	16
17	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:39.660685+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 3}	\N	t		17	16
18	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:40.645589+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 4}	\N	t		17	16
19	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:41.64971+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 5}	\N	t		17	16
20	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:42.655067+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 6}	\N	t		17	16
21	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:43.682023+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 7}	\N	t		17	16
22	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:44.662649+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 8}	\N	t		17	16
23	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:45.657532+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 9}	\N	t		17	16
24	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:46.655956+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 10}	\N	t		17	16
25	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:47.658167+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 11}	\N	t		17	16
26	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:48.664941+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 12}	\N	t		17	16
27	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:49.336243+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 13}	\N	t		17	16
28	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:49.932041+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 14}	\N	t		17	16
29	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:50.502489+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 15}	\N	t		17	16
30	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:51.089936+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 16}	\N	t		17	16
31	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:51.650361+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 17}	\N	t		17	16
32	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:52.223603+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 18}	\N	t		17	16
33	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:52.809889+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 19}	\N	t		17	16
34	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:53.377004+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 20}	\N	t		17	16
35	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:56:53.947481+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 21}	\N	t		17	16
131	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-06 00:50:47.160022+00	\N			/api/documentos/analises/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"id": 3, "status": "concluido", "usuario": 16, "documento": 6, "modelo_ia": "gpt-4", "resultado": "Resumo Executivo:\\n\\nTipo de Documento:\\nEste é um documento de petição inicial para uma ação de alimentos cumulada com regulamentação de visitas.\\n\\nPrincipais pontos e informações relevantes:\\nA requerente, Amanda Santos, representando seu filho menor, Ravi Lucca Carvalho Santos, está processando o requerido, Anderson Carvalho Pereira, para obter apoio financeiro para o sustento da criança e também para regular as visitas paternas. A requerente e o requerido tiveram um relacionamento amoroso que durou aproximadamente 12 anos e terminou em fevereiro de 2025. A criança nasceu em 15 de agosto de 2025 e desde então tem estado sob os cuidados exclusivos da mãe. O pai não tem prestado qualquer auxílio financeiro.\\n\\nPartes envolvidas:\\nAs partes envolvidas são a requerente Amanda Santos, representando seu filho Ravi Lucca Carvalho Santos, e o requerido Anderson Carvalho Pereira. O advogado representando a requerente é Dr. Enio Inacio Nacci Jr.\\n\\nValores e datas importantes:\\nA requerente solicita uma tutela de urgência para fixação de alimentos provisórios em favor do menor Ravi, no valor correspondente a 30% dos rendimentos líquidos do requerido, caso comprove vínculo empregatício formal; ou 50% do salário mínimo nacional vigente (atualmente R$ 1.518,00), na hipótese de desemprego ou trabalho informal do requerido. O valor da causa é de R$ 9.108,00, correspondente a 12 parcelas dos alimentos pleiteados.\\n\\nConclusão/Síntese:\\nA requerente está buscando apoio financeiro para o sustento de seu filho recém-nascido e também a regulamentação das visitas paternas. Ela também solicita a gratuidade processual devido à sua situação de vulnerabilidade econômica. O documento termina com uma solicitação para que o requerido seja citado para responder à ação dentro do prazo legal.", "tipo_analise": "resumo", "usuario_nome": "enio.perfil@gmail.com", "mensagem_erro": "", "tokens_usados": 3028, "custo_estimado": "0.0908", "data_conclusao": "2025-10-06T00:50:47.133896Z", "status_display": "Concluído", "documento_dados": {"id": 6, "ativo": true, "titulo": "Documento Escaneado - 06/10/2025 00:50", "versao": 1, "cliente": 9, "tamanho": 7196, "categoria": null, "descricao": "", "downloads": 0, "tags_list": [], "arquivo_url": null, "data_upload": "2025-10-06T00:50:33.945273Z", "cliente_nome": "Adriana Lopes de Villar Horta", "confidencial": false, "tipo_arquivo": "pdf", "usuario_nome": "enio.perfil@gmail.com", "nome_original": "documento_escaneado.pdf", "visualizacoes": 0, "data_documento": null, "tamanho_formatado": "7.0 KB"}, "data_solicitacao": "2025-10-06T00:50:33.948272Z", "dados_estruturados": {}, "tempo_processamento": "00:00:12.883633", "prompt_personalizado": null, "tipo_analise_display": "Resumo Executivo"}	\N	t		\N	16
36	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:04.600983+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 22}	\N	t		17	16
37	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:05.161213+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 23}	\N	t		17	16
38	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:05.721213+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 24}	\N	t		17	16
39	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:06.302027+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 25}	\N	t		17	16
40	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:06.865923+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 26}	\N	t		17	16
41	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:07.413341+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 27}	\N	t		17	16
42	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:07.965014+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 28}	\N	t		17	16
43	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:08.531169+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 29}	\N	t		17	16
44	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:09.093304+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 30}	\N	t		17	16
45	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:09.669536+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 31}	\N	t		17	16
46	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:10.256326+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 32}	\N	t		17	16
47	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:10.814483+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 33}	\N	t		17	16
48	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:11.399938+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 34}	\N	t		17	16
49	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:11.962919+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 35}	\N	t		17	16
50	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:12.549213+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 36}	\N	t		17	16
51	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:13.136543+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 37}	\N	t		17	16
52	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:13.715451+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 38}	\N	t		17	16
53	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:14.30259+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 39}	\N	t		17	16
54	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:14.889716+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 40}	\N	t		17	16
132	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-06 01:08:53.28017+00	\N			/api/documentos/ocr/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"texto": "--- Página 1 ---\\nagi\\n2, N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\\n\\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\\n240, onde recebe intimações, e endereço eletrônico\\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\\nExcelência propor\\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\\nfato e de direito a seguir expostos:\\nDOS FATOS\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 2 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nà | DEFENSORIA PÚBLICA\\nepi AR,\\n\\nA requerente e o requerido se conheceram em 2013, desenvolvendo\\ninicialmente uma relação de amizade que posteriormente evoluiu para um\\nrelacionamento amoroso. O casal manteve união estável por\\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\\n\\nApós a separação, a requerente descobriu estar grávida, fruto do\\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\\nnascimento anexa.\\n\\nO menor encontra-se sob os cuidados exclusivos da genitora desde\\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\\nfinanceiro para o sustento da criança, que conta atualmente com poucos\\ndias de vida.\\n\\nConsiderando a tenra idade do recém-nascido e a necessidade de\\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\\nnecessidades alimentares urgentes da criança, faz-se necessária a\\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\\ndas visitas paternas.\\n\\nDO DIREITO\\n\\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\\nartigo 227 da Constituição Federal estabelece como dever da família, da\\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\\nalimentação, entre outros, com absoluta prioridade.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 3 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nÉ OAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\\ntal direito após o nascimento da criança. O Estatuto da Criança e do\\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\\nguarda e educação dos filhos menores.\\n\\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\\nser regulamentado considerando-se o melhor interesse da criança.\\nDA GRATUIDADE PROCESSUAL\\n\\nA requerente encontra-se em situação de vulnerabilidade\\neconômica, não possuindo condições de arcar com as custas processuais e\\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\\nDOS PEDIDOS\\n\\nDiante do exposto, requer a Vossa Excelência:\\nI- DA GRATUIDADE PROCESSUAL\\n\\nA concessão dos benefícios da gratuidade processual, com\\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 4 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nAB Issa nda SAB\\nH - DA TUTELA DE URGÊNCIA\\nA concessão de tutela de urgência para fixação de alimentos\\n\\nprovisórios em favor do menor RAVI, no valor correspondente a:\\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\\n\\ncomprove vínculo empregatício formal; ou\\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\\n\\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\\n\\nrequerido.\\nHI - DO MÉRITO\\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\\nem valor adequado, considerando as necessidades do alimentando e as\\npossibilidades do alimentante;\\nb) A regulamentação das visitas paternas, considerando a tenra idade do\\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\\nampliação conforme desenvolvimento da criança;\\nc) A condenação do requerido ao pagamento das custas processuais e\\nhonorários advocatícios;\\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\\nforma e prazo legais;\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 5 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\ne) A intimação do representante do Ministério Público para que atue no feito\\nnos termos do art. 178, II do CPC;\\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\\ndepósito em conta corrente a ser informada pela genitora;\\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\\nconta corrente /poupança para recebimento dos depósitos concernente aos\\nalimentos.\\nDA URGÊNCIA\\n\\nA tutela de urgência se justifica pela extrema necessidade da\\ncriança recém-nascida, que demanda cuidados especiais, alimentação\\nadequada, fraldas, medicamentos e demais itens essenciais à sua\\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\\npode causar danos irreparáveis ao menor.\\n\\nDO VALOR DA CAUSA\\n\\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\\n\\nProtesta provar todo o alegado por todos os meios de prova\\nadmitidos no direito, em especial prova documental, testemunhal e\\ndepoimentos pessoais.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 6 ---\\nagi\\n2 N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR\\nTermos em que,\\nPede deferimento.\\nSalto, data da assinatura digital.\\nENIO INÁCIO NACCI JUNIOR\\nOAB/SP: 390.565\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(dadv.oabsp.org.br\\n", "success": true, "tamanho": 606878, "nome_arquivo": "00 - Inicial alimentos.pdf", "tipo_arquivo": "pdf"}	\N	t		\N	16
55	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:15.463333+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 41}	\N	t		17	16
56	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:16.02453+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 42}	\N	t		17	16
57	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:16.589197+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 43}	\N	t		17	16
58	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:17.161231+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 44}	\N	t		17	16
59	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:17.743523+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 45}	\N	t		17	16
60	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:18.336324+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 46}	\N	t		17	16
61	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:18.884504+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 47}	\N	t		17	16
62	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:19.453936+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 48}	\N	t		17	16
63	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:20.019338+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 49}	\N	t		17	16
64	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:20.65714+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 50}	\N	t		17	16
65	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:21.658627+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 51}	\N	t		17	16
66	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:22.650504+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 52}	\N	t		17	16
67	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:23.650344+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 53}	\N	t		17	16
68	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:24.669018+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 54}	\N	t		17	16
69	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:25.657311+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 55}	\N	t		17	16
70	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:26.652734+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 56}	\N	t		17	16
71	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:27.663284+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 57}	\N	t		17	16
72	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:28.666366+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 58}	\N	t		17	16
73	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:29.66538+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 59}	\N	t		17	16
74	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:30.651638+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 60}	\N	t		17	16
75	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:31.645217+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 61}	\N	t		17	16
76	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:32.662193+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 62}	\N	t		17	16
77	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:33.651304+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 63}	\N	t		17	16
78	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:34.645549+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 64}	\N	t		17	16
79	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:35.648843+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 65}	\N	t		17	16
80	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:36.647758+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 66}	\N	t		17	16
81	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:37.653483+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 67}	\N	t		17	16
82	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:38.656554+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 68}	\N	t		17	16
83	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:39.681321+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 69}	\N	t		17	16
84	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:40.642997+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 70}	\N	t		17	16
85	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:41.6627+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 71}	\N	t		17	16
86	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:42.658609+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 72}	\N	t		17	16
87	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:43.664507+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 73}	\N	t		17	16
88	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:44.658301+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 74}	\N	t		17	16
89	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:45.685871+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 75}	\N	t		17	16
90	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:46.657441+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 76}	\N	t		17	16
91	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:47.652955+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 77}	\N	t		17	16
92	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:48.65758+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 78}	\N	t		17	16
93	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:49.656076+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 79}	\N	t		17	16
94	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:50.66075+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 80}	\N	t		17	16
95	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:51.659537+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 81}	\N	t		17	16
96	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:52.659419+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 82}	\N	t		17	16
97	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:53.64296+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 83}	\N	t		17	16
98	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:54.66472+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 84}	\N	t		17	16
99	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:55.676027+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 85}	\N	t		17	16
100	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:56.665018+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 86}	\N	t		17	16
101	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:57.655661+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 87}	\N	t		17	16
102	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:58.662944+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 88}	\N	t		17	16
103	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:57:59.653024+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 89}	\N	t		17	16
104	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:00.648717+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 90}	\N	t		17	16
105	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:01.648494+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 91}	\N	t		17	16
106	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:02.673541+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 92}	\N	t		17	16
107	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:03.664378+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 93}	\N	t		17	16
108	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:04.653444+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 94}	\N	t		17	16
109	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:05.658769+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 95}	\N	t		17	16
110	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:06.657824+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 96}	\N	t		17	16
111	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:07.668802+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 97}	\N	t		17	16
112	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:08.654982+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 98}	\N	t		17	16
113	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:09.639497+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 99}	\N	t		17	16
114	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:10.662291+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 100}	\N	t		17	16
115	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:11.641761+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 101}	\N	t		17	16
116	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:12.662179+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 102}	\N	t		17	16
117	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:14.655331+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 103}	\N	t		17	16
118	Enio	9	Nacci Advocacia	CREATE	criou Documento: CNIS IZILDA - Zezito da Silva Sauro	2025-10-05 14:58:31.704914+00	1	CNIS IZILDA - Zezito da Silva Sauro	Documento	/api/documentos/1/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 104}	\N	t		17	16
119	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-05 14:59:37.058015+00	\N			/api/documentos/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"titulo": "Ingresso - SET Expo 2025 - 70908588", "arquivo": "http://127.0.0.1:8000/media/documentos/escritorio_9/cliente_17/2025/10/Ingresso_-_SET_Expo_2025_-_70908588.pdf", "cliente": 17, "categoria": null, "descricao": "", "confidencial": false, "data_documento": "2025-10-05"}	\N	t		\N	16
120	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 14:59:43.668824+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 1}	\N	t		17	16
121	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 15:04:52.008442+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 2}	\N	t		17	16
122	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 15:05:29.169242+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 3}	\N	t		17	16
123	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 15:07:23.880871+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 4}	\N	t		17	16
124	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 15:13:09.450875+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 5}	\N	t		17	16
125	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 15:15:09.557968+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 6}	\N	t		17	16
126	Enio	9	Nacci Advocacia	CREATE	criou Documento: Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	2025-10-05 15:20:47.75242+00	3	Ingresso - SET Expo 2025 - 70908588 - Zezito da Silva Sauro	Documento	/api/documentos/3/incrementar_visualizacao/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"visualizacoes": 7}	\N	t		17	16
127	Enio	9	Nacci Advocacia	UPDATE	editou Papeis	2025-10-05 23:47:00.905439+00	\N			/api/papeis/7/	PUT	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"id": 7, "nome": "Administrador", "permissoes": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 11, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]}	\N	t		\N	16
128	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-06 00:45:42.736327+00	\N			/api/documentos/ocr/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"texto": "--- Página 1 ---\\nagi\\n2, N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\\n\\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\\n240, onde recebe intimações, e endereço eletrônico\\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\\nExcelência propor\\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\\nfato e de direito a seguir expostos:\\nDOS FATOS\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 2 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nà | DEFENSORIA PÚBLICA\\nepi AR,\\n\\nA requerente e o requerido se conheceram em 2013, desenvolvendo\\ninicialmente uma relação de amizade que posteriormente evoluiu para um\\nrelacionamento amoroso. O casal manteve união estável por\\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\\n\\nApós a separação, a requerente descobriu estar grávida, fruto do\\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\\nnascimento anexa.\\n\\nO menor encontra-se sob os cuidados exclusivos da genitora desde\\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\\nfinanceiro para o sustento da criança, que conta atualmente com poucos\\ndias de vida.\\n\\nConsiderando a tenra idade do recém-nascido e a necessidade de\\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\\nnecessidades alimentares urgentes da criança, faz-se necessária a\\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\\ndas visitas paternas.\\n\\nDO DIREITO\\n\\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\\nartigo 227 da Constituição Federal estabelece como dever da família, da\\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\\nalimentação, entre outros, com absoluta prioridade.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 3 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nÉ OAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\\ntal direito após o nascimento da criança. O Estatuto da Criança e do\\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\\nguarda e educação dos filhos menores.\\n\\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\\nser regulamentado considerando-se o melhor interesse da criança.\\nDA GRATUIDADE PROCESSUAL\\n\\nA requerente encontra-se em situação de vulnerabilidade\\neconômica, não possuindo condições de arcar com as custas processuais e\\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\\nDOS PEDIDOS\\n\\nDiante do exposto, requer a Vossa Excelência:\\nI- DA GRATUIDADE PROCESSUAL\\n\\nA concessão dos benefícios da gratuidade processual, com\\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 4 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nAB Issa nda SAB\\nH - DA TUTELA DE URGÊNCIA\\nA concessão de tutela de urgência para fixação de alimentos\\n\\nprovisórios em favor do menor RAVI, no valor correspondente a:\\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\\n\\ncomprove vínculo empregatício formal; ou\\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\\n\\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\\n\\nrequerido.\\nHI - DO MÉRITO\\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\\nem valor adequado, considerando as necessidades do alimentando e as\\npossibilidades do alimentante;\\nb) A regulamentação das visitas paternas, considerando a tenra idade do\\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\\nampliação conforme desenvolvimento da criança;\\nc) A condenação do requerido ao pagamento das custas processuais e\\nhonorários advocatícios;\\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\\nforma e prazo legais;\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 5 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\ne) A intimação do representante do Ministério Público para que atue no feito\\nnos termos do art. 178, II do CPC;\\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\\ndepósito em conta corrente a ser informada pela genitora;\\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\\nconta corrente /poupança para recebimento dos depósitos concernente aos\\nalimentos.\\nDA URGÊNCIA\\n\\nA tutela de urgência se justifica pela extrema necessidade da\\ncriança recém-nascida, que demanda cuidados especiais, alimentação\\nadequada, fraldas, medicamentos e demais itens essenciais à sua\\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\\npode causar danos irreparáveis ao menor.\\n\\nDO VALOR DA CAUSA\\n\\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\\n\\nProtesta provar todo o alegado por todos os meios de prova\\nadmitidos no direito, em especial prova documental, testemunhal e\\ndepoimentos pessoais.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 6 ---\\nagi\\n2 N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR\\nTermos em que,\\nPede deferimento.\\nSalto, data da assinatura digital.\\nENIO INÁCIO NACCI JUNIOR\\nOAB/SP: 390.565\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(dadv.oabsp.org.br\\n", "success": true, "tamanho": 606878, "nome_arquivo": "00 - Inicial alimentos.pdf", "tipo_arquivo": "pdf"}	\N	t		\N	16
129	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-06 00:47:39.558836+00	\N			/api/documentos/ocr/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"texto": "--- Página 1 ---\\nagi\\n2, N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\\n\\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\\n240, onde recebe intimações, e endereço eletrônico\\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\\nExcelência propor\\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\\nfato e de direito a seguir expostos:\\nDOS FATOS\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 2 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nà | DEFENSORIA PÚBLICA\\nepi AR,\\n\\nA requerente e o requerido se conheceram em 2013, desenvolvendo\\ninicialmente uma relação de amizade que posteriormente evoluiu para um\\nrelacionamento amoroso. O casal manteve união estável por\\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\\n\\nApós a separação, a requerente descobriu estar grávida, fruto do\\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\\nnascimento anexa.\\n\\nO menor encontra-se sob os cuidados exclusivos da genitora desde\\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\\nfinanceiro para o sustento da criança, que conta atualmente com poucos\\ndias de vida.\\n\\nConsiderando a tenra idade do recém-nascido e a necessidade de\\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\\nnecessidades alimentares urgentes da criança, faz-se necessária a\\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\\ndas visitas paternas.\\n\\nDO DIREITO\\n\\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\\nartigo 227 da Constituição Federal estabelece como dever da família, da\\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\\nalimentação, entre outros, com absoluta prioridade.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 3 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nÉ OAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\\ntal direito após o nascimento da criança. O Estatuto da Criança e do\\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\\nguarda e educação dos filhos menores.\\n\\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\\nser regulamentado considerando-se o melhor interesse da criança.\\nDA GRATUIDADE PROCESSUAL\\n\\nA requerente encontra-se em situação de vulnerabilidade\\neconômica, não possuindo condições de arcar com as custas processuais e\\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\\nDOS PEDIDOS\\n\\nDiante do exposto, requer a Vossa Excelência:\\nI- DA GRATUIDADE PROCESSUAL\\n\\nA concessão dos benefícios da gratuidade processual, com\\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 4 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nAB Issa nda SAB\\nH - DA TUTELA DE URGÊNCIA\\nA concessão de tutela de urgência para fixação de alimentos\\n\\nprovisórios em favor do menor RAVI, no valor correspondente a:\\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\\n\\ncomprove vínculo empregatício formal; ou\\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\\n\\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\\n\\nrequerido.\\nHI - DO MÉRITO\\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\\nem valor adequado, considerando as necessidades do alimentando e as\\npossibilidades do alimentante;\\nb) A regulamentação das visitas paternas, considerando a tenra idade do\\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\\nampliação conforme desenvolvimento da criança;\\nc) A condenação do requerido ao pagamento das custas processuais e\\nhonorários advocatícios;\\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\\nforma e prazo legais;\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 5 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\ne) A intimação do representante do Ministério Público para que atue no feito\\nnos termos do art. 178, II do CPC;\\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\\ndepósito em conta corrente a ser informada pela genitora;\\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\\nconta corrente /poupança para recebimento dos depósitos concernente aos\\nalimentos.\\nDA URGÊNCIA\\n\\nA tutela de urgência se justifica pela extrema necessidade da\\ncriança recém-nascida, que demanda cuidados especiais, alimentação\\nadequada, fraldas, medicamentos e demais itens essenciais à sua\\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\\npode causar danos irreparáveis ao menor.\\n\\nDO VALOR DA CAUSA\\n\\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\\n\\nProtesta provar todo o alegado por todos os meios de prova\\nadmitidos no direito, em especial prova documental, testemunhal e\\ndepoimentos pessoais.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 6 ---\\nagi\\n2 N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR\\nTermos em que,\\nPede deferimento.\\nSalto, data da assinatura digital.\\nENIO INÁCIO NACCI JUNIOR\\nOAB/SP: 390.565\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(dadv.oabsp.org.br\\n", "success": true, "tamanho": 606878, "nome_arquivo": "00 - Inicial alimentos.pdf", "tipo_arquivo": "pdf"}	\N	t		\N	16
130	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-06 00:50:23.018308+00	\N			/api/documentos/ocr/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"texto": "--- Página 1 ---\\nagi\\n2, N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nMERITÍSSIMO JUÍZO DE DIREITO DE UMA DAS VARAS JUDICIAIS DA\\nCOMARCA DE SALTO ESTADO DE SÃO PAULO\\n\\nRAVI LUCCA CARVALHO SANTOS, menor impúbere, representado\\npor sua genitora, AMANDA SANTOS, brasileira, solteira, desempregada,\\nportadora do RG nº 542862852 SSP/SP e inscrita no CPF sob o nº\\n468.158.908-05, ambos residentes e domiciliados na Rua Joviniano Souza\\nFreire, nº 211 - Apto 13 - Bloco 08 - Jd. Santa Lúcia - Salto - SP - Cep:\\n13321-518, por intermédio de seu advogado nomeado que esta subscreve,\\ncom escritório na Av. Dom Pedro II, 101 -Centro - Salto - SP - Cep: 13320-\\n240, onde recebe intimações, e endereço eletrônico\\nenio.nacci(vyadv.oabsp.org.br, vem respeitosamente à presença de Vossa\\nExcelência propor\\nAÇÃO DE ALIMENTOS CUMULADA COM REGULAMENTAÇÃO DE VISITAS\\nem face de ANDERSON CARVALHO PEREIRA, brasileiro, solteiro, podendo\\nser encontrado na FUPRESA - Rod. Eng. Ermênio de Oliveira Penteado, km\\n47,6 - Caldeira - Indaiatuba - SP - Cep: 13347-600, pelos fundamentos de\\nfato e de direito a seguir expostos:\\nDOS FATOS\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 2 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nà | DEFENSORIA PÚBLICA\\nepi AR,\\n\\nA requerente e o requerido se conheceram em 2013, desenvolvendo\\ninicialmente uma relação de amizade que posteriormente evoluiu para um\\nrelacionamento amoroso. O casal manteve união estável por\\naproximadamente 12 anos, tendo se separado em fevereiro de 2025.\\n\\nApós a separação, a requerente descobriu estar grávida, fruto do\\nrelacionamento mantido com o requerido. Em 15 de agosto de 2025, nasceu\\nRAVI LUCCA CARVALHO SANTOS, filho de ambos, conforme certidão de\\nnascimento anexa.\\n\\nO menor encontra-se sob os cuidados exclusivos da genitora desde\\no nascimento, sendo que o genitor não tem prestado qualquer auxílio\\nfinanceiro para o sustento da criança, que conta atualmente com poucos\\ndias de vida.\\n\\nConsiderando a tenra idade do recém-nascido e a necessidade de\\nestabelecimento de vínculo afetivo gradual com o genitor, bem como as\\nnecessidades alimentares urgentes da criança, faz-se necessária a\\nintervenção do Poder Judiciário para fixação de alimentos e regulamentação\\ndas visitas paternas.\\n\\nDO DIREITO\\n\\nO direito aos alimentos encontra-se previsto no artigo 1.696 do\\nCódigo Civil, sendo dever dos pais prover o sustento dos filhos menores. O\\nartigo 227 da Constituição Federal estabelece como dever da família, da\\nsociedade e do Estado assegurar à criança o direito à vida, à saúde, à\\nalimentação, entre outros, com absoluta prioridade.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 3 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nÉ OAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\n\\nA Lei nº 11.804/2008 garante alimentos gravídicos, estendendo-se\\ntal direito após o nascimento da criança. O Estatuto da Criança e do\\nAdolescente, em seu artigo 22, estabelece o dever dos pais de sustento,\\nguarda e educação dos filhos menores.\\n\\nNo que tange ao direito de visitas, o artigo 1.589 do Código Civil\\nassegura ao pai o direito de ter o filho em sua companhia, devendo tal direito\\nser regulamentado considerando-se o melhor interesse da criança.\\nDA GRATUIDADE PROCESSUAL\\n\\nA requerente encontra-se em situação de vulnerabilidade\\neconômica, não possuindo condições de arcar com as custas processuais e\\ndemais despesas do processo sem prejuízo do próprio sustento e de seu filho\\nrecém-nascido. Conforme declaração de hipossuficiência econômica anexa, a\\nrequerente faz jus aos benefícios da gratuidade processual, nos termos da\\nLei nº 1.060/50 e do artigo 98 do Código de Processo Civil.\\nDOS PEDIDOS\\n\\nDiante do exposto, requer a Vossa Excelência:\\nI- DA GRATUIDADE PROCESSUAL\\n\\nA concessão dos benefícios da gratuidade processual, com\\ndispensa do pagamento de custas, taxas e demais despesas processuais, nos\\ntermos da Lei nº 1.060/50 e artigo 98 do CPC.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\n\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 4 ---\\nÓ\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\nAB Issa nda SAB\\nH - DA TUTELA DE URGÊNCIA\\nA concessão de tutela de urgência para fixação de alimentos\\n\\nprovisórios em favor do menor RAVI, no valor correspondente a:\\ne 30% (trinta por cento) dos rendimentos líquidos do requerido, caso\\n\\ncomprove vínculo empregatício formal; ou\\ne 50% (cinquenta por cento) do salário mínimo nacional vigente (atualmente\\n\\nR$ 1.518,00), na hipótese de desemprego ou trabalho informal do\\n\\nrequerido.\\nHI - DO MÉRITO\\na) A procedência da ação para confirmar os alimentos provisórios ou fixá-los\\nem valor adequado, considerando as necessidades do alimentando e as\\npossibilidades do alimentante;\\nb) A regulamentação das visitas paternas, considerando a tenra idade do\\nrecém-nascido, inicialmente com visitas supervisionadas e gradual\\nampliação conforme desenvolvimento da criança;\\nc) A condenação do requerido ao pagamento das custas processuais e\\nhonorários advocatícios;\\nd) A citação do Réu para, querendo, oferecer resposta à presente ação, na\\nforma e prazo legais;\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 5 ---\\nSI N A C C | DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR,\\ne) A intimação do representante do Ministério Público para que atue no feito\\nnos termos do art. 178, II do CPC;\\nf) A expedição de ofício à empregadora do Requerido (FUPRESA) para que\\nproceda o desconto dos alimentos devidos em folha de pagamento e efetue o\\ndepósito em conta corrente a ser informada pela genitora;\\ng) A expedição de ofício ao Banco do Brasil, para que proceda a abertura de\\nconta corrente /poupança para recebimento dos depósitos concernente aos\\nalimentos.\\nDA URGÊNCIA\\n\\nA tutela de urgência se justifica pela extrema necessidade da\\ncriança recém-nascida, que demanda cuidados especiais, alimentação\\nadequada, fraldas, medicamentos e demais itens essenciais à sua\\nsobrevivência e desenvolvimento sadio. A demora na prestação jurisdicional\\npode causar danos irreparáveis ao menor.\\n\\nDO VALOR DA CAUSA\\n\\nAtribui-se à causa o valor de R$ 9.108,00 (nove mil cento e oito\\nreais), correspondente a 12 parcelas dos alimentos pleiteados.\\n\\nProtesta provar todo o alegado por todos os meios de prova\\nadmitidos no direito, em especial prova documental, testemunhal e\\ndepoimentos pessoais.\\n\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(yadv.oabsp.org.br\\n\\n\\n--- Página 6 ---\\nagi\\n2 N A C C l DR. ENIO INACIO NACCI JR.\\nOAB/SP nº: 390.565\\nAdvocacia & Assessoria Jurídica\\naan AR\\nTermos em que,\\nPede deferimento.\\nSalto, data da assinatura digital.\\nENIO INÁCIO NACCI JUNIOR\\nOAB/SP: 390.565\\nAv. Dom Pedro II, 101 — Centro — Salto — SP, CEP: 13320-240\\nWhatsApp: (11) 98858-7046\\nemail: enio.nacci(dadv.oabsp.org.br\\n", "success": true, "tamanho": 606878, "nome_arquivo": "00 - Inicial alimentos.pdf", "tipo_arquivo": "pdf"}	\N	t		\N	16
133	Enio	9	Nacci Advocacia	CREATE	criou Documentos	2025-10-06 01:09:09.958074+00	\N			/api/documentos/salvar-ocr/	POST	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	\N	{"titulo": "Documento Escaneado - 06/10/2025 01:09", "message": "Documento salvo com sucesso", "success": true, "documento_id": 7}	\N	t		\N	16
\.


--
-- Data for Name: escritorios_auditlogretencao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_auditlogretencao (id, dias_retencao, habilitar_log_leitura, habilitar_exportacao_automatica, escritorio_id) FROM stdin;
\.


--
-- Data for Name: escritorios_convite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_convite (id, email, token, status, created_at, escritorio_id, sender_id) FROM stdin;
8	adrianavillarhorta@gmail.com	666e390d-1aac-451f-97bb-1bea49291d4b	accepted	2025-10-04 17:57:13.411709+00	9	16
9	adrianavillarhorta@gmail.com	696bcb70-f48a-469f-9fb3-a8433b79cf73	accepted	2025-10-04 18:15:40.597702+00	9	16
10	adrianavillarhorta@gmail.com	119936bd-b7a8-4169-a135-d79d559178b9	accepted	2025-10-04 18:29:06.964431+00	9	16
11	adrianavillarhorta@gmail.com	3f431638-c344-45d5-8591-4c6f7e08d893	accepted	2025-10-04 18:35:08.142384+00	9	16
\.


--
-- Data for Name: escritorios_escritorio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_escritorio (id, nome, data_criacao, data_expiracao_teste, status_assinatura, openai_api_key, bairro, cep, cidade, complemento, estado, logo, logradouro, numero) FROM stdin;
2	Profissionais os Melhores	2025-10-02 15:53:13.59091+00	2026-01-30 15:53:13.58991+00	trial	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	Escritório Padrão	2025-10-02 13:39:50.13419+00	\N	trial	gAAAAABo4S3ySdEna4y1N3P6DV9E1_-B6CCnqWkVgmEx3RHBFDI0gfnWdeL1LrR_mAAGs0E1n7PE8Zl3gEFgn8zHmrxsLfyJGV28rz_XYHpzqWUNa1CfdQsmJU8MitRQrK8KAqg-x3f6_MQAOKxwhA5SeOlSaF958eCozKI4Um3Q77U6f9meWAKYlJ_rbPzsRWUl8ooGhsSD9yqgh2ptGEcKvcnHLl3Eqx0sjRU4j5c6chwRPDZoyimk9Z8C7yMR0-ZXtjJWLp0wvEtYYZEUI2GfGRkV1zzUC9LpqQGit-6Rv8QcS8e8JcM=						logos/LOGO_2.png		
3	Escritório do Guilherme	2025-10-04 15:35:09.224275+00	2026-02-01 15:35:09.224275+00	trial	\N	\N	\N	\N	\N	\N		\N	\N
4	Escritório do Guilherme	2025-10-04 15:35:22.118105+00	2026-02-01 15:35:22.118105+00	trial	\N	\N	\N	\N	\N	\N		\N	\N
5	Escritório do Guilherme	2025-10-04 15:38:25.333791+00	2026-02-01 15:38:25.333791+00	trial	\N	\N	\N	\N	\N	\N		\N	\N
6	Escritório do Guilherme	2025-10-04 15:42:53.221441+00	2026-02-01 15:42:53.221441+00	trial	\N	\N	\N	\N	\N	\N		\N	\N
7	Autônomo	2025-10-04 15:47:29.336368+00	2026-02-01 15:47:29.336368+00	trial	gAAAAABo4UnncFLJReBPJozBsbMp6YeCO85yeYAxT-Z_TB6aCnFBrsipRgeLPmCsOqiOpfI_umiYrEEEtMHx1WzTJSzMGiG_TgPSddxH9XQf-N4K4lKD5u-DkABfYZjR3y4aak-yqnfFk8rubwu67VRhQlKn5nroa1gvXGHTf5NqP_pvK3fCAkz7a4DYJN531nUOVLu0ei17LJa8zZ1wc-ds9fijppcQ9Lbj30h5coF9sW8SILkYNzqcDsDWOgcS99_ECukJJmW7LcMA-251SPROFVUxdCcB8_3KZJq7_q2R05DxgGULlzo=						logos/LOGO_2_SmMVusl.png		
8	Autônomo	2025-10-04 17:07:03.318158+00	2026-02-01 17:07:03.318158+00	trial	\N	\N	\N	\N	\N	\N		\N	\N
9	Nacci Advocacia	2025-10-04 17:30:04.217657+00	2026-02-01 17:30:04.217657+00	trial	gAAAAABo4VnLrXu7cWYfViJARNraNeaoJnHkMM02WSR6wd4HjL8lFq1j5iIEXvpqcb6Dq3KD267Qylv49wbgLd89peRHxsuBGK1-UMePDrGqtkc9PcABYjM7uF1SnxrE-rm_lXavccSXSE6ROebZwAuZXxYEcxs8yn5HouHhhcVC0LWCuenDZOBS9dAeZ45z8XzLayst1IKXLj7BRaQH-oPLRxTbs-_kq_NQO3D-KQvLwORSYlLfDCs_JfKpRMFlTLJggxW6JNoZkfnaARosiOWUTIVBucl8pGQX2-IwTy0V8U53Q6ZrXFs=						logos/LOGO_2_usajlpk.png		
\.


--
-- Data for Name: escritorios_papel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_papel (id, nome, escritorio_id) FROM stdin;
1	Administrador	6
2	Membro	6
3	Administrador	7
4	Membro	7
5	Administrador	8
6	Membro	8
8	Membro	9
9	Secretária	9
7	Administrador	9
\.


--
-- Data for Name: escritorios_papel_permissoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_papel_permissoes (id, papel_id, permissao_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	2	1
15	2	2
16	2	3
17	2	5
18	2	6
19	2	8
20	2	9
21	3	1
22	3	2
23	3	3
24	3	4
25	3	5
26	3	6
27	3	7
28	3	8
29	3	9
30	3	10
31	3	11
32	3	12
33	3	13
34	4	1
35	4	2
36	4	3
37	4	5
38	4	6
39	4	8
40	4	9
41	5	1
42	5	2
43	5	3
44	5	4
45	5	5
46	5	6
47	5	7
48	5	8
49	5	9
50	5	10
51	5	11
52	5	12
53	5	13
54	6	1
55	6	2
56	6	3
57	6	5
58	6	6
59	6	8
60	6	9
61	7	1
62	7	2
63	7	3
64	7	4
65	7	5
66	7	6
67	7	7
68	7	8
69	7	9
70	7	10
71	7	11
72	7	12
73	7	13
74	8	1
75	8	2
76	8	3
77	8	5
78	8	6
79	8	8
80	8	9
82	9	1
83	9	2
84	9	3
85	7	26
86	1	28
87	1	30
88	1	31
89	1	29
90	1	32
91	1	33
92	1	27
93	3	28
94	3	30
95	3	31
96	3	29
97	3	32
98	3	33
99	3	27
100	5	28
101	5	30
102	5	31
103	5	29
104	5	32
105	5	33
106	5	27
107	9	28
108	9	31
109	9	29
110	9	27
111	7	28
112	7	30
113	7	31
114	7	29
115	7	32
116	7	33
117	7	27
118	7	34
119	7	35
120	7	36
121	7	37
122	7	38
\.


--
-- Data for Name: escritorios_perfilusuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_perfilusuario (id, escritorio_id, user_id) FROM stdin;
18	9	16
22	9	20
\.


--
-- Data for Name: escritorios_perfilusuario_papeis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_perfilusuario_papeis (id, perfilusuario_id, papel_id) FROM stdin;
4	18	7
9	22	9
\.


--
-- Data for Name: escritorios_permissao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.escritorios_permissao (id, nome, codename) FROM stdin;
1	Ver Cliente	ver_cliente
2	Criar Cliente	criar_cliente
3	Editar Cliente	editar_cliente
4	Deletar Cliente	deletar_cliente
5	Ver Consulta	ver_consulta
6	Criar Consulta	criar_consulta
7	Deletar Consulta	deletar_consulta
8	Ver Análise	ver_analise
9	Criar Análise	criar_analise
10	Deletar Análise	deletar_analise
12	Gerenciar Membros	gerenciar_membros
14	Exportar Clientes	exportar_clientes
15	Editar Consulta	editar_consulta
16	Editar Análise	editar_analise
13	Gerenciar Papéis	gerenciar_papeis
11	Gerenciar Escritório	gerenciar_escritorio
17	Ver Relatórios	ver_relatorios
18	Ver Financeiro	ver_financeiro
19	Criar Lançamento	criar_lancamento
20	Editar Lançamento	editar_lancamento
21	Deletar Lançamento	deletar_lancamento
22	Ver Processo	ver_processo
23	Criar Processo	criar_processo
24	Editar Processo	editar_processo
25	Deletar Processo	deletar_processo
26	Ver Auditoria	ver_auditoria
27	Ver Documento	ver_documento
28	Criar Documento	criar_documento
29	Editar Documento	editar_documento
30	Deletar Documento	deletar_documento
31	Download de Documento	download_documento
32	Gerenciar Categorias	gerenciar_categorias
33	Gerenciar Tags	gerenciar_tags
34	Escanear Documento	escanear_documento
35	Solicitar Análise IA	solicitar_analise_ia
36	Ver Análise IA	ver_analise_ia
37	Editar Análise IA	editar_analise_ia
38	Deletar Análise IA	deletar_analise_ia
\.


--
-- Name: analises_analiseia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analises_analiseia_id_seq', 4, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 80, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 20, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: clientes_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_cliente_id_seq', 18, true);


--
-- Name: consultas_consulta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultas_consulta_id_seq', 20, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 20, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 39, true);


--
-- Name: documentos_categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_categoria_id_seq', 90, true);


--
-- Name: documentos_documento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_documento_id_seq', 7, true);


--
-- Name: documentos_documento_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_documento_tags_id_seq', 3, true);


--
-- Name: documentos_documentoanaliseia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_documentoanaliseia_id_seq', 3, true);


--
-- Name: documentos_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_tag_id_seq', 90, true);


--
-- Name: escritorios_auditlog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_auditlog_id_seq', 133, true);


--
-- Name: escritorios_auditlogretencao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_auditlogretencao_id_seq', 1, false);


--
-- Name: escritorios_convite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_convite_id_seq', 11, true);


--
-- Name: escritorios_escritorio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_escritorio_id_seq', 9, true);


--
-- Name: escritorios_papel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_papel_id_seq', 9, true);


--
-- Name: escritorios_papel_permissoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_papel_permissoes_id_seq', 122, true);


--
-- Name: escritorios_perfilusuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_perfilusuario_id_seq', 22, true);


--
-- Name: escritorios_perfilusuario_papeis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_perfilusuario_papeis_id_seq', 9, true);


--
-- Name: escritorios_permissao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.escritorios_permissao_id_seq', 38, true);


--
-- Name: analises_analiseia analises_analiseia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analises_analiseia
    ADD CONSTRAINT analises_analiseia_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: clientes_cliente clientes_cliente_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_cliente
    ADD CONSTRAINT clientes_cliente_cnpj_key UNIQUE (cnpj);


--
-- Name: clientes_cliente clientes_cliente_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_cliente
    ADD CONSTRAINT clientes_cliente_cpf_key UNIQUE (cpf);


--
-- Name: clientes_cliente clientes_cliente_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_cliente
    ADD CONSTRAINT clientes_cliente_email_key UNIQUE (email);


--
-- Name: clientes_cliente clientes_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_cliente
    ADD CONSTRAINT clientes_cliente_pkey PRIMARY KEY (id);


--
-- Name: consultas_consulta consultas_consulta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas_consulta
    ADD CONSTRAINT consultas_consulta_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: documentos_categoria documentos_categoria_escritorio_id_nome_89ac7bd9_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_categoria
    ADD CONSTRAINT documentos_categoria_escritorio_id_nome_89ac7bd9_uniq UNIQUE (escritorio_id, nome);


--
-- Name: documentos_categoria documentos_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_categoria
    ADD CONSTRAINT documentos_categoria_pkey PRIMARY KEY (id);


--
-- Name: documentos_documento documentos_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento
    ADD CONSTRAINT documentos_documento_pkey PRIMARY KEY (id);


--
-- Name: documentos_documento_tags documentos_documento_tags_documento_id_tag_id_3c1224b1_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento_tags
    ADD CONSTRAINT documentos_documento_tags_documento_id_tag_id_3c1224b1_uniq UNIQUE (documento_id, tag_id);


--
-- Name: documentos_documento_tags documentos_documento_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento_tags
    ADD CONSTRAINT documentos_documento_tags_pkey PRIMARY KEY (id);


--
-- Name: documentos_documentoanaliseia documentos_documentoanaliseia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documentoanaliseia
    ADD CONSTRAINT documentos_documentoanaliseia_pkey PRIMARY KEY (id);


--
-- Name: documentos_tag documentos_tag_escritorio_id_nome_208a3242_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_tag
    ADD CONSTRAINT documentos_tag_escritorio_id_nome_208a3242_uniq UNIQUE (escritorio_id, nome);


--
-- Name: documentos_tag documentos_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_tag
    ADD CONSTRAINT documentos_tag_pkey PRIMARY KEY (id);


--
-- Name: escritorios_auditlog escritorios_auditlog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_auditlog
    ADD CONSTRAINT escritorios_auditlog_pkey PRIMARY KEY (id);


--
-- Name: escritorios_auditlogretencao escritorios_auditlogretencao_escritorio_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_auditlogretencao
    ADD CONSTRAINT escritorios_auditlogretencao_escritorio_id_key UNIQUE (escritorio_id);


--
-- Name: escritorios_auditlogretencao escritorios_auditlogretencao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_auditlogretencao
    ADD CONSTRAINT escritorios_auditlogretencao_pkey PRIMARY KEY (id);


--
-- Name: escritorios_convite escritorios_convite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_convite
    ADD CONSTRAINT escritorios_convite_pkey PRIMARY KEY (id);


--
-- Name: escritorios_convite escritorios_convite_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_convite
    ADD CONSTRAINT escritorios_convite_token_key UNIQUE (token);


--
-- Name: escritorios_escritorio escritorios_escritorio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_escritorio
    ADD CONSTRAINT escritorios_escritorio_pkey PRIMARY KEY (id);


--
-- Name: escritorios_papel escritorios_papel_nome_escritorio_id_95f51f95_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel
    ADD CONSTRAINT escritorios_papel_nome_escritorio_id_95f51f95_uniq UNIQUE (nome, escritorio_id);


--
-- Name: escritorios_papel_permissoes escritorios_papel_permis_papel_id_permissao_id_76762e9d_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel_permissoes
    ADD CONSTRAINT escritorios_papel_permis_papel_id_permissao_id_76762e9d_uniq UNIQUE (papel_id, permissao_id);


--
-- Name: escritorios_papel_permissoes escritorios_papel_permissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel_permissoes
    ADD CONSTRAINT escritorios_papel_permissoes_pkey PRIMARY KEY (id);


--
-- Name: escritorios_papel escritorios_papel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel
    ADD CONSTRAINT escritorios_papel_pkey PRIMARY KEY (id);


--
-- Name: escritorios_perfilusuario_papeis escritorios_perfilusuari_perfilusuario_id_papel_i_f9ff9b6e_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario_papeis
    ADD CONSTRAINT escritorios_perfilusuari_perfilusuario_id_papel_i_f9ff9b6e_uniq UNIQUE (perfilusuario_id, papel_id);


--
-- Name: escritorios_perfilusuario_papeis escritorios_perfilusuario_papeis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario_papeis
    ADD CONSTRAINT escritorios_perfilusuario_papeis_pkey PRIMARY KEY (id);


--
-- Name: escritorios_perfilusuario escritorios_perfilusuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario
    ADD CONSTRAINT escritorios_perfilusuario_pkey PRIMARY KEY (id);


--
-- Name: escritorios_perfilusuario escritorios_perfilusuario_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario
    ADD CONSTRAINT escritorios_perfilusuario_user_id_key UNIQUE (user_id);


--
-- Name: escritorios_permissao escritorios_permissao_codename_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_permissao
    ADD CONSTRAINT escritorios_permissao_codename_key UNIQUE (codename);


--
-- Name: escritorios_permissao escritorios_permissao_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_permissao
    ADD CONSTRAINT escritorios_permissao_nome_key UNIQUE (nome);


--
-- Name: escritorios_permissao escritorios_permissao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_permissao
    ADD CONSTRAINT escritorios_permissao_pkey PRIMARY KEY (id);


--
-- Name: analises_analiseia_consulta_id_44b019bb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX analises_analiseia_consulta_id_44b019bb ON public.analises_analiseia USING btree (consulta_id);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: clientes_cliente_cnpj_990e86fe_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clientes_cliente_cnpj_990e86fe_like ON public.clientes_cliente USING btree (cnpj varchar_pattern_ops);


--
-- Name: clientes_cliente_cpf_7ee8eeb9_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clientes_cliente_cpf_7ee8eeb9_like ON public.clientes_cliente USING btree (cpf varchar_pattern_ops);


--
-- Name: clientes_cliente_email_6ec9cd8a_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clientes_cliente_email_6ec9cd8a_like ON public.clientes_cliente USING btree (email varchar_pattern_ops);


--
-- Name: clientes_cliente_escritorio_id_115fc135; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX clientes_cliente_escritorio_id_115fc135 ON public.clientes_cliente USING btree (escritorio_id);


--
-- Name: consultas_consulta_cliente_id_26891c7d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX consultas_consulta_cliente_id_26891c7d ON public.consultas_consulta USING btree (cliente_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: documentos__documen_937045_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos__documen_937045_idx ON public.documentos_documentoanaliseia USING btree (documento_id, data_solicitacao DESC);


--
-- Name: documentos__escrito_03c5eb_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos__escrito_03c5eb_idx ON public.documentos_documento USING btree (escritorio_id, categoria_id, data_upload DESC);


--
-- Name: documentos__escrito_dff850_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos__escrito_dff850_idx ON public.documentos_documento USING btree (escritorio_id, cliente_id, data_upload DESC);


--
-- Name: documentos__escrito_fe0885_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos__escrito_fe0885_idx ON public.documentos_documentoanaliseia USING btree (escritorio_id, data_solicitacao DESC);


--
-- Name: documentos__hash_md_92da4f_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos__hash_md_92da4f_idx ON public.documentos_documento USING btree (hash_md5);


--
-- Name: documentos__status_628dd8_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos__status_628dd8_idx ON public.documentos_documentoanaliseia USING btree (status);


--
-- Name: documentos_categoria_escritorio_id_3a0df945; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_categoria_escritorio_id_3a0df945 ON public.documentos_categoria USING btree (escritorio_id);


--
-- Name: documentos_documento_categoria_id_a460575a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_categoria_id_a460575a ON public.documentos_documento USING btree (categoria_id);


--
-- Name: documentos_documento_cliente_id_085ac5be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_cliente_id_085ac5be ON public.documentos_documento USING btree (cliente_id);


--
-- Name: documentos_documento_documento_pai_id_01b7848f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_documento_pai_id_01b7848f ON public.documentos_documento USING btree (documento_pai_id);


--
-- Name: documentos_documento_escritorio_id_8ead4559; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_escritorio_id_8ead4559 ON public.documentos_documento USING btree (escritorio_id);


--
-- Name: documentos_documento_tags_documento_id_b651f438; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_tags_documento_id_b651f438 ON public.documentos_documento_tags USING btree (documento_id);


--
-- Name: documentos_documento_tags_tag_id_b05a07ed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_tags_tag_id_b05a07ed ON public.documentos_documento_tags USING btree (tag_id);


--
-- Name: documentos_documento_usuario_upload_id_0c70565f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documento_usuario_upload_id_0c70565f ON public.documentos_documento USING btree (usuario_upload_id);


--
-- Name: documentos_documentoanaliseia_documento_id_7f86d302; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documentoanaliseia_documento_id_7f86d302 ON public.documentos_documentoanaliseia USING btree (documento_id);


--
-- Name: documentos_documentoanaliseia_escritorio_id_32e5ba2f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documentoanaliseia_escritorio_id_32e5ba2f ON public.documentos_documentoanaliseia USING btree (escritorio_id);


--
-- Name: documentos_documentoanaliseia_usuario_id_0bb9198f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_documentoanaliseia_usuario_id_0bb9198f ON public.documentos_documentoanaliseia USING btree (usuario_id);


--
-- Name: documentos_tag_escritorio_id_565b546d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX documentos_tag_escritorio_id_565b546d ON public.documentos_tag USING btree (escritorio_id);


--
-- Name: escritorios_acao_3832dc_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_acao_3832dc_idx ON public.escritorios_auditlog USING btree (acao, "timestamp" DESC);


--
-- Name: escritorios_auditlog_content_type_id_55746126; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_auditlog_content_type_id_55746126 ON public.escritorios_auditlog USING btree (content_type_id);


--
-- Name: escritorios_auditlog_modelo_nome_1ebaea28; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_auditlog_modelo_nome_1ebaea28 ON public.escritorios_auditlog USING btree (modelo_nome);


--
-- Name: escritorios_auditlog_modelo_nome_1ebaea28_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_auditlog_modelo_nome_1ebaea28_like ON public.escritorios_auditlog USING btree (modelo_nome varchar_pattern_ops);


--
-- Name: escritorios_auditlog_timestamp_9615e900; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_auditlog_timestamp_9615e900 ON public.escritorios_auditlog USING btree ("timestamp");


--
-- Name: escritorios_auditlog_usuario_id_91d41d48; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_auditlog_usuario_id_91d41d48 ON public.escritorios_auditlog USING btree (usuario_id);


--
-- Name: escritorios_convite_escritorio_id_fdeadcca; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_convite_escritorio_id_fdeadcca ON public.escritorios_convite USING btree (escritorio_id);


--
-- Name: escritorios_convite_sender_id_31c674f2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_convite_sender_id_31c674f2 ON public.escritorios_convite USING btree (sender_id);


--
-- Name: escritorios_modelo__c7bc0b_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_modelo__c7bc0b_idx ON public.escritorios_auditlog USING btree (modelo_nome, "timestamp" DESC);


--
-- Name: escritorios_papel_escritorio_id_3701344c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_papel_escritorio_id_3701344c ON public.escritorios_papel USING btree (escritorio_id);


--
-- Name: escritorios_papel_permissoes_papel_id_272c1a21; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_papel_permissoes_papel_id_272c1a21 ON public.escritorios_papel_permissoes USING btree (papel_id);


--
-- Name: escritorios_papel_permissoes_permissao_id_6d8b95cb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_papel_permissoes_permissao_id_6d8b95cb ON public.escritorios_papel_permissoes USING btree (permissao_id);


--
-- Name: escritorios_perfilusuario_escritorio_id_6a37e7b1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_perfilusuario_escritorio_id_6a37e7b1 ON public.escritorios_perfilusuario USING btree (escritorio_id);


--
-- Name: escritorios_perfilusuario_papeis_papel_id_d35bb128; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_perfilusuario_papeis_papel_id_d35bb128 ON public.escritorios_perfilusuario_papeis USING btree (papel_id);


--
-- Name: escritorios_perfilusuario_papeis_perfilusuario_id_22734229; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_perfilusuario_papeis_perfilusuario_id_22734229 ON public.escritorios_perfilusuario_papeis USING btree (perfilusuario_id);


--
-- Name: escritorios_permissao_codename_c78bf81e_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_permissao_codename_c78bf81e_like ON public.escritorios_permissao USING btree (codename varchar_pattern_ops);


--
-- Name: escritorios_permissao_nome_54333de3_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_permissao_nome_54333de3_like ON public.escritorios_permissao USING btree (nome varchar_pattern_ops);


--
-- Name: escritorios_timesta_178dea_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_timesta_178dea_idx ON public.escritorios_auditlog USING btree ("timestamp" DESC, escritorio_id);


--
-- Name: escritorios_usuario_ae6625_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX escritorios_usuario_ae6625_idx ON public.escritorios_auditlog USING btree (usuario_id, "timestamp" DESC);


--
-- Name: analises_analiseia analises_analiseia_consulta_id_44b019bb_fk_consultas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analises_analiseia
    ADD CONSTRAINT analises_analiseia_consulta_id_44b019bb_fk_consultas FOREIGN KEY (consulta_id) REFERENCES public.consultas_consulta(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: clientes_cliente clientes_cliente_escritorio_id_115fc135_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes_cliente
    ADD CONSTRAINT clientes_cliente_escritorio_id_115fc135_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: consultas_consulta consultas_consulta_cliente_id_26891c7d_fk_clientes_cliente_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas_consulta
    ADD CONSTRAINT consultas_consulta_cliente_id_26891c7d_fk_clientes_cliente_id FOREIGN KEY (cliente_id) REFERENCES public.clientes_cliente(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_categoria documentos_categoria_escritorio_id_3a0df945_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_categoria
    ADD CONSTRAINT documentos_categoria_escritorio_id_3a0df945_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento documentos_documento_categoria_id_a460575a_fk_documento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento
    ADD CONSTRAINT documentos_documento_categoria_id_a460575a_fk_documento FOREIGN KEY (categoria_id) REFERENCES public.documentos_categoria(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento documentos_documento_cliente_id_085ac5be_fk_clientes_cliente_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento
    ADD CONSTRAINT documentos_documento_cliente_id_085ac5be_fk_clientes_cliente_id FOREIGN KEY (cliente_id) REFERENCES public.clientes_cliente(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documentoanaliseia documentos_documento_documento_id_7f86d302_fk_documento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documentoanaliseia
    ADD CONSTRAINT documentos_documento_documento_id_7f86d302_fk_documento FOREIGN KEY (documento_id) REFERENCES public.documentos_documento(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento_tags documentos_documento_documento_id_b651f438_fk_documento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento_tags
    ADD CONSTRAINT documentos_documento_documento_id_b651f438_fk_documento FOREIGN KEY (documento_id) REFERENCES public.documentos_documento(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento documentos_documento_documento_pai_id_01b7848f_fk_documento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento
    ADD CONSTRAINT documentos_documento_documento_pai_id_01b7848f_fk_documento FOREIGN KEY (documento_pai_id) REFERENCES public.documentos_documento(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documentoanaliseia documentos_documento_escritorio_id_32e5ba2f_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documentoanaliseia
    ADD CONSTRAINT documentos_documento_escritorio_id_32e5ba2f_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento documentos_documento_escritorio_id_8ead4559_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento
    ADD CONSTRAINT documentos_documento_escritorio_id_8ead4559_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento_tags documentos_documento_tags_tag_id_b05a07ed_fk_documentos_tag_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento_tags
    ADD CONSTRAINT documentos_documento_tags_tag_id_b05a07ed_fk_documentos_tag_id FOREIGN KEY (tag_id) REFERENCES public.documentos_tag(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documentoanaliseia documentos_documento_usuario_id_0bb9198f_fk_auth_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documentoanaliseia
    ADD CONSTRAINT documentos_documento_usuario_id_0bb9198f_fk_auth_user FOREIGN KEY (usuario_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_documento documentos_documento_usuario_upload_id_0c70565f_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_documento
    ADD CONSTRAINT documentos_documento_usuario_upload_id_0c70565f_fk_auth_user_id FOREIGN KEY (usuario_upload_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: documentos_tag documentos_tag_escritorio_id_565b546d_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_tag
    ADD CONSTRAINT documentos_tag_escritorio_id_565b546d_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_auditlog escritorios_auditlog_content_type_id_55746126_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_auditlog
    ADD CONSTRAINT escritorios_auditlog_content_type_id_55746126_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_auditlogretencao escritorios_auditlog_escritorio_id_6ae0da0a_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_auditlogretencao
    ADD CONSTRAINT escritorios_auditlog_escritorio_id_6ae0da0a_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_auditlog escritorios_auditlog_usuario_id_91d41d48_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_auditlog
    ADD CONSTRAINT escritorios_auditlog_usuario_id_91d41d48_fk_auth_user_id FOREIGN KEY (usuario_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_convite escritorios_convite_escritorio_id_fdeadcca_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_convite
    ADD CONSTRAINT escritorios_convite_escritorio_id_fdeadcca_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_convite escritorios_convite_sender_id_31c674f2_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_convite
    ADD CONSTRAINT escritorios_convite_sender_id_31c674f2_fk_auth_user_id FOREIGN KEY (sender_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_papel escritorios_papel_escritorio_id_3701344c_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel
    ADD CONSTRAINT escritorios_papel_escritorio_id_3701344c_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_papel_permissoes escritorios_papel_pe_papel_id_272c1a21_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel_permissoes
    ADD CONSTRAINT escritorios_papel_pe_papel_id_272c1a21_fk_escritori FOREIGN KEY (papel_id) REFERENCES public.escritorios_papel(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_papel_permissoes escritorios_papel_pe_permissao_id_6d8b95cb_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_papel_permissoes
    ADD CONSTRAINT escritorios_papel_pe_permissao_id_6d8b95cb_fk_escritori FOREIGN KEY (permissao_id) REFERENCES public.escritorios_permissao(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_perfilusuario escritorios_perfilus_escritorio_id_6a37e7b1_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario
    ADD CONSTRAINT escritorios_perfilus_escritorio_id_6a37e7b1_fk_escritori FOREIGN KEY (escritorio_id) REFERENCES public.escritorios_escritorio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_perfilusuario_papeis escritorios_perfilus_papel_id_d35bb128_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario_papeis
    ADD CONSTRAINT escritorios_perfilus_papel_id_d35bb128_fk_escritori FOREIGN KEY (papel_id) REFERENCES public.escritorios_papel(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_perfilusuario_papeis escritorios_perfilus_perfilusuario_id_22734229_fk_escritori; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario_papeis
    ADD CONSTRAINT escritorios_perfilus_perfilusuario_id_22734229_fk_escritori FOREIGN KEY (perfilusuario_id) REFERENCES public.escritorios_perfilusuario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: escritorios_perfilusuario escritorios_perfilusuario_user_id_214259f4_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.escritorios_perfilusuario
    ADD CONSTRAINT escritorios_perfilusuario_user_id_214259f4_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

