"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const templates = [
  { id: "t-001", name: "Standard NDA", description: "Mutual non-disclosure agreement", category: "NDA", used: 12, updated: "2026-06-01" },
  { id: "t-002", name: "Employment Offer Letter", description: "Standard employment offer template", category: "Employment", used: 8, updated: "2026-05-20" },
  { id: "t-003", name: "Services Agreement", description: "Professional services contract", category: "Services", used: 15, updated: "2026-06-15" },
  { id: "t-004", name: "Vendor Agreement", description: "Standard vendor/supplier contract", category: "Supply", used: 7, updated: "2026-05-10" },
  { id: "t-005", name: "Software License Agreement", description: "SaaS and software licensing terms", category: "License", used: 5, updated: "2026-06-20" },
  { id: "t-006", name: "Lease Agreement", description: "Commercial property lease", category: "Lease", used: 3, updated: "2026-06-25" },
];

const categories = ["All", "NDA", "Employment", "Services", "Supply", "License", "Lease"];

export default function TemplatesPage() {
  const [category, setCategory] = useState("All");

  const filtered = category === "All"
    ? templates
    : templates.filter((t) => t.category === category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Start from a pre-defined contract template
          </p>
        </div>
        <Button size="sm">Create Template</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-[#1b91fb] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <Card key={t.id} className="p-5 transition-shadow hover:shadow-md">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary">{t.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  Used {t.used}x
                </span>
              </div>
              <div>
                <h3 className="font-medium">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {t.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Updated {new Date(t.updated).toLocaleDateString()}
                </span>
                <Link href={`/contracts/new?template=${t.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    Use Template
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
