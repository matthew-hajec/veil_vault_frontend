import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
    const { user, isAuthenticated } = useAuth0();

    return (
        <div>
            <h1>Home</h1>
            {isAuthenticated ? (
                <p>Welcome, {user.name}!</p>
            ) : (
                <p>Welcome, please log in.</p>
            )}
        </div>
    )

}

export default Home;