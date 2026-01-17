document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("runButton").addEventListener("click", runMagi);
});

function runMagi() {
  const input = document.getElementById("input").value.trim();
  if (!input) return;

  const type = classifyQuestion(input);
  const core = extractCoreConflict(input, type);

  const reality = judgeWithStance("reality", core);
  const meaning = judgeWithStance("meaning", core);
  const regret  = judgeWithStance("regret", core);

  const finalDecision = decideFinal(reality.score, meaning.score, regret.score);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧠 問いの芯：
${core.summary}

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
  if (text.match(/どちら|ではなく/)) return "選択・比較型";
  if (text.match(/続ける|辞める|やめる/)) return "継続・中断型";
  if (text.match(/挑戦|踏み出す/)) return "挑戦・リスク型";
  if (text.match(/伝える|関係/)) return "人間関係型";
  return "汎用判断型";
}

/* ==============================
   問いの芯抽出（最重要）
============================== */
function extractCoreConflict(text, type) {

  // 選択・比較型の代表的トレードオフ
  if (type === "選択・比較型") {
    if (text.match(/夜行|バス/) && text.match(/新幹線/)) {
      return {
        summary:
          "コストを抑える代わりに、移動の快適さや体調への負担を受け入れるべきか",
        low: "コスト・節約",
        high: "快適さ・体調・効率"
      };
    }
  }

  // 継続・中断型
  if (type === "継続・中断型") {
    return {
      summary:
        "今の安定や慣れを保つか、変化による不安を受け入れて前に進むべきか",
      low: "安定",
      high: "変化"
    };
  }

  // 汎用フォールバック
  return {
    summary:
      "短期的な負担と、長期的な納得や影響のどちらを重視すべきか",
    low: "短期の楽さ",
    high: "長期の納得"
  };
}

/* ==============================
   人格の立場表明（核心）
============================== */
function judgeWithStance(persona, core) {
  let score = 0;
  let reason = "";

  if (persona === "reality") {
    reason += "レアリス：この問いの本質は、";
    reason += `「${core.low}」と「${core.high}」のトレードオフだと見る。`;

    // レアリスは high（現実的安定・効率）を重視
    score = core.high.includes("体調") || core.high.includes("効率") ? 0 : -1;

    reason +=
      " 現実的には体調や効率を犠牲にする判断はリスクが高く、積極的に肯定はできない。";
  }

  if (persona === "meaning") {
    reason += "メイナ：私はこの選択を、";
    reason += `「${core.low}」を選ぶことの意味から考えたい。`;

    score = 1;

    reason +=
      " 自分で工夫し、制約の中で選択すること自体に納得感や主体性を見出せる。";
  }

  if (persona === "regret") {
    reason += "レグレト：未来から振り返ると、";
    reason += `「${core.high}」を軽視した場合の後悔が気になる。`;

    score = 0;

    reason +=
      " 金銭は取り返せても、体調を崩した経験や楽しめなかった記憶は残りやすい。";
  }

  return format(score, reason);
}

/* ==============================
   共通
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
