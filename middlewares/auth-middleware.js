const auth = async (req, res, next) => {
  const user = await req.session.user;
  const isAuth = await req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next();
  }

  res.locals.isAuth = isAuth;

  next();
};

module.exports = auth;