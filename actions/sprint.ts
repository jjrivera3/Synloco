"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Utility function to check if the user is the test user
async function isTestUser(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.emailAddress;
  return email === "recruiter+clerk_test@example.com";
}

interface SprintData {
  name: string;
  startDate: Date;
  endDate: Date;
  status?: string;
}

export async function createSprint(projectId: string, data: SprintData) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping create sprint operation.");
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project Not Found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED", // Default value
      projectId: projectId,
    },
  });

  return sprint;
}

export async function updateSprintStatus(sprintId: string, newStatus: string) {
  if (await isTestUser()) {
    console.log(
      "Test user signed in. Skipping update sprint status operation."
    );
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
