/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

// Utility function to check if the user is the test user
async function isTestUser(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.emailAddress;
  return email === "recruiter+clerk_test@example.com";
}

export interface CreateProjectData {
  key: number;
  name: string;
  title?: string;
  description: string;
  startDate?: string;
  endDate?: string;
}

export async function createProject(data: CreateProjectData) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping create project operation.");
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  const { data: membership } = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Check for user membership
  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });
    return project;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error creating project: " + error.message);
    } else {
      throw new Error("Unknown error occurred while creating project");
    }
  }
}

export async function getProjects(orgId: any) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping fetching projects.");
    return [];
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function deleteProject(projectId: any) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping delete project operation.");
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}

export async function getProject(projectId: any) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping fetching project details.");
    return null;
  }

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  if (project.organizationId !== orgId) {
    return null;
  }

  return project;
}
