

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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."increment_view_count"("post_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$;


ALTER FUNCTION "public"."increment_view_count"("post_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- auth.uid()가 null인 경우 false 반환
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE auth_user_id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_post_category"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- 게시글의 post_type과 카테고리의 post_type이 일치하는지 확인
  IF NEW.category_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM categories 
      WHERE id = NEW.category_id 
      AND post_type = NEW.post_type
    ) THEN
      RAISE EXCEPTION 'Category post_type must match post post_type';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_post_category"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_admin_password"("admin_login_id" "text", "admin_password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admins 
    WHERE login_id = admin_login_id 
      AND password = MD5(admin_password)
  );
END;
$$;


ALTER FUNCTION "public"."verify_admin_password"("admin_login_id" "text", "admin_password" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admins" (
    "id" integer NOT NULL,
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "auth_user_id" "uuid",
    "email" "text"
);


ALTER TABLE "public"."admins" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."admins_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."admins_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."admins_id_seq" OWNED BY "public"."admins"."id";



CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "post_type" "text" NOT NULL,
    "description" "text",
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "categories_post_type_check" CHECK (("post_type" = ANY (ARRAY['insights'::"text", 'events'::"text", 'testimonials'::"text"])))
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."partners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "image_url" "text",
    "is_active" boolean DEFAULT true,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."partners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "excerpt" "text",
    "image_url" "text",
    "post_type" "text" NOT NULL,
    "category_id" "uuid",
    "tags" "text"[],
    "date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "client_name" "text",
    "client_company" "text",
    "client_position" "text",
    "rating" integer,
    "status" "text" DEFAULT 'published'::"text",
    "views" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "posts_post_type_check" CHECK (("post_type" = ANY (ARRAY['insights'::"text", 'events'::"text", 'testimonials'::"text"]))),
    CONSTRAINT "posts_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "posts_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"])))
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_name" "text" NOT NULL,
    "company_type" "text" NOT NULL,
    "contact_person" "text" NOT NULL,
    "position" "text",
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "service_type" "text" NOT NULL,
    "consulting_areas" "text"[],
    "current_challenges" "text",
    "desired_outcomes" "text",
    "message" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "processed_by" "uuid",
    "processed_at" timestamp with time zone,
    "admin_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "service_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'contacted'::"text", 'in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."service_requests" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admins" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."admins_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_post_type_name_key" UNIQUE ("post_type", "name");



ALTER TABLE ONLY "public"."partners"
    ADD CONSTRAINT "partners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_requests"
    ADD CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_admins_auth_user_id" ON "public"."admins" USING "btree" ("auth_user_id");



CREATE INDEX "idx_admins_email" ON "public"."admins" USING "btree" ("email");



CREATE INDEX "idx_categories_order" ON "public"."categories" USING "btree" ("display_order");



CREATE INDEX "idx_categories_type" ON "public"."categories" USING "btree" ("post_type");



CREATE INDEX "idx_partners_display_order" ON "public"."partners" USING "btree" ("display_order");



CREATE INDEX "idx_partners_is_active" ON "public"."partners" USING "btree" ("is_active");



CREATE INDEX "idx_posts_category" ON "public"."posts" USING "btree" ("category_id");



CREATE INDEX "idx_posts_date" ON "public"."posts" USING "btree" ("date" DESC);



CREATE INDEX "idx_posts_status" ON "public"."posts" USING "btree" ("status");



CREATE INDEX "idx_posts_tags" ON "public"."posts" USING "gin" ("tags");



CREATE INDEX "idx_posts_type" ON "public"."posts" USING "btree" ("post_type");



CREATE INDEX "idx_posts_views" ON "public"."posts" USING "btree" ("views" DESC);



CREATE INDEX "idx_service_requests_created" ON "public"."service_requests" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_service_requests_status" ON "public"."service_requests" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "update_categories_updated_at" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_partners_updated_at" BEFORE UPDATE ON "public"."partners" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_posts_updated_at" BEFORE UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_service_requests_updated_at" BEFORE UPDATE ON "public"."service_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "validate_post_category_trigger" BEFORE INSERT OR UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."validate_post_category"();



ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



CREATE POLICY "Admins can delete categories" ON "public"."categories" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can delete partners" ON "public"."partners" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can delete posts" ON "public"."posts" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can delete service requests" ON "public"."service_requests" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can insert categories" ON "public"."categories" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can insert partners" ON "public"."partners" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can insert posts" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admins"
  WHERE ("admins"."auth_user_id" = "auth"."uid"()))));



CREATE POLICY "Admins can select posts" ON "public"."posts" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can update admin users" ON "public"."admins" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can update categories" ON "public"."categories" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can update partners" ON "public"."partners" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can update posts" ON "public"."posts" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can update service requests" ON "public"."service_requests" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can view admin users" ON "public"."admins" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can view all partners" ON "public"."partners" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can view service requests" ON "public"."service_requests" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Allow anon insert for posts" ON "public"."posts" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "Allow anon insert for service requests" ON "public"."categories" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Allow anon insert for service requests" ON "public"."service_requests" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Allow read for login" ON "public"."admins" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Anyone can view active partners" ON "public"."partners" FOR SELECT USING (("is_active" = true));



ALTER TABLE "public"."admins" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."partners" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_requests" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."increment_view_count"("post_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_view_count"("post_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_view_count"("post_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_post_category"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_post_category"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_post_category"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_admin_password"("admin_login_id" "text", "admin_password" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_admin_password"("admin_login_id" "text", "admin_password" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_admin_password"("admin_login_id" "text", "admin_password" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."admins" TO "anon";
GRANT ALL ON TABLE "public"."admins" TO "authenticated";
GRANT ALL ON TABLE "public"."admins" TO "service_role";



GRANT ALL ON SEQUENCE "public"."admins_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."admins_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."admins_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."partners" TO "anon";
GRANT ALL ON TABLE "public"."partners" TO "authenticated";
GRANT ALL ON TABLE "public"."partners" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."service_requests" TO "anon";
GRANT ALL ON TABLE "public"."service_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."service_requests" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
