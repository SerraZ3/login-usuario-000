const express = require("express");
const app = express();
const port = 3001;
const methodOverride = require("method-override");
const indexRoute = require("./src/routes/indexRoute");
const authRoute = require("./src/routes/authRoute");


app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Configura pasta estática para acesso externo
app.use(express.static(__dirname + "/public"));
// Configura o template engine
app.set("view engine", "ejs");
// Configura o caminho para os views
app.set("views", __dirname + "/src/views");


app.use("/", indexRoute);
app.use("/", authRoute);


app.listen(port, () => {
  console.log("Estamos rodando em: http://localhost:" + port);
});
