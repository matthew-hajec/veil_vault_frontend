import { decryptEnc0File } from '../crypto/enc0';

const baseUrl = '/api';

export async function uploadFile(file, token) {
  const url = `${baseUrl}/file/upload`;
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  // Handle 400 errors
  if (response.status === 400) {
    const data = await response.json();
    throw new Error(data.error);
  }

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

export async function downloadFile(id, password) {
  const linkUrl = `${baseUrl}/file/download_url/${id}`;
  const response = await fetch(linkUrl);

  if (!response.ok) {
    throw new Error('Failed to get download link.');
  }

  const { url } = await response.json();

  const downloadResponse = await fetch(url);

  if (!downloadResponse.ok) {
    throw new Error('Failed to download file.');
  }

  const file = await downloadResponse.blob();

  try {
    const decryptedFile = await decryptEnc0File(file, password);
    return decryptedFile;
  } catch (error) {
    throw new Error('Failed to decrypt file.');
  }
}

export async function fetchFileSize(id) {
  const url = `${baseUrl}/file/size/${id}`;
  const response = await fetch(url);

  // Handle 404 errors
  if (response.status === 404) {
    throw new Error('File not found.');
  }

  if (!response.ok) {
    throw new Error('Server Error.');
  }

  const data = await response.json();

  if (!data || !data.size) {
    throw new Error('Invalid response from server.');
  }

  return data.size;
}

export async function getDashboardInfo(token) {
  const url = `${baseUrl}/user/dashboard`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get dashboard info.');
  }

  const data = await response.json();

  if (!data || !data.user || !data.files) {
    throw new Error('Invalid response from server.');
  }

  return data;
}
