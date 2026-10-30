const express = require("express");
const cors = require("cors");
const morgan = require('morgan')

const app = express();


const testRoute = require("./routes/testRoute");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ message: "Multivendor Ecommerce Backend Server Is Running!!!!" });
});




app.use("/api/test", testRoute);
app.use("/api/auth", authRoutes);


module.exports = app;