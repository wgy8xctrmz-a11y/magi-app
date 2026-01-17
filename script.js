function runMagi() {
  const input = document.getElementById("input").value;
  const reality = Number(document.getElementById("reality").value);
  const meaning = Number(document.getElementById("meaning").value);
  const regret = Number(document.getElementById("regret").value);

  let decision = "";
  if (meaning >= 7 && regret >= 7) {
    decision = "結論：やるべき";
  } else if (reality <= 3) {
    decision = "結論：見送り";
  } else {
    decision = "結論：保留・再検討";
  }

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
