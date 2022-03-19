const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {port} = require("./config");
const connectDb = require("./db");
const routes = require("./routers");

const app = express();

app.use(cors());
app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", routes);

(async function start() {
    await connectDb();
    app.listen(port, () => { console.log("Server listening on port ", port) });
})();