import { Listing } from '@/db/models';
import getLoggedUser from '@/utils/get-logged-user';

const matchURL = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const validateCreateListing = (req_body) => {
  if (!req_body.brand) {
    return { status: false, message: "Insufficient required fields. Brand not found" };
  }
  if (!req_body.year) {
    return { status: false, message: "Insufficient required fields. Year not found" };
  }
  if (!req_body.type) {
    return { status: false, message: "Insufficient required fields. Type not found" };
  }
  if (!req_body.expiry_date) {
    return { status: false, message: "Insufficient required fields. Expiry Date not found" };
  }
  if (!Date.parse(req_body.expiry_date)) {
    return { status: false, message: "Invalid Date format" };
  }
  if (!req_body.description) {
    return { status: false, message: "Insufficient required fields. Description not found" };
  }
  if (!req_body.image_link) {
    return { status: false, message: "Insufficient required fields. Image Link not found" };
  }
  if (!matchURL.test(req_body.image_link)) {
    return { status: false, message: "Invalid Image Link" };
  }
  if (!req_body.opening_price) {
    return { status: false, message: "Insufficient required fields. Opening Price not found" };
  }
  if (!req_body.price_increment) {
    return { status: false, message: "Insufficient required fields. Price Increment not found" };
  }

  return { status: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(500).json({ message: "Page not found"});
  }

  try {
    const validated = validateCreateListing(req.body);
    if (!validated.status) {
      return res.status(400).json({message: validated.message});
    }

    const user = await getLoggedUser(req);

    const { brand, year, type, description, image_link, opening_price, price_increment, expiry_date } = req.body;
    const listing = await Listing.create({
      user_id: user.id,
      brand, year, type, description, image_link, opening_price, price_increment, expiry_date
    });

    res.status(201).json({message: "successfully created", listing});
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
