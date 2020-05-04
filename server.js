//create express server
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const notes = require("./db/db.json");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("welcome");

// html router GET request handle
app.get("/", function (req, res) {
  console.log("default page loaded");
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/notes", function (req, res) {
  console.log("notes.html loaded");
  res.sendFile(path.join(__dirname, "./notes.html"));
});


// API router requests handle
app.get("/api/notes", function (req, res) {
  console.log("api notes loaded");
  res.json(notes);
});

app.post("/api/notes", function (req, res) {
  const newNotes = req.body;

  console.log(newNotes);

  notes.push(newNotes);

  res.json(newNotes);
});

app.delete("/api/notes/:id", function (req, res) {});

// listener
app.listen(PORT, function () {
  console.log(`App is listening at PORT ${PORT}`);
});
