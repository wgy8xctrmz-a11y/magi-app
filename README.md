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
