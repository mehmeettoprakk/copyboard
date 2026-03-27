import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('copyboard.db');
  }

  return dbPromise;
};

export const initDatabase = async () => {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS clipboard_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Genel',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_clipboard_items_created_at ON clipboard_items(created_at DESC);
  `);

  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(clipboard_items)');
  const hasTitle = columns.some((column) => column.name === 'title');

  if (!hasTitle) {
    await db.runAsync("ALTER TABLE clipboard_items ADD COLUMN title TEXT NOT NULL DEFAULT ''");
  }
};
