import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const googleStateCookieName="google_oauth_state";

const createCookieOptions=(maxAge) => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.authCookieSameSite,
  domain: env.cookieDomain,
  path: "/",
  maxAge,
});

export const authCookieOptions=() => createCookieOptions(7*24*60*60*1000);

export const oauthStateCookieOptions=() =>
  createCookieOptions(10*60*1000);

export const generateOauthState=() => crypto.randomBytes(32).toString("hex");

export const signAppToken=(user) => {
  const jsonString=jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      provider: user.authProvider,
    },
    env.appJwtSecret,
    {
      expiresIn: env.appJwtExpiresIn,
      issuer: "bus-ticket-booking-api",
      audience: "bus-ticket-booking-client",
    }
  )
  return jsonString
}

export const verifyAppToken=(token) =>
  jwt.verify(token, env.appJwtSecret, {
    issuer: "bus-ticket-booking-api",
    audience: "bus-ticket-booking-client",
  });
