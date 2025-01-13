/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrganization } from "@/actions/organization";
import { auth } from "@clerk/nextjs/server";
import CreateProjectButton from "../../project/_components/CreateProjectButton";
import UserIssues from "../../project/_components/UserIssues";
import ProjectList from "../_components/ProjectList";

const Organization = async ({ params }: any) => {
  const { orgId } = await params;
  const { userId } = await auth();
  const organization = await getOrganization(orgId);

  if (!userId) {
    return <div>You must be logged in to view this page.</div>;
  }

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center sm:items-start">
        {/* Title aligned on the left */}
        <h1 className="text-3xl font-medium gradient-title3 pb-2 sm:pb-0">
          {organization.name}&apos;s Projects
        </h1>

        {/* Buttons aligned on the right */}
        <div className="flex items-center gap-4">
          <CreateProjectButton />
        </div>
      </div>

      <div className="mb-4">
        <ProjectList orgId={organization.id} />
      </div>
      <div className="mt-8">
        <UserIssues userId={userId} id={""} name={""} />
      </div>
    </div>
  );
};

export default Organization;
