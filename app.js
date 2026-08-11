const lessons = [
  {
    id: 1,
    title: "Cooperação bilateral",
    theme: "Relações diplomáticas",
    level: "C1",
    durationLabel: "~32 giây",
    description: "Luyện nghe register ngoại giao với các cụm về hợp tác và tham vấn giữa hai nước.",
    audio: "audio/licao-01.mp3",
    transcript: "Portugal manifesta a sua disponibilidade para aprofundar a cooperação com o Vietname, nomeadamente nos domínios da transição energética e da economia azul. Consideramos, contudo, que quaisquer novas iniciativas deverão assentar em projetos tecnicamente viáveis, com fontes de financiamento claramente identificadas e benefícios mensuráveis para ambas as partes. Nesse contexto, propomos que os respectivos ministérios competentes iniciem consultas exploratórias, sem prejuízo dos mecanismos de cooperação já existentes."
  },
  {
    id: 2,
    title: "Transição energética",
    theme: "Cooperação energética",
    level: "C1",
    durationLabel: "~60 giây",
    description: "Luyện nghe ngôn ngữ ngoại giao thận trọng về nhóm công tác, điều kiện kỹ thuật và cam kết tài chính.",
    audio: "audio/licao-02.mp3",
    transcript: "Senhora Vice-Ministra, acolhemos com interesse a proposta vietnamita de reforçar a cooperação no domínio da transição energética. O nosso Governo está disponível para analisar a eventual criação de um grupo de trabalho conjunto, embora ainda não tenha sido tomada qualquer decisão quanto ao seu mandato ou calendário. Qualquer avanço deverá depender da viabilidade técnica dos projetos, da disponibilidade de recursos orçamentais e da compatibilidade das iniciativas com as obrigações europeias de Portugal. Importa igualmente esclarecer que este grupo não substituiria os mecanismos de diálogo já existentes, nem implicaria, nesta fase, qualquer compromisso financeiro adicional. Propomos, por conseguinte, que os ministérios competentes iniciem contactos exploratórios durante o próximo trimestre e preparem um documento de opções, de natureza não vinculativa. Caso estejam reunidas as condições necessárias, poderemos considerar o anúncio de um roteiro de cooperação por ocasião da próxima visita de alto nível."
  },
  {
    id: 3,
    title: "Cơ chế trao đổi thường niên",
    theme: "Hợp tác kinh tế – thương mại",
    level: "C1",
    durationLabel: "~44 giây",
    description: "Luyện nghe tiếng Việt với register ngoại giao về cơ chế hợp tác, mức cam kết, điều kiện triển khai và bước tiếp theo.",
    audio: "audio/licao-03 VN.mp3",
    transcript: "Thưa Ngài Quốc vụ khanh, Việt Nam ghi nhận đề xuất của Bồ Đào Nha về việc thiết lập cơ chế trao đổi thường niên giữa các cơ quan xúc tiến thương mại hai nước. Chúng tôi cho rằng sáng kiến này có thể góp phần hỗ trợ doanh nghiệp tiếp cận thị trường, nhất là trong lĩnh vực logistics xanh và công nghệ cảng biển. Tuy nhiên, ở giai đoạn hiện nay, Việt Nam chưa thể cam kết về hình thức tổ chức hoặc nguồn kinh phí. Mọi bước tiếp theo cần phù hợp với pháp luật của mỗi nước, không trùng lặp với cơ chế Ủy ban hỗn hợp hiện có và dựa trên nhu cầu thực tế của doanh nghiệp. Vì vậy, chúng tôi đề nghị các đầu mối kỹ thuật tiến hành trao đổi không chính thức trong ba tháng tới và trình một số phương án để hai bên xem xét. Nếu đạt được đồng thuận, vấn đề này có thể được đưa vào chương trình nghị sự của kỳ họp Ủy ban hỗn hợp tiếp theo."
  }
];

const $ = (selector) => document.querySelector(selector);
const audio = $("#audio");
const input = $("#dictationInput");
let currentLesson = lessons[0];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function renderLessonList() {
  const list = $("#lessonList");
  list.innerHTML = lessons.map(lesson => `
    <button class="lesson-item ${lesson.id === currentLesson.id ? "active" : ""}" type="button" data-id="${lesson.id}">
      <small>BÀI ${String(lesson.id).padStart(2, "0")}</small>
      <strong>${lesson.title}</strong>
      <span>${lesson.theme} · ${lesson.durationLabel}</span>
    </button>`).join("");
  list.querySelectorAll("button").forEach(button => button.addEventListener("click", () => selectLesson(Number(button.dataset.id))));
}

function selectLesson(id) {
  currentLesson = lessons.find(lesson => lesson.id === id) || lessons[0];
  audio.pause();
  audio.src = currentLesson.audio;
  audio.load();
  $("#lessonMeta").textContent = `BÀI ${String(currentLesson.id).padStart(2, "0")} · ${currentLesson.theme.toUpperCase()}`;
  $("#lessonTitle").textContent = currentLesson.title;
  $("#lessonDescription").textContent = currentLesson.description;
  $("#lessonLevel").textContent = currentLesson.level;
  resetLesson();
  renderLessonList();
}

// Giữ nguyên dấu tiếng Bồ, chỉ bỏ dấu câu, chữ hoa và khoảng trắng thừa.
function tokenize(text) {
  return text.normalize("NFC").toLocaleLowerCase("pt-PT").match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
}

// Levenshtein theo từ: cho phép phân loại đúng, thiếu, thừa và thay thế.
function compareWords(reference, answer) {
  const ref = tokenize(reference);
  const typed = tokenize(answer);
  const rows = ref.length + 1;
  const cols = typed.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));
  const op = Array.from({ length: rows }, () => Array(cols).fill(""));

  for (let i = 1; i < rows; i++) { dp[i][0] = i; op[i][0] = "missing"; }
  for (let j = 1; j < cols; j++) { dp[0][j] = j; op[0][j] = "extra"; }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (ref[i - 1] === typed[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        op[i][j] = "correct";
      } else {
        const choices = [
          { cost: dp[i - 1][j - 1] + 1, type: "replace" },
          { cost: dp[i - 1][j] + 1, type: "missing" },
          { cost: dp[i][j - 1] + 1, type: "extra" }
        ];
        choices.sort((a, b) => a.cost - b.cost);
        dp[i][j] = choices[0].cost;
        op[i][j] = choices[0].type;
      }
    }
  }

  const result = [];
  let i = ref.length;
  let j = typed.length;
  while (i > 0 || j > 0) {
    const type = op[i][j];
    if (type === "correct") { result.push({ type, expected: ref[i - 1] }); i--; j--; }
    else if (type === "replace") { result.push({ type, expected: ref[i - 1], actual: typed[j - 1] }); i--; j--; }
    else if (type === "missing") { result.push({ type, expected: ref[i - 1] }); i--; }
    else { result.push({ type: "extra", actual: typed[j - 1] }); j--; }
  }

  const aligned = result.reverse();
  const counts = aligned.reduce((acc, item) => { acc[item.type]++; return acc; }, { correct: 0, missing: 0, extra: 0, replace: 0 });
  const errors = counts.missing + counts.extra + counts.replace;
  const score = Math.max(0, Math.round((1 - errors / Math.max(ref.length, 1)) * 100));
  return { aligned, counts, score };
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function checkAnswer() {
  if (!input.value.trim()) {
    input.focus();
    input.setAttribute("aria-invalid", "true");
    return;
  }
  input.removeAttribute("aria-invalid");
  const { aligned, counts, score } = compareWords(currentLesson.transcript, input.value);
  const messages = score === 100 ? ["Perfeito!", "Bạn nghe chính xác toàn bộ bài."] : score >= 85 ? ["Rất tốt!", "Chỉ còn vài chi tiết nhỏ cần nghe lại."] : score >= 60 ? ["Tiến bộ tốt", "Hãy nghe lại các đoạn được đánh dấu rồi thử lần nữa."] : ["Cứ tiếp tục nhé", "Nghe từng cụm ngắn ở tốc độ 0.75× sẽ dễ hơn."];

  $("#scoreValue").textContent = `${score}%`;
  $("#scoreRing").style.setProperty("--score", `${score * 3.6}deg`);
  $("#scoreMessage").textContent = messages[0];
  $("#scoreExplanation").textContent = messages[1];
  $("#correctCount").textContent = counts.correct;
  $("#missingCount").textContent = counts.missing;
  $("#extraCount").textContent = counts.extra;
  $("#replaceCount").textContent = counts.replace;
  $("#transcriptText").textContent = currentLesson.transcript;
  $("#wordComparison").innerHTML = aligned.map(item => {
    if (item.type === "replace") return `<span class="word replace" title="Bạn viết: ${escapeHtml(item.actual)}">${escapeHtml(item.expected)}<small>viết: ${escapeHtml(item.actual)}</small></span>`;
    if (item.type === "extra") return `<span class="word extra" title="Từ thừa">+ ${escapeHtml(item.actual)}</span>`;
    return `<span class="word ${item.type}">${escapeHtml(item.expected)}</span>`;
  }).join("");
  $("#results").hidden = false;
  $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetLesson() {
  audio.pause();
  audio.currentTime = 0;
  audio.playbackRate = 1;
  input.value = "";
  input.removeAttribute("aria-invalid");
  $("#results").hidden = true;
  $("#playIcon").textContent = "▶";
  $("#timeline").value = 0;
  $("#currentTime").textContent = "0:00";
  $("#speedControls").querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.speed === "1"));
}

$("#playPause").addEventListener("click", () => audio.paused ? audio.play() : audio.pause());
$("#rewind").addEventListener("click", () => { audio.currentTime = Math.max(0, audio.currentTime - 5); });
$("#forward").addEventListener("click", () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); });
$("#timeline").addEventListener("input", event => { if (audio.duration) audio.currentTime = (event.target.value / 100) * audio.duration; });
$("#speedControls").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  audio.playbackRate = Number(button.dataset.speed);
  $("#speedControls").querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
});
audio.addEventListener("play", () => { $("#playIcon").textContent = "❚❚"; $("#playPause").setAttribute("aria-label", "Tạm dừng âm thanh"); });
audio.addEventListener("pause", () => { $("#playIcon").textContent = "▶"; $("#playPause").setAttribute("aria-label", "Phát âm thanh"); });
audio.addEventListener("loadedmetadata", () => { $("#duration").textContent = formatTime(audio.duration); });
audio.addEventListener("timeupdate", () => {
  $("#currentTime").textContent = formatTime(audio.currentTime);
  $("#timeline").value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
});
audio.addEventListener("ended", () => { $("#playIcon").textContent = "▶"; });
$("#checkAnswer").addEventListener("click", checkAnswer);
$("#resetLesson").addEventListener("click", () => { resetLesson(); input.focus(); });

selectLesson(1);

// Cho phép kiểm thử thuật toán trong Node.js mà không ảnh hưởng trình duyệt.
if (typeof module !== "undefined") module.exports = { tokenize, compareWords };
