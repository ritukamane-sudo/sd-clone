"use client";

import { Card } from "@/components/ui/card";

const today = new Date();
const year = today.getFullYear();
const month = today.toLocaleString("default", { month: "long" });

const days = Array.from({ length: 30 }, (_, i) => i + 1);

const events: Record<number, { title: string; type: string }[]> = {
  5: [{ title: "NDA Review - TechCorp", type: "deadline" }],
  12: [{ title: "Board Meeting", type: "meeting" }],
  15: [{ title: "License Renewal - SaaSify", type: "deadline" }],
  22: [{ title: "Contract Review Session", type: "meeting" }],
  28: [{ title: "Quarterly Compliance", type: "deadline" }],
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          View contract deadlines and events
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-[#1b91fb] px-6 py-4 text-white">
          <h2 className="text-lg font-semibold">
            {month} {year}
          </h2>
        </div>
        <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="border-r p-2 last:border-r-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 border-b border-r p-1" />
          ))}
          {days.map((day) => (
            <div
              key={day}
              className={`min-h-24 border-b border-r p-1 ${
                day === today.getDate() ? "bg-[#f0f7ff]" : ""
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  day === today.getDate()
                    ? "bg-[#1b91fb] text-white"
                    : "text-muted-foreground"
                }`}
              >
                {day}
              </span>
              {events[day]?.map((e, i) => (
                <div
                  key={i}
                  className={`mt-1 rounded px-1 py-0.5 text-[10px] leading-tight ${
                    e.type === "deadline"
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {e.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
