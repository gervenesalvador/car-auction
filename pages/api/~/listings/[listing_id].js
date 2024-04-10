import { Listing, Bid, ListingOwner, User } from '@/db/models';

export default async function handler(req, res) {
  const { listing_id } = req.query;
  try {
    const listing = await Listing.findOne({
      where: { id: listing_id },
      include: [
        {
          model: Bid,
          as: 'bids',
          order: [[ 'createdAt', 'DESC' ]],
          limit: 1,
          include: {
            model: User,
            as: 'user',
            attributes: ['name'],
          },
        },
        ListingOwner
      ]
    });

    res.status(200).json({ listing });
  } catch (e) {
    console.log("error", e);
    res.status(400).json({ error_code: 'get_listings', message: e });
  }
}
