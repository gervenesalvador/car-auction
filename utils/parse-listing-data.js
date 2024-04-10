export default function parseListingData(data) {
  let is_close = !data.status;
  const now = new Date();
  const expiry_date = new Date(data.expiry_date);
  const diffInMs = expiry_date.getTime() - now.getTime();

  if (diffInMs > 0) {
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
    return { ...data, days, hours, minutes, seconds, is_close };
  }
  is_close = (data.status && data.bids.length > 0) ? true : false; // if the listing status is still active but the expiry date is passed then it should be close

  return { ...data, days: 0, hours: 0, minutes: 0, seconds: 0, is_close };
}
