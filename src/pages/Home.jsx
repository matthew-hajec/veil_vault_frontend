import { useAuth0 } from '@auth0/auth0-react';
import DecryptionWidget from '../components/widgets/Decryption';

const HomePage = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        <div>
            <DecryptionWidget />
            <h1>Home</h1>
            {isAuthenticated ? (
                <p>Welcome, {user.name}!</p>
            ) : (
                <p>Welcome, please log in.</p>
            )}
        </div>
    )

}

export default HomePage;