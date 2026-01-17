document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("runButton").addEventListener("click", runMagi);
});

function runMagi() {
  const input = document.getElementById("input").value.trim();
  if (!input) return;

  const type = classifyQuestion(input);
  const views = viewpoints[type];

  const reality = thinkReality(input, views.reality);
  const meaning = thinkMeaning(input, views.meaning);
  const regret  = thinkRegret(input, views.regret);

  const finalDecision = decideFinal(reality.score, meaning.score, regret.score);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧠 問いの型：
${type}

🧭 判定：

【レアリス｜REALITY】 ${reality.symbol}
${reality.reason}

【メイナ｜MEANING】 ${meaning.symbol}
${meaning.reason}

【レグレト｜REGRET】 ${regret.symbol}
${regret.reason}

🔍 結論：
${finalDecision}
━━━━━━━━━━━━━━
`;

  document.getElementById("output").textContent = result;
}

/* ==============================
   問いの分類レイヤー
============================== */
function classifyQuestion(text) {
  if (text.match(/どちら|か|選ぶ|比較/)) return "選択・比較型";
  if (text.match(/続ける|やめる|辞める|継続/)) return "継続・中断型";
  if (text.match(/挑戦|やるべき|踏み出す/)) return "挑戦・リスク型";
  if (text.match(/伝える|距離|関係/)) return "人間関係型";
  return "汎用判断型";
}

/* ==============================
   問いタイプ別・観点セット
============================== */
const viewpoints = {
  "選択・比較型": {
    reality: ["コスト", "時間", "体力", "安全性"],
    meaning: ["納得感", "自分らしさ", "選択の理由"],
    regret:  ["選ばなかった後悔", "将来の比較"]
  },
  "継続・中断型": {
    reality: ["安定性", "負担", "代替案"],
    meaning: ["価値観との一致", "我慢か意味か"],
    regret:  ["続けた未来", "辞めた未来"]
  },
  "挑戦・リスク型": {
    reality: ["失敗可能性", "準備状況"],
    meaning: ["成長", "人生軸"],
    regret:  ["挑戦しなかった後悔", "失敗の後悔"]
  },
  "人間関係型": {
    reality: ["影響範囲", "関係性の変化"],
    meaning: ["誠実さ", "自分の感情"],
    regret:  ["言わなかった後悔", "言った後の関係"]
  },
  "汎用判断型": {
    reality: ["現実的制約", "実行可能性"],
    meaning: ["意味", "納得"],
    regret:  ["後悔"]
  }
};

/* ==============================
   人格別・思考生成
============================== */

function thinkReality(text, points) {
  let score = 0;
  let reason = "レアリス：この問いは現実的に";

  reason += `「${points.join("・")}」の観点で整理すべきだと考える。`;

  if (text.match(/節約|安く|コスト/)) score += 1;
  if (text.match(/疲|負担|リスク|不安/)) score -= 1;

  if (score > 0) {
    reason += " 現実条件を踏まえても、前向きに検討できる余地はある。";
  } else if (score < 0) {
    reason += " 実行時の負担や不確実性が現実的な懸念となる。";
  } else {
    reason += " 利点と欠点が拮抗しており、決定打には欠ける。";
  }

  return formatResult(score, reason);
}

function thinkMeaning(text, points) {
  let score = 0;
  let reason = "メイナ：この問いは";

  reason += `「${points.join("・")}」という意味の軸で考えたい。`;

  if (text.match(/やりたい|意味|大事/)) score += 1;
  if (text.match(/義務|仕方なく/)) score -= 1;

  if (score > 0) {
    reason += " 自分の価値観に沿った選択だと感じられる。";
  } else if (score < 0) {
    reason += " 内面的な納得感が弱く、意味を見出しにくい。";
  } else {
    reason += " まだ自分の中で意味づけが定まりきっていない。";
  }

  return formatResult(score, reason);
}

function thinkRegret(text, points) {
  let score = 0;
  let reason = "レグレト：未来の視点では";

  reason += `「${points.join("・")}」を比較する必要がある。`;

  if (text.match(/後悔|逃す|機会/)) score += 1;
  if (text.match(/疲|失敗/)) score -= 1;

  if (score > 0) {
    reason += " やらなかった場合の心残りが強く残りそうだ。";
  } else if (score < 0) {
    reason += " 実行した結果の後悔も無視できない。";
  } else {
    reason += " どちらの後悔も決定的とは言えない。";
  }

  return formatResult(score, reason);
}

/* ==============================
   共通処理
============================== */
function formatResult(score, reason) {
  let symbol = "△";
  if (score > 0) symbol = "○";
  if (score < 0) symbol = "✖️";
  return { score, symbol, reason };
}

/* ==============================
   結論ロジック（レアリス優先）
============================== */
function decideFinal(r, m, g) {
  if (r < 0) return "結論：見送り";
  if (r === 0) return "結論：保留・再検討";
  if (r > 0 && (m > 0 || g > 0)) return "結論：やるべき";
  return "結論：保留・再検討";
}
