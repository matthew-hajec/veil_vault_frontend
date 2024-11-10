export async function uploadFile(file, token) {
    const url = '/upload';
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('File upload failed');
    }

    const data = await response.json();

    // Validate the response data
    if (!data || !data.id) {
        throw new Error('Invalid response from server');
    }

    return data;
}