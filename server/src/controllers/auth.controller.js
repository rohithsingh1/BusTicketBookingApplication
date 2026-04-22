import env from "../config/env.js";
import User from "../models/user.model.js";
import {
  buildGoogleAuthorizationUrl,
  exchangeCodeForGoogleProfile,
  upsertGoogleUser,
} from "../services/google-auth.service.js";
import {
  authCookieOptions,
  generateOauthState,
  googleStateCookieName,
  oauthStateCookieOptions,
  signAppToken,
} from "../utils/auth.js";

const sanitizeUser=(user) => ({
  id: user._id,
  username: user.username ?? null,
  email: user.email ?? null,
  name: user.name,
  avatarUrl: user.avatarUrl ?? null,
  authProvider: user.authProvider,
  emailVerified: user.emailVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const startGoogleAuth=(req, res) => {
  const state=generateOauthState();
  const authorizationUrl=buildGoogleAuthorizationUrl(state);

  console.log("authorizationUrl in startGoogleAuth>>>>>", authorizationUrl);

  res.cookie(googleStateCookieName, state, oauthStateCookieOptions());
  return res.status(200).json({
    success: true,
    data: {
      authorizationUrl,
    },
  });
};

export const loginWithCredentials=async (req, res) => {
  const email=String(req.body?.email || "").trim();
  const password=String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required.",
    });
  }

  const user=await User.findOne({
    email,
    authProvider: "local",
  }).select("+passwordHash");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  user.lastLoginAt=new Date();
  await user.save();

  const appToken=signAppToken(user);
  res.cookie(env.authCookieName, appToken, authCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: {
      user: sanitizeUser(user),
    },
  });
};

export const registerWithCredentials=async (req, res) => {
  const email=String(req.body?.email || "").trim();
  const password=String(req.body?.password || "");
  const name=String(req.body?.name).trim();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required.",
    });
  }

  if (email.length < 3) {
    return res.status(400).json({
      success: false,
      message: "email must be at least 3 characters long.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  const existingUser=await User.findOne({email});

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "email is already taken.",
    });
  }

  const passwordHash=await User.hashPassword(password);
  const user=await User.create({
    email,
    name,
    authProvider: "local",
    passwordHash,
    emailVerified: false,
    lastLoginAt: new Date(),
  });

  const appToken=signAppToken(user);
  res.cookie(env.authCookieName, appToken, authCookieOptions());

  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: {
      user: sanitizeUser(user),
    },
  });
};

export const handleGoogleCallback=async (req, res) => {
  try {
    const {code, state}=req.query;
    console.log('code,state in handleGoogleCallback >>>>>>', code, state)
    const storedState=req.cookies?.[googleStateCookieName];
    console.log('storedState in handleGoogleCallback >>>>>>>', storedState)

    if (!code||!state||!storedState||state!==storedState) {
      return res.status(400).json({
        success: false,
        message: "OAuth state validation failed.",
      });
    }

    // if (!code||!state) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OAuth state validation failed.",
    //   });
    // }

    const googleProfile=await exchangeCodeForGoogleProfile(code);
    const user=await upsertGoogleUser(googleProfile);
    console.log('user in handleGoogleCallback >>>>>>>', user)
    const appToken=signAppToken(user);
    console.log('appToken in handleGoogleCallback>>>>>>>>>', appToken)

    res.clearCookie(googleStateCookieName, oauthStateCookieOptions());
    res.cookie(env.authCookieName, appToken, authCookieOptions());

    if (env.clientSuccessRedirectUrl) {
      return res.redirect(env.clientSuccessRedirectUrl);
    }

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    res.clearCookie(googleStateCookieName, oauthStateCookieOptions());

    if (env.clientFailureRedirectUrl) {
      return res.redirect(env.clientFailureRedirectUrl);
    }

    return res.status(401).json({
      success: false,
      message: error.message||"Google authentication failed.",
    });
  }
};

export const getCurrentUser=async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
};

export const logout=(req, res) => {
  res.clearCookie(env.authCookieName, authCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
