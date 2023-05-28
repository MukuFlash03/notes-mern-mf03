import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../../models/note";
import * as NotesApi from "../../network/notes_api";
import { NoteInput } from "../../network/notes_api";
import TextInputField from "../form/TextInputField";

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
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Enter note title"
                        register={register}
                        registerOptions={{ required: "Please enter a title" }}
                        error={errors.title}
                    />
                    <TextInputField
                        name="content"
                        label="Content"
                        as="textarea"
                        rows={5}
                        placeholder="Enter note content"
                        register={register}
                    />
                    {/* <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter note title"
                            isInvalid={!!errors.title}
                            {...register("title", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}    
                        </Form.Control.Feedback>
                    </Form.Group> */}

                    {/* <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            placeholder="Enter note content"
                            {...register("content")}
                        />
                    </Form.Group> */}
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