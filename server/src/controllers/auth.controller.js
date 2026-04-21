import env from "../config/env.js";
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

export const handleGoogleCallback=async (req, res) => {
  try {
    const {code, state}=req.query;
    console.log('code,state in handleGoogleCallback >>>>>>', code, state)
    const storedState=req.cookies?.[googleStateCookieName];
    console.log('storedState in handleGoogleCallback >>>>>>>', storedState)

    // if (!code||!state||!storedState||state!==storedState) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OAuth state validation failed.",
    //   });
    // }

    if (!code||!state) {
      return res.status(400).json({
        success: false,
        message: "OAuth state validation failed.",
      });
    }

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
        user,
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
      user: req.user,
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
