import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { User } from '@/db/models';

const validateLogin = (req_body) => {
  if (!req_body.email) {
    return { status: false, message: "Insufficient required fields. Email not found" };
  }
  if (!req_body.password) {
    return { status: false, message: "Insufficient required fields. Password not found" };
  }
  return { status: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(500).json({ message: "Page not found"});
  }

  try {
    const body = req.body;
    const validated = validateLogin(body);
    if (!validated.status) {
      throw new Error(validated.message);
    }

    const { email, password } = body;

    // check if the user already exists
    const user = await User.findOne({ where: {email} });
    if (!user) {
      throw new Error("User doesn't exists");
    }

    // check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Credentials");
    }

    // create token data
    const tokenData = { id: user.id, email: user.email };
    const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Logged in successfully", success: true, token });
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
