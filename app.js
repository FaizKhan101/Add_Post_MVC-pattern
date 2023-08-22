const express = require("express");
const session = require("express-session");

const sessionConfig = require('./config/session')
const authMiddleware = require('./middlewares/auth-middleware')
const db = require("./data/database");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

sessionConfig.createSessionStore(session)

const app = express();



app.use(
  session(sessionConfig.createSessionConfig())
);

app.use(authMiddleware);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(blogRoutes);

app.use((error, req, res, next) => {
  console.log({error});
  res.render('500')
})

db.connectToDatabase().then(() => {
  app.listen(3000, () => {
    console.log("Server start at port 3000!");
  });
});
