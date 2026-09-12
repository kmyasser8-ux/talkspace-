/* =========================================================
   TALKSPACE
   Vanilla JavaScript Application
   ========================================================= */


/* ================= HELPERS ================= */

const $ = (
  selector,
  root = document
) => root.querySelector(selector);


const $$ = (
  selector,
  root = document
) => [
  ...root.querySelectorAll(selector)
];


/* =========================================================
   ARTICLES
   ========================================================= */

const articles = [

  {
    id: 1,

    tag: "سوسيولوجيا",

    date: "12 سبتمبر 2026",

    title:
      "لماذا أصبحت المساحة الرقمية جزءًا من هويتنا الاجتماعية؟",

    excerpt:
      "منصات الحوار لم تعد مجرد أدوات اتصال؛ إنها بيئات تتشكل داخلها العادات واللغة والانتماءات.",

    body:
      "عندما ينتقل الحوار إلى مساحة رقمية، لا تنتقل الكلمات وحدها. تنتقل معها قواعد جديدة للانتباه، وطريقة مختلفة لبناء الثقة، وإيقاع أسرع لتكوين الانطباعات. لهذا أصبحت هندسة الواجهة نفسها جزءًا من التجربة الاجتماعية."
  },


  {
    id: 2,

    tag: "قيادة",

    date: "09 سبتمبر 2026",

    title:
      "القائد الذي يعرف متى يصمت يربح نصف المعركة",

    excerpt:
      "الاستماع ليس غيابًا عن القيادة، بل واحدة من أكثر أدواتها فعالية عندما يصبح القرار معقدًا.",

    body:
      "القيادة الحديثة لا تُقاس فقط بعدد القرارات التي يتخذها القائد، بل بجودة المساحة التي يصنعها كي تظهر المعلومات المهمة. الصمت هنا ليس ترددًا؛ إنه تقنية لجمع الإشارات قبل إطلاق الحكم."
  },


  {
    id: 3,

    tag: "تكنولوجيا",

    date: "06 سبتمبر 2026",

    title:
      "الذكاء الاصطناعي لا يقتل الأفكار — لكنه يغيّر اقتصاد الانتباه",

    excerpt:
      "مع وفرة المحتوى المولّد، تصبح قيمة الفكرة مرتبطة أكثر بالاختيار والسياق والتحقق.",

    body:
      "حين يصبح إنتاج المسودة شبه مجاني، ينتقل التحدي من الكتابة إلى التمييز. ما الذي يستحق النشر؟ ما الذي يحتاج مصدرًا؟ وما الذي يبدو ذكيًا فقط لأنه مصاغ بشكل جيد؟ المستقبل ليس لمن ينتج أكثر، بل لمن يختار أفضل."
  },


  {
    id: 4,

    tag: "سوسيولوجيا",

    date: "02 سبتمبر 2026",

    title:
      "هل نحتاج فعلًا إلى رأي في كل شيء؟",

    excerpt:
      "اقتصاد المنصات يكافئ سرعة التعليق، بينما التفكير الجيد يحتاج مساحة للتريث.",

    body:
      "هناك فرق بين المشاركة وبين الاستجابة التلقائية. كلما زادت سرعة المنصة، ازدادت قيمة القدرة على قول: لا أعرف بعد. هذه الجملة الصغيرة قد تكون من أكثر أدوات التفكير مقاومةً للضجيج."
  },


  {
    id: 5,

    tag: "تكنولوجيا",

    date: "29 أغسطس 2026",

    title:
      "من الشاشة إلى البيئة: كيف تتغير واجهات المستقبل؟",

    excerpt:
      "الواجهة القادمة لن تكون مجرد صفحات؛ ستكون طبقة ذكية تتفاعل مع السياق من حولنا.",

    body:
      "تصميم الواجهات يتجه نحو طبقات أكثر مرونة: بيانات، إشعارات، مساعدات وسياقات تظهر عند الحاجة وتختفي عندما تعيق التركيز."
  },


  {
    id: 6,

    tag: "قيادة",

    date: "24 أغسطس 2026",

    title:
      "إدارة الأولويات ليست قائمة مهام طويلة",

    excerpt:
      "الأولوية الحقيقية هي قرار بشأن ما لن تفعله الآن بقدر ما هي قرار بشأن ما ستفعله.",

    body:
      "عندما تتحول كل مهمة إلى عاجلة، تتوقف كلمة أولوية عن أداء وظيفتها. لوحة بسيطة من ثلاث حالات تساعد على رؤية تدفق العمل: ما ينتظر، ما يتحرك، وما انتهى فعلًا."
  }

];


/* =========================================================
   TASKS
   ========================================================= */

let tasks = [

  {
    id: 101,
    title: "صياغة فكرة العدد القادم",
    desc: "تحويل الملاحظات المتفرقة إلى زاوية واضحة.",
    priority: "high",
    status: "todo"
  },

  {
    id: 102,
    title: "مراجعة مصادر مقال الذكاء الاصطناعي",
    desc: "تدقيق الروابط والأرقام قبل النشر.",
    priority: "high",
    status: "doing"
  },

  {
    id: 103,
    title: "اختيار عنوان بديل",
    desc: "اختبار 3 عناوين أكثر اختصارًا.",
    priority: "medium",
    status: "todo"
  },

  {
    id: 104,
    title: "تصميم غلاف المقال",
    desc: "نسخة Cyber Eye مع طبقة زجاجية.",
    priority: "medium",
    status: "doing"
  },

  {
    id: 105,
    title: "تحديث صفحة حول المنصة",
    desc: "إضافة المبادئ التقنية.",
    priority: "low",
    status: "done"
  },

  {
    id: 106,
    title: "تنظيف قائمة الأفكار",
    desc: "حذف التكرارات ودمج المتشابه.",
    priority: "low",
    status: "done"
  },

  {
    id: 107,
    title: "نشر المقال المختار",
    desc: "المراجعة النهائية ثم الإطلاق.",
    priority: "high",
    status: "done"
  },

  {
    id: 108,
    title: "اختبار الهاتف",
    desc: "فحص تجربة RTL على الشاشات الصغيرة.",
    priority: "medium",
    status: "todo"
  }

];


/* =========================================================
   KANBAN COLUMNS
   ========================================================= */

const columns = [

  {
    id: "todo",
    title: "قيد الانتظار"
  },

  {
    id: "doing",
    title: "جاري العمل"
  },

  {
    id: "done",
    title: "تم الإنجاز"
  }

];


/* =========================================================
   SETTINGS
   ========================================================= */

const defaultSettings = {

  cyan: "#00f2fe",

  blue: "#0000ff",

  blur: 18,

  glass: 0.62,

  bg: "deep",

  light: false

};


let settings =
  JSON.parse(
    localStorage.getItem(
      "talkspace-settings"
    ) || "null"
  )
  ||
  {
    ...defaultSettings
  };


/* =========================================================
   SAVE SETTINGS
   ========================================================= */

function saveSettings() {

  localStorage.setItem(
    "talkspace-settings",
    JSON.stringify(settings)
  );

}


/* =========================================================
   APPLY SETTINGS
   ========================================================= */

function applySettings() {

  const root =
    document.documentElement;


  root.style.setProperty(
    "--cyan",
    settings.cyan
  );


  root.style.setProperty(
    "--blue",
    settings.blue
  );


  root.style.setProperty(
    "--blur",
    settings.blur + "px"
  );


  root.style.setProperty(
    "--glass-alpha",
    settings.glass
  );


  const backgrounds = {

    deep: [
      "#06090f",
      "#0a101b"
    ],

    blue: [
      "#07112b",
      "#0b1838"
    ],

    violet: [
      "#12091d",
      "#1b0c2a"
    ],

    light: [
      "#edf5f8",
      "#dcebf0"
    ]

  };


  const [
    backgroundOne,
    backgroundTwo
  ] =
    backgrounds[settings.bg]
    ||
    backgrounds.deep;


  root.style.setProperty(
    "--bg",
    backgroundOne
  );


  root.style.setProperty(
    "--bg2",
    backgroundTwo
  );


  document.body.classList.toggle(
    "light",
    settings.light ||
    settings.bg === "light"
  );


  $("#cyanPicker").value =
    settings.cyan;


  $("#bluePicker").value =
    settings.blue;


  $("#blurRange").value =
    settings.blur;


  $("#glassRange").value =
    settings.glass;


  $("#cyanValue").textContent =
    settings.cyan.toUpperCase();


  $("#blueValue").textContent =
    settings.blue.toUpperCase();


  $("#blurValue").textContent =
    settings.blur + "px";


  $("#glassValue").textContent =
    Number(settings.glass).toFixed(2);


  $$(".bg-option").forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.bg === settings.bg
      );

    }
  );

}


/* =========================================================
   TOAST
   ========================================================= */

function toast(message) {

  const element =
    document.createElement("div");


  element.className = "toast";


  element.innerHTML = `
    <i></i>
    <span>${message}</span>
  `;


  $("#toastStack")
    .appendChild(element);


  setTimeout(() => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(8px)";


    setTimeout(
      () => element.remove(),
      250
    );

  }, 2800);

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigate(view) {

  const viewId =
    `view-${view}`;


  $$(".view").forEach(
    currentView => {

      currentView.classList.toggle(
        "active",
        currentView.id === viewId
      );

    }
  );


  $$(".nav-link").forEach(
    nav => {

      nav.classList.toggle(
        "active",
        nav.dataset.nav === view
      );

    }
  );


  history.replaceState(
    null,
    "",
    `#${view}`
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (view === "articles") {

    renderArticles(
      currentFilter
    );

  }


  if (view === "board") {

    renderBoard();

  }

}


/* =========================================================
   ARTICLE CARD
   ========================================================= */

function articleCard(article) {

  return `

    <article class="article-card">

      <div class="article-top">

        <span class="tag">
          ${article.tag}
        </span>

        <span class="article-index">
          0${article.id}
        </span>

      </div>


      <h3>
        ${article.title}
      </h3>


      <p>
        ${article.excerpt}
      </p>


      <div class="article-meta">

        <span>
          ${article.date}
        </span>

        <button
          class="read-btn"
          data-read="${article.id}"
        >
          قراءة المقال كاملاً ↗
        </button>

      </div>

    </article>

  `;

}


/* =========================================================
   FEATURED
   ========================================================= */

function renderFeatured() {

  $("#featuredGrid").innerHTML =
    articles
      .slice(0, 3)
      .map(articleCard)
      .join("");

}


/* =========================================================
   ARTICLES FILTER
   ========================================================= */

let currentFilter = "all";


function renderArticles(
  filter = "all"
) {

  currentFilter = filter;


  const list =
    filter === "all"
      ? articles
      : articles.filter(
          article =>
            article.tag === filter
        );


  $("#articlesGrid").innerHTML =
    list
      .map(articleCard)
      .join("");


  $$(".filter-btn").forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.filter === filter
      );

    }
  );

}


/* =========================================================
   OPEN ARTICLE
   ========================================================= */

function openArticle(id) {

  const article =
    articles.find(
      item =>
        item.id === Number(id)
    );


  if (!article) return;


  $("#modalTag").textContent =
    article.tag.toUpperCase();


  $("#modalTitle").textContent =
    article.title;


  $("#modalDate").textContent =
    article.date;


  $("#modalBody").textContent =
    article.body;


  $("#articleModal")
    .classList.add("open");


  $("#articleModal")
    .setAttribute(
      "aria-hidden",
      "false"
    );

}


/* =========================================================
   CLOSE ARTICLE
   ========================================================= */

function closeArticle() {

  $("#articleModal")
    .classList.remove("open");


  $("#articleModal")
    .setAttribute(
      "aria-hidden",
      "true"
    );

}


/* =========================================================
   TASK PRIORITY LABEL
   ========================================================= */

function taskPriority(priority) {

  if (priority === "high")
    return "عالية";

  if (priority === "medium")
    return "متوسطة";

  return "منخفضة";

}


/* =========================================================
   MINI BOARD
   ========================================================= */

function renderMiniBoard() {

  $("#miniBoard").innerHTML =
    columns.map(column => {

      const columnTasks =
        tasks.filter(
          task =>
            task.status === column.id
        );


      return `

        <div class="mini-column">

          <h4>

            ${column.title}

            <span class="column-count">
              (${columnTasks.length})
            </span>

          </h4>


          ${
            columnTasks
              .slice(0, 3)
              .map(
                task =>
                  `<div class="mini-task">
                    ${task.title}
                  </div>`
              )
              .join("")
          }


          ${
            columnTasks.length === 0
              ? `
                <div class="mini-task">
                  لا توجد مهام
                </div>
              `
              : ""
          }

        </div>

      `;

    }).join("");

}


/* =========================================================
   TASK CARD
   ========================================================= */

function taskCard(task) {

  return `

    <article
      class="task-card"
      draggable="true"
      data-task="${task.id}"
    >

      <span
        class="priority ${task.priority}"
      >
        ${taskPriority(task.priority)}
      </span>


      <h4>
        ${task.title}
      </h4>


      <p>
        ${task.desc || ""}
      </p>


      <div class="task-actions">

        <button
          data-move="${task.id}"
        >
          نقل →
        </button>

        <button
          data-delete="${task.id}"
        >
          حذف
        </button>

      </div>

    </article>

  `;

}


/* =========================================================
   RENDER KANBAN
   ========================================================= */

function renderBoard() {

  $("#kanbanBoard").innerHTML =
    columns.map(column => {

      const list =
        tasks.filter(
          task =>
            task.status === column.id
        );


      return `

        <section
          class="board-column"
          data-status="${column.id}"
        >

          <div class="column-head">

            <div class="column-title">

              <span class="column-dot"></span>

              ${column.title}

            </div>


            <span class="column-count">

              ${String(list.length)
                .padStart(2, "0")}

            </span>

          </div>


          <div
            class="task-list"
            data-drop="${column.id}"
          >

            ${list
              .map(taskCard)
              .join("")}

          </div>

        </section>

      `;

    }).join("");


  bindDrag();


  updateStats();

}


/* =========================================================
   UPDATE STATS
   ========================================================= */

function updateStats() {

  $("#statArticles")
    .textContent =
    String(
      articles.length
    ).padStart(2, "0");


  $("#statIdeas")
    .textContent =
    String(
      tasks.filter(
        task =>
          task.status !== "done"
      ).length
    ).padStart(2, "0");


  $("#statDone")
    .textContent =
    String(
      tasks.filter(
        task =>
          task.status === "done"
      ).length
    ).padStart(2, "0");

}


/* =========================================================
   DRAG AND DROP
   ========================================================= */

function bindDrag() {

  $$(".task-card").forEach(
    card => {

      card.addEventListener(
        "dragstart",
        () => {

          card.classList.add(
            "dragging"
          );

        }
      );


      card.addEventListener(
        "dragend",
        () => {

          card.classList.remove(
            "dragging"
          );


          $$(".task-list")
            .forEach(zone => {

              zone.classList.remove(
                "drop-active"
              );

            });

        }
      );

    }
  );


  $$(".task-list").forEach(
    zone => {

      zone.addEventListener(
        "dragover",
        event => {

          event.preventDefault();

          zone.classList.add(
            "drop-active"
          );

        }
      );


      zone.addEventListener(
        "dragleave",
        () => {

          zone.classList.remove(
            "drop-active"
          );

        }
      );


      zone.addEventListener(
        "drop",
        event => {

          event.preventDefault();


          zone.classList.remove(
            "drop-active"
          );


          const card =
            $(".task-card.dragging");


          if (!card) return;


          const taskId =
            Number(
              card.dataset.task
            );


          const targetStatus =
            zone.dataset.drop;


          const task =
            tasks.find(
              item =>
                item.id === taskId
            );


          if (
            task &&
            task.status !== targetStatus
          ) {

            task.status =
              targetStatus;


            persistTasks();

            renderBoard();

            renderMiniBoard();

            toast(
              "تم نقل المهمة بنجاح ✦"
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   LOCAL STORAGE TASKS
   ========================================================= */

function persistTasks() {

  localStorage.setItem(
    "talkspace-tasks",
    JSON.stringify(tasks)
  );

}


const storedTasks =
  JSON.parse(
    localStorage.getItem(
      "talkspace-tasks"
    ) || "null"
  );


if (
  Array.isArray(storedTasks)
) {

  tasks = storedTasks;

}


/* =========================================================
   TASK MODAL
   ========================================================= */

function openTask() {

  $("#taskModal")
    .classList.add("open");


  $("#taskTitle").focus();

}


function closeTask() {

  $("#taskModal")
    .classList.remove("open");

}


/* =========================================================
   GLOBAL CLICK EVENTS
   ========================================================= */

document.addEventListener(
  "click",
  event => {


    /* NAVIGATION */

    const nav =
      event.target.closest(
        "[data-nav]"
      );


    if (nav) {

      event.preventDefault();

      navigate(
        nav.dataset.nav
      );

      return;

    }


    /* ARTICLE */

    const read =
      event.target.closest(
        "[data-read]"
      );


    if (read) {

      openArticle(
        read.dataset.read
      );

      return;

    }


    /* CLOSE ARTICLE */

    const closeModal =
      event.target.closest(
        "[data-close-modal]"
      );


    if (closeModal) {

      closeArticle();

      return;

    }


    /* CLOSE TASK */

    const closeTaskButton =
      event.target.closest(
        "[data-close-task]"
      );


    if (closeTaskButton) {

      closeTask();

      return;

    }


    /* MOVE TASK */

    const move =
      event.target.closest(
        "[data-move]"
      );


    if (move) {

      const task =
        tasks.find(
          item =>
            item.id ===
            Number(
              move.dataset.move
            )
        );


      if (!task) return;


      const currentIndex =
        columns.findIndex(
          column =>
            column.id ===
            task.status
        );


      task.status =
        columns[
          (currentIndex + 1)
          % columns.length
        ].id;


      persistTasks();

      renderBoard();

      renderMiniBoard();

      toast(
        "تم تحريك المهمة إلى الحالة التالية"
      );

      return;

    }


    /* DELETE TASK */

    const deleteButton =
      event.target.closest(
        "[data-delete]"
      );


    if (deleteButton) {

      tasks =
        tasks.filter(
          task =>
            task.id !==
            Number(
              deleteButton.dataset.delete
            )
        );


      persistTasks();

      renderBoard();

      renderMiniBoard();

      toast(
        "تم حذف المهمة"
      );

      return;

    }

  }
);


/* =========================================================
   ARTICLE FILTERS
   ========================================================= */

$$(".filter-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        renderArticles(
          button.dataset.filter
        );

      }
    );

  });


/* =========================================================
   DARK / LIGHT MODE
   ========================================================= */

$("#themeBtn")
  .addEventListener(
    "click",
    () => {

      settings.light =
        !document.body.classList.contains(
          "light"
        );


      settings.bg =
        settings.light
          ? "light"
          : "deep";


      saveSettings();

      applySettings();


      toast(
        settings.light
          ? "تم تفعيل الوضع النهاري ☀"
          : "تم تفعيل الوضع الداكن ◐"
      );

    }
  );


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

$("#notifyBtn")
  .addEventListener(
    "click",
    () => {

      toast(
        "لا توجد إشعارات جديدة — كل شيء تحت السيطرة ✦"
      );

    }
  );


/* =========================================================
   STUDIO
   ========================================================= */

$("#studioBtn")
  .addEventListener(
    "click",
    () => {

      $("#studioDrawer")
        .classList.add("open");

    }
  );


$("#closeStudio")
  .addEventListener(
    "click",
    closeStudio
  );


$("#drawerBackdrop")
  .addEventListener(
    "click",
    closeStudio
  );


function closeStudio() {

  $("#studioDrawer")
    .classList.remove("open");

}


/* =========================================================
   COLOR CONTROLS
   ========================================================= */

$("#cyanPicker")
  .addEventListener(
    "input",
    event => {

      settings.cyan =
        event.target.value;

      saveSettings();

      applySettings();

    }
  );


$("#bluePicker")
  .addEventListener(
    "input",
    event => {

      settings.blue =
        event.target.value;

      saveSettings();

      applySettings();

    }
  );


/* =========================================================
   RANGE CONTROLS
   ========================================================= */

$("#blurRange")
  .addEventListener(
    "input",
    event => {

      settings.blur =
        event.target.value;

      saveSettings();

      applySettings();

    }
  );


$("#glassRange")
  .addEventListener(
    "input",
    event => {

      settings.glass =
        event.target.value;

      saveSettings();

      applySettings();

    }
  );


/* =========================================================
   BACKGROUND
   ========================================================= */

$$(".bg-option")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        settings.bg =
          button.dataset.bg;


        settings.light =
          settings.bg === "light";


        saveSettings();

        applySettings();


        toast(
          `تم تغيير الخلفية إلى ${button.textContent}`
        );

      }
    );

  });


/* =========================================================
   RESET
   ========================================================= */

$("#resetSettings")
  .addEventListener(
    "click",
    () => {

      settings = {
        ...defaultSettings
      };


      saveSettings();

      applySettings();


      toast(
        "تمت إعادة الهوية إلى الإعدادات الأصلية"
      );

    }
  );


/* =========================================================
   ADD TASK
   ========================================================= */

$("#addTaskTop")
  .addEventListener(
    "click",
    openTask
  );


$("#taskForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      tasks.unshift({

        id: Date.now(),

        title:
          $("#taskTitle")
            .value
            .trim(),

        desc:
          $("#taskDescription")
            .value
            .trim(),

        priority:
          $("#taskPriority")
            .value,

        status:
          $("#taskStatus")
            .value

      });


      persistTasks();

      renderBoard();

      renderMiniBoard();

      closeTask();


      event.target.reset();


      toast(
        "تمت إضافة المهمة إلى اللوحة ✦"
      );

    }
  );


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeArticle();

      closeTask();

      closeStudio();

    }

  }
);


/* =========================================================
   BROWSER HISTORY
   ========================================================= */

window.addEventListener(
  "popstate",
  () => {

    navigate(
      location.hash.slice(1)
      || "home"
    );

  }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

renderFeatured();

renderArticles();

renderBoard();

renderMiniBoard();

updateStats();

applySettings();


const initialView =
  location.hash.slice(1);


if (
  [
    "home",
    "articles",
    "board",
    "about"
  ].includes(initialView)
) {

  navigate(initialView);

}
