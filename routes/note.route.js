
const express = require("express")

const { NoteModel } = require("../modules/Note.model")

const noteRouter = express.Router();

// get
noteRouter.get("/", async (req, res) => {

    const notes = await NoteModel.find()
    res.send(notes)
})

// post.....
noteRouter.post("/create", async (req, res) => {
    const payload = req.body
    try {
        const new_note = new NoteModel(payload)
        await new_note.save()
        res.send({ "msg": "Note created sucessfully" })
    } catch (err) {
        console.log(err)
        res.send({ "error": "Something went wrong " })
    }
})
// patch..............

noteRouter.patch("/update/:noteId", async (req, res) => {
    const noteId = req.params.noteId
    const userId = req.body.userId

    const note = await NoteModel.findOne({ _id: noteId })
    if (userId !== note.userId) {
        res.send("Not authorized")
    } else {
        await NoteModel.findByIdAndUpdate({ _id: noteId }, payload)
        res.send("Note updated sucessfully")
    }

});

// delete
noteRouter.delete("/delete/:noteId", async (req, res) => {
    const noteId = req.params.noteId
    const userId = req.body.userId

    const note = await NoteModel.findOne({ _id: noteId })
    if (userId !== note.userId) {
        res.send("Not authorized")
    } else {
        await NoteModel.findByIdAndDelete({ _id: noteId })
        res.send("Deleted Sucessfully")
    }



})

module.exports={noteRouter}