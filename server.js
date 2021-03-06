const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
let notes = require("./db/db.json");

//create express server
const app = express();
const PORT = process.env.PORT || 3000;

const OUTPUT_DIR = path.resolve(__dirname, "db");
const outputPath = path.join(OUTPUT_DIR, "db.json");

function htmlRoute() {
  // routing return index.html
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
  });

  // routing return notes.html
  app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./notes.html"));
  });
}

function apiRoute() {
  // read db.json and return all saved notes
  app.get("/api/notes", function (req, res) {
    return res.json(notes);
  });

  // return single selected note
  app.get("/api/notes/:id", function (req, res) {
    const chosen = req.params.id;

    for (let i = 0; i < notes.length; i++) {
      if (chosen == notes[i].id) {
        return res.json(notes[i]);
      }
    }
    console.log("selected note not founded");
    return res.json(false);
  });

  // add new note to db.json
  app.post("/api/notes", function (req, res) {
    const newNotes = req.body;

    newNotes.id = uuidv4();
    notes.push(newNotes);

    writeToDB(notes);
    return res.json(newNotes);
  });

  // delete selected note
  app.delete("/api/notes/:id", function (req, res) {
    const chosen = req.params.id;

    for (let i = 0; i < notes.length; i++) {
      if (chosen == notes[i].id) {
        notes.splice(i, 1);
        writeToDB(notes);
        return res.json(notes);
      }
    }
    console.log("delete note not founded");
    return res.json(false);
  });
}

function writeToDB(data) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, JSON.stringify(data));
}

function init() {
  //middleware
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

  //router
  htmlRoute();
  apiRoute();

  // listener
  app.listen(PORT, function () {
    console.log(`App is listening at PORT ${PORT}`);
  });
}

init();
