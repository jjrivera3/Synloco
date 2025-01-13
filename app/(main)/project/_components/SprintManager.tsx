/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { updateSprintStatus } from "@/actions/sprint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SprintManagerProps {
  sprint: {
    id: string | number; // Allow both string and number
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    status: string;
  };
  setSprint: (sprint: {
    id: string | number; // Allow both string and number
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    status: string;
  }) => void;
  sprints: Array<{
    id: string | number; // Allow both string and number
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    status: string;
  }>;
  projectId: string;
}

const SprintManager: React.FC<SprintManagerProps> = ({
  sprint,
  setSprint,
  sprints,
  projectId,
}) => {
  const [status, setStatus] = useState(sprint.status);

  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const handleStatusChange = async (newStatus: string) => {
    //@ts-expect-error will fix later
    updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [loading, updatedStatus]);

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints]);

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    if (selectedSprint) {
      setSprint(selectedSprint);
      setStatus(selectedSprint.status);
      //@ts-expect-error will fix later
      router.replace(`/project/${projectId}`, undefined, { shallow: true });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4 mt-8">
        <Select
          value={String(sprint.id)} // Convert `sprint.id` to a string
          onValueChange={handleSprintChange}
        >
          <SelectTrigger className="self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => {
              return (
                <SelectItem key={sprint.id} value={String(sprint.id)}>
                  {" "}
                  {/* Convert `sprint.id` to a string */}
                  {sprint.name} ({format(sprint.startDate, "MMM d, yyy")}) to{" "}
                  {format(sprint.endDate, "MMM d, yyyy")}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            className="bg-green-700 text-white"
            disabled={!!loading}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            variant="destructive"
            disabled={!!loading}
          >
            End Sprint
          </Button>
        )}
      </div>

      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
