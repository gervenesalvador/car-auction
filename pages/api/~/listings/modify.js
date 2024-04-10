import { Listing } from '@/db/models';
import getLoggedUser from "@/utils/get-logged-user";

const validateUpdateListing = (req_body) => {
  if (!req_body.listing_id) {
    return { status: false, message: "Insufficient required fields. Listing not found" };
  }
  if (typeof req_body.status !== "boolean") {
    return { status: false, message: "Insufficient required fields. Status not found" };
  }

  return { status: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(500).json({ message: "Page not found"});
  }

  try {
    const validated = validateUpdateListing(req.body);
    if (!validated.status) {
      return res.status(400).json({message: validated.message});
    }

    const user = await getLoggedUser(req);
    if (user.role.id !== 1) { // need admin access
      throw new Error("Unauthorized");
    }

    const listing = await Listing.findOne({
      where: { id: req.body.listing_id },
    });
    if (!listing) {
      throw new Error("Listing not found");
    }

    await Listing.update({ status: req.body.status }, {
      where: { id: req.body.listing_id },
    });

    res.status(200).json({message: `Listing has been ${req.body.status ? 'opened' : 'closed' } successfully`});
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
