const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

//connect to mongoose

mongoose.connect('mongodb+srv://Oasis:Oasis@oasis.utdhl.mongodb.net/Oasis');

app.use("/", require("./routes/noteRoute"));

app.listen(57454, function() {
    console.log("express server is running on port 57454");
})
