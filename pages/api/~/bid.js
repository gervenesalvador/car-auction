import { Listing, Bid } from '@/db/models';
import getLoggedUser from "@/utils/get-logged-user";

var limitBidding = [];

const validateBid = (req_body) => {
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
    const validated = validateBid(req.body);
    if (!validated.status) {
      return res.status(400).json({message: validated.message});
    }

    if (limitBidding.includes(req.body.listing_id)) {
      throw new Error("Sorry, somebody has bid quicker with this price. Please check the new price");
    }

    limitBidding.push(req.body.listing_id);
    const user = await getLoggedUser(req);
    const listing = await Listing.findOne({
      where: { id: req.body.listing_id },
      include: [
        {
          model: Bid,
          as: 'bids',
          order: [[ 'createdAt', 'DESC' ]],
          limit: 1,
        },
      ]
    });

    if (!listing.status) {
      throw new Error("This listing is already closed");
    }

    if (listing.user_id === user.id) {
      throw new Error("You cannot bid on your own listing");
    }

    if (listing.bids[0] && listing.bids[0].user_id === user.id) {
      throw new Error("You are already the top bidder");
    }

    const expiryDate = new Date(listing.expiryDate);
    const now = Date.now();
    if (expiryDate.getTime() < now && listing.bids.length > 0) {
      throw new Error("Listing is expired!");
    }

    const current_bid = listing.bids[0] && listing.bids[0].amount > listing.opening_price ? listing.bids[0].amount : listing.opening_price;

    const bid = await Bid.create({
      listing_id: listing.id,
      user_id: user.id,
      amount: Number(current_bid) + Number(listing.price_increment)
    });

    res.json({message: "Bid placed successfully", bid});
  } catch (error) {
    console.error(error);
    let errorMessage = "An error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    res.status(400).json({ message: errorMessage });
  } finally {
    var index = limitBidding.indexOf(req.body.listing_id);
    if (index !== -1) {
      limitBidding.splice(index, 1);
    }
  }
}
