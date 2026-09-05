(function(){
  const HINT_COST = 2;
  const MAX_WRONG = 6;
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const CATEGORY_KEYS = ["prog","animals","countries","food"];

  const WORDS = {
    es: {
      prog: ["VARIABLE","FUNCION","BUCLE","SERVIDOR","TERMINAL","TECLADO","ALGORITMO","DEPURAR","COMPILAR","GITHUB"],
      animals: ["ELEFANTE","JIRAFA","COCODRILO","PINGUINO","MURCIELAGO","TIBURON","ARDILLA","CANGURO"],
      countries: ["ARGENTINA","COLOMBIA","PARAGUAY","URUGUAY","ECUADOR","VENEZUELA","HONDURAS","GUATEMALA"],
      food: ["EMPANADA","GUACAMOLE","TORTILLA","CEVICHE","ASADO","TAMAL","AREPA","CHURRO"]
    },
    en: {
      prog: ["VARIABLE","FUNCTION","LOOP","SERVER","TERMINAL","KEYBOARD","ALGORITHM","DEBUG","COMPILE","GITHUB"],
      animals: ["ELEPHANT","GIRAFFE","CROCODILE","PENGUIN","BAT","SHARK","SQUIRREL","KANGAROO"],
      countries: ["ARGENTINA","COLOMBIA","PARAGUAY","URUGUAY","ECUADOR","VENEZUELA","HONDURAS","GUATEMALA"],
      food: ["EMPANADA","GUACAMOLE","TORTILLA","CEVICHE","BARBECUE","TAMALE","AREPA","CHURRO"]
    }
  };

  const TEXT = {
    es: {
      windowTitle: "ahorcado.sh — bash",
      promptPrefix: "./ahorcado --categoria",
      heading: "AHORCADO TERMINAL",
      categoryLabel: "categoria:",
      categories: { prog:"programación", animals:"animales", countries:"países", food:"comida" },
      newWordBtn: "nueva_palabra()",
      hintBtn: () => `pista (-${HINT_COST})`,
      langBtn: "English",
      attemptsLabel: "intentos restantes",
      logLabel: "log",
      winBanner: w => "PALABRA DESCIFRADA — " + w,
      loseBanner: w => "SIN INTENTOS — la palabra era " + w,
      logLoaded: n => `palabra cargada (${n} letras)`,
      logCorrect: l => `'${l}' correcto`,
      logWrong: l => `'${l}' no está en la palabra`,
      logHint: l => `pista usada: se reveló '${l}' (-${HINT_COST} intentos)`,
      logSuccess: "proceso finalizado con exito (0)",
      logError: "proceso finalizado con error (1)",
      ariaLetter: l => "letra " + l,
      ariaCategory: "Elegir categoría"
    },
    en: {
      windowTitle: "hangman.sh — bash",
      promptPrefix: "./hangman --category",
      heading: "TERMINAL HANGMAN",
      categoryLabel: "category:",
      categories: { prog:"programming", animals:"animals", countries:"countries", food:"food" },
      newWordBtn: "new_word()",
      hintBtn: () => `hint (-${HINT_COST})`,
      langBtn: "Español",
      attemptsLabel: "attempts left",
      logLabel: "log",
      winBanner: w => "WORD CRACKED — " + w,
      loseBanner: w => "OUT OF ATTEMPTS — the word was " + w,
      logLoaded: n => `word loaded (${n} letters)`,
      logCorrect: l => `'${l}' correct`,
      logWrong: l => `'${l}' is not in the word`,
      logHint: l => `hint used: revealed '${l}' (-${HINT_COST} attempts)`,
      logSuccess: "process finished successfully (0)",
      logError: "process finished with error (1)",
      ariaLetter: l => "letter " + l,
      ariaCategory: "Choose category"
    }
  };

  const STAGES = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  {O}  |
      |
      |
      |
=========`,
`  +---+
  |   |
  {O}  |
  {|}  |
      |
      |
=========`,
`  +---+
  |   |
  {O}  |
 /{|}  |
      |
      |
=========`,
`  +---+
  |   |
  {O}  |
 /{|}\\  |
      |
      |
=========`,
`  +---+
  |   |
  {O}  |
 /{|}\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  {O}  |
 /{|}\\  |
 / \\  |
      |
=========`
  ];

  const el = {
    category: document.getElementById("categorySelect"),
    catLabel: document.getElementById("catLabel"),
    newWordBtn: document.getElementById("newWordBtn"),
    hintBtn: document.getElementById("hintBtn"),
    langBtn: document.getElementById("langBtn"),
    gallows: document.getElementById("gallows"),
    meter: document.getElementById("meter"),
    log: document.getElementById("log"),
    banner: document.getElementById("banner"),
    word: document.getElementById("word"),
    keyboard: document.getElementById("keyboard"),
    windowTitle: document.getElementById("windowTitle"),
    promptPrefix: document.getElementById("promptPrefix"),
    heading: document.getElementById("heading"),
    categoryLabel: document.getElementById("categoryLabel"),
    attemptsLabel: document.getElementById("attemptsLabel"),
    logLabel: document.getElementById("logLabel")
  };

  let lang = "es";
  let state = {
    word: "",
    guessed: new Set(),
    wrong: 0,
    over: false
  };

  function t(){ return TEXT[lang]; }

  function pickWord(){
    const list = WORDS[lang][el.category.value];
    return list[Math.floor(Math.random() * list.length)];
  }

  function renderGallows(){
    const raw = STAGES[Math.min(state.wrong, MAX_WRONG)];
    el.gallows.innerHTML = raw.replace(/\{([^}]+)\}/g, '<span class="danger">$1</span>');
  }

  function renderMeter(){
    el.meter.innerHTML = "";
    for(let i=0;i<MAX_WRONG;i++){
      const bar = document.createElement("i");
      if(i < state.wrong) bar.classList.add("used");
      el.meter.appendChild(bar);
    }
  }

  function renderWord(){
    el.word.innerHTML = "";
    for(const ch of state.word){
      const slot = document.createElement("span");
      slot.className = "slot" + (state.guessed.has(ch) ? " filled" : "");
      slot.textContent = state.guessed.has(ch) ? ch : (state.over ? ch : "_");
      el.word.appendChild(slot);
    }
  }

  function renderKeyboard(){
    el.keyboard.innerHTML = "";
    for(const letter of ALPHABET){
      const btn = document.createElement("button");
      btn.className = "key";
      btn.textContent = letter;
      btn.setAttribute("aria-label", t().ariaLetter(letter));
      if(state.guessed.has(letter)){
        btn.disabled = true;
        btn.classList.add(state.word.includes(letter) ? "correct" : "wrong");
      }
      if(state.over) btn.disabled = true;
      btn.addEventListener("click", () => guess(letter));
      el.keyboard.appendChild(btn);
    }
  }

  function renderHintButton(){
    el.hintBtn.textContent = t().hintBtn();
    const remainingLetters = [...state.word].some(ch => !state.guessed.has(ch));
    el.hintBtn.disabled = state.over || !remainingLetters;
  }

  function log(msg, cls){
    const line = document.createElement("div");
    if(cls) line.className = cls;
    line.textContent = "> " + msg;
    el.log.appendChild(line);
    el.log.scrollTop = el.log.scrollHeight;
  }

  function checkEnd(){
    const wordDone = [...state.word].every(ch => state.guessed.has(ch));
    if(wordDone){
      state.over = true;
      el.banner.textContent = t().winBanner(state.word);
      el.banner.className = "banner win";
      log(t().logSuccess, "ok");
    } else if(state.wrong >= MAX_WRONG){
      state.over = true;
      el.banner.textContent = t().loseBanner(state.word);
      el.banner.className = "banner lose";
      log(t().logError, "bad");
    }
  }

  function guess(letter){
    if(state.over || state.guessed.has(letter)) return;
    state.guessed.add(letter);
    if(state.word.includes(letter)){
      log(t().logCorrect(letter), "ok");
    } else {
      state.wrong++;
      log(t().logWrong(letter), "bad");
    }
    checkEnd();
    render();
  }

  function useHint(){
    if(state.over) return;
    const remaining = [...state.word].filter(ch => !state.guessed.has(ch));
    if(remaining.length === 0) return;
    const letter = remaining[Math.floor(Math.random() * remaining.length)];
    state.guessed.add(letter);
    state.wrong += HINT_COST;
    log(t().logHint(letter), "hint");
    checkEnd();
    render();
  }

  function render(){
    renderGallows();
    renderMeter();
    renderWord();
    renderKeyboard();
    renderHintButton();
  }

  function populateCategoryOptions(){
    const prevValue = el.category.value || CATEGORY_KEYS[0];
    el.category.innerHTML = "";
    for(const key of CATEGORY_KEYS){
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = t().categories[key];
      el.category.appendChild(opt);
    }
    el.category.value = prevValue;
  }

  function applyStaticText(){
    el.windowTitle.textContent = t().windowTitle;
    el.promptPrefix.textContent = t().promptPrefix;
    el.heading.textContent = t().heading;
    el.categoryLabel.textContent = t().categoryLabel;
    el.category.setAttribute("aria-label", t().ariaCategory);
    el.newWordBtn.textContent = t().newWordBtn;
    el.langBtn.textContent = t().langBtn;
    el.attemptsLabel.textContent = t().attemptsLabel;
    el.logLabel.textContent = t().logLabel;
  }

  function newGame(){
    state = { word: pickWord(), guessed: new Set(), wrong: 0, over: false };
    el.catLabel.textContent = t().categories[el.category.value];
    el.banner.textContent = "";
    el.banner.className = "banner";
    el.log.innerHTML = "";
    log(t().logLoaded(state.word.length));
    render();
  }

  function switchLanguage(){
    lang = lang === "es" ? "en" : "es";
    applyStaticText();
    populateCategoryOptions();
    newGame();
  }

  el.newWordBtn.addEventListener("click", newGame);
  el.hintBtn.addEventListener("click", useHint);
  el.langBtn.addEventListener("click", switchLanguage);
  el.category.addEventListener("change", newGame);

  document.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if(ALPHABET.includes(letter)) guess(letter);
  });

  applyStaticText();
  populateCategoryOptions();
  newGame();
})();
