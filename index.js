/*
####  prototype of encrypted chat box ####
#          Developed by Baramex          #
### github: https://github.com/baramex ###

License: lgpl-3.0
*/

/* path */
const path = require("path");

/* server init */
const express = require("express");
const { createServer } = require("http");
const port = 1001;
const app = express();
const httpServer = createServer(app);

httpServer.listen(port, () => console.log("[server/INFO] Server started !"));

/* server gets */
app.get("*", (req, res) => {
    return res.sendFile(path.join(__dirname, "pages", "index.html"));
});

/* socket */
const io = new require("socket.io")(httpServer);

var token;
updateToken();
var n = 0;

io.on("connection", (socket) => {
    console.log("[server/INFO] Client connected !");

    io.emit("join", socket.id);

    socket.emit("key", token);

    socket.on("message", (mes) => {
        var infos = { encrypted: mes.message, sender: { id: socket.id }, time: mes.time };
        console.log("[server/INFO] Received message ! Message: " + infos.encrypted + " - Sender: " + infos.sender.id + " - Message n°" + n)

        io.emit("message", infos);

        n++;
    });
});

function updateToken() {
    token = generateToken();

    io.emit("key", token);
}

function generateToken() {
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    var length = 2048;
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}