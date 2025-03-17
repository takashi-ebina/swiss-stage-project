# swiss-stage-project

スイス方式トーナメントの対戦組み合わせを作成するツール

## インストーラー

下記のリンクから`swiss-stage-project-Setup-x.x.x.exe`をダウンロードしてください

※`x.x.x`はバージョン番号

### [v1.0.0](https://github.com/takashi-ebina/swiss-stage-project/releases/tag/v1.0.0)

## 画面イメージ

### 対戦表
![対戦表](https://github.com/user-attachments/assets/96b00427-9d37-4f62-ace1-5323bc2c66e7)

### 参加者リスト
![参加者リスト](https://github.com/user-attachments/assets/78ddf75c-4690-4df2-82bc-6ae62b29d4bd)

### ランキング
![ランキング](https://github.com/user-attachments/assets/43223512-6ada-463c-ae9d-363a2ab6af38)

## 組み合わせ方法

1. 1回戦は抽選で決めた番号順に組み合わせる
   - 対戦相手がいない場合は、対戦相手を`dummy`として、不戦勝とする
   - `dummy`は参加者中、段級位が最下位のものとして組み合わせを行う
2. 2回戦以降は勝敗の多いものから順に組み合わせる
   - 同じ勝敗の者の組み合わせも抽選で決めた番号順に組み合わせる
   - `dummy`と対戦することとなるものは、勝敗最下位で抽選番号が最下位の者になる
   - 既に対局した相手と組み合わせることはない

## 順位の組み方

1. 勝敗が多いものを上位とする
2. 勝敗が同じ場合は、すべての対戦相手の勝敗の合計（SOS）が多いものを上位とする
3. それでも同じ場合は、自分より勝った相手の勝敗の合計（SODOS）が多いものを上位とする

```:txt
SOS:  Sum of Opponents Scores（対戦相手の勝ち星の数）
SODOS:Sum of Defeated Opponents Scores（負かした対戦相手の勝ち星の数）
```
