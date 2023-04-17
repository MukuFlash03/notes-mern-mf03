import express from "express";
const app = express();
// const port = 5000;
const port = undefined;

app.get("/", (req, res) => {
    res.send("Hola Mundo!!!");
});

app.listen(port!, () => {
    console.log("Server started on Port: " + port);
});



