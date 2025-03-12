import { app, BrowserWindow } from 'electron'
import path from 'path'

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 開発時は必ずlocalhostを読み込むように修正
  win.loadURL('http://localhost:3000')
  // 開発者ツールを表示
  // win.webContents.openDevTools()
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