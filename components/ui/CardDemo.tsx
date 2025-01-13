"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BarChart, Calendar, Layout } from "lucide-react";

export function CardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 max-w-7xl mx-auto w-full gap-6 mb-20">
      <Card>
        <CardContent icon={<Layout className="text-blue-500 w-10 h-10" />}>
          <CardTitle>Intuitive Kanban Boards</CardTitle>
          <CardDescription>
            Visualize your workflow and optimize team productivity with our
            easy-to-use Kanban boards.
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent icon={<Calendar className="text-blue-500 w-10 h-10" />}>
          <CardTitle>Powerful Sprint Planning</CardTitle>
          <CardDescription>
            Plan and manage sprints effectively, ensuring your team stays
            focused on delivering value.
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardContent icon={<BarChart className="text-blue-500 w-10 h-10" />}>
          <CardTitle>Collaborative Workflows</CardTitle>
          <CardDescription>
            Seamlessly collaborate with your team to ensure smooth project
            execution and achieve outstanding results.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between max-w-sm w-full min-h-[275px] mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({
  children,
  icon,
  className,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {icon && <div className="mb-4">{icon}</div>}
      <div className="mt-auto">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold text-gray-800 dark:text-white",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-md font-normal text-neutral-600 dark:text-neutral-400 mt-2",
        className
      )}
    >
      {children}
    </p>
  );
};
