# あなたと繋いだ光

（ここにスクショと制作した思いを載せたいね）

## 概要

* TextAliveAppAPIを利用して楽曲に合わせた演出を行うWebアプリケーションです。
* ペンライトを実際に動かすことができます。
* ペンライトの色はマジカルミライ2021年のペンライトを参考にしています。

## 利用方法

### 準備

* [Node.js](https://nodejs.org/) をインストールしている環境で以下のコマンドを実行すると、開発用サーバが起動します。

```sh
git clone https://github.com/ra-menda/project-magimira2022.git
cd project-magimira2022/
npm install
```

### 開発用サーバ起動

* 以下のコマンドで開発用サーバが起動します。

```sh
npm run dev
```

### ビルド

* 以下のコマンドで `docs` 以下にビルド済みファイルが生成されます。

```sh
npm run build
```

## 操作方法

### 楽曲変更方法

* デフォルト起動時は[『Loading Memories / せきこみごはん feat. 初音ミク』](https://www.youtube.com/watch?v=ZOTJgXBkJpc)が流れるようになっています。
* URLにクエリパラメータ`ta_song_url={楽曲URL}`をつけることで好きな楽曲で楽しめます。
* 右下のURL欄にTextAlive対応楽曲のYoutube動画やニコニコ動画のURLを貼り付け、「変更」ボタンを押すと楽曲が切り替わります。

<details>
<summary>楽曲コンテスト受賞楽曲</summary>

[『Loading Memories / せきこみごはん feat. 初音ミク』https://www.youtube.com/watch?v=ZOTJgXBkJpc](https://www.youtube.com/watch?v=ZOTJgXBkJpc)

[『青に溶けた風船 / 初音ミク』https://piapro.jp/t/9cSd/20220205030039](https://piapro.jp/t/9cSd/20220205030039)

[『歌の欠片と / MEIKO』https://www.youtube.com/watch?v=CkIy0PdUGjk](https://www.youtube.com/watch?v=CkIy0PdUGjk)

[『未完のストーリー / 初音ミク』https://www.youtube.com/watch?v=GSt0gPV2E9M](https://www.youtube.com/watch?v=GSt0gPV2E9M)

[『Miku＆cat nap - みはるかす』https://www.youtube.com/watch?v=qVTavYjd9Ek](https://www.youtube.com/watch?v=qVTavYjd9Ek)

[『201 - fear ft. hatsune miku』https://www.youtube.com/watch?v=ZK2rp1VdNy4](https://www.youtube.com/watch?v=ZK2rp1VdNy4)
</details>

### ペンライトの色変更方法

* 「色変更」ボタンを押すと、手元のペンライトと会場のペンライトの色が変更されます。

1. 初音ミク
2. 鏡音レン
3. 鏡音リン
4. 巡音ルカ
5. MEIKOさん
6. KAITOさん
7. 白色

の順でペンライトの色が変更します。

---

## TextAlive App API

![TextAlive](https://i.gyazo.com/thumb/1000/5301e6f642d255c5cfff98e049b6d1f3-png.png)

TextAlive App API は、音楽に合わせてタイミングよく歌詞が動くWebアプリケーション（リリックアプリ）を開発できるJavaScript用のライブラリです。

TextAlive App API について詳しくはWebサイト [TextAlive for Developers](https://developer.textalive.jp/) をご覧ください。

## クレジット

* WebPage Development : [ラーメン](https://twitter.com/ramenda) , Ocean , おわたん
* Illust : [いとこん](https://twitter.com/itokon71)
* Special Thanks : まぶちゃん , [ExertionGame](https://twitter.com/ExertionGame)

---
https://github.com/ra-menda/project-magimira2022
