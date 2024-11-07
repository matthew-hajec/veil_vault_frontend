import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DecryptionWidget from './components/widgets/DecryptionWidget'
import EncryptionWidget from './components/widgets/EncryptionWidget';
import LoginButton from './components/auth/LoginButton'
import LogoutButton from './components/auth/LogoutButton';

function App() {
    const [file, setFile] = useState(undefined)

    const {user, isAuthenticated, isLoading} = useAuth0()

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
             {!isAuthenticated &&
                <LoginButton />
             }
             {isAuthenticated &&
                <>
                    <p>Logged in as: {user.name}</p>
                    <LogoutButton />
                </>
             }
            <input
                type='file'
                onChange={e => setFile(e.target.files[0])}
            ></input>
            <DecryptionWidget file={file} />
            <EncryptionWidget file={file} />
        </div>
    );
}

export default App;
