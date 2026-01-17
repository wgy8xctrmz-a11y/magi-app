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

  const reality = judgeRealis(input);
  const meaning = judgeMeina(input);
  const regret = judgeRegret(input);

  const decision = makeFinalDecision(reality.result, meaning.result, regret.result);

  const result = `
━━━━━━━━━━━━━━
【PERSONAL MAGI 判定ログ】
━━━━━━━━━━━━━━
📌 対象：
${input}

🧭 判定：

【レアリス｜REALITY】 ${reality.result}
${reality.reason}

【メイナ｜MEANING】 ${meaning.result}
${meaning.reason}

【レグレト｜REGRET】 ${regret.result}
${regret.reason}

🔍 結論：
${decision}
━━━━━━━━━━━━━━
  `;

  document.getElementById("output").textContent = result;
}

/* ===== 人格別判定ロジック（人格語彙版） ===== */

function judgeRealis(text) {
  if (text.match(/今すぐ|簡単|できそう|現実的/)) {
    return {
      result: "○",
      reason: "レアリス：条件・資源・時間の制約を考慮しても、現実的に実行可能と判断する。リスクは許容範囲内だ。"
    };
  }
  if (text.match(/難しそう|不安|リスク|準備/)) {
    return {
      result: "△",
      reason: "レアリス：実行可能性はあるが、条件調整とリスク管理が必要だ。現実面の不確実性が残る。"
    };
  }
  if (text.match(/無理|不可能|現実的じゃない/)) {
    return {
      result: "✖️",
      reason: "レアリス：現状の制約条件では実行性が低く、破綻リスクが高すぎる。現実的ではない。"
    };
  }
  return {
    result: "△",
    reason: "レアリス：現実条件の情報が不足しているため、中間評価とする。追加検討が必要だ。"
  };
}

function judgeMeina(text) {
  if (text.match(/大事|人生|意味|夢|やりたい/)) {
    return {
      result: "○",
      reason: "メイナ：これはあなたの人生軸や価値観に強く合致している。自分らしさと納得感が高い選択だと思う。"
    };
  }
  if (text.match(/まあまあ|悪くない|迷う/)) {
    return {
      result: "△",
      reason: "メイナ：意味は感じるけれど、心のどこかに違和感も残っている。まだ納得しきれていない印象。"
    };
  }
  if (text.match(/どうでもいい|義務|嫌/)) {
    return {
      result: "✖️",
      reason: "メイナ：これはあなたの価値観や想いと噛み合っていない。意味を見出しにくい選択だと感じる。"
    };
  }
  return {
    result: "△",
    reason: "メイナ：意味や価値との一致度がはっきりしないため、今は中間評価とする。"
  };
}

function judgeRegret(text) {
  if (text.match(/後悔する|一生|逃したくない/)) {
    return {
      result: "○",
      reason: "レグレト：この選択を見送れば、将来のあなたは強い心残りと後悔を抱える可能性が高い。"
    };
  }
  if (text.match(/後悔するかも|微妙/)) {
    return {
      result: "△",
      reason: "レグレト：後悔する可能性はあるが、致命的なものになるかは不透明だ。未来の自分は揺れるかもしれない。"
    };
  }
  if (text.match(/別に|気にしない|問題ない/)) {
    return {
      result: "✖️",
      reason: "レグレト：この選択をしなくても、未来のあなたは大きな後悔を抱かない可能性が高い。"
    };
  }
  return {
    result: "△",
    reason: "レグレト：後悔の大きさを見積もる材料が不足しているため、中間評価とする。"
  };
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
