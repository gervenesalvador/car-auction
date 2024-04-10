import { Listing, User } from '@/db/models';
import getLoggedUser from "@/utils/get-logged-user";

const validateDeleteListing = (req_body) => {
  if (!req_body.listing_id) {
    return { status: false, message: "Insufficient required fields. Listing not found" };
  }

  return { status: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(500).json({ message: "Page not found"});
  }

  try {
    const validated = validateDeleteListing(req.body);
    if (!validated.status) {
      return res.status(400).json({message: validated.message});
    }

    const user = await getLoggedUser(req);
    if (user.role.id !== 1) { // need admin access
      throw new Error("Unauthorized");
    }

    await Listing.destroy({ where: {id: req.body.listing_id} });

    res.status(201).json({message: "successfully deleted"});
  } catch (error) {
    console.error(error);
    let errorMessage = "An error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    res.status(400).json({ message: errorMessage });
  }
}
