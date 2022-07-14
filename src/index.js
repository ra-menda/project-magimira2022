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

const textContainer = document.querySelector("#text");

// 単語が発声されていたら #text に表示する
// Show words being vocalized in #text
function animatePhrase(now, unit) {
  if (unit.contains(now)) {
    phraseEl.textContent = unit.text;
  }
};

// TextAlive Player を作る
// Instantiate a TextAlive Player instance
const player = new Player({
  app: {
    token: "1HJzpsZ11CfoUPrr",
  },
  mediaElement: document.querySelector("#media"),
});

// TextAlive Player のイベントリスナを登録する
// Register event listeners
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onThrottledTimeUpdate,
  onPlay,
  onPause,
  onStop,
  onAppMediaChange,
  onTimeUpdate
});

const playBtns = document.querySelectorAll(".play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");
const reloadBtn = document.querySelector("#reload_button");
const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#container p");
const changecolor = document.querySelector('#change_color')
const bar = document.querySelector("#bar");

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  // Show control if this app is launched standalone (not connected to a TextAlive host)
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";

    // 再生ボタン / Start music playback
    playBtns.forEach((playBtn) =>
      playBtn.addEventListener("click", () => {
        player.video && player.requestPlay();
      })
    );

    // 歌詞頭出しボタン / Seek to the first character in lyrics text
    jumpBtn.addEventListener(
      "click",
      () =>
        player.video &&
        player.requestMediaSeek(player.video.firstChar.startTime)
    );

    // 一時停止ボタン / Pause music playback
    pauseBtn.addEventListener(
        "click",
        () => player.video && player.requestPause()
    );

    // 巻き戻しボタン / Rewind music playback
    rewindBtn.addEventListener(
        "click",
        () => player.video && player.requestMediaSeek(0)
    );

    //楽曲再指定ボタン
    reloadBtn.addEventListener(
        "click",
        () => player.createFromSongUrl(document.querySelector("#song_url").value)
    );

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
  // Load a song when a song URL is not specified
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
  // Show meta data
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;

  // 定期的に呼ばれる各単語の "animate" 関数をセットする
  // Set "animate" function
  let p = player.video.firstPhrase;
  jumpBtn.disabled = !p;
  while (p && p.next) {
    p.animate = animatePhrase;
      p = p.next;
  }
}

var before_1=0;
var adjustment = 16;

function onTimeUpdate(position) {  
  document.querySelector("#beat_index").textContent = player.findBeat(position).index;
  const duration = player.findBeat(position).duration;
  document.querySelector("#beat_duration").textContent = duration.toString();
  const bpm = 1000 / duration * 60
  document.querySelector("#beat_1").textContent = bpm.toString();
  document.querySelector("#prev").textContent = before_1;
 // BPM差が10以上であればdurationを更新する
 if(Math.abs(bpm - before_1) > 16) {
  document.getElementById('image').style.animationDuration = (duration* adjustment).toString() + "ms";
  document.getElementById('speaker').style.animationDuration = (duration* adjustment).toString() + "ms";
}
  before_1=bpm;
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t) {
  // ボタンを有効化する
  // Enable buttons
  if (!player.app.managed) {
    document
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
  }

  // 歌詞がなければ歌詞頭出しボタンを無効にする
  // Disable jump button if no lyrics is available
  jumpBtn.disabled = !player.video.firstPhrase;
}

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position) {
  // 再生位置を表示する
  // Update current position
  positionEl.textContent = String(Math.floor(position));

  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できます
  // More precise timing information can be retrieved by `player.timer.position` at any time
}

// 再生が始まったら #overlay を非表示に
// Hide #overlay when music playback started
function onPlay() {
  document.querySelector("#overlay").style.display = "none";
}

// 再生が一時停止・停止したら歌詞表示をリセット
// Reset lyrics text field when music playback is paused or stopped
function onPause() {
  phraseEl.textContent = "-";
}

function onStop() {
  phraseEl.textContent = "-";
}

//楽曲変更する場合に呼ばれるメソッド
function onAppMediaChange() {
  phraseEl.textContent = "-";
}

//色管理利用
var color = 1;

//ゴリ押し色変更
function changeColor() {
  switch (color) {
    case 1:
      document.getElementById('stkr').style.background = "#0050FF7F";
      color++;
      break;

    case 2:
      document.getElementById('stkr').style.background = "#FF00007F";
      color++;
      break;

    case 3:
      document.getElementById('stkr').style.background = "#F7FF007E";
      color++;
      break;

    case 4:
      document.getElementById('stkr').style.background = "#00F6FF7C";
      color = 1;
      break;
  }
}