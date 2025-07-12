---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "swiss-stage-project"
  text: "スイス方式トーナメントの対戦組合せ作成アプリ"
  tagline: トーナメントの表の作成をもっと、簡単に
  image:
    src: /assets/swiss-stage-project.ico
    alt: logo
  actions:
    - theme: brand
      text: アプリをダウンロードする
      link: 'https://github.com/takashi-ebina/swiss-stage-project/releases'
    - theme: alt
      text: 機能の概要について
      link: /feature-overview
    - theme: alt
      text: コントリビューションガイドについて
      link: /contribution-guide

features:
  - icon: 🗒️
    title: トーナメント表の作成
    details: 参加者の氏名、段級位を入力するだけで、簡単にトーナメント表が作成できます！ 
  - icon: ⚔️
    title: 対戦相手のマッチング
    details: 勝ち点に基づいて、適切な対戦相手をマッチできます<br>手間のかかる対戦相手の選定作業から解放されます！
  - icon: 👑
    title: ランキング
    details: 対戦結果に基づいて、順位を確認することができます<br>ひと目で自分の順位がわかります！
---

***

![image](./public/assets/demo.gif)

***

::: info アプリのインストール
[アプリをダウンロードする](https://github.com/takashi-ebina/swiss-stage-project/releases)から`swiss-stage-project-Setup-x.x.x.exe`をダウンロードしてください

※`x.x.x`はバージョン番号

ダウンロードした`swiss-stage-project-Setup-x.x.x.exe`をダブルクリック後、デスクトップに`swiss-stage-project.exe`のショートカットファイルが作成されます
:::

<style>
:root {
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #000000 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}
</style>
