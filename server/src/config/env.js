const requireEnv=(name, fallback) => {
  const value=process.env[name]??fallback;

  if (value===undefined||value===null||value==="") {
    throw new Error(`${name} is missing in the environment variables.`);
  }

  return value;
};

const splitOrigins=(value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const nodeEnv=process.env.NODE_ENV||"development";
const isProduction=nodeEnv==="production";
const clientUrl=requireEnv("CLIENT_URL", "http://localhost:3000");

const env={
  nodeEnv,
  isProduction,
  appJwtSecret: requireEnv("APP_JWT_SECRET", process.env.JWT_KEY),
  appJwtExpiresIn: process.env.APP_JWT_EXPIRES_IN||"7d",
  clientUrl,
  clientSuccessRedirectUrl:
    process.env.CLIENT_SUCCESS_REDIRECT_URL||`${clientUrl}/auth/success`,
  clientFailureRedirectUrl:
    process.env.CLIENT_FAILURE_REDIRECT_URL||
    `${clientUrl}/login?error=google_oauth_failed`,
  cookieDomain: process.env.COOKIE_DOMAIN||undefined,
  authCookieName: process.env.AUTH_COOKIE_NAME||"bus_ticket_auth",
  authCookieSameSite: process.env.AUTH_COOKIE_SAME_SITE||"lax",
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID||"",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET||"",
    redirectUri: process.env.GOOGLE_REDIRECT_URI||"",
  },
};

env.corsOrigins=splitOrigins(process.env.CORS_ORIGINS||clientUrl);

export default env;
