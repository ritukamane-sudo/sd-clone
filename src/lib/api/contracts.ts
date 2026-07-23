const API_BASE = "/api";

export interface ContractListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface ContractMinimal {
  id: string;
  title: string;
  status: string;
  counterparty_name?: string;
  contract_type?: string;
  value?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractDetail {
  id: string;
  title: string;
  description?: string;
  status: string;
  kind: string;
  counterparty?: { id: string; name: string; email?: string };
  contract_type?: { id: string; name: string };
  template?: { id: string; name: string };
  value?: string;
  currency: string;
  start_date?: string;
  end_date?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_by?: { id: string; name: string; email: string };
  created_at: string;
  updated_at: string;
}

export async function listContracts(
  params: ContractListParams = {}
): Promise<{ results: ContractMinimal[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("page_size", String(params.pageSize));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const res = await fetch(
    `${API_BASE}/v2.1/public/contracts/?${searchParams.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch contracts");
  return res.json();
}

export async function getContract(
  id: string
): Promise<ContractDetail> {
  const res = await fetch(`${API_BASE}/v2.1/public/contracts/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch contract");
  return res.json();
}

export async function createContract(
  data: Record<string, unknown>
): Promise<ContractDetail> {
  const res = await fetch(`${API_BASE}/v2.1/public/contracts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create contract");
  return res.json();
}

export async function updateContract(
  id: string,
  data: Record<string, unknown>
): Promise<ContractDetail> {
  const res = await fetch(`${API_BASE}/v2.1/public/contracts/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update contract");
  return res.json();
}
