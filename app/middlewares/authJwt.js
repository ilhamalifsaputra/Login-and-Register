const jwt = require("jsonwebtoken")
const config = require("../config/authConfig")
const db = require("../models")
const User = db.user
const Role = db.role

// Make a function for verify token
verifyToken = (req, res, next) => {
    let token = req.session.token

    if (!token) {
        return res.status(403).send({ message: "Token tak ditemukan!"})
    }

    jwt.verify(
        token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized",
                })
            }
            req.userId = decoded.id
            next()
        }
    )
}

// Make a function for verify admin
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({
                message: err
            })
            return
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({
                        message: err
                    })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles [i].name === "admin") {
                        next()
                        return
                    }
                }

                res.status(403).send({
                    message: "Perlu ole admin!"
                })
            }
        )
    })
}

// Make a function for verify moderator
isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

    Role.find(
        {
            _id: { $in: user.roles },
        },
        (err, roles) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return;
                }
            }
            res.status(403).send({ message: "Perlu role moderator!" });
            return;
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
}

module.exports = authJwt