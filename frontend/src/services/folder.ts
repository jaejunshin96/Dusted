import authAxios from '../utils/authentications/authFetch';
import { Folder } from '../types/types';

const backendUrl = import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL_PROD;

const API_URL = `${backendUrl}/api/folder/`;

export const getFolders = async () => {
    const response = await authAxios(`${API_URL}`, {
        method: "GET",
    });

    if (response.status !== 200) {
        throw new Error('Failed to fetch folders');
    }

    return response.data;
}

export const postFolder = async (folderName: string) => {
    const response = await authAxios(`${API_URL}`, {
        method: "POST",
        data: {
            name: folderName,
        }
    });

    if (response.status !== 201) {
        throw new Error('Failed to post folder');
    }

    return response.data;
}

export const deleteFolder = async (folder: Folder) => {
    const response = await authAxios(`${API_URL}`, {
        method: "DELETE",
        params: {
            id: folder.id,
        }
    })

    if (response.status !== 204) {
        throw new Error('Failed to delete folder');
    }

    return response.data;
}

export const updateFolder = async (folderId: number, folderName: string) => {
    const response = await authAxios(`${API_URL}`, {
        method: "PATCH",
        data: {
            id: folderId,
            name: folderName,
        }
    });

    if (response.status !== 200) {
        throw new Error('Failed to update folder');
    }

    return response.data;
}
