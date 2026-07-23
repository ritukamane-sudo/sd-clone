import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  users,
  organizations,
  organizationMembers,
  contracts,
  counterparties,
  contractVersions,
  contractApprovals,
  obligations,
  templates,
  activities,
} from "./schema/index";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log("Seeding database...");

  const [org] = await db
    .insert(organizations)
    .values({ name: "Duroflex Limited", slug: "duroflex" })
    .returning();

  const [user] = await db
    .insert(users)
    .values({ email: "rituka@duroflex.com", name: "Rituka Mane", role: "legal" })
    .returning();

  await db.insert(organizationMembers).values({ organizationId: org.id, userId: user.id, role: "legal" });

  const [cp1] = await db
    .insert(counterparties)
    .values({ name: "TechCorp Solutions", email: "legal@techcorp.com", organizationId: org.id })
    .returning();

  const [cp2] = await db
    .insert(counterparties)
    .values({ name: "DataGuard Inc", email: "contracts@dataguard.io", organizationId: org.id })
    .returning();

  const contractData = [
    {
      title: "NDA Agreement - TechCorp",
      description: "Mutual Non-Disclosure Agreement for product collaboration",
      status: "signed" as const,
      kind: "new" as const,
      counterpartyId: cp1.id,
      tags: ["nda", "confidential"],
      value: "250000",
      currency: "INR",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2027-07-01"),
    },
    {
      title: "Service Level Agreement - DataGuard",
      description: "SLA for data processing services",
      status: "pending_approval" as const,
      kind: "renewal" as const,
      counterpartyId: cp2.id,
      tags: ["sla", "data-processing"],
      value: "1500000",
      currency: "INR",
      startDate: new Date("2026-06-15"),
      endDate: new Date("2027-06-14"),
    },
    {
      title: "Software License Agreement",
      description: "Enterprise license for cloud management platform",
      status: "draft" as const,
      kind: "new" as const,
      counterpartyId: cp1.id,
      tags: ["software", "license"],
      value: "5000000",
      currency: "INR",
    },
    {
      title: "Vendor Agreement - Office Supplies",
      description: "Annual vendor agreement for office supplies and equipment",
      status: "executed" as const,
      kind: "renewal" as const,
      counterpartyId: cp2.id,
      tags: ["vendor", "procurement"],
      value: "1200000",
      currency: "INR",
    },
  ];

  for (const c of contractData) {
    const [contract] = await db
      .insert(contracts)
      .values({
        ...c,
        organizationId: org.id,
        createdById: user.id,
        createdBy: user.name,
      })
      .returning();

    await db.insert(contractVersions).values({
      contractId: contract.id,
      versionNumber: 1,
      content: "<p>Draft version of " + contract.title + "</p>",
      createdById: user.id,
    });

    if (contract.status === "signed" || contract.status === "executed") {
      await db.insert(contractApprovals).values({
        contractId: contract.id,
        approverId: user.id,
        status: "approved",
        comment: "All terms are acceptable.",
      });
    } else if (contract.status === "pending_approval") {
      await db.insert(contractApprovals).values({
        contractId: contract.id,
        approverId: user.id,
        status: "pending",
      });
    }

    await db.insert(obligations).values({
      contractId: contract.id,
      title: "Deliver initial report",
      description: "Submit quarterly performance report as per clause 4.2",
      assigneeId: user.id,
      dueDate: new Date("2026-09-30"),
      status: "pending",
      priority: "high",
    });

    await db.insert(activities).values({
      contractId: contract.id,
      userId: user.id,
      action: "created",
      description: `Contract "${contract.title}" was created`,
    });
  }

  const templateCategories = ["NDA", "SLA", "Employment", "License", "Lease", "Service"];
  for (const cat of templateCategories) {
    await db.insert(templates).values({
      name: `${cat} Template`,
      description: `Standard ${cat.toLowerCase()} template with customizable clauses`,
      category: cat.toLowerCase(),
      organizationId: org.id,
      createdById: user.id,
      content: `<h1>${cat} Agreement</h1><p>This agreement is made on [Date] between [Party A] and [Party B].</p>`,
    });
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
