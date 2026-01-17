document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("runButton");
  if (btn) btn.addEventListener("click", runMagi);
});

/* ==============================
   判断構造マップ
============================== */
const JUDGMENT_STRUCTURES = {
  safety_vs_growth: { label: "安全 vs 成長" },
  short_vs_long: { label: "短期の楽さ vs 長期の価値" },
  certainty_vs_possibility: { label: "確実性 vs 可能性" },
  self_vs_others: { label: "自分優先 vs 他者優先" },
  present_vs_ideal: { label: "今の自分 vs なりたい自分" },
  failure_vs_regret: { label: "失敗回避 vs 後悔回避" },
  efficiency_vs_acceptance: { label: "効率 vs 納得感" }
};

/* ==============================
   判断構造の兆候語
============================== */
const STRUCTURE_SIGNS = {
  safety_vs_growth: ["不安", "怖", "リスク", "無理", "踏み出"],
  short_vs_long: ["今", "将来", "あとで", "長期", "先々"],
  certainty_vs_possibility: ["安定", "確実", "可能性", "チャンス"],
  self_vs_others: ["相手", "周り", "迷惑", "家族", "期待"],
  present_vs_ideal: ["このまま", "変わりたい", "成長", "理想", "挑戦"],
  failure_vs_regret: ["失敗", "後悔", "やらなかった"],
  efficiency_vs_acceptance: ["効率", "合理", "納得", "気持ち", "値段"]
};

/* ==============================
   移動・体力系 経験則
============================== */
const FATIGUE_TRAVEL_SIGNS = [
  "夜行", "バス", "移動", "長時間", "深夜",
  "睡眠", "体力", "疲れ", "翌日", "早朝"
];

/* ==============================
   質問タイプ判定
============================== */
const QUESTION_TYPE_SIGNS = {
  RELATION: ["相手", "人", "関係", "言うべき", "距離", "我慢"],
  CHALLENGE: ["安定", "挑戦", "踏み出", "変わ", "ずっと", "やりたかった"],
  CONTINUE: ["続ける", "辞める", "このまま", "やめ時", "見切り"]
};

function detectQuestionType(text) {
  const t = text.replace(/\s/g, "");
  if (QUESTION_TYPE_SIGNS.RELATION.some(w => t.includes(w))) return "人間関係型";
  if (QUESTION_TYPE_SIGNS.CHALLENGE.some(w => t.includes(w))) return "挑戦・踏み出し型";
  if (QUESTION_TYPE_SIGNS.CONTINUE.some(w => t.includes(w))) return "継続・撤退型";
  return "選択・比較型";
}

/* ==============================
   意図仮説レイヤー
============================== */
const QUESTION_TYPE_HYPOTHESES = {
  "選択・比較型": ["efficiency_vs_acceptance", "failure_vs_regret"],
  "挑戦・踏み出し型": ["safety_vs_growth", "present_vs_ideal", "failure_vs_regret"],
  "継続・撤退型": ["short_vs_long", "certainty_vs_possibility"],
  "人間関係型": ["self_vs_others", "failure_vs_regret"]
};

function applyIntentHypotheses(scores, questionType) {
  (QUESTION_TYPE_HYPOTHESES[questionType] || []).forEach(key => {
    scores[key] = (scores[key] || 0) + 1;
  });
  return scores;
}

function applyTravelFatigueBias(scores, questionType, text) {
  if (questionType !== "選択・比較型") return scores;
  if (FATIGUE_TRAVEL_SIGNS.some(w => text.includes(w))) {
    scores["safety_vs_growth"] = (scores["safety_vs_growth"] || 0) + 1;
  }
  return scores;
}

/* ==============================
   判断構造抽出
============================== */
function extractJudgmentStructures(text) {
  const scores = {};
  for (const key in STRUCTURE_SIGNS) {
    scores[key] = 0;
    STRUCTURE_SIGNS[key].forEach(word => {
      if (text.includes(word)) scores[key]++;
    });
  }
  return scores;
}

function pickMainStructures(scores) {
  const picked = Object.entries(scores)
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  return picked.length ? picked : ["efficiency_vs_acceptance"];
}

/* ==============================
   判定記号ルール
============================== */
const DECISION_RULES = {
  reality: {
    blockIf: ["safety_vs_growth", "failure_vs_regret"]
  },
  meaning: {
    allowIf: ["present_vs_ideal", "safety_vs_growth", "failure_vs_regret"]
  },
  regret: {
    blockIf: ["safety_vs_growth"],
    allowIf: ["failure_vs_regret"]
  }
};

function decideSymbol(personaKey, scores) {
  const rules = DECISION_RULES[personaKey];
  const strong = key => (scores[key] || 0) >= 2;

  if (rules.blockIf && rules.blockIf.some(strong)) return "✖️";
  if (rules.allowIf && rules.allowIf.some(strong)) return "○";
  return "△";
}

/* ==============================
   理由文生成
============================== */
function generateReason(personaKey, mainStructure) {
  const label = JUDGMENT_STRUCTURES[mainStructure].label;

  if (personaKey === "reality") {
    return `私はこの悩みを「${label}」の観点から捉える。
破綻しにくさと安全性を最優先に考える人格として、
無理を前提に進む判断にはブレーキをかけたい。`;
  }

  if (personaKey === "meaning") {
    return `この問いは「${label}」に関わるものだ。
自分が何に納得して選びたいかという軸で考えると、
その選択が意味を持つかどうかが重要になる。`;
  }

  return `私はこの選択を将来から振り返る。
「${label}」の結果として、
後になって取り返しのつかない後悔が残らないかを重く見る。`;
}

/* ==============================
   三者協議 結論生成
============================== */
function generateFinalConclusion({ reality, meaning, regret }) {
  if (regret === "✖️" && meaning !== "○") {
    return `今回は後悔の不可逆性を最重視する。
価格や効率よりも、体調や満足度を守る判断が妥当だ。
結論：見送り。`;
  }

  if (meaning === "○" && regret !== "✖️") {
    return `この選択には価値や納得感が見出せる。
致命的な後悔リスクも高くないため、前向きに進む意義がある。
結論：やるべき。`;
  }

  if (reality === "✖️") {
    return `現実的な成立条件に無視できない懸念がある。
感情や意味以前に、今回は避ける判断が妥当だ。
結論：見送り。`;
  }

  return `三者の意見はいずれも決定打に欠けている。
追加条件を整理した上で再検討する余地がある。
結論：保留・再検討。`;
}

/* ==============================
   メイン処理
============================== */
function runMagi() {
  const inputEl = document.getElementById("input");
  const outEl = document.getElementById("output");

  if (!inputEl || !outEl) return;

  const input = inputEl.value.trim();
  if (!input) {
    outEl.textContent = "※ 判断したい内容を入力してください。";
    return;
  }

  let scores = extractJudgmentStructures(input);

  const questionType = detectQuestionType(input);
  scores = applyIntentHypotheses(scores, questionType);
  scores = applyTravelFatigueBias(scores, questionType, input);

  const structures = pickMainStructures(scores);
  const main = structures[0];

  const realitySymbol = decideSymbol("reality", scores);
  const meaningSymbol = decideSymbol("meaning", scores);
  const regretSymbol  = decideSymbol("regret", scores);

  const conclusion = generateFinalConclusion({
    reality: realitySymbol,
    meaning: meaningSymbol,
    regret: regretSymbol
  });

  outEl.textContent = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧠 問いの型：
${questionType}

🧠 判断構造：
${structures.map(k => JUDGMENT_STRUCTURES[k].label).join(" / ")}

🧭 判定：

【レアリス｜REALITY】 ${realitySymbol}
${generateReason("reality", main)}

【メイナ｜MEANING】 ${meaningSymbol}
${generateReason("meaning", main)}

【レグレト｜REGRET】 ${regretSymbol}
${generateReason("regret", main)}

🔍 結論：
${conclusion}
━━━━━━━━━━━━━━
`;
}
