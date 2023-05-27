import { Modal, Form, Button } from "react-bootstrap";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            content: noteToEdit?.content || ""
        }
    });

    async function onSubmit(noteInput: NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                noteResponse = await NotesApi.updateNote(noteToEdit._id, noteInput);
            } else {
                noteResponse = await NotesApi.createNote(noteInput);
            }
            onNoteSaved(noteResponse);
        }
        catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit Note" : "Add Note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter note title"
                            isInvalid={!!errors.title}
                            {...register("title", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}    
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            placeholder="Enter note content"
                            {...register("content")}
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        type="submit" 
                        form="addEditNoteForm"
                        disabled={isSubmitting}
                    >
                        Save Note
                    </Button>
                </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditNoteDialog;