const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")

app.listen(4000,(req,res) => {
    console.log("Jai shree shyam")
})

mongoose.set("strictQuery",false)
mongoose.connect("mongodb+srv://Manish:7993819446@nodejsproject.rucaek2.mongodb.net/userAuth?retryWrites=true&w=majority")
.then(() => {
    console.log("connected to the database successfully")
})
.catch((err) => {
    console.log(err)
})

//middlewares
app.use(express.json())

app.use("/api/auth",authRoute);