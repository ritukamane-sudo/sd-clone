"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

type FlowStep = "choose" | "template" | "upload_third_party" | "upload_executed" | "details" | "done";

interface Template {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

interface ApiContractTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function NewContractPage() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("choose");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<"third_party" | "executed" | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    counterparty_name: "",
    counterparty_email: "",
    value: "",
    currency: "INR",
    kind: "new",
    tags: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetch("/api/v2.1/public/templates")
      .then((r) => r.json())
      .then((data) => {
        if (data.results) {
          setTemplates(data.results.map((t: ApiContractTemplate) => ({
            id: t.id,
            name: t.name,
            description: t.description || undefined,
            category: t.category || undefined,
          })));
        }
      });
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleChooseTemplate = (t: Template) => {
    setSelectedTemplate(t);
    setForm((f) => ({ ...f, title: t.name.replace(" Template", "") + " - New Agreement" }));
    setStep("details");
  };

  const handleUploadFlow = (mode: "third_party" | "executed") => {
    setUploadMode(mode);
    setStep(mode === "third_party" ? "upload_third_party" : "upload_executed");
  };

  const handleFileSelected = () => {
    setStep("details");
  };

  const handleSubmit = async () => {
    let uploadedUrl: string | null = null;

    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("contract_id", "new");
      const uploadRes = await fetch("/api/v2.1/public/upload", { method: "POST", body: fd });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData.url;
      }
    }

    const body = {
      title: form.title,
      description: form.description,
      kind: form.kind,
      counterparty_name: form.counterparty_name,
      counterparty_email: form.counterparty_email,
      value: form.value || undefined,
      currency: form.currency,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      start_date: form.start_date || undefined,
      end_date: form.end_date || undefined,
      template_id: selectedTemplate?.id,
      file_url: uploadedUrl,
      status: "draft",
    };

    const res = await fetch("/api/v2.1/public/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success("Contract created");
      router.push(`/contracts/${data.id}/edit`);
    } else {
      toast.error("Failed to create contract");
    }
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/contracts" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Contracts
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New Contract</h1>
      </div>

      {step === "choose" && (
        <div className="grid gap-4">
          <Card
            className="group cursor-pointer p-6 transition-all hover:border-[#1b91fb] hover:shadow-sm"
            onClick={() => setStep("template")}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f7ff]">
                <FileText className="h-5 w-5 text-[#1b91fb]" />
              </div>
              <div>
                <h3 className="font-medium">Choose a Template</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start from a pre-defined contract template
                </p>
              </div>
            </div>
          </Card>
          <Card
            className="group cursor-pointer p-6 transition-all hover:border-[#1b91fb] hover:shadow-sm"
            onClick={() => handleUploadFlow("third_party")}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f7ff]">
                <Upload className="h-5 w-5 text-[#1b91fb]" />
              </div>
              <div>
                <h3 className="font-medium">Upload Third Party Paper</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a contract received from a third party for review
                </p>
              </div>
            </div>
          </Card>
          <Card
            className="group cursor-pointer p-6 transition-all hover:border-[#1b91fb] hover:shadow-sm"
            onClick={() => handleUploadFlow("executed")}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0f7ff]">
                <Upload className="h-5 w-5 text-[#1b91fb]" />
              </div>
              <div>
                <h3 className="font-medium">Upload Executed Contract</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a contract that has already been signed
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {step === "template" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select a template to get started.</p>
          {templates.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">
              No templates available.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {templates.map((t) => (
                <Card
                  key={t.id}
                  className={`cursor-pointer p-4 transition-all hover:border-[#1b91fb] ${
                    selectedTemplate?.id === t.id ? "border-[#1b91fb] ring-1 ring-[#1b91fb]/20" : ""
                  }`}
                  onClick={() => handleChooseTemplate(t)}
                >
                  <h3 className="font-medium text-sm">{t.name}</h3>
                  {t.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                  )}
                  {t.category && (
                    <Badge variant="secondary" className="mt-2 text-xs">{t.category}</Badge>
                  )}
                </Card>
              ))}
            </div>
          )}
          <Button variant="outline" onClick={() => setStep("choose")}>Back</Button>
        </div>
      )}

      {(step === "upload_third_party" || step === "upload_executed") && (
        <div className="space-y-4">
          <div
            className={`rounded-lg border-2 border-dashed bg-card p-12 text-center transition-colors ${
              dragging ? "border-[#1b91fb] bg-[#f0f7ff]" : "border-border"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              {file ? file.name : "Drag and drop files here, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Supported formats: PDF, DOCX, DOC</p>
            <Button
              variant={file ? "default" : "outline"}
              className="mt-4"
              onClick={(e) => { e.stopPropagation(); file ? handleFileSelected() : fileInputRef.current?.click(); }}
            >
              {file ? "Continue" : "Select Files"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </div>
          <Button variant="outline" onClick={() => { setStep("choose"); setFile(null); }}>
            Back
          </Button>
        </div>
      )}

      {step === "details" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-sm font-medium">Contract Information</h3>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="Enter contract title" />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Brief description of the contract"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm min-h-[80px] resize-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Counterparty Name *</Label>
                  <Input value={form.counterparty_name} onChange={(e) => updateForm("counterparty_name", e.target.value)} placeholder="Company name" />
                </div>
                <div>
                  <Label>Counterparty Email</Label>
                  <Input value={form.counterparty_email} onChange={(e) => updateForm("counterparty_email", e.target.value)} placeholder="legal@company.com" type="email" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Value</Label>
                  <Input value={form.value} onChange={(e) => updateForm("value", e.target.value)} placeholder="250000" type="number" />
                </div>
                <div>
                  <Label>Currency</Label>
                  <select
                    value={form.currency}
                    onChange={(e) => updateForm("currency", e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <Label>Contract Kind</Label>
                  <select
                    value={form.kind}
                    onChange={(e) => updateForm("kind", e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="new">New</option>
                    <option value="renewal">Renewal</option>
                    <option value="amendment">Amendment</option>
                    <option value="termination">Termination</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Start Date</Label>
                  <Input value={form.start_date} onChange={(e) => updateForm("start_date", e.target.value)} type="date" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input value={form.end_date} onChange={(e) => updateForm("end_date", e.target.value)} type="date" />
                </div>
              </div>
              <div>
                <Label>Tags (comma separated)</Label>
                <Input value={form.tags} onChange={(e) => updateForm("tags", e.target.value)} placeholder="nda, confidential, vendor" />
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => { setStep("choose"); setSelectedTemplate(null); }}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={!form.title.trim()}>
              Create Contract
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
