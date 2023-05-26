import express from "express";
import * as NotesController from "../controllers/notes";

/*
app.get("/", (req, res) => {
    res.send("Hola World!");
});
*/

const router = express.Router();

router.get("/", NotesController.getNotes);
router.get("/:noteId", NotesController.getNote);
router.post("/", NotesController.postNote);
router.patch("/:noteId", NotesController.updateNote);
router.delete("/:noteId", NotesController.deleteNote);

export default router;