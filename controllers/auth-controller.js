const bcrypt = require("bcrypt");

const db = require("../data/database");

exports.getSignup = (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: "",
    };
  }

  req.session.inputData = null;

  res.render("signup", { inputData: sessionInputData });
};

exports.postSignup = async (req, res) => {
  const enteredEmail = req.body.email;
  const enteredConfirmEmail = req.body["confirm-email"];
  const enteredPassword = req.body.password;

  const userExist = await db.getDb().collection('users').findOne({email: enteredEmail})

  if (
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredPassword.length < 6 ||
    !enteredEmail.includes("@") ||
    enteredEmail !== enteredConfirmEmail ||
    userExist
  ) {
    req.session.inputData = {
      hasError: true,
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    req.session.save(() => {
      console.log("Something wrong in your data!");
      res.redirect("/signup");
    });
    return;
  }



  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  await db
    .getDb()
    .collection("users")
    .insertOne({ email: enteredEmail, password: hashedPassword });

  res.redirect("/login");
};

exports.getLogin = (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }
  req.session.inputData = null;
  res.render("login", { inputData: sessionInputData });
};

exports.postLogin = async (req, res) => {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (!existingUser || existingUser.length === 0) {
    req.session.inputData = {
      hasError: true,
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(() => {
      console.log("Something wrong in your data!");
      res.redirect("/login");
    });
    return;
  }

  const isAcheckForPassword = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  if (!isAcheckForPassword) {
    req.session.inputData = {
      hasError: true,
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(() => {
      console.log("Wrong Password!");
      res.redirect("/login");
    });
    return;
  }

  req.session.user = {
    id: existingUser._id,
    email: existingUser.email,
  };
  req.session.isAuthenticated = true;

  res.redirect("/admin");
};

exports.logOut = async (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect("/");
};
