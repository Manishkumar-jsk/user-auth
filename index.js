const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const dotenv = require("dotenv");

dotenv.config();

app.listen(4000,(req,res) => {
    console.log("connected to the server successfully")
})

mongoose.set("strictQuery",false)
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("connected to the database successfully")
})
.catch((err) => {
    console.log(err)
})

//middlewares
app.use(express.json())

app.use("/api/auth",authRoute);