import * as Clipboard from 'expo-clipboard';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Alert } from 'react-native';

import {
  deleteItem,
  getItemById,
  getLatestContent,
  insertItem,
  searchItems,
  updateItem,
} from '../db/clipboardRepository';
import { initDatabase } from '../db/sqlite';
import type { ClipboardItem } from '../types/clipboard';

type ClipboardContextValue = {
  items: ClipboardItem[];
  query: string;
  loading: boolean;
  error: string | null;
  lastCopiedId: number | null;
  refreshItems: (nextQuery?: string) => Promise<void>;
  captureClipboardOnLaunch: () => Promise<void>;
  saveClipboardText: (text: string, title?: string) => Promise<void>;
  copyItemToClipboard: (item: ClipboardItem) => Promise<void>;
  editItem: (id: number, title: string, content: string) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  setQuery: (value: string) => void;
  getItem: (id: number) => Promise<ClipboardItem | null>;
};

const ClipboardContext = createContext<ClipboardContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const ClipboardProvider = ({ children }: Props) => {
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [query, setQueryState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCopiedId, setLastCopiedId] = useState<number | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshItems = useCallback(async (nextQuery = query) => {
    try {
      const data = await searchItems(nextQuery);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayitlar yuklenemedi.');
    }
  }, [query]);

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      void refreshItems(value);
    },
    [refreshItems]
  );

  const saveClipboardText = useCallback(
    async (text: string, title?: string) => {
      const normalized = text.trim();
      if (!normalized) {
        return;
      }

      await insertItem(normalized, title);
      await refreshItems();
    },
    [refreshItems]
  );

  const copyItemToClipboard = useCallback(async (item: ClipboardItem) => {
    await Clipboard.setStringAsync(item.content);
    setLastCopiedId(item.id);

    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = setTimeout(() => {
      setLastCopiedId(null);
    }, 1200);
  }, []);

  const removeItem = useCallback(
    async (id: number) => {
      await deleteItem(id);
      await refreshItems();
    },
    [refreshItems]
  );

  const editItem = useCallback(
    async (id: number, title: string, content: string) => {
      await updateItem(id, title.trim(), content.trim());
      await refreshItems();
    },
    [refreshItems]
  );

  const getItem = useCallback(async (id: number) => {
    return getItemById(id);
  }, []);

  const captureClipboardOnLaunch = useCallback(async () => {
    const currentClipboard = (await Clipboard.getStringAsync()).trim();
    if (!currentClipboard) {
      return;
    }

    const latestContent = await getLatestContent();
    if (latestContent?.trim() === currentClipboard) {
      return;
    }

    await new Promise<void>((resolve) => {
      Alert.alert(
        'Panoda yeni metin bulundu',
        'Kaydetmek ister misiniz?',
        [
          {
            text: 'Atla',
            style: 'cancel',
            onPress: () => resolve(),
          },
          {
            text: 'Kaydet',
            onPress: async () => {
              await saveClipboardText(currentClipboard);
              resolve();
            },
          },
        ],
        { cancelable: true }
      );
    });
  }, [saveClipboardText]);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        await initDatabase();
        if (!mounted) {
          return;
        }

        await refreshItems('');
        await captureClipboardOnLaunch();
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Baslatma hatasi.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void boot();

    return () => {
      mounted = false;
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, [captureClipboardOnLaunch, refreshItems]);

  const value = useMemo<ClipboardContextValue>(
    () => ({
      items,
      query,
      loading,
      error,
      lastCopiedId,
      refreshItems,
      captureClipboardOnLaunch,
      saveClipboardText,
      copyItemToClipboard,
      editItem,
      removeItem,
      setQuery,
      getItem,
    }),
    [
      captureClipboardOnLaunch,
      copyItemToClipboard,
      editItem,
      error,
      getItem,
      items,
      lastCopiedId,
      loading,
      query,
      refreshItems,
      removeItem,
      saveClipboardText,
      setQuery,
    ]
  );

  return <ClipboardContext.Provider value={value}>{children}</ClipboardContext.Provider>;
};

export const useClipboard = () => {
  const context = useContext(ClipboardContext);

  if (!context) {
    throw new Error('useClipboard, ClipboardProvider icinde kullanilmalidir.');
  }

  return context;
};
