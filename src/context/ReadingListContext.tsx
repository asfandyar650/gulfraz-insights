'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

interface ReadingListContextType {
  bookmarkedIds: string[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const ReadingListContext = createContext<ReadingListContextType>({
  bookmarkedIds: [],
  isBookmarked: () => false,
  toggleBookmark: () => {},
  removeBookmark: () => {},
  isDrawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const ReadingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gulfraz_reading_list');
      if (stored) {
        setBookmarkedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error reading bookmarks:', e);
    }
  }, []);

  const saveBookmarks = (ids: string[]) => {
    try {
      localStorage.setItem('gulfraz_reading_list', JSON.stringify(ids));
    } catch (e) {
      console.warn('Error saving bookmarks:', e);
    }
  };

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarkedIds.includes(id);
    },
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      setBookmarkedIds((prev) => {
        let updated: string[];
        if (prev.includes(id)) {
          updated = prev.filter((item) => item !== id);
          showToast('Removed from Reading List', 'info');
        } else {
          updated = [id, ...prev];
          showToast('Saved to Reading List', 'success');
        }
        saveBookmarks(updated);
        return updated;
      });
    },
    [showToast]
  );

  const removeBookmark = useCallback(
    (id: string) => {
      setBookmarkedIds((prev) => {
        const updated = prev.filter((item) => item !== id);
        saveBookmarks(updated);
        showToast('Removed from Reading List', 'info');
        return updated;
      });
    },
    [showToast]
  );

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <ReadingListContext.Provider
      value={{
        bookmarkedIds,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
};

export const useReadingList = () => useContext(ReadingListContext);
