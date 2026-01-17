document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("runButton").addEventListener("click", runMagi);
});

function runMagi() {
  const input = document.getElementById("input").value.trim();
  if (!input) return;

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

/* ==============================
   レアリス｜現実的思考生成
============================== */
function judgeReality(text) {
  const t = text;
  let pros = [];
  let cons = [];

  if (t.match(/節約|安く|値段|コスト/)) {
    pros.push("費用を抑えられる点");
  }
  if (t.match(/夜行|長時間/)) {
    cons.push("移動時間が長くなること");
  }
  if (t.match(/疲|睡眠/)) {
    cons.push("睡眠の質や体力低下のリスク");
  }
  if (t.match(/新幹線|早く|快適|安全/)) {
    pros.push("移動効率や安全性の高さ");
  }

  let score = pros.length - cons.length;

  let reason = "レアリス：";
  if (pros.length > 0) {
    reason += `${pros.join("、")}は現実的に評価できる。`;
  }
  if (cons.length > 0) {
    reason += `一方で、${cons.join("、")}は無視できない現実的負担だ。`;
  }
  reason += "総合すると、現実条件は一長一短で決定打に欠ける。";

  return formatResult(score, reason);
}

/* ==============================
   メイナ｜価値・意味の思考生成
============================== */
function judgeMeaning(text) {
  const t = text;
  let aligns = [];
  let doubts = [];

  if (t.match(/節約|安く/)) {
    aligns.push("自分で工夫して選択する姿勢");
  }
  if (t.match(/旅|選択/)) {
    aligns.push("移動そのものを含めた体験価値");
  }
  if (t.match(/疲|しんど/)) {
    doubts.push("楽しさより消耗が勝つ可能性");
  }

  let score = aligns.length - doubts.length;

  let reason = "メイナ：";
  if (aligns.length > 0) {
    reason += `${aligns.join("、")}には意味を感じる。`;
  }
  if (doubts.length > 0) {
    reason += `ただし、${doubts.join("、")}点には違和感も残る。`;
  }
  reason += "価値観との相性は比較的良いが、完全な納得にはもう一歩だ。";

  return formatResult(score, reason);
}

/* ==============================
   レグレト｜後悔シミュレーション
============================== */
function judgeRegret(text) {
  const t = text;
  let futureLoss = [];
  let futureCost = [];

  if (t.match(/節約|安く/)) {
    futureLoss.push("安易に快適さを優先した選択への後悔");
  }
  if (t.match(/疲|夜行/)) {
    futureCost.push("実行後に疲労が残る可能性");
  }

  let score = futureLoss.length - futureCost.length;

  let reason = "レグレト：";
  if (futureLoss.length > 0) {
    reason += `見送った場合、${futureLoss.join("、")}が残る可能性がある。`;
  }
  if (futureCost.length > 0) {
    reason += `一方で、${futureCost.join("、")}も想定される。`;
  }
  reason += "どちらの後悔も決定的とは言えず、慎重な判断が必要だ。";

  return formatResult(score, reason);
}

/* ==============================
   共通：結果整形
============================== */
function formatResult(score, reason) {
  let symbol = "△";
  if (score > 0) symbol = "○";
  if (score < 0) symbol = "✖️";

  return { score, symbol, reason };
}

/* ==============================
   最終結論（レアリス優先）
============================== */
function decideFinal(r, m, g) {
  if (r < 0) return "結論：見送り";
  if (r === 0) return "結論：保留・再検討";
  if (r > 0 && (m > 0 || g > 0)) return "結論：やるべき";
  return "結論：保留・再検討";
}
