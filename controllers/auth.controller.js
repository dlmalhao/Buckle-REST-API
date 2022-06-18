const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Course = db.course;

exports.signup = async (req, res) => {
  try {
    let user = await User.findOne({
      where: { email_utilizador: req.body.email_utilizador },
    });
    if (user) return res.status(422).json({success:false, message: "Email already exists!" });

    let course = await Course.findOne({
      where: { descricao_curso: req.body.descricao_curso },
    });

    // save User to database
    user = await User.create({
      email_utilizador: req.body.email_utilizador,
      password: bcrypt.hashSync(req.body.password, 10), // generates hash to password
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      role: "Student",
      status: "active",
      gender :req.body.gender,
      courseId: course.id,
      img: "https://imagens.mdig.com.br/thbs/45184mn.jpg",
      bgImg: "https://www.solidbackgrounds.com/images/2048x1536/2048x1536-powder-blue-web-solid-color-background.jpg",
      descricao:"",
      date:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())
    })
    return res.json({
      success: true,
      message: "User was registered successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body || !req.body.email_utilizador || !req.body.password)
      return res
        .status(400)
        .json({ success: false, msg: "Must provide email and password." });
    let user = await User.findOne({
      where: { email_utilizador: req.body.email_utilizador },
    }); //get user data from DB
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found." });
    // tests a string (password in body) against a hash (password in database)
    const check = bcrypt.compareSync(req.body.password, user.password);
    if (!check)
      return res.status(401).json({
        success: false,
        accessToken: null,
        msg: "Invalid credentials!",
      });
    // sign the given payload (user ID and role) into a JWT payload – builds JWT token, using secret key
    const token = jwt.sign(
      { id: user.id, role: user.userTypeId },
      config.secret,
      {
        expiresIn: "24h", // 24 hours
      }
    );

    return res
      .status(200)
      .json({ success: true, accessToken: token, user: user });
  } catch (err) {
    if (err instanceof ValidationError)
      res
        .status(400)
        .json({ success: false, msg: err.errors.map((e) => e.message) });
    else
      res.status(500).json({
        success: false,
        msg: err.message || "Some error occurred at login.",
      });
  }
};

exports.verifyToken = (req, res, next) => {
  // search token in headers most commonly used for authorization
  const header = req.headers["x-access-token"] || req.headers.authorization;
  if (typeof header == "undefined")
    return res.status(401).json({ success: false, msg: "No token provided!" });
  const bearer = header.split(" "); // Authorization: Bearer <token>
  const token = bearer[1];
  try {
    let decoded = jwt.verify(token, config.secret);
    req.loggedUserId = decoded.id; // save user ID and role into request object
    req.loggedUserRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Unauthorized!" });
  }
};

exports.isAdmin = async (req, res, next) => {
  let user = await User.findByPk(req.loggedUserId);
  let user_type = await UserType.findOne({ where: { id: user.userTypeId } });
  if (user_type.type === "Admin") {
    next();
  } else {
    return res.status(403).send({
      message: "Require Admin User Type!",
    });
  }
};

exports.isAdminOrLoggedUser = async (req, res, next) => {
  let user = await User.findByPk(req.loggedUserId);
  let user_type = await UserType.findOne({ where: { id: user.userTypeId } });
  if (user_type.type === "Admin" || user.id == req.params.userID) {
    next();
  } else {
    return res.status(403).send({
      message: "Require Admin User Type!",
    });
  }
};

exports.isAssociation = async (req, res, next) => {
  let user = await User.findByPk(req.loggedUserId);
  let user_type = await UserType.findOne({ where: { id: user.userID } });
  if (user_type.type === "Association" || user_type.type === "Admin") {
    next();
  } else {
    return res.status(403).send({
      message: "Require Association or Admin User Type!",
    });
  }
};
