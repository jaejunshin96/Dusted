import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Folder } from '../../types/types';
import { getFolders, postFolder, updateFolder } from '../../services/folder';
import styles from './FolderSlide.module.css';
import { FaEllipsis } from 'react-icons/fa6';

interface FolderSlideProps {
  onFolderSelect: (folderId: number | null) => void;
  selectedFolderId: number | null;
  onOptionClicked: () => void;
}

const FolderSlide: React.FC<FolderSlideProps> = ({
  onFolderSelect,
  selectedFolderId,
  onOptionClicked
}) => {
  const { t } = useTranslation();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadFolders = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (err) {
        setError(t('Failed to load folders'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, [t]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
        setIsEditing(false);
        setIsAdding(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showModal]);

  const handleAdd = async () => {
    if (!newFolderName.trim()) {
      return;
    }

    try {
      const newFolder = await postFolder(newFolderName.trim());
      setFolders([...folders, newFolder]);
      setIsAdding(false);
      setShowModal(false);
      setNewFolderName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionClick = () => {
    setShowModal(true);
  };

  const handleAddButtonClick = () => {
    setIsAdding(true);
    setNewName('');
  };

  const handleEditButtonClick = () => {
    if (selectedFolder) {
      setIsEditing(true);
      setNewName(selectedFolder.name);
    }
  };

  const handleEdit = async () => {
    if (selectedFolder) {
      await updateFolder(selectedFolder.id, newName);
      setFolders(folders.map(folder => folder.id === selectedFolder.id ? { ...folder, name: newName } : folder));
      setIsEditing(false);
      setShowModal(false);
    }
  }

  const handleDelete = () => {
    setShowModal(false);

    if (selectedFolderId) {
      setFolders(prevFolders => prevFolders.filter(folder => folder.id !== selectedFolderId));
    }

    onOptionClicked();
  };

  return (
    <div className={styles.folderContainer}>
      <div className={styles.folderHeader}>
        <div className={styles.headerLeft}></div>
        <h1 className={styles.folderTitle}>
          {selectedFolderId === null ? t('All') : selectedFolder?.name}
        </h1>
        <button
          className={styles.optionButton}
          onClick={handleOptionClick}
          aria-label={t("Folder options")}
        >
          <FaEllipsis size={24} />
        </button>
      </div>

      <div className={styles.folderSlideContainer}>
        <div className={styles.folderScroll}>
          <button
            className={`${styles.folderItem} ${selectedFolderId === null ? styles.active : ''}`}
            onClick={() => {onFolderSelect(null); setSelectedFolder(null);}}
          >
            {t('All')}
          </button>

          {loading && <div className={styles.loading}>{t('Loading...')}</div>}

          {error && <div className={styles.error}>{error}</div>}

          {folders.map(folder => (
            <button
              key={folder.id}
              className={`${styles.folderItem} ${selectedFolderId === folder.id ? styles.active : ''}`}
              onClick={() => {onFolderSelect(folder.id); setSelectedFolder(folder);}}
            >
              {folder.name}
            </button>
          ))}
        </div>

        {/*<button
          className={styles.optionButton}
          onClick={handleOptionClick}
          aria-label={t("Folder options")}
        >
          <FaEllipsis size={24} />
        </button>*/}

        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.optionsList} onClick={(e) => e.stopPropagation()}>
              {!isEditing && !isAdding && (
                <>
                  {selectedFolder && (
                    <button
                      className={`${styles.optionItem} ${styles.deleteOption}`}
                      onClick={handleDelete}
                    >
                      {t("Delate folder")}
                    </button>
                  )}

                  {selectedFolder && (
                    <button
                      className={styles.optionItem}
                      onClick={handleEditButtonClick}
                    >
                      {t("Edit folder")}
                    </button>
                  )}

                  <button
                    className={styles.optionItem}
                    onClick={handleAddButtonClick}
                  >
                    {t("Add new folder")}
                  </button>
                </>
              )}

              {isAdding && (
                <>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {e.key === 'Enter' && handleAdd()}}
                    placeholder={t('Folder name')}
                    className={styles.EditInput}
                  />
                  <button
                    className={styles.optionItem}
                    onClick={() => handleAdd()}
                  >
                    {t("Add")}
                  </button>
                </>
              )}

              {isEditing && (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {e.key === 'Enter' && handleEdit()}}
                    placeholder={t('New folder name')}
                    className={styles.EditInput}
                  />
                  <button
                    className={styles.optionItem}
                    onClick={() => handleEdit()}
                  >
                    {t("Save")}
                  </button>
                </>
              )}

              <button
                className={styles.optionItem}
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setIsAdding(false);
                }}
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderSlide;
