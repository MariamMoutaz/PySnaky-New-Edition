/* 
   PySnaky 
   Sections: cursor, canvas, storage,
   navigation, lesson , quiz , python sim
 */

const STORAGE_KEY = "pysnaky_progress_v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { passed: {} };
  } catch (e) {
    return { passed: {} };
  }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) { /* ignore */ }
}
let progress = loadProgress();

function resetProgress() {
  if (!confirm("Reset all lesson progress? This can't be undone.")) return;
  progress = { passed: {} };
  saveProgress(progress);
  renderSnakeTracker();
  if (document.getElementById("lessonPanel").dataset.current) {
    renderLessonPanel(document.getElementById("lessonPanel").dataset.current);
  }
  renderQuizHub();
}


const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  });
  document.addEventListener("mousedown", () => cursor.classList.add("click"));
  document.addEventListener("mouseup", () => cursor.classList.remove("click"));
}

/*  background*/
const bgCanvas = document.getElementById("bgCanvas");
const bctx = bgCanvas.getContext("2d");
let dots = [];
function setupCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  const count = Math.floor((window.innerWidth * window.innerHeight) / 34000);
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 1.4 + 0.4,
    vy: Math.random() * 0.15 + 0.03,
    hue: Math.random() > 0.7 ? "#b78cff" : "#4ee6a4",
    a: Math.random() * 0.5 + 0.15
  }));
}
function drawBg() {
  bctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  dots.forEach((d) => {
    d.y -= d.vy;
    if (d.y < -5) d.y = bgCanvas.height + 5;
    bctx.beginPath();
    bctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    bctx.fillStyle = d.hue;
    bctx.globalAlpha = d.a;
    bctx.fill();
  });
  bctx.globalAlpha = 1;
  requestAnimationFrame(drawBg);
}
setupCanvas();
window.addEventListener("resize", setupCanvas);
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(drawBg);
}


function showPage(pageId) {
  ["home", "lessons", "quiz", "about"].forEach((p) => {
    const el = document.getElementById(p + "-page");
    if (el) el.style.display = "none";
  });
  const target = document.getElementById(pageId + "-page");
  if (target) target.style.display = "block";
  const navItem = document.getElementById("nav-" + pageId);
  if (navItem) navItem.checked = true;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pageId === "lessons" && !document.getElementById("lessonNav").dataset.built) {
    buildLessonsPage();
  }
  if (pageId === "quiz") renderQuizHub();
}


function renderSnakeTracker() {
  const body = document.getElementById("snakeBody");
  const total = LESSONS.length;
  document.getElementById("totalCount").textContent = total;
  let doneCount = 0;
  body.innerHTML = "";
  LESSONS.forEach((lesson) => {
    const seg = document.createElement("div");
    seg.className = "snake-segment";
    if (progress.passed[lesson.id]) { seg.classList.add("done"); doneCount++; }
    seg.title = lesson.title;
    seg.onclick = () => { showPage("lessons"); selectLesson(lesson.id); };
    body.appendChild(seg);
  });
  document.getElementById("doneCount").textContent = doneCount;
}

/* Lessons page*/
function buildLessonsPage() {
  const nav = document.getElementById("lessonNav");
  nav.dataset.built = "1";
  nav.innerHTML = "";
  LESSONS.forEach((lesson, i) => {
    const item = document.createElement("div");
    item.className = "lesson-nav-item";
    item.id = "navitem-" + lesson.id;
    item.innerHTML = `<span class="dot"></span>${lesson.title}`;
    item.onclick = () => selectLesson(lesson.id);
    nav.appendChild(item);
  });
  selectLesson(LESSONS[0].id);
}

function selectLesson(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return;
  document.querySelectorAll(".lesson-nav-item").forEach((el) => el.classList.remove("active"));
  const navEl = document.getElementById("navitem-" + lessonId);
  if (navEl) navEl.classList.add("active");
  LESSONS.forEach((l) => {
    const el = document.getElementById("navitem-" + l.id);
    if (el && progress.passed[l.id]) el.classList.add("completed");
  });
  renderLessonPanel(lessonId);
}

function renderLessonPanel(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const panel = document.getElementById("lessonPanel");
  panel.dataset.current = lessonId;

  const idx = LESSONS.findIndex((l) => l.id === lessonId);
  const passed = !!progress.passed[lessonId];

  let html = `
    <h2>${lesson.title}</h2>
    <p class="intro">${lesson.intro}</p>
    <div class="body">${lesson.body}</div>
  `;

  lesson.examples.forEach((ex, exIdx) => {
    const codeId = `code-${lesson.id}-${exIdx}`;
    const outId = `out-${lesson.id}-${exIdx}`;
    html += `
      <div class="code-editor">
        <div class="code-header">
          <span class="code-dot red"></span><span class="code-dot yellow"></span><span class="code-dot green"></span>
          <span class="code-title">${ex.title}</span>
        </div>
        <pre id="${codeId}">${escapeHtml(ex.code)}</pre>
        <button class="run-btn" onclick="runExample('${codeId}','${outId}')">▶ Run</button>
        <div class="code-output" id="${outId}"><span class="placeholder">Output will appear here.</span></div>
      </div>
    `;
  });

  html += `<div class="lesson-actions">`;
  if (idx > 0) html += `<button class="btn secondary" onclick="selectLesson('${LESSONS[idx - 1].id}')">← Previous</button>`;
  html += `<button class="btn" onclick="showPage('quiz'); startQuiz('${lesson.id}')">${passed ? "Retake quiz ✓" : "Take the quiz"}</button>`;
  if (idx < LESSONS.length - 1) html += `<button class="btn secondary" onclick="selectLesson('${LESSONS[idx + 1].id}')">Next →</button>`;
  html += `</div>`;

  panel.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/*  Quiz hub +  runner  */
function renderQuizHub() {
  const grid = document.getElementById("quizHubGrid");
  const contentCard = grid.closest(".content-card");
  // remove any active quiz view, restore hub
  const activeView = document.getElementById("activeQuizView");
  if (activeView) activeView.remove();
  grid.style.display = "grid";
  contentCard.querySelector("h2").textContent = "Quiz Hub";
  contentCard.querySelector(".lead").style.display = "block";

  grid.innerHTML = "";
  LESSONS.forEach((lesson) => {
    const passed = !!progress.passed[lesson.id];
    const card = document.createElement("div");
    card.className = "quiz-hub-card";
    card.innerHTML = `<h4>${lesson.title}</h4><span class="status ${passed ? "passed" : ""}">${passed ? "✓ passed" : "not attempted"}</span>`;
    card.onclick = () => startQuiz(lesson.id);
    grid.appendChild(card);
  });
}

function startQuiz(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const grid = document.getElementById("quizHubGrid");
  const contentCard = grid.closest(".content-card");
  grid.style.display = "none";
  contentCard.querySelector("h2").textContent = lesson.title + " — Quiz";
  contentCard.querySelector(".lead").style.display = "none";

  const old = document.getElementById("activeQuizView");
  if (old) old.remove();

  const view = document.createElement("div");
  view.id = "activeQuizView";

  let html = `<button class="btn secondary" onclick="renderQuizHub()" style="margin-bottom:1.5rem;">← Back to hub</button>`;
  lesson.quiz.forEach((q, i) => {
    html += `<div class="quiz-question" data-qindex="${i}">
      <h4>Q${i + 1}. ${q.q}</h4>`;
    q.options.forEach((opt, oi) => {
      html += `<label class="quiz-option">
        <input type="radio" name="q${i}" value="${oi}"> <span>${opt}</span>
      </label>`;
    });
    html += `</div>`;
  });
  html += `<button class="btn" onclick="checkQuiz('${lessonId}')">Submit answers</button>
    <div class="quiz-result" id="quizResult"></div>`;
  view.innerHTML = html;
  contentCard.appendChild(view);
}

function checkQuiz(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  let score = 0;
  lesson.quiz.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const questionEl = document.querySelector(`.quiz-question[data-qindex="${i}"]`);
    const options = questionEl.querySelectorAll(".quiz-option");
    options.forEach((optEl, oi) => {
      optEl.classList.remove("correct", "incorrect");
      if (oi === q.correct) optEl.classList.add("correct");
      else if (selected && parseInt(selected.value) === oi) optEl.classList.add("incorrect");
    });
    if (selected && parseInt(selected.value) === q.correct) score++;
  });

  const result = document.getElementById("quizResult");
  result.style.display = "block";
  const total = lesson.quiz.length;
  if (score === total) {
    result.className = "quiz-result pass";
    result.textContent = `Score: ${score}/${total} — nice, lesson complete.`;
    progress.passed[lessonId] = true;
    saveProgress(progress);
    renderSnakeTracker();
  } else {
    result.className = "quiz-result fail";
    result.textContent = `Score: ${score}/${total} — review the highlighted answers and try again.`;
  }
  result.scrollIntoView({ behavior: "smooth", block: "center" });
}



if (!Array.prototype.append) {
  Object.defineProperty(Array.prototype, "append", {
    value: function (item) { this.push(item); },
    enumerable: false
  });
}

function pyStr(v) {
  if (v === true) return "True";
  if (v === false) return "False";
  if (v === null || v === undefined) return "None";
  if (Array.isArray(v)) return "[" + v.map((x) => (typeof x === "string" ? `'${x}'` : pyStr(x))).join(", ") + "]";
  return String(v);
}

function transpile(code) {
  const rawLines = code.split("\n");
  const lines = [];
  for (let raw of rawLines) {
    let line = raw.replace(/\t/g, "    ");
    const stripped = line.trim();
    if (stripped === "" || stripped.startsWith("#")) continue;
    const indentMatch = line.match(/^(\s*)/);
    const indent = Math.floor(indentMatch[1].length / 4);
    // strip inline comments (naive, ignores # inside strings — fine for lesson content)
    let content = stripped.replace(/\s+#(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$).*$/, "");
    lines.push({ indent, content });
  }

  const out = [];
  const stack = [];

  const pyBoolFix = (s) =>
    s
      .replace(/\btrue\b/gi, "true")
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\s+/g, "!");

  const fixFStrings = (s) =>
    s.replace(/f(["'])((?:\\.|(?!\1).)*)\1/g, (m, quote, inner) => {
      const converted = inner.replace(/\{([^{}]+)\}/g, "${$1}");
      return "`" + converted + "`";
    });

  for (const { indent, content } of lines) {
    while (stack.length && stack[stack.length - 1] > indent) {
      stack.pop();
      out.push("}");
    }

    let text = content;
    let isHeader = false;

    let m;
    if ((m = text.match(/^if\s+(.+):$/))) {
      text = `if (${pyBoolFix(m[1])}) {`; isHeader = true;
    } else if ((m = text.match(/^elif\s+(.+):$/))) {
      text = `else if (${pyBoolFix(m[1])}) {`; isHeader = true;
    } else if (/^else\s*:$/.test(text)) {
      text = `else {`; isHeader = true;
    } else if ((m = text.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\(([^)]*)\)\s*:$/))) {
      const v = m[1];
      const args = m[2].split(",").map((s) => s.trim());
      let start = "0", end = args[0], step = "1";
      if (args.length === 2) { start = args[0]; end = args[1]; }
      if (args.length === 3) { start = args[0]; end = args[1]; step = args[2]; }
      text = `for (let ${v} = ${start}; ${v} < ${end}; ${v} += ${step}) {`; isHeader = true;
    } else if ((m = text.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/))) {
      text = `for (const ${m[1]} of ${pyBoolFix(m[2])}) {`; isHeader = true;
    } else if ((m = text.match(/^while\s+(.+):$/))) {
      text = `while (${pyBoolFix(m[1])}) {`; isHeader = true;
    } else if ((m = text.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/))) {
      text = `function ${m[1]}(${m[2]}) {`; isHeader = true;
    } else if ((m = text.match(/^([a-zA-Z_]\w*)\s*=\s*(?!=)(.+)$/))) {
      text = `var ${m[1]} = ${fixFStrings(pyBoolFix(m[2]))};`;
    } else if ((m = text.match(/^return\s+(.+)$/))) {
      text = `return ${fixFStrings(pyBoolFix(m[1]))};`;
    } else {
      text = `${fixFStrings(pyBoolFix(text))};`;
    }

    if (!/#/.test(content)) text = fixFStrings(text); 
    out.push(text);
    if (isHeader) stack.push(indent + 1);
  }
  while (stack.length) { stack.pop(); out.push("}"); }
  return out.join("\n");
}

function runExample(codeId, outId) {
  const codeEl = document.getElementById(codeId);
  const outEl = document.getElementById(outId);
  const source = codeEl.textContent;
  outEl.classList.remove("error");
  outEl.innerHTML = '<span class="placeholder">Running...</span>';

  setTimeout(() => {
    try {
      const jsCode = transpile(source);
      const output = [];
      const print = (...args) => output.push(args.map(pyStr).join(" "));
      const len = (x) => x.length;
      const fn = new Function("print", "len", jsCode);
      fn(print, len);
      outEl.textContent = output.length ? output.join("\n") : "(no output)";
    } catch (err) {
      outEl.classList.add("error");
      outEl.textContent = "Error: " + err.message;
    }
  }, 250);
}


document.addEventListener("DOMContentLoaded", () => {
  renderSnakeTracker();
  showPage("home");
  console.log("PySnaky ready.");
});
