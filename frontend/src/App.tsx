import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import { Button, Spinner } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Container, Row, Col } from 'react-bootstrap';
import styles from "./styles/NotesPage.module.css";
import stylesUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/notes_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from 'react-icons/fa';
import { set } from 'react-hook-form';

function App() {
	
	const [notes, setNotes] = useState<NoteModel[]>([]);
	const [notesLoading, setNotesLoading] = useState(true);
	const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
	
	const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
	const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
	
	useEffect(() => {
		async function getNotes() {
			try {
				setShowNotesLoadingError(false);
				setNotesLoading(true);
				const notes = await NotesApi.fetchNotes();
				setNotes(notes);
			} catch (error) {
				console.error(error);
				setShowNotesLoadingError(true);
			} finally {
				setNotesLoading(false);
			}
		}
		getNotes();
	}, []);
	
	async function deleteNote(note: NoteModel) {
		try {
			await NotesApi.deleteNote(note._id);
			setNotes(notes.filter(currentNote => currentNote._id !== note._id))
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}
	
	const notesGrid =       
		<Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
			{notes.map((note) => (
				<Col key={note._id}>
				<Note 
					note={note} 
					className={styles.note}
					onNoteClicked={(note) => {
					setNoteToEdit(note);
				}}
				onDeleteClicked={deleteNote}
				/>
				</Col>
			))}
		</Row>
		
		return (
			<Container className={styles.notePage}>
			<Button 
				className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
				onClick={() => setShowAddNoteDialog(true)}
			>
				<FaPlus />
				Add Note
			</Button>
			
			{ notesLoading && <Spinner animation="border" variant="primary" /> }
			{ showNotesLoadingError && <p>Something went wrong: Error loading notes. Please refresh the page and try again.</p> }
			{ !notesLoading && !showNotesLoadingError && 
				<>
					{
						notes.length > 0 
							? notesGrid
							: <p className={stylesUtils.blockCenter}>No notes yet. Add one above!</p>
					}
				</>
			}
			
			{ showAddNoteDialog && 
				<AddEditNoteDialog 
				onDismiss={() => setShowAddNoteDialog(false)}
				onNoteSaved={(newNote) => {
					setNotes([...notes, newNote]);
					setShowAddNoteDialog(false);
				}}
				/>
			}
			{ noteToEdit &&
				<AddEditNoteDialog 
				noteToEdit={noteToEdit}
				onDismiss={() => setNoteToEdit(null)}
				onNoteSaved={(updatedNote) => {
					setNotes(notes.map(currentNote => currentNote._id === updatedNote._id ? updatedNote : currentNote));
					setNoteToEdit(null);
				}}
				/>
			}
			</Container>
			);
		}
		
		export default App;
		