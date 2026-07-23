import { pgTable, text, timestamp, uuid, jsonb, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

export const roles = pgEnum("role", ["admin", "legal", "finance", "viewer"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: roles("role").default("viewer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: roles("role").default("viewer"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const contractStatus = pgEnum("contract_status", [
  "draft",
  "pending_approval",
  "approved",
  "sent",
  "signed",
  "executed",
  "void",
  "on_hold",
]);

export const contractKind = pgEnum("contract_kind", [
  "new",
  "renewal",
  "amendment",
  "termination",
]);

export const contracts = pgTable("contracts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: contractStatus("status").default("draft").notNull(),
  kind: contractKind("kind").default("new"),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  createdById: uuid("created_by_id").notNull().references(() => users.id),
  counterpartyId: uuid("counterparty_id"),
  contractTypeId: uuid("contract_type_id"),
  templateId: uuid("template_id"),
  content: text("content"),
  metadata: jsonb("metadata"),
  tags: text("tags").array(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  value: text("value"),
  currency: text("currency").default("USD"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const counterparties = pgTable("counterparties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: jsonb("address"),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contractVersions = pgTable("contract_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  versionNumber: integer("version_number").notNull(),
  content: text("content"),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contractApprovals = pgTable("contract_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  approverId: uuid("approver_id").notNull().references(() => users.id),
  status: text("status").default("pending").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workflowStatus = pgEnum("workflow_status", ["active", "inactive", "draft"]);

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: workflowStatus("status").default("draft"),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  createdById: uuid("created_by_id").references(() => users.id),
  steps: jsonb("steps"),
  conditions: jsonb("conditions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content"),
  category: text("category"),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  createdById: uuid("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const obligations = pgTable("obligations", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  title: text("title").notNull(),
  description: text("description"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").references(() => contracts.id),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  userId: uuid("user_id").references(() => users.id),
  authorName: text("author_name").notNull(),
  text: text("text").notNull(),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emails = pgTable("emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractId: uuid("contract_id").notNull().references(() => contracts.id),
  fromEmail: text("from_email").notNull(),
  subject: text("subject").notNull(),
  preview: text("preview"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});
