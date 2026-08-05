export const AUTH_COOKIE_NAME = "token";

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  // In production the API (Render) and frontend (Vercel) are on different
  // domains, so this is a cross-site request from the browser's point of
  // view. "lax" cookies are withheld from cross-site fetch/XHR, so the
  // login cookie would never be sent back on subsequent requests. "none"
  // requires secure:true, which only works over HTTPS (i.e. in production).
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
