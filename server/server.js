const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./api/routes/user");
const pollRoutes = require("./api/routes/poll");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/vote", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => console.log(`connected to db!!!`))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/poll", pollRoutes);
app.listen(port, () => console.log(`server connected at port ${port}`));
