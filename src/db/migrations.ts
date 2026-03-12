import Database from 'better-sqlite3';

export function ensureOwnerUserIdColumn(database: Database.Database): void {
  try {
    database.exec('ALTER TABLE agent_threads ADD COLUMN owner_user_id TEXT');
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.toLowerCase().includes('duplicate column name')
    ) {
      throw error;
    }
  }
}

export function ensureReadOnlyColumn(database: Database.Database): void {
  try {
    database.exec('ALTER TABLE agent_channels ADD COLUMN read_only INTEGER DEFAULT 0');
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.toLowerCase().includes('duplicate column name')
    ) {
      throw error;
    }
  }
}
