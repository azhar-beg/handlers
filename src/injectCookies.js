const parseCookies = (rawCookies) => {
  if (!rawCookies) {
    return;
  }

  const cookies = {};
  rawCookies.split(';').forEach(cookie => {
    const [key, value] = cookie.split('=');
    cookies[key] = value;
  })
  return cookies;
};

const injectCookies = (req, res, next) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
};

module.exports = { injectCookies };
