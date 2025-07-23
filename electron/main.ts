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
    width: 1280,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

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
  return path.join(dbFolder, 'swiss-stage-project_v2.db');
}

ipcMain.handle('find-all-profiles', async () => {
  console.log("[START] find-all-profiles");
  const db = new sqlite3.Database(getDbPath());
  const result = await util.promisify(
    db.all.bind(db, 'select group_id, id, organization, name, rank from profile order by id')
  ).call(db) as ProfileDto[];
  await util.promisify(db.close).call(db);
  console.log("[ END ] find-all-profiles");
  return result;
})

ipcMain.handle('find-all-matches', async () => {
  console.log("[START] find-all-matches");
  const db = new sqlite3.Database(getDbPath());
  const result = await util.promisify(
    db.all.bind(db, 'select group_id, id, idx, opponent_id, result from match order by id')
  ).call(db) as MatchDto[];
  await util.promisify(db.close).call(db);
  console.log("[ END ] find-all-matches");
  return result;
})

ipcMain.handle('find-one-title-info', async () => {
  console.log("[START] find-one-title-info");
  const db = new sqlite3.Database(getDbPath());
  const result = await util.promisify(
    db.all.bind(db, 'select logo_name, title from title_info limit 1')
  ).call(db) as TitleInfoDto[];
  await util.promisify(db.close).call(db);
  console.log("[ END ] find-one-title-info");
  return result;
})

ipcMain.handle('init-db', async () => {
  console.log("[START] init-db");
  const db = new sqlite3.Database(getDbPath());
  try {
    await util.promisify(db.run).call(
      db,"create table if not exists profile (group_id integer, id integer, organization text, name text, rank integer)"
    );
    await util.promisify(db.run).call(
      db,"create table if not exists match (group_id integer, id integer, idx integer, opponent_id text, result integer)"
    );
    await util.promisify(db.run).call(
      db,"create table if not exists title_info (logo_name text, title text)"
    );
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    console.log("[ END ] init-db");
    await util.promisify(db.close).call(db);
  }
})

ipcMain.handle('save', async (_event, groupId: number, profileDto: ProfileDto, matchDtoList: MatchDto[]) => {
  console.log("[START] init-db");
  const db = new sqlite3.Database(getDbPath());
  try {
    console.log("[SAVE] profileDto:", profileDto);
    const profileInsertStatement = db.prepare("INSERT INTO profile VALUES (?,?,?,?,?)");
    await util.promisify(profileInsertStatement.run
      .bind(profileInsertStatement, [groupId, profileDto.id, profileDto.organization, profileDto.name, profileDto.rank]))
      .call(profileInsertStatement);
    await util.promisify(profileInsertStatement.finalize).call(profileInsertStatement);

    console.log("[SAVE] matchDtoList:", matchDtoList);
    const matchInsertStatement = db.prepare("INSERT INTO match VALUES (?,?,?,?,?)");
    for (const matchDto of matchDtoList) {
      await util.promisify(matchInsertStatement.run
        .bind(matchInsertStatement, [groupId, matchDto.id, matchDto.idx, matchDto.opponent_id, matchDto.result]))
        .call(matchInsertStatement);
    }
    await util.promisify(matchInsertStatement.finalize).call(matchInsertStatement);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  } finally {
    console.log("[ END ] init-db");
    await util.promisify(db.close).call(db);
  }
})

ipcMain.handle('save-title-info', async (_event, titleInfoDto: TitleInfoDto) => {
  console.log("[START] save-title-info");
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
    console.log("[ END ] save-title-info");
    await util.promisify(db.close).call(db);
  }
})

ipcMain.handle('delete', async () => {
  console.log("[START] delete");
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
    console.log("[ END ] delete");
    await util.promisify(db.close).call(db);
  }
})