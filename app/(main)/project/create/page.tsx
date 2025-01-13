"use client";

import { CreateProjectData, createProject } from "@/actions/projects";
import { projectSchema } from "@/app/lib/Validators";
import OrgSwitcher from "@/components/OrgSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    data: project,
    loading,
    error,
    fn: createProjectFn,
  } = useFetch(createProject);

  // Use SubmitHandler from react-hook-form to type the onSubmit function
  const onSubmit: SubmitHandler<CreateProjectData> = async (data) => {
    createProjectFn(data);
  };

  useEffect(() => {
    if (project) {
      toast.success("Project created Successfully");
      router.push(`/project/${project.id}`);
    }
  }, [loading, project, router]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-4xl p-6 rounded-lg border border-slate-700">
        <h1 className="text-4xl text-center font-bold mb-8 gradient-title">
          Create New Project
        </h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              id="name"
              className="focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Project Name"
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              id="key"
              className="focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="Project Key (Ex: SLYT)"
              {...register("key")}
            />
            {errors.key?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
            )}
          </div>
          <Textarea
            id="description"
            className="h-28 focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Project Description"
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={!!loading}
            className="bg-[#0881a3] text-white hover:bg-[#066b85]"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
          {error && <p className="text-red-500 mt-2">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
