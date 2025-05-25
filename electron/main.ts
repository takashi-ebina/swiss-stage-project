import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url';
import util from 'node:util';
import type { ProfileDto } from '../src/types/profileDto';
import type { MatchDto } from '../src/types/matchDto';
import type { TitleInfoDto } from '../src/types/titleInfoDto';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.setMaximumSize(1280, 1200);

  if (process.env.NODE_ENV === "development") {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    // win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function getDbPath() {
  // 開発／本番（exeファイル）でパスを変える（userData -> C:\Users\[userName]\AppData\Roaming\swiss-stage-project\）
  const baseDir = app.isPackaged ? app.getPath('userData') : path.join(__dirname, '..');
  const dbFolder = path.join(baseDir, 'data');
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
  }
  return path.join(dbFolder, 'swiss-stage-project.db');
}

ipcMain.handle('find-all-profiles', async () => {
  const db = new sqlite3.Database(getDbPath());
  const result = await util.promisify(
    db.all.bind(db, 'select id, organization, name, rank from profile order by id')
  ).call(db) as ProfileDto[];
  await util.promisify(db.close).call(db);
  return result;
})

ipcMain.handle('find-all-matches', async () => {
  const db = new sqlite3.Database(getDbPath());
  const result = await util.promisify(
    db.all.bind(db, 'select id, idx, opponent_id, result from match order by id')
  ).call(db) as MatchDto[];
  await util.promisify(db.close).call(db);
  return result;
})

ipcMain.handle('find-one-title-info', async () => {
  const db = new sqlite3.Database(getDbPath());
  const result = await util.promisify(
    db.all.bind(db, 'select logo_name, title from title_info limit 1')
  ).call(db) as TitleInfoDto[];
  await util.promisify(db.close).call(db);
  return result;
})

ipcMain.handle('init-db', async () => {
  const db = new sqlite3.Database(getDbPath());
  try {
    await util.promisify(db.run).call(
      db,"create table if not exists profile (id integer, organization text, name text, rank integer)"
    );
    await util.promisify(db.run).call(
      db,"create table if not exists match (id integer, idx integer, opponent_id text, result integer)"
    );
    await util.promisify(db.run).call(
      db,"create table if not exists title_info (logo_name text, title text)"
    );
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    await util.promisify(db.close).call(db);
  }
})

ipcMain.handle('save', async (_event, profileDto: ProfileDto, matchDtoList: MatchDto[]) => {
  console.log("[SAVE] profileDto:", profileDto);
  console.log("[SAVE] matchDtoList:", matchDtoList);
  const db = new sqlite3.Database(getDbPath());
  try {
    const profileInsertStatement = db.prepare("INSERT INTO profile VALUES (?,?,?,?)");
    await util.promisify(profileInsertStatement.run
      .bind(profileInsertStatement, [profileDto.id, profileDto.organization, profileDto.name, profileDto.rank]))
      .call(profileInsertStatement);
    await util.promisify(profileInsertStatement.finalize).call(profileInsertStatement);

    const matchInsertStatement = db.prepare("INSERT INTO match VALUES (?,?,?,?)");
    for (const matchDto of matchDtoList) {
      await util.promisify(matchInsertStatement.run
        .bind(matchInsertStatement, [matchDto.id, matchDto.idx, matchDto.opponent_id, matchDto.result]))
        .call(matchInsertStatement);
    }
    await util.promisify(matchInsertStatement.finalize).call(matchInsertStatement);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    await util.promisify(db.close).call(db);
  }
})

ipcMain.handle('save-title-info', async (_event, titleInfoDto: TitleInfoDto) => {
  console.log("[SAVE] titleInfoDto:", titleInfoDto);
  const db = new sqlite3.Database(getDbPath());
  try {
    const titleInfoInsertStatement = db.prepare("INSERT INTO title_info VALUES (?,?)");
    await util.promisify(titleInfoInsertStatement.run
      .bind(titleInfoInsertStatement, [titleInfoDto.logo_name, titleInfoDto.title]))
      .call(titleInfoInsertStatement);
    await util.promisify(titleInfoInsertStatement.finalize).call(titleInfoInsertStatement);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    await util.promisify(db.close).call(db);
  }
})

ipcMain.handle('delete', async () => {
  const db = new sqlite3.Database(getDbPath());
  try {
    await util.promisify(db.run).call(
      db,"delete from profile"
    );
    await util.promisify(db.run).call(
      db,"delete from match"
    );
    await util.promisify(db.run).call(
      db,"delete from title_info"
    );
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    await util.promisify(db.close).call(db);
  }
})