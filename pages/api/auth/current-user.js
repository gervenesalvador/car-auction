// import jwt from "jsonwebtoken";

// import { User, UserRole } from "@/db/models";
import getLoggedUser from "@/utils/get-logged-user";

export default async function handler(req, res) {
  try {
    const user = await getLoggedUser(req);

    res.json({ currentUser: user });
  } catch (error) {
    // console.error(error);
    let errorMessage = "An error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    res.status(400).json({ message: errorMessage });
  }
}
