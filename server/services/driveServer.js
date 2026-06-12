import { Readable } from 'stream';
import { driveClient, googleConfigured } from './googleWorkspace.js';

export function driveConfigured() {
  return googleConfigured();
}

export async function uploadBuffer({ name, buffer, folderId, mimeType = 'application/octet-stream' }) {
  if (!folderId) {
    const error = new Error('Google Drive folder ID is not configured.');
    error.status = 503;
    throw error;
  }
  const drive = driveClient();
  const response = await drive.files.create({
    requestBody: {
      name,
      parents: [folderId],
      mimeType
    },
    media: {
      mimeType,
      body: Readable.from(buffer)
    },
    fields: 'id,name,mimeType,createdTime,webViewLink'
  });
  return response.data;
}

export async function uploadPdf({ name, buffer, folderId }) {
  return uploadBuffer({ name, buffer, folderId, mimeType: 'application/pdf' });
}

export async function getProtectedFile(fileId) {
  const drive = driveClient();
  const metadata = await drive.files.get({
    fileId,
    fields: 'id,name,mimeType,size,modifiedTime'
  });
  const content = await drive.files.get({
    fileId,
    alt: 'media'
  }, { responseType: 'stream' });
  return { metadata: metadata.data, stream: content.data };
}

export async function listFolderFiles(folderId) {
  if (!folderId) return [];
  const drive = driveClient();
  const response = await drive.files.list({
    q: `'${folderId.replace(/'/g, "\\'")}' in parents and trashed = false`,
    fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink)',
    orderBy: 'name'
  });
  return response.data.files || [];
}
