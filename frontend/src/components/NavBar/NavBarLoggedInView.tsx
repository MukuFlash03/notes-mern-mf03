import { Button, Navbar } from "react-bootstrap";
import { User } from "../../models/user";
import * as UsersApi from "../../network/users_api";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccess: () => void,
}

const NavBarLoggedInView = ({ user, onLogoutSuccess }: NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await UsersApi.logout();
            onLogoutSuccess();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <>
            <Navbar.Text>
                Logged in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>
                Logout
            </Button>
        </>
    );
}

export default NavBarLoggedInView;