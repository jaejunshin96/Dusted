import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCollections } from 'react-icons/md';
import { Folder } from '../../types/types';
import styles from './FolderList.module.css';

interface FolderListProps {
  folders: Folder[];
  selectedFolder: number | null;
  setSelectedFolder: (folderId: number | null) => void;
  onCreateFolder: (folderName: string) => Promise<void>;
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolder,
  setSelectedFolder,
  onCreateFolder,
}) => {
  const { t } = useTranslation();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateClick = () => {
    setIsCreatingFolder(true);
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) {
      return;
    }

    try {
      await onCreateFolder(newFolderName);
      setIsCreatingFolder(false);
      setNewFolderName('');
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <>
      <div className={styles.folderSection}>
        <div className={styles.folderLabelContainer}>
          <MdCollections className={styles.folderIcon} />
          <p className={styles.folderLabel}>{t("Save to folder:")}</p>
        </div>

        {/* Folder list */}
        <div className={styles.folderList}>
          <div
            className={`${styles.folderItem} ${selectedFolder === null ? styles.selectedFolder : ''}`}
            onClick={() => setSelectedFolder(null)}
          >
            <span className={styles.folderName}>{t('All')}</span>
          </div>

          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`${styles.folderItem} ${selectedFolder === folder.id ? styles.selectedFolder : ''}`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <span className={styles.folderName}>{folder.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New folder button */}
      <div className={styles.createFolderContainer}>
        {isCreatingFolder ? (
          <>
            <input
              type="text"
              placeholder={t("New Folder")}
              className={styles.createFolderInput}
              value={newFolderName}
              onChange={handleFolderNameChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateFolder();
                }
              }}
            />
            <button
              className={styles.createFolderButton}
              onClick={handleCreateFolder}
            >
              {t("Add")}
            </button>

            <button
              className={styles.createFolderButton}
              onClick={() => setIsCreatingFolder(false)}
            >
              {t("Cancel")}
            </button>
          </>
        ) : (
          <button
            className={styles.createFolderButton}
            onClick={handleCreateClick}
          >
            <span className={styles.folderName}>{t('Add new folder')}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default FolderList;
