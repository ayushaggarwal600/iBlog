require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;

//MongoDB Connection
const connect = require("./connection");
connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connection success");
  })
  .catch((error) => {
    console.log("DB connection fail", error.message);
  });

//ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

//Home Page
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

//Routes
app.use("/user", userRouter);
app.use("/blog", blogRouter);

//Listen on PORT
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
