import jwt from "jsonwebtoken";

import { User, UserRole } from "@/db/models";

function getCookieFromList(cookies, cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(cookies);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default async function getLoggedUser(req) {
    const cookies = req.headers.cookie;
    const token = getCookieFromList(cookies, "token");

    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!decoded || (decoded.exp < Math.floor(Date.now() / 1000))) {
      throw new Error("Expired Token");
    }

    const user = await User.findOne({
      where: { id: decoded.id},
      attributes: ["id", "name", "phone_number"],
      include: [UserRole]
    });

    if (!user) {
      throw new Error("Unauthorized");
    }

    return user;
}
