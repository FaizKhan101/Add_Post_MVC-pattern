const express = require("express");

const Post = require("../models/post")
const postController = require('../controllers/post-controller')

const router = express.Router();

router.get("/", postController.getHome);

router.get("/admin", postController.getAdmin);

router.post("/admin", postController.postAdmin);

router.get("/posts/:id/edit", postController.getEditPost);

router.post("/posts/:id/edit", postController.postEditPost);

router.post("/delete/:id", postController.deletePost);


module.exports = router;
