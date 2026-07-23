export interface ApiContract {
  id: string;
  title: string;
  description?: string;
  status: string;
  kind: string;
  counterparty_name: string;
  counterparty_email?: string;
  contract_type: string;
  template_name?: string;
  value?: string;
  currency: string;
  tags: string[];
  start_date?: string;
  end_date?: string;
  created_by_name: string;
  created_by_email: string;
  created_at: string;
  updated_at: string;
}

export interface ApiObligation {
  id: string;
  contract_id: string;
  contract_title: string;
  title: string;
  description?: string;
  assignee_name?: string;
  due_date?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface ApiApproval {
  id: string;
  contract_id: string;
  contract_title: string;
  approver_name: string;
  approver_email: string;
  status: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export const mockContracts: ApiContract[] = [
  {
    id: "c-001",
    title: "NDA Agreement - TechCorp Inc",
    description: "Standard mutual NDA for technology evaluation",
    status: "signed",
    kind: "new",
    counterparty_name: "TechCorp Inc",
    counterparty_email: "legal@techcorp.com",
    contract_type: "NDA",
    value: "50000",
    currency: "USD",
    tags: ["nda", "confidential"],
    start_date: "2026-07-01",
    end_date: "2027-07-01",
    created_by_name: "Rituka Mane",
    created_by_email: "rituka@duroflex.com",
    created_at: "2026-06-15T10:00:00Z",
    updated_at: "2026-07-20T14:00:00Z",
  },
  {
    id: "c-002",
    title: "Software License Agreement - SaaSify",
    description: "Enterprise license for cloud platform",
    status: "pending_approval",
    kind: "new",
    counterparty_name: "SaaSify Ltd",
    counterparty_email: "legal@saasify.io",
    contract_type: "License",
    value: "120000",
    currency: "USD",
    tags: ["software", "license"],
    start_date: "2026-08-01",
    end_date: "2027-08-01",
    created_by_name: "Amit Sharma",
    created_by_email: "amit@duroflex.com",
    created_at: "2026-06-20T08:00:00Z",
    updated_at: "2026-07-10T09:00:00Z",
  },
  {
    id: "c-003",
    title: "Marketing Services Agreement - AdWorks",
    description: "Digital marketing campaign services",
    status: "draft",
    kind: "new",
    counterparty_name: "AdWorks Agency",
    counterparty_email: "contact@adworks.com",
    contract_type: "Services",
    value: "25000",
    currency: "USD",
    tags: ["marketing", "services"],
    start_date: "2026-09-01",
    end_date: "2027-03-01",
    created_by_name: "Rituka Mane",
    created_by_email: "rituka@duroflex.com",
    created_at: "2026-07-05T11:00:00Z",
    updated_at: "2026-07-05T11:00:00Z",
  },
  {
    id: "c-004",
    title: "Employment Agreement - Sarah Lee",
    description: "Senior Software Engineer position",
    status: "executed",
    kind: "new",
    counterparty_name: "Sarah Lee",
    counterparty_email: "sarah.lee@email.com",
    contract_type: "Employment",
    value: "",
    currency: "USD",
    tags: ["employment", "engineering"],
    start_date: "2026-06-01",
    end_date: "",
    created_by_name: "HR Team",
    created_by_email: "hr@duroflex.com",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-28T16:00:00Z",
  },
  {
    id: "c-005",
    title: "Vendor Supply Agreement - SupplyChain Co",
    description: "Raw materials supply for manufacturing",
    status: "on_hold",
    kind: "renewal",
    counterparty_name: "SupplyChain Co",
    counterparty_email: "supply@supplychain.com",
    contract_type: "Supply",
    value: "500000",
    currency: "USD",
    tags: ["supply", "manufacturing"],
    start_date: "2026-04-01",
    end_date: "2027-04-01",
    created_by_name: "Mike Ross",
    created_by_email: "mike@duroflex.com",
    created_at: "2026-05-10T07:00:00Z",
    updated_at: "2026-07-12T10:00:00Z",
  },
  {
    id: "c-006",
    title: "Office Lease - MG Road Bangalore",
    description: "Office space lease renewal",
    status: "approved",
    kind: "renewal",
    counterparty_name: "MG Realty Pvt Ltd",
    counterparty_email: "leasing@mgrealty.com",
    contract_type: "Lease",
    value: "180000",
    currency: "INR",
    tags: ["lease", "office"],
    start_date: "2026-10-01",
    end_date: "2029-09-30",
    created_by_name: "Priya Patel",
    created_by_email: "priya@duroflex.com",
    created_at: "2026-07-01T12:00:00Z",
    updated_at: "2026-07-18T09:00:00Z",
  },
  {
    id: "c-007",
    title: "Consulting Agreement - McKinsey",
    description: "Strategy consulting engagement",
    status: "draft",
    kind: "new",
    counterparty_name: "McKinsey & Co",
    counterparty_email: "engagement@mckinsey.com",
    contract_type: "Services",
    value: "750000",
    currency: "USD",
    tags: ["consulting", "strategy"],
    start_date: "2026-09-15",
    end_date: "2027-03-15",
    created_by_name: "Raj Kumar",
    created_by_email: "raj@duroflex.com",
    created_at: "2026-07-22T15:00:00Z",
    updated_at: "2026-07-22T15:00:00Z",
  },
];

export const mockObligations: ApiObligation[] = [
  { id: "o-001", contract_id: "c-001", contract_title: "NDA Agreement - TechCorp Inc", title: "Return all confidential materials", status: "pending", priority: "high", assignee_name: "Rituka Mane", due_date: "2027-07-15", created_at: "2026-07-01T10:00:00Z", updated_at: "2026-07-01T10:00:00Z" },
  { id: "o-002", contract_id: "c-001", contract_title: "NDA Agreement - TechCorp Inc", title: "Annual compliance review", status: "pending", priority: "medium", assignee_name: "Legal Team", due_date: "2027-01-01", created_at: "2026-07-01T10:00:00Z", updated_at: "2026-07-01T10:00:00Z" },
  { id: "o-003", contract_id: "c-004", contract_title: "Employment Agreement - Sarah Lee", title: "Submit background verification report", status: "completed", priority: "high", assignee_name: "HR Team", due_date: "2026-06-15", created_at: "2026-06-01T09:00:00Z", updated_at: "2026-06-10T14:00:00Z" },
  { id: "o-004", contract_id: "c-005", contract_title: "Vendor Supply Agreement - SupplyChain Co", title: "Renegotiate pricing terms", status: "overdue", priority: "high", assignee_name: "Mike Ross", due_date: "2026-07-01", created_at: "2026-05-10T07:00:00Z", updated_at: "2026-06-15T10:00:00Z" },
  { id: "o-005", contract_id: "c-005", contract_title: "Vendor Supply Agreement - SupplyChain Co", title: "Verify insurance certificates", status: "pending", priority: "low", assignee_name: "Finance Team", due_date: "2026-12-31", created_at: "2026-05-10T07:00:00Z", updated_at: "2026-05-10T07:00:00Z" },
  { id: "o-006", contract_id: "c-002", contract_title: "Software License Agreement - SaaSify", title: "Review SLA compliance metrics", status: "pending", priority: "medium", assignee_name: "Amit Sharma", due_date: "2026-08-15", created_at: "2026-06-20T08:00:00Z", updated_at: "2026-06-20T08:00:00Z" },
];

export const mockApprovals: ApiApproval[] = [
  { id: "a-001", contract_id: "c-002", contract_title: "Software License Agreement - SaaSify", approver_name: "Rituka Mane", approver_email: "rituka@duroflex.com", status: "pending", created_at: "2026-07-10T09:00:00Z", updated_at: "2026-07-10T09:00:00Z" },
  { id: "a-002", contract_id: "c-002", contract_title: "Software License Agreement - SaaSify", approver_name: "Priya Patel", approver_email: "priya@duroflex.com", status: "pending", created_at: "2026-07-10T09:00:00Z", updated_at: "2026-07-10T09:00:00Z" },
  { id: "a-003", contract_id: "c-006", contract_title: "Office Lease - MG Road Bangalore", approver_name: "Raj Kumar", approver_email: "raj@duroflex.com", status: "approved", comment: "Looks good, proceed", created_at: "2026-07-15T12:00:00Z", updated_at: "2026-07-18T09:00:00Z" },
  { id: "a-004", contract_id: "c-006", contract_title: "Office Lease - MG Road Bangalore", approver_name: "Rituka Mane", approver_email: "rituka@duroflex.com", status: "approved", comment: "Terms are acceptable", created_at: "2026-07-15T12:00:00Z", updated_at: "2026-07-17T14:00:00Z" },
  { id: "a-005", contract_id: "c-007", contract_title: "Consulting Agreement - McKinsey", approver_name: "Rituka Mane", approver_email: "rituka@duroflex.com", status: "pending", created_at: "2026-07-22T15:00:00Z", updated_at: "2026-07-22T15:00:00Z" },
];

export const mockTemplates: ApiTemplate[] = [
  { id: "t-001", name: "Standard NDA", description: "Mutual non-disclosure agreement", category: "NDA", created_by_name: "Rituka Mane", created_at: "2026-01-15T10:00:00Z", updated_at: "2026-06-01T10:00:00Z" },
  { id: "t-002", name: "Employment Offer Letter", description: "Standard employment offer template", category: "Employment", created_by_name: "HR Team", created_at: "2026-02-10T10:00:00Z", updated_at: "2026-05-20T10:00:00Z" },
  { id: "t-003", name: "Services Agreement", description: "Professional services contract", category: "Services", created_by_name: "Legal Team", created_at: "2026-03-05T10:00:00Z", updated_at: "2026-06-15T10:00:00Z" },
  { id: "t-004", name: "Vendor Agreement", description: "Standard vendor/supplier contract", category: "Supply", created_by_name: "Mike Ross", created_at: "2026-03-20T10:00:00Z", updated_at: "2026-05-10T10:00:00Z" },
  { id: "t-005", name: "Software License Agreement", description: "SaaS and software licensing terms", category: "License", created_by_name: "Amit Sharma", created_at: "2026-04-01T10:00:00Z", updated_at: "2026-06-20T10:00:00Z" },
  { id: "t-006", name: "Lease Agreement", description: "Commercial property lease", category: "Lease", created_by_name: "Legal Team", created_at: "2026-04-15T10:00:00Z", updated_at: "2026-06-25T10:00:00Z" },
];
