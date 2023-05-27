import styles from "../styles/Note.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Card } from "react-bootstrap";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface NoteProps {
    note: NoteModel,
    onNoteClicked: (note: NoteModel) => void,
    onDeleteClicked: (note: NoteModel) => void,
    className?: string,
}

const Note = ({ note, onNoteClicked, onDeleteClicked, className }: NoteProps) => {

    const {
        title,
        content,
        createdAt,
        updatedAt,
    } = note;

    let createdUpdatedAt: string;
    if (updatedAt > createdAt) {
        createdUpdatedAt = `Updated: ${formatDate(updatedAt)}`;
    } else {
        createdUpdatedAt = `Created: ${formatDate(createdAt)}`;
    }

    return (
        <Card 
            className={`${styles.noteCard} ${className}`}
            onClick={() => {
                onNoteClicked(note);
            }}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={stylesUtils.flexCenter}>
                    {title}
                    <MdDelete 
                        className="text-muted ms-auto" 
                        onClick={(e) => {
                            onDeleteClicked(note);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {content}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedAt}
            </Card.Footer>
        </Card>
    )
}

export default Note;