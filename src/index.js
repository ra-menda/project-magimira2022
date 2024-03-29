import {Player} from "textalive-app-api";

// TextAlive Player を作る
const player = new Player({
  app: {
    token: "1HJzpsZ11CfoUPrr",
  },
  mediaElement: document.querySelector("#media"),
});

// 歌詞を交互にする
var isRight = false;
var oldphrase = "";

// BPM周りの変数
var before_bpm = 0;
var adjustment = 16;

// 色管理利用
var color = 2;

// ボタン周り
const playBtns = document.querySelectorAll(".play");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const reloadBtn = document.querySelector("#reload_button");
const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#cssLiricsLeft");
const phraseEl2 = document.querySelector("#cssLiricsRight");
const displayChangeColor = document.querySelector('#stkr'); //画面クリックでも色変更できるように
const lightBeat = document.querySelector('#minilightframe'); 
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// スクロール禁止
window.onload = function () {
  document.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, {passive: false});
  document.addEventListener('mousewheel', function (e) {
    e.preventDefault();
  }, {passive: false});
}

// 単語が発声されていたら #text に表示する
function animatePhrase(now, unit) {
  if (unit.contains(now)) {
    if (unit.text != oldphrase) {
      if (isRight) {
        phraseEl.textContent = unit.text;
        isRight = !isRight;
      } else {
        phraseEl2.textContent = unit.text;
        isRight = !isRight;
      }
      oldphrase = unit.text;
    }
  }
}

// TextAlive Player のイベントリスナを登録する
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onPlay,
  onPause,
  onStop,
  onTimeUpdate
});

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
    // 一時停止ボタン
    pauseBtn.addEventListener(
        "click",
        () => player.video && player.requestPause()
    );
    // 巻き戻しボタン
    rewindBtn.addEventListener(
        "click",
        rewind
    );
    // 楽曲再指定ボタン
    reloadBtn.addEventListener(
        "click",
        changeMedia
    );
    // 色変更ボタン
    displayChangeColor.addEventListener(
        "click",
        changeColor
    )
  }
  // 楽曲URLが指定されていなければ マジカルミライ 2022グランプリ楽曲を読み込む
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
  while (p && p.next) {
    p.animate = animatePhrase;
    p = p.next;
  }
  // 最後のフレーズの取得のためにもう一回回す
  p.animate = animatePhrase;
  p = p.next;
  // 曲変更後に大きい再生ボタンを再表示する。
  document.querySelector("#overlay").style.visibility = "visible";
}

function onTimeUpdate(position) {
  const duration = player.findBeat(position).duration;
  const bpm = 1000 / duration * 60

  // BPM差が10以上であればdurationを更新する
  if (Math.abs(bpm - before_bpm) > 16) {
    document.getElementById('image').style.animationDuration = (duration * adjustment).toString() + "ms";
    document.getElementById('speaker').style.animationDuration = (duration * adjustment).toString() + "ms";
    document.getElementById('stkrframe').style.animationDuration = (duration * adjustment / 2 ).toString() + "ms";
    const lightBeat = document.getElementsByClassName('miniLightframe');
    for (let i = 0; i < lightBeat.length; i++) {
    lightBeat[i].style.animationDuration = (duration * adjustment / 2).toString() + "ms";
  }
    //document.getElementById('miniLightframe').style.animationDuration = (duration * adjustment).toString() + "ms";
  }
  before_bpm = bpm;
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
}

// 再生が始まったら #overlay を非表示に
function onPlay() {
  document.querySelector("#overlay").style.visibility = "hidden";
}

// 巻き戻しする際の処理
async function rewind() {
  player.requestMediaSeek(0);
  await sleep(50);
  elementReset();
}

// 再生が一時停止・停止したら歌詞表示をリセット
function onPause() {
  elementReset();
}

function onStop() {
  elementReset();
}

function elementReset() {
  phraseEl.textContent = " ";
  phraseEl2.textContent = " ";
  oldphrase = "";
  isRight = !isRight;
  document.getElementById('image').style.animationDuration = "0s";
  document.getElementById('speaker').style.animationDuration = "0s";
  before_bpm = 0;
}

// 楽曲変更する場合に呼ばれるメソッド
function changeMedia() {
  player.requestStop();
  player.createFromSongUrl(document.querySelector("#song_url").value);
}

// 色変更
function changeColor() {
  let miniLightColor;
  // 'miniLight'Classの配列が格納される
  const miniLightColorElements = document.getElementsByClassName('miniLight');

  switch (color) {
    case 1:
      // 初音ミク
      document.getElementById('light').style.background = "#46FF82";
      miniLightColor = "#46FF82";
      color++;
      break;

    case 2:
      // 鏡音レン
      document.getElementById('light').style.background = "#ffc527";
      miniLightColor = "#ffc527";
      color++;
      break;

    case 3:
      // 鏡音リン
      document.getElementById('light').style.background = "#f58e2d";
      miniLightColor = "#f58e2d";
      color++;
      break;

    case 4:
      // 巡音ルカ
      document.getElementById('light').style.background = "#fc52ad";
      miniLightColor = "#fc52ad";
      color++;
      break;

    case 5:
      // MEIKOさん
      document.getElementById('light').style.background = "#ff4848";
      miniLightColor = "#ff4848";
      color++;
      break;

    case 6:
      // KAITOさん
      document.getElementById('light').style.background = "#4668ff";
      miniLightColor = "#4668ff";
      color++;
      break;

    case 7:
      // 白
      document.getElementById('light').style.background = "#d6ffff";
      miniLightColor = "#d6ffff";
      color=1;
      break;
  }

  for (let i = 0; i < miniLightColorElements.length; i++) {
    miniLightColorElements[i].style.backgroundColor = miniLightColor;
  }
}