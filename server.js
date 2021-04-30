// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
let idCounter = 1;
// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;
// Sets up Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(express.json());
// Check for Server Running
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
// Serve HTML Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
// GET Notes Api
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));
// GET Specific Note
app.get('/api/notes/:note', (req, res) => {
    // chosen note 
    const chosen = req.params.note;
    // for loop iteration, if selected note title is in db.json, response is json of that specific db entry
    for (let i = 0; i < db.length; i++) {
        if (chosen === db[i].title) {
          return res.json(db[i]);
        };
      };
});
// POST
app.post('/api/notes', (req, res) => {
    // New API note
    const newNote = req.body;
    // get data from db.json
    let dbData = fs.readFileSync(path.join(__dirname, './db/db.json'));
    // parse dbData
    let parsedDbData = JSON.parse(dbData);
    // Push note to db.json with id number 
    newNote.id = verifyID(parsedDbData);
    console.log(newNote.id, 'new note id');
    parsedDbData.push(newNote);
    // Overwrite existing db.json
    fs.writeFile('./db/db.json', JSON.stringify(parsedDbData), err => {
        err ? console.error(err) : console.log('Success');
    });
    // Reload the page on new note creation
    res.end();
});
// DELETE
app.delete('/api/notes/:id', (req, res) => {

    const returnId = req.params.id;
    console.log(returnId);
    // get data from db.json
    let dbData = fs.readFileSync(path.join(__dirname, './db/db.json'));
    // parse dbData
    let parsedDbData = JSON.parse(dbData);
    for (let i = 0; i < parsedDbData.length; i++) {
        if (parsedDbData[i].id == returnId) {
            console.log()
            parsedDbData.splice(i, 1);
        };
    };
    // Overwrite existing db.json
    fs.writeFile('./db/db.json', JSON.stringify(parsedDbData), err => {
        err ? console.error(err) : console.log('Success');
    });
    res.end();
});

function verifyID(parsedData) {
    let x = parsedData.length;
    if (x === 0) {
        x = 1
    }
    else {
        for (i = 0; i < parsedData.length; i++) {
            console.log(parsedData[i].id, 'within the function');
            if (parsedData[i].id === x){
                x++;
            }
        }
    }
    return x
}