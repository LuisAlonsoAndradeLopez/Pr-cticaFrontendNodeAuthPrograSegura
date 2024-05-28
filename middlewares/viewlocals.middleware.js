const AppPath = process.env.AppPath

const ViewLocals = (req, res, next) => {
    const IsAuthenticated = req.session.user == null ? false : true;
    res.locals.user = req.session.user;
    res.locals.IsAuthenticated = IsAuthenticated;
    res.locals.AppPath = AppPath;
    next();
}

module.exports = ViewLocals