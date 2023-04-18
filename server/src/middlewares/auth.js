const isLoggedIn = (req, res, next) => {
    try {
        if (req.session.userId) {
            next()
        } else {
            return res.status(400).json({
                message: "please login",
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const isLoggedOut = (req, res, next) => {
    try {
        if (req.session.userId) {
            return res.status(400).json({
                message: "please logout",
            })
        }
        next()
    } catch (err) {
        console.log(err)
    }
}

module.exports = { isLoggedIn, isLoggedOut }