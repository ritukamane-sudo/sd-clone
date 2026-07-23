"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ContractEditor } from "@/components/contracts/contract-editor";
import type { ApiContract } from "@/lib/api/data";

export default function ContractEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contract, setContract] = useState<ApiContract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v2.1/public/contracts/${id}/`)
      .then((r) => r.json())
      .then(setContract)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (html: string) => {
    await fetch(`/api/v2.1/public/contracts/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: html }),
    });
    router.push(`/contracts/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!contract) {
    return <div className="text-sm text-muted-foreground">Contract not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/contracts/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to Contract
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">Edit: {contract.title}</h1>
        </div>
      </div>
      <ContractEditor onSave={handleSave} />
    </div>
  );
}
