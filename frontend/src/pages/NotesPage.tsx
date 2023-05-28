import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/Notes/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/Notes/NotesPageLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";

interface NotesPageProps {
    loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
    return (
        <>
            <Container className={styles.notePage}>
                <>
                    {loggedInUser
                        ? <NotesPageLoggedInView />
                        : <NotesPageLoggedOutView />
                    }
                </>
            </Container>
        </>
    );
}

export default NotesPage;