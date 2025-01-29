CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"counselorId" text,
	"data" jsonb DEFAULT '{"syllabus":[],"resources":[]}'::jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselor_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"counselorId" text,
	"data" jsonb DEFAULT '{"booked":[]}'::jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselors" (
	"id" text PRIMARY KEY NOT NULL,
	"fullname" text NOT NULL,
	"email" text NOT NULL,
	"hashedPassword" text NOT NULL,
	"phoneNumber" text NOT NULL,
	CONSTRAINT "counselors_email_unique" UNIQUE("email"),
	CONSTRAINT "counselors_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE "initial_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb DEFAULT '{"profile":{}}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" text PRIMARY KEY NOT NULL,
	"counselorId" text NOT NULL,
	"userId" text NOT NULL,
	"meetingDate" date,
	"data" jsonb DEFAULT '{"notes":[]}'::jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"data" jsonb DEFAULT '{"events":[]}'::jsonb,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"counselorId" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"fullname" text NOT NULL,
	"grade" integer NOT NULL,
	"email" text NOT NULL,
	"hashedPassword" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"scheduleId" text,
	"meetingId" text,
	"counselorId" text NOT NULL,
	"profileId" text,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phoneNumber_unique" UNIQUE("phoneNumber")
);
--> statement-breakpoint
CREATE TABLE "users_classes" (
	"user_id" text NOT NULL,
	"class_id" text NOT NULL,
	CONSTRAINT "users_classes_user_id_class_id_pk" PRIMARY KEY("user_id","class_id")
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_counselorId_counselors_id_fk" FOREIGN KEY ("counselorId") REFERENCES "public"."counselors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_schedules" ADD CONSTRAINT "counselor_schedules_counselorId_counselors_id_fk" FOREIGN KEY ("counselorId") REFERENCES "public"."counselors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_counselorId_counselors_id_fk" FOREIGN KEY ("counselorId") REFERENCES "public"."counselors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_schedules" ADD CONSTRAINT "user_schedules_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_schedules" ADD CONSTRAINT "user_schedules_counselorId_counselors_id_fk" FOREIGN KEY ("counselorId") REFERENCES "public"."counselors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_initial_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."initial_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_classes" ADD CONSTRAINT "users_classes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_classes" ADD CONSTRAINT "users_classes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;