/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import UserAvatar from "@/app/(main)/project/_components/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./IssueDetailsDialog";

interface User {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Issue {
  id: string;
  title: string;
  createdAt: string;
  status: string;
  priority: keyof typeof priorityColor;
  assignee: User;
  reporter: User; // Added
  projectId: string; // Added
  sprintId: string; // Added
}

interface IssueCardProps {
  issue: Issue;
  showStatus?: boolean;
  onDelete?: (...params: any[]) => void;
  onUpdate?: (...params: any[]) => void;
}

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: IssueCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params: any[]) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params: any[]) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDialogOpen(true)}
        style={{ userSelect: "none" }} // Prevents text highlighting
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
