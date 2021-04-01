const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const userRoutes = require("./api/routes/user");
const pollRoutes = require("./api/routes/poll");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/vote" || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => console.log(`connected to db!!!`))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3002;
// app.use(express.static(path.join(__dirname, "build")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/poll", pollRoutes);
app.listen(port, () => console.log(`server connected at port ${port}`));
