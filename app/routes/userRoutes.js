const { authJwt, authjwt } = require("../middlewares")
const controller = require("../controllers/userController")

module.exports = function(app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        )
        next()
    })

    app.get("/api/test/all", controller.allAccess)

    app.get("/api/test/user", [authjwt.verifyToken], controller.userBoard)

    app.get(
        "/api/test/mod",
        [authjwt.verifyToken, authjwt.isModerator],
        controller.moderatorBoard
    )

    app.get(
        "/api/test/admin",
        [authjwt.verifyToken, authjwt.isAdmin],
        controller.adminBoard
    )
} 