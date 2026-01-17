document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("runButton");
  button.addEventListener("click", runMagi);
});

function runMagi() {
  const input = document.getElementById("input").value.trim();
  if (!input) {
    alert("判定したい内容を入力してください。");
    return;
  }

  const reality = judgeReality(input);
  const meaning = judgeMeaning(input);
  const regret = judgeRegret(input);

  const decision = makeFinalDecision(reality, meaning, regret);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧭 判定：
REALITY：${reality}
MEANING：${meaning}
REGRET：${regret}

🔍 結論：
${decision}
━━━━━━━━━━━━━━
  `;

  document.getElementById("output").textContent = result;
}

/* ===== 人格別判定ロジック ===== */

function judgeReality(text) {
  if (text.match(/今すぐ|簡単|できそう|現実的/)) return "○";
  if (text.match(/難しそう|不安|リスク|準備/)) return "△";
  if (text.match(/無理|不可能|現実的じゃない/)) return "✖️";
  return "△";
}

function judgeMeaning(text) {
  if (text.match(/大事|人生|意味|夢|やりたい/)) return "○";
  if (text.match(/まあまあ|悪くない|迷う/)) return "△";
  if (text.match(/どうでもいい|義務|嫌/)) return "✖️";
  return "△";
}

function judgeRegret(text) {
  if (text.match(/後悔する|一生|逃したくない/)) return "○";
  if (text.match(/後悔するかも|微妙/)) return "△";
  if (text.match(/別に|気にしない|問題ない/)) return "✖️";
  return "△";
}

/* ===== 最終結論 ===== */

function makeFinalDecision(reality, meaning, regret) {
  const results = [reality, meaning, regret];
  const circleCount = results.filter(r => r === "○").length;
  const crossCount = results.filter(r => r === "✖️").length;

  if (circleCount >= 2) return "実行すべき";
  if (crossCount >= 2) return "見送り";
  return "保留・再検討";
}
