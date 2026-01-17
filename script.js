document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("runButton");
  button.addEventListener("click", runMagi);
});

function runMagi() {
  const input = document.getElementById("input").value.trim();

  const reality = judgeReality(input);
  const meaning = judgeMeaning(input);
  const regret = judgeRegret(input);

  const finalDecision = decideFinal(reality.score, meaning.score, regret.score);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

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

/* ─────────────────────────────
   レアリス｜REALITY（現実主義）
───────────────────────────── */
function judgeReality(text) {
  const t = text.toLowerCase();
  let score = 0;

  const hasCheap = t.includes("節約") || t.includes("安く") || t.includes("値段") || t.includes("コスト");
  const hasNight = t.includes("夜行") || t.includes("長時間") || t.includes("疲") || t.includes("睡眠");
  const hasShinkansen = t.includes("新幹線") || t.includes("早く") || t.includes("快適") || t.includes("安全");

  if (hasShinkansen) score += 2;
  if (hasCheap) score += 1;
  if (hasNight) score -= 3;

  let reason = "";
  if (score >= 1) {
    reason = "レアリス：現実的観点では、効率や安全性、快適性が重要であり、それに優れる選択肢が含まれているため肯定評価とする。";
  } else if (score <= -1) {
    reason = "レアリス：実務的に見ると、長時間移動や疲労、睡眠の質低下など現実的負担が大きく、否定評価とする。";
  } else {
    reason = "レアリス：現実条件の利点と欠点が拮抗しており、中間評価とする。";
  }

  return scoreToResult(score, reason);
}

/* ─────────────────────────────
   メイナ｜MEANING（価値主義）
───────────────────────────── */
function judgeMeaning(text) {
  const t = text.toLowerCase();
  let score = 0;

  const hasCheap = t.includes("節約") || t.includes("安く") || t.includes("値段") || t.includes("コスト");
  const hasJourney = t.includes("旅") || t.includes("体験") || t.includes("挑戦") || t.includes("選択");
  const hasForced = t.includes("仕方なく") || t.includes("義務") || t.includes("嫌々");

  if (hasCheap) score += 2;
  if (hasJourney) score += 1;
  if (hasForced) score -= 2;

  let reason = "";
  if (score >= 1) {
    reason = "メイナ：価値や意味の観点から、節約という選択や体験のあり方に納得感があり、肯定評価とする。";
  } else if (score <= -1) {
    reason = "メイナ：意味的充足や内面的な納得感が乏しく、価値との整合性が低いため否定評価とする。";
  } else {
    reason = "メイナ：意味的価値の方向性が定まらず、中間評価とする。";
  }

  return scoreToResult(score, reason);
}

/* ─────────────────────────────
   レグレト｜REGRET（後悔最小化）
───────────────────────────── */
function judgeRegret(text) {
  const t = text.toLowerCase();
  let score = 0;

  const hasMissChance = t.includes("やらなかった") || t.includes("逃す") || t.includes("機会");
  const hasFatigue = t.includes("疲") || t.includes("無理") || t.includes("しんど");
  const hasCheap = t.includes("節約") || t.includes("安く") || t.includes("値段");

  if (hasMissChance) score += 2;
  if (hasCheap) score += 1;
  if (hasFatigue) score -= 2;

  let reason = "";
  if (score >= 1) {
    reason = "レグレト：将来振り返った際に『やらなかった後悔』が残る可能性が高く、肯定評価とする。";
  } else if (score <= -1) {
    reason = "レグレト：実行した結果の疲労や不満が後悔として残る可能性が高く、否定評価とする。";
  } else {
    reason = "レグレト：実行後と未実行後の後悔の大きさが拮抗しており、中間評価とする。";
  }

  return scoreToResult(score, reason);
}

/* ─────────────────────────────
   スコア → 記号変換（判断を出すMAGI仕様）
───────────────────────────── */
function scoreToResult(score, reason) {
  let symbol = "△";
  if (score >= 1) symbol = "○";
  else if (score <= -1) symbol = "✖️";

  return {
    score,
    symbol,
    reason
  };
}

/* ─────────────────────────────
   最終結論ロジック
───────────────────────────── */
function decideFinal(r, m, g) {
  const sum = r + m + g;

  if (sum >= 2) return "結論：やるべき";
  if (sum <= -2) return "結論：見送り";
  return "結論：保留・再検討";
}
