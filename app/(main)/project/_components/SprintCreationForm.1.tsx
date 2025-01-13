"use client";

import { createSprint } from "@/actions/sprint";
import { CardContent } from "@/components/ui/CardDemo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sprintSchema } from "@/app/lib/Validators";
import { SprintCreationFormProps, SprintFormData } from "./SprintCreationForm";

export const SprintCreationForm: React.FC<SprintCreationFormProps> = ({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}) => {
  const [showForm, setShowForm] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const onSubmit = async (data: SprintFormData) => {
    await createSprintFn(projectId, {
      ...data,
      startDate: dateRange.from, // Ensure this matches the type
      endDate: dateRange.to, // Ensure this matches the type
    });
    setShowForm(false);
    toast.success("Sprint created successfully");
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold gradient-title3">
          {projectTitle}
        </h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 mt-4 mb-4 rounded-lg border border-slate-700">
          <CardContent>
            <form
              className="flex gap-4 items-end"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="name"
                >
                  Sprint Name
                </label>
                <Input id="name" readOnly {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>

                <Controller
                  control={control}
                  //@ts-expect-error will fix later
                  name="dateRange"
                  render={(field) => {
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !dateRange && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                              format(dateRange.from, "LLL dd, y") +
                              " - " +
                              format(dateRange.to, "LLL dd, y")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto" align="start">
                          <DayPicker
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                //@ts-expect-error will fix later
                                setDateRange(range);
                                //@ts-expect-error will fix later
                                field.onChange(range);
                              }
                            }}
                            classNames={{
                              chevron: "fill-[#0881a3]",
                              range_start: "bg-[#0881a3]",
                              range_end: "bg-[#0881a3]",
                              range_middle: "bg-[#066b85]",
                              day_button: "border-none",
                              today: "border-1 border-[#066b85]",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              <Button>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};
