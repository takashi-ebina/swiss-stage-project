import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { constant } from '@/constants/constant';
import { Player } from '@/models/player';
import { playerUtil } from '@/utils/playerUtil';

export const exportExcel = async (players: Player[], titleName: string): Promise<void> => {
  const workBook = new ExcelJS.Workbook();

  for (let groupId = 1; groupId <= constant.GROUP_SIZE; groupId++) {
    writeWorkSheet(workBook, players, groupId);
  }

  const buffer = await workBook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, titleName + '_対戦表.xlsx');
};

const writeWorkSheet = (workBook: ExcelJS.Workbook, players: Player[], groupId: number): void => {
  const workSheet = workBook.addWorksheet(`GROUP${groupId}`);
  const headerRows = [2, 3];
  const columnCount = 17;
  const playersByGroupId = playerUtil.getPlayersByGroupId(players, groupId).filter(p => p.profile.name !== "");

  writeTitle(workSheet);
  writeHeaders(workSheet);
  applyHeaderStyle(workSheet, headerRows, columnCount);
  mergeHeaderCells(workSheet);
  centerAlignHeaders(workSheet);
  writePlayerData(workSheet, playersByGroupId);
  autoFitColumns(workSheet);
};

const writeTitle = (ws: ExcelJS.Worksheet) => {
  ws.mergeCells('A1:Q1');
  const titleCell = ws.getCell('A1');
  titleCell.value = '対戦表';
  titleCell.font = { bold: true, size: 14, name: 'Meiryo UI' };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
};

const writeHeaders = (ws: ExcelJS.Worksheet) => {
  const labels = [
    ['No', '名前', '段級位', '1回戦', '', '2回戦', '', '3回戦', '', '4回戦', '', '5回戦', '', '勝ち点', 'SOS', 'SODOS', '順位'],
    ['', '', '', '相手', '結果', '相手', '結果', '相手', '結果', '相手', '結果', '相手', '結果', '', '', '', '']
  ];
  labels.forEach((rowLabels, rowIndex) => {
    const row = ws.getRow(rowIndex + 2);
    rowLabels.forEach((text, i) => {
      row.getCell(i + 1).value = text;
    });
  });
};

const applyHeaderStyle = (ws: ExcelJS.Worksheet, rows: number[], cols: number) => {
  rows.forEach(rowNum => {
    const row = ws.getRow(rowNum);
    for (let col = 1; col <= cols; col++) {
      const cell = row.getCell(col);
      cell.font = { name: 'Meiryo UI', bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF228B22' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  });
};

const mergeHeaderCells = (ws: ExcelJS.Worksheet) => {
  ['A', 'B', 'C', 'N', 'O', 'P', 'Q'].forEach(col => ws.mergeCells(`${col}2:${col}3`));
  ['D', 'F', 'H', 'J', 'L'].forEach((col, i) => {
    const nextCol = String.fromCharCode(col.charCodeAt(0) + 1);
    ws.mergeCells(`${col}2:${nextCol}2`);
  });
};

const centerAlignHeaders = (ws: ExcelJS.Worksheet) => {
  ['A2', 'B2', 'C2', 'D2', 'F2', 'H2', 'J2', 'L2','N2','O2','P2','Q2'
    ,'D3','E3','F3','G3','H3','I3','J3','K3','L3','L3','M3',].forEach(addr => {
    ws.getCell(addr).alignment = { horizontal: 'center', vertical: 'middle' };
  });
};

const writePlayerData = (ws: ExcelJS.Worksheet, players: Player[]) => {
  let rowIndex = 4;
  for (const player of players) {
    const row = ws.getRow(rowIndex);
    row.getCell('A').value = player.profile.id;
    row.getCell('B').value = player.profile.name;
    row.getCell('C').value = player.profile.rank.name;

    for (let i = 0; i < player.matches.length; i++) {
      const match = player.matches[i];
      const opponentCol = 4 + i * 2;
      const resultCol = opponentCol + 1;
      row.getCell(opponentCol).value = match.opponentId || '';

      const resultCell = row.getCell(resultCol);
      resultCell.value = match.result.name || '';

      if (match.result.name === '○') {
        resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB9F6CA' } }; // 緑
      } else if (match.result.name === '×') {
        resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } }; // 赤
      } else if (match.result.name === '△') {
        resultCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } }; // 黄
      }
    }

    row.getCell('N').value = player.points;
    row.getCell('O').value = player.sos;
    row.getCell('P').value = player.sodos;
    row.getCell('Q').value = player.ranking;

    for (let col = 1; col <= 17; col++) {
      const cell = row.getCell(col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { name: 'Meiryo UI' };
    }
    rowIndex++;
  }
};

const autoFitColumns = (ws: ExcelJS.Worksheet) => {
  ws.columns.forEach(col => {
    col.width = 10;
  });
};

export const excelUtil = {
  exportExcel,
};