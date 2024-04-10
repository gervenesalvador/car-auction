import { User } from '@/db/models';
import bcrypt from 'bcrypt';

const matchCPNumber = /^(09|\+639)\d{9}$/;
const matchPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const matchEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateSignUp = (req_body) => {
  if (!req_body.email) {
    return { status: false, message: "Insufficient required fields. Email not found" };
  }
  if (!matchEmail.test(req_body.email)) {
    return { status: false, message: "Invalid Email format" };
  }
  if (!req_body.name) {
    return { status: false, message: "Insufficient required fields. Name not found" };
  }
  if (!req_body.password) {
    return { status: false, message: "Insufficient required fields. Password not found" };
  }
  if (!matchPassword.test(req_body.password)) {
    return { status: false, message: "Invalid Password. Minimum eight characters, at least one letter and one number" };
  }
  if (!req_body.phone_number) {
    return { status: false, message: "Insufficient required fields. Phone Number not found" };
  }
  if (!matchCPNumber.test(req_body.phone_number)) {
    return { status: false, message: "Invalid Cellphone number format" };
  }
  return { status: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(500).json({ message: "Page not found"});
  }

  try {
    const validated = validateSignUp(req.body);
    if (!validated.status) {
      return res.status(400).json({message: validated.message});
    }

    const {name, email, password, phone_number} = req.body;
    // let's check if the user already exists, if that's case we don't want to create a duplicate user
    const user = await User.findOne({ where: {email} });
    if (user) {
      return res.status(400).json({message: "User already exists"});
    }
    // hash the password, you don't want to save it as a plain text
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // save the user
    const newUser = await User.create({name, email, password: hashedPassword, phone_number, role_id: 2});

    return res.status(200).json({message: "User created successfully", success: true, user: newUser});
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}
