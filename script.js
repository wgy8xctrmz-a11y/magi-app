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
  present_vs_ideal: ["このまま", "変わりたい", "成長", "理想"],
  failure_vs_regret: ["失敗", "後悔", "やらなかった"],
  efficiency_vs_acceptance: ["効率", "合理", "納得", "気持ち"]
};

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

  const scores = extractJudgmentStructures(input);
  const structures = pickMainStructures(scores);

  const reality = generateReason("reality", structures);
  const meaning = generateReason("meaning", structures);
  const regret  = generateReason("regret", structures);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧠 判断構造：
${structures.map(k => JUDGMENT_STRUCTURES[k].label).join(" / ")}

🧭 判定：

【レアリス｜REALITY】 △
${reality}

【メイナ｜MEANING】 △
${meaning}

【レグレト｜REGRET】 △
${regret}

🔍 結論：
結論：保留・再検討
━━━━━━━━━━━━━━
`;

  outEl.textContent = result;
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

/* ==============================
   主構造選択（必ず返す）
============================== */
function pickMainStructures(scores) {
  const picked = Object.entries(scores)
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  // ★ フォールバック（超重要）
  if (picked.length === 0) {
    return ["efficiency_vs_acceptance", "short_vs_long"];
  }
  return picked;
}

/* ==============================
   理由文生成（人格は必ず立場を取る）
============================== */
function generateReason(personaKey, structures) {
  const main = structures[0] || "efficiency_vs_acceptance";
  const label = JUDGMENT_STRUCTURES[main].label;

  if (personaKey === "reality") {
    return `私はこの悩みを「${label}」のトレードオフだと捉える。
私は破綻しにくい側に立つ人格だ。
この状況では、無理をして進む選択は現実的なリスクが残る。
だから私は、この判断にはブレーキをかける。`;
  }

  if (personaKey === "meaning") {
    return `この悩みは「${label}」において、
自分が何を大事にして選びたいかが問われている。
私は納得して選ぶ側に立つ人格だ。
ただし今は、その覚悟や言語化がまだ足りないと感じる。`;
  }

  if (personaKey === "regret") {
    return `私はこの悩みを「${label}」の観点から、
将来の後悔として考える。
私は取り返しのつかない後悔を避ける側に立つ。
この選択で失われる可能性のあるものは、後から戻せない。`;
  }

  return "";
}
