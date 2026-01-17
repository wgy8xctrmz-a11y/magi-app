document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("runButton").addEventListener("click", runMagi);
});

function runMagi() {
  const input = document.getElementById("input").value.trim();
  if (!input) return;

  const type = classifyQuestion(input);
  const assumptions = buildAssumptions(input, type);
  const views = viewpoints[type];

  const reality = thinkReality(input, views.reality, assumptions);
  const meaning = thinkMeaning(input, views.meaning, assumptions);
  const regret  = thinkRegret(input, views.regret, assumptions);

  const finalDecision = decideFinal(reality.score, meaning.score, regret.score);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧠 問いの型：
${type}

🧠 暗黙の前提（MAGI仮定）：
${assumptions.join(" / ")}

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
   問い分類
============================== */
function classifyQuestion(text) {
  if (text.match(/どちら|か|選ぶ|比較/)) return "選択・比較型";
  if (text.match(/続ける|辞める|やめる|継続/)) return "継続・中断型";
  if (text.match(/挑戦|踏み出す|リスク/)) return "挑戦・リスク型";
  if (text.match(/伝える|距離|関係/)) return "人間関係型";
  return "汎用判断型";
}

/* ==============================
   前提補完レイヤー（核心）
============================== */
function buildAssumptions(text, type) {
  const a = [];

  // 共通の常識
  if (text.match(/行く|移動|旅行/)) {
    a.push("一定の移動距離がある");
  }
  if (text.match(/節約|安く|値段/)) {
    a.push("コスト差を気にしている");
  }

  // 交通系の常識
  if (text.match(/夜行/)) {
    a.push("長時間移動になる");
    a.push("睡眠の質が下がる可能性");
    a.push("翌日の体力に影響");
  }
  if (text.match(/新幹線/)) {
    a.push("短時間で移動できる");
    a.push("体力消耗が少ない");
    a.push("コストは高め");
  }

  // 人生判断系の常識
  if (type === "継続・中断型") {
    a.push("現状には一定の理由がある");
    a.push("変化には不安が伴う");
  }

  return a;
}

/* ==============================
   人格別思考生成
============================== */

function thinkReality(text, points, a) {
  let score = 0;
  let reason = "レアリス：";

  reason += `この問いは現実的に「${points.join("・")}」で考えるべきだ。`;

  if (a.includes("長時間移動になる")) score -= 2;
  if (a.includes("睡眠の質が下がる可能性")) score -= 1;
  if (a.includes("短時間で移動できる")) score += 2;
  if (a.includes("コスト差を気にしている")) score += 1;

  reason += ` 前提として、${a.join("、")}と仮定する。`;
  reason += " これらを踏まえると、現実条件は決して楽観できない。";

  return format(score, reason);
}

function thinkMeaning(text, points, a) {
  let score = 0;
  let reason = "メイナ：";

  reason += `意味の軸は「${points.join("・")}」だと感じる。`;

  if (a.includes("コスト差を気にしている")) score += 2;
  if (a.includes("体力消耗が少ない")) score += 1;
  if (a.includes("翌日の体力に影響")) score -= 1;

  reason += " 節約という選択には、自分で選んだという納得感がある。";

  return format(score, reason);
}

function thinkRegret(text, points, a) {
  let score = 0;
  let reason = "レグレト：";

  reason += `未来の視点では「${points.join("・")}」が重要になる。`;

  if (a.includes("コスト差を気にしている")) score += 1;
  if (a.includes("翌日の体力に影響")) score -= 2;

  reason += " 将来、どちらを選んだ自分を後悔しやすいかを考えたい。";

  return format(score, reason);
}

/* ==============================
   共通処理
============================== */
function format(score, reason) {
  let symbol = "△";
  if (score > 0) symbol = "○";
  if (score < 0) symbol = "✖️";
  return { score, symbol, reason };
}

/* ==============================
   結論（レアリス優先）
============================== */
function decideFinal(r, m, g) {
  if (r < 0) return "結論：見送り";
  if (r === 0) return "結論：保留・再検討";
  if (r > 0 && (m > 0 || g > 0)) return "結論：やるべき";
  return "結論：保留・再検討";
}
