/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProjects } from "@/actions/projects";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import DeleteProject from "./DeleteProject";
import { Button } from "@/components/ui/button";

// Define the type for the props
interface ProjectListProps {
  orgId: string;
}

export default async function ProjectList({ orgId }: ProjectListProps) {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <p>
        No Projects Found{" "}
        <Link
          className="underline underline-offset-2 text-blue-500"
          href="/project/create"
        >
          Create New Projects
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project: any) => (
        <Card
          key={project.id}
          className="p-4 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]"
        >
          <CardContent>
            <CardTitle className="flex justify-between items-center min-h-9">
              {project.name}
              <DeleteProject projectId={project.id} />
            </CardTitle>
            <CardDescription className="mb-4">
              {project.description}
            </CardDescription>
            <Link
              href={`/project/${project.id}`}
              className="text-white hover:underline text-sm"
            >
              <Button className="bg-[#0881a3] text-white hover:bg-[#066b85]">
                View Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
