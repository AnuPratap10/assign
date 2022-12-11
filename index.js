const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const cors = require("cors")

require('dotenv').config()
const { connections } = require("./config/db")
const { UserModel } = require("./modules/User.model")
const {authenticate} = require("./middlewears/authentication");
const {noteRouter} =require("./routes/note.route")

const app = express()
app.use(express.json())
app.use(cors({ origin: "*" }))

app.get("/", (req, res) => {
    res.send("Hello world..Landing Page.......")
})

// signup..............

app.post("/signup", async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    const userPresent = await UserModel.findOne({ email })
    //TODO
    if (userPresent?.email) {
        res.send("Try loggin in, already exist")
    }
    else {
        try {
            bcrypt.hash(password, 4, async function (err, hash) {
                const user = new UserModel({ email, password: hash })
                await user.save()
                res.send("Sign up successfull")
            });

        }
        catch (err) {
            console.log(err)
            res.send("Something went wrong, pls try again later")
        }
    }

})
// working fine..................

// login...........


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email })

        if (user.length > 0) {
            const hashed_password = user[0].password;
            bcrypt.compare(password, hashed_password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ "userID": user[0]._id }, 'hush');
                    res.send({ "msg": "Login successfull", "token": token })
                }
                else {
                    res.send("Login failed ")
                }
            })
        }
        else {
            res.send("Login failed ho gya")
        }
    }
    catch {
        res.send("Something went wrong, please try again later")
    }
})
// login work fine..............

// auth meddlewear
app.use(authenticate)

// note crud middlewear
app.use("/notes",noteRouter)



app.listen(process.env.PORT, async () => {
    try {
        await connections;
        console.log("Connect to db Sucessfull")

    } catch (err) {
        console.log("Connect to db Failed")
        console.log(err)

    }
    console.log("Listing on http://localhost:8080/")
})