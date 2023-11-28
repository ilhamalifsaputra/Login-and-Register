const express = require("express")
const cors = require("cors")
const cookieSession = require("cookie-session")

const app = express()
app.use(express.json());

const db = require("./app/models/")
const dbConfig = require("./app/config/dbConfig")
const Role = db.role

//routes
require('./app/routes/authRoutes')(app)
require('./app/routes/userRoutes')(app)


db.mongoose.connect(`mongodb+srv://netrava:Indonesia45@firstmongo.nj5qd7o.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Sukses terkoneksi dengan MongoDB')
    initial()
})
.catch(err => {
    console.error("Koneksi Error!", err)
    process.exit
})

let corsOptions = {
    origin: "http://localhost:8080"
}

app.use(cors(corsOptions))

//parse content-type - application/json
app.use(express.json())

//parse conten-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(
    cookieSession({
        name: "userSession",
        keys: ["COOKIE_SECRET"],
        httpOnly: true
    })
)

app.get("/", (req, res) => {
    res.json({ message: "Selamat Datang!"})
})

//set port
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}.`)
})

//add initial function to set role
function initial() {
    Role.estimatedDocumentCount()
        .then(count => {
            if (count === 0) {
                new Role({
                    name: "user"
                }).save()
                .then(() => console.log("added 'user' to roles collection"))
                .catch(err => console.log("error", err));

                new Role({
                    name: "moderator"
                }).save()
                .then(() => console.log("added 'moderator' to roles collection"))
                .catch(err => console.log("error", err));

                new Role({
                    name: "admin"
                }).save()
                .then(() => console.log("added 'admin' to roles collection"))
                .catch(err => console.log("error", err));
            }
        })
        .catch(err => console.log("error", err));
}
