const PORT = process.env.PORT || 3000;
const notes = require("./db/db.json");
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// filter queries
function filteredQuery(query, notesArr) {
  let filtered = notesArr;
  if (query.title) {
    filtered = filtered.filter((notes) => notes.title === query.title);
  }
  if (query.text) {
    filtered = filtered.filter((notes) => notes.text === query.text);
  }
  return filtered;
}

// create notes
function createNote(body, notesArr) {
  let note = body;
  notesArr.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArr, null, 2)
  );
  return note;
}

// delete notes
function deleteNote(id, notesArr) {
  for (let i = 0; i < notesArr.length; i++) {
    let note = notesArr[i];

    if (note.id == id) {
      notesArr.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArr, null, 2)
      );
    }
  }
}

// GET HOME API route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// GET NOTES API
app.get("/api/notes", function (req, res) {
  let results = notes;
  if (req.query) {
    results = filteredQuery(req.query, results);
  }
  res.json(results);
});

// POST NOTES API
app.post("/api/notes", function (req, res) {
  req.body.id = notes.length.toString();
  const note = createNote(req.body, notes);
  console.log(req.body);
  res.json(req.body);
});

// DELETE NOTES API
app.delete("/api/notes/:id", function (req, res) {
  deleteNote(req.params.id, notes);
  res.json(true);
});

// GET notes route
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// GET catchall route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
