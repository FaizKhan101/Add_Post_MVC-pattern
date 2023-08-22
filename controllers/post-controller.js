const Post = require("../models/post");

exports.getHome = (req, res) => {
  res.render("home");
};

exports.getAdmin = async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.render("401");
  }

  const posts = await Post.fetchAll();

  res.render("admin", { posts });
};

exports.postAdmin = async (req, res) => {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  const post = new Post(enteredTitle, enteredContent);
  await post.save();

  res.redirect("/admin");
};

exports.getEditPost = async (req, res, next) => {
  const postId = req.params.id;
  let post;
  try {
    post = new Post(null, null, postId);
    await post.fetchSingle();
    if (!post || post.length === 0) {
      return res.status(404).render("404");
    }
    res.render("update-post", { post });
  } catch (error) {
    next(error)
  }
};

exports.postEditPost = async (req, res) => {
  const postId = req.params.id;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;

  const post = new Post(updatedTitle, updatedContent, postId);
  await post.save();

  res.redirect("/admin");
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  const postDelete = new Post(null, null, postId);
  await postDelete.deletePost();

  res.redirect("/admin");
};
