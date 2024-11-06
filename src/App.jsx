import React, { useState } from 'react';
import DecryptionWidget from './components/widgets/DecryptionWidget'
import EncryptionWidget from './components/widgets/EncryptionWidget';

function App() {
    const [file, setFile] = useState(undefined)

    return (
        <div>
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
