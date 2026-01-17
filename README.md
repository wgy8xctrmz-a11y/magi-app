# magi-app
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>PERSONAL MAGI</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🧠 PERSONAL MAGI</h1>

  <textarea id="input" placeholder="判断したい内容を書いてください..." rows="5"></textarea>

  <div class="scores">
    <label>REALITY: <input type="number" id="reality" min="0" max="10"></label>
    <label>MEANING: <input type="number" id="meaning" min="0" max="10"></label>
    <label>REGRET: <input type="number" id="regret" min="0" max="10"></label>
  </div>

  <button onclick="runMagi()">判定する</button>

  <pre id="output"></pre>

  <script src="script.js"></script>
</body>
</html>
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
body {
  font-family: system-ui, sans-serif;
  background: #111;
  color: #eee;
  padding: 20px;
}

textarea, input {
  width: 100%;
  margin: 5px 0;
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
}

pre {
  background: #222;
  padding: 15px;
  margin-top: 15px;
  white-space: pre-wrap;
}
