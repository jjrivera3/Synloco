/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import statuses from "@/data/status.json";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import IssueCreationDrawer from "./CreateIssue";
import SprintManager from "./SprintManager";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import useFetch from "@/hooks/useFetch";
import IssueCard from "@/components/IssueCard";
import { toast } from "sonner";
import BoardFilters from "./BoardFilters";
import { User } from "@/entities/User";

interface Sprint {
  id: number; // Update to allow both types
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
}

interface SprintBoardProps {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
}

interface Status {
  key: string;
  name: string;
}

interface ReorderParams<T> {
  list: T[];
  startIndex: number;
  endIndex: number;
}

interface Issue {
  id: string; // Unique identifier for the issue
  title: string; // Title of the issue
  status: string; // Status of the issue (e.g., "TODO", "IN_PROGRESS", etc.)
  order: number; // Order of the issue for sorting
  description?: string; // Optional description of the issue
  assigneeId?: string; // Optional ID of the assignee
  sprintId?: string; // Optional ID of the associated sprint
  priority: string; // Priority of the issue (e.g., "LOW", "MEDIUM", "HIGH", "URGENT")
  createdAt: string; // Creation date of the issue
  assignee: User; // The assigned user
  reporter: User; // The user who reported the issue
  projectId: string; // ID of the associated project
}

function reorder<T>({ list, startIndex, endIndex }: ReorderParams<T>): T[] {
  const result = Array.from(list); // Clone the array
  const [removed] = result.splice(startIndex, 1); // Remove the item at startIndex
  result.splice(endIndex, 0, removed); // Insert it at endIndex

  return result;
}

const SprintBoard: React.FC<SprintBoardProps> = ({
  sprints,
  projectId,
  orgId,
}) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleAddIssue = (status: SetStateAction<string>) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const {
    loading: issuesLoading,
    error: issueError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  const [filteredIssues, setFilterdIssues] = useState<Issue[]>([]);

  const handleFilterChange = (newFilteredIssues: Issue[]) => {
    setFilterdIssues(newFilteredIssues);
  };

  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint.id]);

  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const onDragEnd = async (result: any) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...(issues ?? [])];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder({
        list: sourceList,
        startIndex: source.index,
        endIndex: destination.index,
      });

      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  if (issueError) return <div>Error loading issues</div>;

  return (
    <div>
      <SprintManager
        sprint={currentSprint}
        //@ts-expect-error will fix later
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        //@ts-expect-error will fix later
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 rounded-lg bg-[#282828b3]">
          {statuses.map((column: Status) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h3 className="font-medium text-center">{column.name}</h3>

                    {filteredIssues
                      ?.filter((issue) => issue.status === column.key)
                      .map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={!!updateIssuesLoading}
                        >
                          {(provided) => {
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <IssueCard
                                  //@ts-expect-error will fix later
                                  issue={issue}
                                  onDelete={() => fetchIssues(currentSprint.id)}
                                  onUpdate={(updated) =>
                                    setIssues((issues) =>
                                      issues?.map((issue) => {
                                        if (issue.id === updated.id)
                                          return updated;
                                        return issue;
                                      })
                                    )
                                  }
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                    {column.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => handleAddIssue(column.key)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Issue
                        </Button>
                      )}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
