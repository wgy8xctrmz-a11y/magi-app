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
   各人格の判断ロジック
───────────────────────────── */

function judgeReality(text) {
  const t = text.toLowerCase();

  let score = 0;
  let reason = "";

  if (t.includes("節約") || t.includes("安く") || t.includes("値段") || t.includes("コスト")) {
    score += 1;
  }
  if (t.includes("夜行") || t.includes("長時間") || t.includes("疲") || t.includes("睡眠")) {
    score -= 2;
  }
  if (t.includes("新幹線") || t.includes("早く") || t.includes("快適") || t.includes("安全")) {
    score += 2;
  }

  if (score >= 2) {
    reason = "レアリス：現実的条件として、効率・安全・快適性の観点で有利な選択肢が含まれているため、肯定評価とする。";
  } else if (score <= -1) {
    reason = "レアリス：実務的・現実的に見ると、時間や体力、安全性の面で負担が大きく、現実性が低いと判断する。";
  } else {
    reason = "レアリス：現実条件の利点と欠点が拮抗しており、実用性の観点では中間評価とする。";
  }

  return scoreToResult(score, reason);
}

function judgeMeaning(text) {
  const t = text.toLowerCase();

  let score = 0;
  let reason = "";

  if (t.includes("節約") || t.includes("安く") || t.includes("意味") || t.includes("価値")) {
    score += 2;
  }
  if (t.includes("体験") || t.includes("旅") || t.includes("挑戦") || t.includes("選択")) {
    score += 1;
  }
  if (t.includes("義務") || t.includes("仕方なく") || t.includes("嫌々")) {
    score -= 2;
  }

  if (score >= 2) {
    reason = "メイナ：価値や意味の整合性として、本人の動機や選択の物語性が感じられ、肯定評価とする。";
  } else if (score <= -1) {
    reason = "メイナ：意味的充足や価値との一致度が低く、内面的な納得感に欠けるため否定評価とする。";
  } else {
    reason = "メイナ：意味的価値の方向性が定まらず、現時点では中間評価とする。";
  }

  return scoreToResult(score, reason);
}

function judgeRegret(text) {
  const t = text.toLowerCase();

  let score = 0;
  let reason = "";

  if (t.includes("後悔") || t.includes("後で") || t.includes("将来")) {
    score += 1;
  }
  if (t.includes("疲") || t.includes("無理") || t.includes("しんど")) {
    score -= 2;
  }
  if (t.includes("やらなかった") || t.includes("逃す") || t.includes("機会")) {
    score += 2;
  }

  if (score >= 2) {
    reason = "レグレト：将来振り返った際に『やらなかった後悔』が大きくなる可能性が高いため、肯定評価とする。";
  } else if (score <= -1) {
    reason = "レグレト：実行した結果の疲労や不満が後悔として残る可能性が高く、否定評価とする。";
  } else {
    reason = "レグレト：実行後と未実行後の後悔の大きさが拮抗しており、中間評価とする。";
  }

  return scoreToResult(score, reason);
}

/* ─────────────────────────────
   スコア → 記号変換
───────────────────────────── */

function scoreToResult(score, reason) {
  let symbol = "△";
  if (score >= 2) symbol = "○";
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

  if (sum >= 4) return "結論：やるべき";
  if (sum <= -2) return "結論：見送り";
  return "結論：保留・再検討";
}
