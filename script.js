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

  const HINTS = {
    es: {
      prog: {
        VARIABLE: "Guarda un valor que puede cambiar durante la ejecución",
        FUNCION: "Bloque de código reutilizable que se puede llamar",
        BUCLE: "Repite instrucciones mientras se cumpla una condición",
        SERVIDOR: "Atiende peticiones de otros computadores conectados",
        TERMINAL: "Interfaz de texto para darle comandos al sistema",
        TECLADO: "Periférico con teclas que se usa para escribir",
        ALGORITMO: "Secuencia de pasos para resolver un problema",
        DEPURAR: "Buscar y corregir errores en el código",
        COMPILAR: "Convertir código fuente en un programa ejecutable",
        GITHUB: "Plataforma donde alojas y compartes repositorios de código"
      },
      animals: {
        ELEFANTE: "El mamífero terrestre más grande, tiene trompa",
        JIRAFA: "Animal africano de cuello larguísimo",
        COCODRILO: "Reptil acuático con mandíbulas muy poderosas",
        PINGUINO: "Ave que no vuela y vive en climas fríos",
        MURCIELAGO: "El único mamífero capaz de volar",
        TIBURON: "Depredador marino con muchos dientes",
        ARDILLA: "Roedor pequeño que guarda nueces y trepa árboles",
        CANGURO: "Marsupial australiano que salta con sus patas traseras"
      },
      countries: {
        ARGENTINA: "País sudamericano famoso por el tango y el asado",
        COLOMBIA: "País cafetero con costas en dos océanos",
        PARAGUAY: "País sudamericano sin salida al mar, habla guaraní",
        URUGUAY: "País pequeño de Sudamérica, capital Montevideo",
        ECUADOR: "País atravesado por la línea equinoccial",
        VENEZUELA: "País con las reservas de petróleo más grandes del mundo",
        HONDURAS: "País centroamericano con ruinas mayas en Copán",
        GUATEMALA: "País centroamericano de origen maya, moneda quetzal"
      },
      food: {
        EMPANADA: "Masa rellena, horneada o frita, típica sudamericana",
        GUACAMOLE: "Puré de palta/aguacate, típico mexicano",
        TORTILLA: "Puede ser de maíz o de papa, según el país",
        CEVICHE: "Pescado o marisco marinado en cítricos",
        ASADO: "Carne cocinada a las brasas, tradición argentina",
        TAMAL: "Masa de maíz envuelta en hoja, cocida al vapor",
        AREPA: "Masa de maíz típica de Venezuela y Colombia",
        CHURRO: "Masa frita alargada, se come con azúcar o chocolate"
      }
    },
    en: {
      prog: {
        VARIABLE: "Stores a value that can change during execution",
        FUNCTION: "Reusable block of code that you can call",
        LOOP: "Repeats instructions while a condition holds",
        SERVER: "Handles requests from other connected computers",
        TERMINAL: "Text interface for issuing commands to the system",
        KEYBOARD: "Peripheral with keys used for typing",
        ALGORITHM: "Sequence of steps to solve a problem",
        DEBUG: "Find and fix errors in the code",
        COMPILE: "Turn source code into an executable program",
        GITHUB: "Platform where you host and share code repositories"
      },
      animals: {
        ELEPHANT: "The largest land mammal, has a trunk",
        GIRAFFE: "African animal with an extremely long neck",
        CROCODILE: "Aquatic reptile with very powerful jaws",
        PENGUIN: "Flightless bird that lives in cold climates",
        BAT: "The only mammal capable of true flight",
        SHARK: "Marine predator with many teeth",
        SQUIRREL: "Small rodent that hoards nuts and climbs trees",
        KANGAROO: "Australian marsupial that hops on its hind legs"
      },
      countries: {
        ARGENTINA: "South American country famous for tango and asado",
        COLOMBIA: "Coffee-growing country with two coastlines",
        PARAGUAY: "Landlocked South American country, speaks Guaraní",
        URUGUAY: "Small South American country, capital Montevideo",
        ECUADOR: "Country crossed by the equator",
        VENEZUELA: "Country with the largest oil reserves in the world",
        HONDURAS: "Central American country with Mayan ruins at Copán",
        GUATEMALA: "Central American country of Mayan origin, currency quetzal"
      },
      food: {
        EMPANADA: "Stuffed pastry, baked or fried, typical of South America",
        GUACAMOLE: "Avocado dip, typical of Mexico",
        TORTILLA: "Can be made of corn or potato, depending on the country",
        CEVICHE: "Fish or seafood marinated in citrus juice",
        BARBECUE: "Meat cooked over coals, an Argentine tradition",
        TAMALE: "Corn dough wrapped in a leaf, steamed",
        AREPA: "Corn dough patty typical of Venezuela and Colombia",
        CHURRO: "Fried dough pastry, eaten with sugar or chocolate"
      }
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
      musicOn: "🔊 música",
      musicOff: "🔈 música",
      attemptsLabel: "intentos restantes",
      logLabel: "log",
      winBanner: w => "PALABRA DESCIFRADA — " + w,
      loseBanner: w => "SIN INTENTOS — la palabra era " + w,
      logLoaded: n => `palabra cargada (${n} letras)`,
      logCorrect: l => `'${l}' correcto`,
      logWrong: l => `'${l}' no está en la palabra`,
      logHint: h => `pista: ${h} (-${HINT_COST} intentos)`,
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
      musicOn: "🔊 music",
      musicOff: "🔈 music",
      attemptsLabel: "attempts left",
      logLabel: "log",
      winBanner: w => "WORD CRACKED — " + w,
      loseBanner: w => "OUT OF ATTEMPTS — the word was " + w,
      logLoaded: n => `word loaded (${n} letters)`,
      logCorrect: l => `'${l}' correct`,
      logWrong: l => `'${l}' is not in the word`,
      logHint: h => `hint: ${h} (-${HINT_COST} attempts)`,
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
    musicBtn: document.getElementById("musicBtn"),
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
  let musicOn = false;
  let state = {
    word: "",
    guessed: new Set(),
    wrong: 0,
    over: false,
    hintUsed: false
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
    el.hintBtn.disabled = state.over || state.hintUsed;
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
    if(state.over || state.hintUsed) return;
    state.hintUsed = true;
    state.wrong += HINT_COST;
    const hintText = HINTS[lang][el.category.value][state.word];
    log(t().logHint(hintText), "hint");
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
    el.musicBtn.textContent = musicOn ? t().musicOn : t().musicOff;
    el.attemptsLabel.textContent = t().attemptsLabel;
    el.logLabel.textContent = t().logLabel;
  }

  function newGame(){
    state = { word: pickWord(), guessed: new Set(), wrong: 0, over: false, hintUsed: false };
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
  el.musicBtn.addEventListener("click", () => {
    musicOn = Music.toggle();
    el.musicBtn.textContent = musicOn ? t().musicOn : t().musicOff;
  });

  document.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if(ALPHABET.includes(letter)) guess(letter);
  });

  applyStaticText();
  populateCategoryOptions();
  newGame();
})();
