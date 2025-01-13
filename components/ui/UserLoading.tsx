"use client";

import { useOrganization, useUser } from "@clerk/nextjs";

const UserLoading = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (!isLoaded || !isUserLoaded) {
    return (
      <div className="mb-4 animate-pulse space-y-2">
        {/* Skeleton for a larger element (e.g., user/organization name) */}
        <div className="h-10 w-40 bg-gray-600 rounded-md"></div>
        {/* Skeleton for a smaller element (e.g., a label or button) */}
        <div className="h-8 w-24 bg-gray-600 rounded-md"></div>
      </div>
    );
  }

  return null; // Explicitly return null when loading is complete
};

export default UserLoading;
