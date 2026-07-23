import { FileText, SearchX, Inbox, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const icons = { file: FileText, search: SearchX, inbox: Inbox, comment: MessageSquare, check: CheckCircle2 };

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: keyof typeof icons;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && (
        <Link href={action.href}>
          <Button className="mt-4" size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
