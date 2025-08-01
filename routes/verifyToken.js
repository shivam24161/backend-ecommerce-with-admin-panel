const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, data) => {
            if (err) return res.status(402).json("Not valid token");
            req.user = data;
            next();
        })
    }
    else {
        return res.status(402).json("Not authorized")
    }
}

const verifyTokenAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("you are not allowed to do this");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("you are not allowed to do this");
        }
    })
}


module.exports = { verifyToken, verifyTokenAuth, verifyTokenAndAdmin };