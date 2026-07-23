"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BellIcon, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/v2.1/public/contracts?search=${encodeURIComponent(query)}&page_size=5`);
        const data = await res.json();
        setResults(data.results || []);
      } catch { setResults([]); }
      setSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <button
          onClick={() => { setShowSearch(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="flex w-full items-center gap-2 rounded-lg border border-input bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 lg:cursor-text"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">Search contracts...</span>
          <span className="lg:hidden">Search...</span>
          <kbd className="ml-auto hidden rounded border bg-background px-1.5 text-[10px] font-medium text-muted-foreground lg:inline">/</kbd>
        </button>

        {showSearch && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50">
            <div className="rounded-lg border bg-card shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 border-b px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  placeholder="Search contracts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  autoFocus
                />
                {searching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                <button onClick={() => { setShowSearch(false); setQuery(""); }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Esc
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {results.length === 0 && query.trim() && !searching && (
                  <p className="p-4 text-center text-xs text-muted-foreground">No contracts found</p>
                )}
                {results.map((c: any) => (
                  <Link
                    key={c.id}
                    href={`/contracts/${c.id}`}
                    onClick={() => { setShowSearch(false); setQuery(""); }}
                    className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.counterparty_name}</p>
                    </div>
                    <span className="shrink-0 ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                      {c.status.replace("_", " ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
        <BellIcon className="h-4 w-4" />
      </button>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f7ff] text-xs font-medium text-[#1b91fb] ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
          RM
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">Rituka Mane</p>
            <p className="text-xs text-muted-foreground">rituka@duroflex.com</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setOpen(false); router.push("/settings/user"); }}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setOpen(false); router.push("/settings/organisation/details"); }}>
            Organisation
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
