import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Check if the user exists in the database
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    const name = `${user.firstName} ${user.lastName}`;
    const imageUrl = user.imageUrl;
    const email = user.emailAddresses[0].emailAddress;

    if (loggedInUser) {
      // Update the user if the imageUrl has changed
      if (loggedInUser.imageUrl !== imageUrl) {
        await db.user.update({
          where: { clerkUserId: user.id },
          data: {
            imageUrl,
            name,
            email,
          },
        });
      }
      return loggedInUser;
    }

    // If the user does not exist, create a new user
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl,
        email,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("Error syncing user with database");
  }
};
