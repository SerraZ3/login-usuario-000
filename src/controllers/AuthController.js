const fs = require("fs");
const path = require("path");
const bcrypt = require("../helpers/bcrypt");
const indexController = {
  login: (req, res) => {
    res.render("login", {
      title: "Login",
      user: req.cookies.user,
      admin: req.cookies.admin
    });
  },
  auth: (req, res) => {
    const usersJson = fs.readFileSync(
      path.join(__dirname, "..", "data", "users.json"),
      "utf-8"
    );

    let users = JSON.parse(usersJson);
    // LIMPEZA DE COOKIES
    res.clearCookie("user");
    res.clearCookie("admin");

    // CAPTURA DO EMAIL E SENHA ENVIADOS
    const { email, senha } = req.body;
    console.log(req.session.email);
    console.log(email, senha);
    // BUSCA POR USUÁRIO RELACIONADO AOS DADOS ENVIADOS
    const userLogin = users.find((usuario) => {
      if (usuario.email === email) {
        if (bcrypt.compareHash(senha, usuario.senha)) {
          return true;
        }
      }
    });

    // CASO NÃO ENCONTREMOS UM USUÁRIO COM ESSES DADOS
    if (!userLogin) {
      return res.render("login", {
        title: "Login",
        error: {
          message: "Verifique se o email e a senha correspondem",
        },
      });
    }

    // FILTRAMOS ALGUNS CAMPOS COM O JSON.STRINGIFY (COMO A SENHA)
    let user = JSON.parse(
      JSON.stringify(userLogin, [
        "id",
        "nome",
        "sobrenome",
        "apelido",
        "email",
        "admin",
      ])
    );

    // DEFINIMOS OS COOKIES USUÁRIO (OBJETO) E ADMIN (BOOLEANO)
    req.session.email = user.email;
    res.cookie("user", user);
    res.cookie("admin", `${userLogin.admin}`);
    res.redirect("/");
  },
  register: (req, res) => {
    res.render("register", {
      title: "Cadastro",
    });
  },
  create: (req, res) => {
    const usersJson = fs.readFileSync(
      path.join(__dirname, "..", "data", "users.json"),
      "utf-8"
    );

    let users = JSON.parse(usersJson);

    const { nome, sobrenome, apelido, senha, email, confirmar_senha } =
      req.body;
    if (senha !== confirmar_senha) {
      return res.render("register", {
        title: "Cadastro",
        error: {
          message: "Senhas não coincidem",
        },
      });
    }
    if (
      !nome ||
      !sobrenome ||
      !apelido ||
      !senha ||
      !confirmar_senha ||
      !email
    ) {
      return res.render("register", {
        title: "Cadastro",
        error: { message: "Preencha todos os campo" },
      });
    }
    let newUser = {
      nome,
      sobrenome,
      apelido,
      senha: bcrypt.generateHash(senha),
      email,
    };
    let newId = users[users.length - 1].id + 1;
    newUser.criadoEm = new Date();
    newUser.modificadoEm = new Date();
    newUser.admin = false;
    newUser.id = newId;
    users.push(newUser);
    fs.writeFileSync(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(users)
    );
    res.redirect("/");
  },
  logout: (req, res) => {
    req.session.destroy();
    // LIMPEZA DE COOKIES
    res.clearCookie("user");
    res.clearCookie("admin");
    res.redirect("/");
  },
};

module.exports = indexController;
