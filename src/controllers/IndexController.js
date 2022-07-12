const indexController = {
  home: (req, res) => {
    return res.render("index", {
      title: "Home",
      user: req.cookies.user,
      admin: req.cookies.admin,
    });
  },
};

module.exports = indexController;
