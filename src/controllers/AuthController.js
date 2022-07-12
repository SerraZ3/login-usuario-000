const fs = require("fs");
const path = require("path");
const indexController = {
  login: (req, res) => {
    res.render("login", {
      title: "Login",
    });
  },
  auth: (req, res) => {
    // LIMPEZA DE COOKIES
    res.clearCookie("usuario");
    res.clearCookie("admin");

    // CAPTURA DO EMAIL E SENHA ENVIADOS
    const { email, senha } = req.body;

    // BUSCA POR USUÁRIO RELACIONADO AOS DADOS ENVIADOS
    const usuarioLogado = usuariosPlaceholder.filter((usuario) => {
      if (usuario.email === email) {
        if (usuario.senha === senha) {
          return usuario;
        }
      }
    });

    // CASO NÃO ENCONTREMOS UM USUÁRIO COM ESSES DADOS
    if (!usuarioLogado.length) {
      res.render("login", {
        titulo: "Ops!",
        subtitulo: "Algo de errado não deu certo...",
        usuarioLogado: req.cookies.usuario,
        usuarioAdmin: req.cookies.admin,
      });
    }

    // FILTRAMOS ALGUNS CAMPOS COM O JSON.STRINGIFY (COMO A SENHA)
    let usuario = JSON.parse(
      JSON.stringify(usuarioLogado[0], [
        "id",
        "nome",
        "sobrenome",
        "apelido",
        "email",
        "admin",
      ])
    );

    // DEFINIMOS OS COOKIES USUÁRIO (OBJETO) E ADMIN (BOOLEANO)
    res.cookie("usuario", usuario);
    res.cookie("admin", `${usuarioLogado[0].admin}`);
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
    console.log(req.body);
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
    let newUser = { nome, sobrenome, apelido, senha, email };
console.log(newUser);
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
  logout: (req, res) => {},
};

module.exports = indexController;
