const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// Checking duplicate such as Email and Username
checkDuplicate = (req, res, next) => {
    //Username
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (user) {
            res.status(400).send({ message: "Gagal, username tidak ditemukan!"});
            return;
        }

        //Email
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                res.status(400).send({ message: "Gagal, email tidak ditemukan!"});
                return;
            }

            next();
        }).catch(err => {
            res.status(500).send({ message: err });
            return;
        });
    }).catch(err => {
        res.status(500).send({ message: err });
        return;
    });
}

// Checking role function
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Gagal! Role ${req.body.roles[i]} tidak ditemukan!`
                });
                return;
            }
        }
    }
    next();
}

// Wrap function for export
const verifySignUp = {
    checkDuplicate,
    checkRolesExisted
}

module.exports = verifySignUp;
