import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import LoginModal from './components/modals/LoginModal';
import SignUpModal from './components/modals/SignUpModal';
import { User } from "./models/user";
import * as UsersApi from "./network/users_api";
import NotFoundPage from './pages/NotFoundPage';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import styles from "./styles/App.module.css";

function App() {

	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

	const [showSignUpModal, setShowSignUpModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	useEffect(() => {
		async function fetchLoggedInUser() {
			try {
				const user = await UsersApi.getLoggedInUser();
				setLoggedInUser(user);
			} catch (error) {
				console.log(error);
			}
		}
		fetchLoggedInUser();
	}, []);

	return (
		<BrowserRouter>
			<div>
				<NavBar
					loggedInUser={loggedInUser}
					onSignUpClicked={() => { setShowSignUpModal(true); }}
					onLoginClicked={() => { setShowLoginModal(true); }}
					onLogoutSuccess={() => { setLoggedInUser(null); }}
				/>

				<Container className={styles.pageContainer}>
					<Routes>
						<Route
							path="/"
							element={<NotesPage loggedInUser={loggedInUser} />}
						/>
						<Route
							path="/privacy"
							element={<PrivacyPage />}
						/>
						<Route
							path="/*"
							element={<NotFoundPage />}
						/>
					</Routes>
				</Container>

				{showSignUpModal &&
					<SignUpModal
						onDismiss={() => { setShowSignUpModal(false); }}
						onSignUpSuccess={(user: User) => {
							setLoggedInUser(user);
							setShowSignUpModal(false);
						}}
					/>
				}
				{showLoginModal &&
					<LoginModal
						onDismiss={() => { setShowLoginModal(false); }}
						onLoginSuccess={(user: User) => {
							setLoggedInUser(user);
							setShowLoginModal(false);
						}}
					/>
				}
			</div>
		</BrowserRouter>
	);
}

export default App;
