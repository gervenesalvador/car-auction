import { Listing, Bid } from '@/db/models';

export default async function handler(req, res) {
  try {
    const listings = await Listing.findAll({
      limit: 100,
      include: [
        {
          model: Bid,
          as: 'bids',
          order: [[ 'createdAt', 'DESC' ]],
          limit: 1,
        },
      ]
    });
    res.status(200).json({ listings });
  } catch (e) {
    console.log("error", e);
    res.status(400).json({ error_code: 'get_listings', message: e });
  }
}
