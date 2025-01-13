/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Issue {
  id: number;
  title: string;
  status: string;
  order: number;
  description?: string;
  sprintId: number;
  assignee?: User;
  reporter?: User;
}

// Utility function to check if the user is the test user
async function isTestUser(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.emailAddress;
  return email === "recruiter+clerk_test@example.com";
}

export async function createIssue(
  projectId: any,
  data: {
    status: any;
    title: any;
    description: any;
    priority: any;
    sprintId: any;
    assigneeId: any;
  }
) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping create issue operation.");
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}

export async function getIssuesForSprint(sprintId: number): Promise<Issue[]> {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping fetching issues.");
    return [];
  }

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: {
      sprintId,
    },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });
  return issues;
}

export async function updateIssueOrder(updatedIssues: any) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping update issue order operation.");
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  await db.$transaction(async (prisma: any) => {
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId: any) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping delete issue operation.");
    return { message: "Operation skipped for test user." };
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

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

export async function updateIssue(
  issueId: any,
  data: { status: any; priority: any }
) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping update issue operation.");
    return { message: "Operation skipped for test user." };
  }

  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    throw new Error("Error updating issue: " + (error as Error).message);
  }
}

export async function getUserIssues(userId: string | null) {
  if (await isTestUser()) {
    console.log("Test user signed in. Skipping fetching user issues.");
    return [];
  }

  const { orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { reporterId: user.id }],
      project: {
        organizationId: orgId,
      },
    },
    include: {
      project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return issues;
}
