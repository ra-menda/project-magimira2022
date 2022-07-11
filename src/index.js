/**
 * TextAlive App API basic example
 * https://github.com/TextAliveJp/textalive-app-basic
 *
 * API チュートリアル「1. 開発の始め方」のサンプルコードです。
 * 発声中の歌詞を単語単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 * https://developer.textalive.jp/app/
 */

import {Player} from "textalive-app-api";

// 歌詞を交互にする
var isRight = true;
var olophrase = "";

// 単語が発声されていたら #text に表示する
function animatePhrase(now, unit) {
  if (unit.contains(now)) {
    if (unit.text != olophrase) {
      if (isRight) {
        phraseEl.textContent = unit.text;
        isRight = !isRight;
      } else {
        phraseEl2.textContent = unit.text;
        isRight = !isRight;
      }
      olophrase = unit.text;
    }
  }
};

// TextAlive Player を作る
const player = new Player({
  app: {
    token: "1HJzpsZ11CfoUPrr",
  },
  mediaElement: document.querySelector("#media"),
});

// TextAlive Player のイベントリスナを登録する
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onThrottledTimeUpdate,
  onPlay,
  onPause,
  onStop,
  onTimeUpdate,
  onAppMediaChange
});

const playBtns = document.querySelectorAll(".play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");
const reloadBtn = document.querySelector("#reload_button");
const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#testcssLiricsLeft"/*"#lyrics"*//*"#container p"*/);
const phraseEl2 = document.querySelector("#testcssLiricsRight"/*"#lyrics2"*/);
const changecolor = document.querySelector('#change_color')

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";

    // 再生ボタン
    playBtns.forEach((playBtn) =>
      playBtn.addEventListener("click", () => {
        player.video && player.requestPlay();
      })
    );

    // 歌詞頭出しボタン
    jumpBtn.addEventListener(
      "click",
      () =>
        player.video &&
        player.requestMediaSeek(player.video.firstChar.startTime)
    );

    // 一時停止ボタン
    pauseBtn.addEventListener(
        "click",
        () => player.video && player.requestPause()
    );

    // 巻き戻しボタン
    rewindBtn.addEventListener(
        "click",
        () => player.video && player.requestMediaSeek(0)
    );

    // 楽曲再指定ボタン
    reloadBtn.addEventListener(
        "click",
        changeMedia
    );

    // 色変更ボタン
    changecolor.addEventListener(
        "click",
        changeColor
    )

    document
        .querySelector("#header a")
        .setAttribute(
            "href",
            "https://developer.textalive.jp/app/run/?ta_app_url=https%3A%2F%2Ftextalivejp.github.io%2Ftextalive-app-basic%2F&ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DygY2qObZv24"
        );
  } else {
    document
      .querySelector("#header a")
      .setAttribute(
        "href",
        "https://textalivejp.github.io/textalive-app-basic/"
      );
  }

  // 楽曲URLが指定されていなければ マジカルミライ 2020テーマ曲を読み込む
  if (!app.songUrl) {
    player.createFromSongUrl("https://www.youtube.com/watch?v=ZOTJgXBkJpc");
  }
}

/**
 * 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
 *
 * @param {IVideo} v - https://developer.textalive.jp/packages/textalive-app-api/interfaces/ivideo.html
 */
function onVideoReady(v) {
  // メタデータを表示する
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;

  // 定期的に呼ばれる各単語の "animate" 関数をセットする
  let p = player.video.firstPhrase;
  jumpBtn.disabled = !p;
  while (p && p.next) {
    p.animate = animatePhrase;
    p = p.next;
  }
  // 曲変更後に歌詞文字を"-"にするのと、大きい再生ボタンを再表示する。
  phraseEl.textContent = "-";
  phraseEl2.textContent = "-";
  olophrase = ""
  isRight = true;
  // document.querySelector("#overlay").style.visibility = "visible";
}

function onTimeUpdate(position) {
  document.querySelector("#beat_index").textContent = player.findBeat(position).index;
  const duration = player.findBeat(position).duration;
  document.querySelector("#beat_duration").textContent = duration.toString();
  const bpm = 1000 / duration * 60
  document.querySelector("#beat_1").textContent = bpm.toString();
  document.getElementById('image').style.animationDuration = (duration * 2).toString() + "ms";
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t) {
  // ボタンを有効化する
  if (!player.app.managed) {
    document
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
  }

  // 歌詞がなければ歌詞頭出しボタンを無効にする
  jumpBtn.disabled = !player.video.firstPhrase;
  player.video && player.requestPlay();
}

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position) {
// 再生位置を表示する
  positionEl.textContent = String(Math.floor(position));
}

// 再生が始まったら #overlay を非表示に
function onPlay() {
  document.querySelector("#overlay").style.visibility = "hidden";
}

// 再生が一時停止・停止したら歌詞表示をリセット
function onPause() {
  phraseEl.textContent = "-";
  phraseEl2.textContent = "-";
  olophrase = ""
  isRight = !isRight;
}

function onStop() {
  phraseEl.textContent = "-";
  phraseEl2.textContent = "-";
  olophrase = ""
  isRight = !isRight;
}

// 楽曲変更する場合に呼ばれるメソッド
function changeMedia() {
  while (player.video && player.requestMediaSeek(0)) {
    player.createFromSongUrl(document.querySelector("#song_url").value);
    break;
  }
}

function onAppMediaChange(songURL) {
  alert(songURL);
}

// 色管理利用
var color = 1;

// ゴリ押し色変更
function changeColor() {
  switch (color) {
    case 1:
      document.getElementById('light').style.background = "#46FF82";
      color++;
      break;

    case 2:
      document.getElementById('light').style.background = "#ff0000";
      color++;
      break;

    case 3:
      document.getElementById('light').style.background = "#F7FF00";
      color++;
      break;

    case 4:
      document.getElementById('light').style.background = "#00F6FF";
      color = 1;
      break;
  }
}