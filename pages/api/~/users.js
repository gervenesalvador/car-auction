import { User, UserRole, UserListings, UserBid } from '@/db/models';

export default async function handler(req, res) {
  try {
    const users = await User.findAll({ limit: 100, include: [UserRole, UserListings, UserBid] });
    res.status(200).json({ users });
  } catch (e) {
    res.status(400).json({ error_code: 'get_users', message: e });
  }
}
