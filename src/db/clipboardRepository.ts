import type { SQLiteBindValue } from 'expo-sqlite';

import { getDb } from './sqlite';
import type { ClipboardItem } from '../types/clipboard';

type ClipboardRow = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const buildDefaultTitle = (content: string) => {
  const trimmed = content.trim();
  if (!trimmed) {
    return 'Isimsiz kayit';
  }

  const firstLine = trimmed.split('\n')[0].trim();
  return firstLine.length > 42 ? `${firstLine.slice(0, 42)}...` : firstLine;
};

const mapRow = (row: ClipboardRow): ClipboardItem => ({
  id: row.id,
  title: row.title?.trim() || buildDefaultTitle(row.content),
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const insertItem = async (content: string, title?: string) => {
  const db = await getDb();
  const now = new Date().toISOString();
  const finalTitle = title?.trim() || buildDefaultTitle(content);

  const result = await db.runAsync(
    `INSERT INTO clipboard_items (title, content, category, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    [finalTitle, content, 'Genel', now, now]
  );

  return result.lastInsertRowId;
};

export const listItems = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync<ClipboardRow>(
    `SELECT id, title, content, created_at, updated_at
     FROM clipboard_items
     ORDER BY datetime(created_at) DESC`
  );

  return rows.map(mapRow);
};

export const searchItems = async (query: string) => {
  const db = await getDb();
  const hasQuery = query.trim().length > 0;

  if (!hasQuery) {
    return listItems();
  }

  let sql = `SELECT id, title, content, created_at, updated_at FROM clipboard_items`;
  const clauses: string[] = [];
  const params: SQLiteBindValue[] = [];

  if (hasQuery) {
    clauses.push('(title LIKE ? OR content LIKE ?)');
    params.push(`%${query.trim()}%`, `%${query.trim()}%`);
  }

  sql += ` WHERE ${clauses.join(' AND ')} ORDER BY datetime(created_at) DESC`;

  const rows = await db.getAllAsync<ClipboardRow>(sql, params);
  return rows.map(mapRow);
};

export const updateItem = async (id: number, title: string, content: string) => {
  const db = await getDb();

  await db.runAsync(
    `UPDATE clipboard_items
     SET title = ?, content = ?, updated_at = ?
     WHERE id = ?`,
    [title.trim() || buildDefaultTitle(content), content, new Date().toISOString(), id]
  );
};

export const deleteItem = async (id: number) => {
  const db = await getDb();
  await db.runAsync('DELETE FROM clipboard_items WHERE id = ?', [id]);
};

export const getItemById = async (id: number) => {
  const db = await getDb();
  const row = await db.getFirstAsync<ClipboardRow>(
    `SELECT id, title, content, created_at, updated_at
     FROM clipboard_items
     WHERE id = ?`,
    [id]
  );

  return row ? mapRow(row) : null;
};

export const getLatestContent = async () => {
  const db = await getDb();
  const row = await db.getFirstAsync<{ content: string }>(
    `SELECT content
     FROM clipboard_items
     ORDER BY datetime(created_at) DESC
     LIMIT 1`
  );

  return row?.content ?? null;
};
