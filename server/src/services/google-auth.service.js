import {OAuth2Client} from "google-auth-library";
import env from "../config/env.js";
import User from "../models/user.model.js";

const GOOGLE_ISSUERS=new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);

const getGoogleClient=() => {
  if (
    !env.google.clientId||
    !env.google.clientSecret||
    !env.google.redirectUri
  ) {
    throw new Error(
      "Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI."
    );
  }

  return new OAuth2Client({
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    redirectUri: env.google.redirectUri,
  });
};

export const buildGoogleAuthorizationUrl=(state) =>
  getGoogleClient().generateAuthUrl({
    access_type: "online",
    include_granted_scopes: true,
    response_type: "code",
    scope: ["openid", "email", "profile"],
    state,
  });

export const exchangeCodeForGoogleProfile=async (code) => {
  const googleClient=getGoogleClient();

  const {tokens}=await googleClient.getToken({
    code,
    redirect_uri: env.google.redirectUri,
  });

  console.log("tokens in exchangeCodeForGoogleProfile>>>>>>>>", tokens);


  if (!tokens.id_token) {
    throw new Error("Google did not return an ID token.");
  }

  const ticket=await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.google.clientId,
  });

  const payload=ticket.getPayload();

  console.log("payload in exchangeCodeForGoogleProfile>>>>>>", payload);


  if (!payload?.sub||!payload.email) {
    throw new Error("Google account payload is missing required identity fields.");
  }

  if (!payload.email_verified) {
    throw new Error("Google account email is not verified.");
  }

  if (!GOOGLE_ISSUERS.has(payload.iss)) {
    throw new Error("Google token issuer is invalid.");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name||payload.email.split("@")[0],
    avatarUrl: payload.picture||null,
    emailVerified: Boolean(payload.email_verified),
  };
};

export const upsertGoogleUser=async (googleProfile) => {
  const user=await User.findOneAndUpdate(
    {
      $or: [{googleId: googleProfile.googleId}, {email: googleProfile.email}],
    },
    {
      $set: {
        googleId: googleProfile.googleId,
        email: googleProfile.email,
        name: googleProfile.name,
        avatarUrl: googleProfile.avatarUrl,
        authProvider: "google",
        emailVerified: googleProfile.emailVerified,
        lastLoginAt: new Date(),
      },
    },
    {
      upsert: true, //  create user if not found
      new: true, // return updated/new user
      setDefaultsOnInsert: true, // apply schema defaults on first insert
    }
  );

  return user;
};
