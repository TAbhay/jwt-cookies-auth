const express = require("express");
const app     = express();
const bodyParser = require("body-parser");
const morgan     = require("morgan");
const mongoose   = require("mongoose");
const cors       = require('cors');
const authRoutes = require("./routes/auth");
// const MongoStore = require("connect-mongo")(session);
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
mongoose.connect(process.env.MongoDB_URI|| "mongodb://localhost/project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(morgan("tiny"));
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
mongoose.connection
  .once("open", () => console.log("MongoDB succesfully connected!"))
  .on("error", (error) => {
    console.log("Error in connecting MongoDB:", error);
  });

app.use(authRoutes);


const port = process.env.PORT || 27017;
app.listen(port,function(req,res){
    console.log(`Server Listening on http://localhost:${port}`);
});
