/* =========================================================
   TALKSPACE FOUNDATION 1.0
   Central Application State
   ========================================================= */

"use strict";


const App = {

    /* =====================================================
       STATE
       ===================================================== */

    state: {

        theme: "dark",

        colors: {
            primary: "#0000ff",
            cyan: "#00f2fe"
        },

        blur: 20,

        activeView: "home",

        captureType: "idea",

        items: [],

        ideas: [],
        ideaFilter: "all",
        ideaSearch: "",

        articles: [],
        tasks: [],
        notes: [],

        articleEditingId: null,
        articleDraft: null,

        activity: [
            {
                title: "مرحبًا بك في TalkSpace",
                description: "تم إنشاء مساحة العمل",
                time: "الآن"
            }
        ],

        notifications: []

    },


    /* =====================================================
       INIT
       ===================================================== */

    init() {

        this.loadState();

        // Normalize state after loading old/new versions.
        this.normalizeState();

        this.applyTheme();
        this.applyCustomization();

        this.bindEvents();

        this.render();

        this.showToast(
            "TalkSpace جاهز",
            "مساحة العمل تعمل بشكل طبيعي."
        );

    },


    /* =====================================================
       STATE NORMALIZATION
       ===================================================== */

    normalizeState() {

        const defaults = {
            theme: "dark",
            colors: { primary: "#0000ff", cyan: "#00f2fe" },
            blur: 20,
            activeView: "home",
            captureType: "idea",
            items: [],
            ideas: [],
            ideaFilter: "all",
            ideaSearch: "",
            articles: [],
            tasks: [],
            notes: [],
            articleEditingId: null,
            articleDraft: null,
            activity: [],
            notifications: []
        };

        this.state = {
            ...defaults,
            ...this.state,
            colors: { ...defaults.colors, ...(this.state.colors || {}) },
            ideas: Array.isArray(this.state.ideas) ? this.state.ideas : [],
            articles: Array.isArray(this.state.articles) ? this.state.articles : [],
            tasks: Array.isArray(this.state.tasks) ? this.state.tasks : [],
            notes: Array.isArray(this.state.notes) ? this.state.notes : [],
            items: Array.isArray(this.state.items) ? this.state.items : [],
            activity: Array.isArray(this.state.activity) ? this.state.activity : [],
            notifications: Array.isArray(this.state.notifications) ? this.state.notifications : []
        };

        // Keep legacy idea records compatible.
        this.state.ideas = this.state.ideas.map(idea => ({
            id: idea.id ?? Date.now() + Math.random(),
            title: String(idea.title || ""),
            details: String(idea.details || ""),
            tags: Array.isArray(idea.tags) ? idea.tags : [],
            space: String(idea.space || ""),
            status: ["raw", "developing", "ready", "converted"].includes(idea.status) ? idea.status : "raw",
            createdAt: idea.createdAt || new Date().toISOString(),
            updatedAt: idea.updatedAt || idea.createdAt || new Date().toISOString()
        }));

        // Normalize article records and preserve their visual identity.
        this.state.articles = this.state.articles.map(article => ({
            id: article.id ?? Date.now() + Math.random(),
            sourceIdeaId: article.sourceIdeaId ?? null,
            title: String(article.title || ""),
            intro: String(article.intro || ""),
            content: String(article.content || ""),
            space: String(article.space || ""),
            tags: Array.isArray(article.tags) ? article.tags : [],
            sources: Array.isArray(article.sources) ? article.sources : [],
            status: ["draft", "review", "published"].includes(article.status) ? article.status : "draft",
            createdAt: article.createdAt || new Date().toISOString(),
            updatedAt: article.updatedAt || article.createdAt || new Date().toISOString(),
            design: {
                coverImage: "",
                logoImage: "",
                symbol: "◎",
                accent: this.state.colors.cyan,
                fontFamily: "Cairo",
                titleSize: 46,
                bodySize: 18,
                coverPosition: "center",
                coverZoom: 100,
                coverStyle: "image",
                ...(article.design || {})
            }
        }));

        if (!this.state.activity.length) {
            this.state.activity.push({
                title: "مرحبًا بك في TalkSpace",
                description: "تم إنشاء مساحة العمل",
                time: "الآن"
            });
        }
    },

    /* =====================================================
       STORAGE
       ===================================================== */

    saveState() {

        try {

            localStorage.setItem(
                "talkspace_foundation_state",
                JSON.stringify(this.state)
            );

        } catch (error) {

            console.warn(
                "Could not save TalkSpace state.",
                error
            );

            if (error && (error.name === "QuotaExceededError" || String(error).toLowerCase().includes("quota"))) {
                console.warn("TalkSpace storage quota exceeded. Large article images may need to be removed.");
            }

        }

    },


    loadState() {

        try {

            const saved =
                localStorage.getItem(
                    "talkspace_foundation_state"
                );

            if (!saved) return;

            const parsed = JSON.parse(saved);

            this.state = {
                ...this.state,
                ...parsed,

                colors: {
                    ...this.state.colors,
                    ...(parsed.colors || {})
                },

                ideas: Array.isArray(parsed.ideas)
                    ? parsed.ideas
                    : (Array.isArray(parsed.items)
                        ? parsed.items
                            .filter(item => item.type === "idea")
                            .map(item => ({
                                id: item.id,
                                title: item.title || "",
                                details: item.details || "",
                                tags: Array.isArray(item.tags)
                                    ? item.tags
                                    : [],
                                space: item.space || "",
                                status: item.status || "raw",
                                createdAt: item.createdAt || new Date().toISOString(),
                                updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
                            }))
                        : []),

                ideaFilter: parsed.ideaFilter || "all",
                ideaSearch: parsed.ideaSearch || "",

                articles: Array.isArray(parsed.articles) ? parsed.articles.map(article => ({
                    ...article,
                    tags: Array.isArray(article.tags) ? article.tags : [],
                    sources: Array.isArray(article.sources) ? article.sources : [],
                    status: article.status || "draft",
                    design: {
                        coverImage: "", logoImage: "", symbol: "◎", accent: (parsed.colors || {}).cyan || "#00f2fe", fontFamily: "Cairo", titleSize: 46, bodySize: 18, coverPosition: "center", coverZoom: 100, coverStyle: "image",
                        ...(article.design || {})
                    }
                })) : [],
                tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
                notes: Array.isArray(parsed.notes) ? parsed.notes : []
            };

        } catch (error) {

            console.warn(
                "Could not load TalkSpace state.",
                error
            );

        }

    },


    /* =====================================================
       EVENTS
       ===================================================== */

    bindEvents() {

        document.addEventListener(
            "click",
            (event) => this.handleClick(event)
        );


        document.addEventListener(
            "keydown",
            (event) => this.handleKeyboard(event)
        );


        /* Studio colors */

        const primaryColor =
            document.getElementById("primaryColor");

        const cyanColor =
            document.getElementById("cyanColor");

        const blurRange =
            document.getElementById("blurRange");


        primaryColor?.addEventListener(
            "input",
            (event) => {

                this.state.colors.primary =
                    event.target.value;

                document.getElementById(
                    "primaryColorValue"
                ).textContent =
                    event.target.value;

                this.applyCustomization();
                this.saveState();

            }
        );


        cyanColor?.addEventListener(
            "input",
            (event) => {

                this.state.colors.cyan =
                    event.target.value;

                document.getElementById(
                    "cyanColorValue"
                ).textContent =
                    event.target.value;

                this.applyCustomization();
                this.saveState();

            }
        );


        blurRange?.addEventListener(
            "input",
            (event) => {

                this.state.blur =
                    Number(event.target.value);

                document.getElementById(
                    "blurValue"
                ).textContent =
                    `${this.state.blur}px`;

                this.applyCustomization();
                this.saveState();

            }
        );


        /* Capture type */

        document
            .querySelectorAll("[data-capture-type]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const type =
                            button.dataset.captureType;

                        this.setCaptureType(type);

                    }
                );

            });


        /* Presets */

        document
            .querySelectorAll("[data-preset]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        this.applyPreset(
                            button.dataset.preset
                        );

                    }
                );

            });


        /* Command search */

        const commandInput =
            document.getElementById("commandInput");

        commandInput?.addEventListener(
            "input",
            () => this.filterCommands()
        );

        /* Ideas search */
        const ideasSearch =
            document.getElementById("ideasSearch");

        ideasSearch?.addEventListener(
            "input",
            (event) => {
                this.state.ideaSearch = event.target.value;
                this.renderIdeas();
            }
        );

        this.bindArticleStudioEvents();


        /* Close modal by background */

        document
            .getElementById("captureModal")
            ?.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.id ===
                        "captureModal"
                    ) {

                        this.closeCapture();

                    }

                }
            );


        /* Close command palette */

        document
            .getElementById("commandLayer")
            ?.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.id ===
                        "commandLayer"
                    ) {

                        this.closeCommand();

                    }

                }
            );


        /* Mobile overlay */

        document
            .getElementById("mobileOverlay")
            ?.addEventListener(
                "click",
                () => this.closeSidebar()
            );

    },


    /* =====================================================
       CLICK HANDLER
       ===================================================== */

    handleClick(event) {

        const viewButton =
            event.target.closest("[data-view]");

        if (viewButton) {

            this.navigate(
                viewButton.dataset.view
            );

            return;
        }


        const actionButton =
            event.target.closest("[data-action]");

        if (actionButton) {

            this.handleAction(
                actionButton.dataset.action,
                actionButton
            );

            return;
        }


        const ideaFilter =
            event.target.closest("[data-idea-filter]");

        if (ideaFilter) {
            this.setIdeaFilter(ideaFilter.dataset.ideaFilter);
            return;
        }

        const ideaAction =
            event.target.closest("[data-idea-action]");

        if (ideaAction) {
            this.handleIdeaAction(
                ideaAction.dataset.ideaAction,
                ideaAction
            );
            return;
        }

        const articleAction = event.target.closest("[data-article-action]");
        if (articleAction) {
            this.handleArticleAction(articleAction.dataset.articleAction, articleAction);
            return;
        }

        const articleTab = event.target.closest("[data-article-tab]");
        if (articleTab) {
            this.switchArticleTab(articleTab.dataset.articleTab);
            return;
        }

        const previewMode = event.target.closest("[data-preview-mode]");
        if (previewMode) {
            this.setPreviewMode(previewMode.dataset.previewMode);
            return;
        }

        const coverStyle = event.target.closest("[data-cover-style]");
        if (coverStyle) {
            this.setArticleDraftValue("coverStyle", coverStyle.dataset.coverStyle);
            document.querySelectorAll("[data-cover-style]").forEach(b => b.classList.toggle("active", b === coverStyle));
            this.updateArticlePreview();
            return;
        }

        const commandView =
            event.target.closest(
                "[data-command-view]"
            );

        if (commandView) {

            this.navigate(
                commandView.dataset.commandView
            );

            this.closeCommand();

            return;
        }


        const commandAction =
            event.target.closest(
                "[data-command-action]"
            );

        if (commandAction) {

            this.handleAction(
                commandAction.dataset.commandAction
            );

            this.closeCommand();

            return;
        }

    },


    /* =====================================================
       ACTIONS
       ===================================================== */

    handleAction(action, element = null) {

        switch (action) {

            case "go-home":
                this.navigate("home");
                break;


            case "explore":
                this.navigate("explore");
                break;


            case "capture":

                this.openCapture(
                    element?.dataset.type ||
                    "idea"
                );

                break;


            case "save-capture":
                this.saveCapture();
                break;


            case "close-capture":
                this.closeCapture();
                break;


            case "close-article-studio":
                this.closeArticleStudio();
                break;

            case "save-article":
                this.saveArticleFromStudio();
                break;

            case "preview-article":
                this.switchArticleTab("preview");
                break;

            case "remove-article-cover":
                this.removeArticleCover();
                break;

            case "remove-article-logo":
                this.removeArticleLogo();
                break;


            case "notifications":
                this.openNotifications();
                break;


            case "close-notifications":
                this.closeNotifications();
                break;


            case "studio":
                this.openStudio();
                break;


            case "close-studio":
                this.closeStudio();
                break;


            case "theme":
                this.toggleTheme();
                break;


            case "command":
                this.openCommand();
                break;


            case "toggle-sidebar":
                this.toggleSidebar();
                break;


            case "focus":
                this.focusMode();
                break;


            case "new-task":
                this.openCapture("task");
                break;

            case "ideas":
                this.navigate("ideas");
                this.renderIdeas();
                break;


            case "activity":
                this.showToast(
                    "النشاط",
                    "سيتم تطوير سجل النشاطات في المرحلة القادمة."
                );
                break;


            case "profile":
                this.showToast(
                    "مساحة العمل",
                    "إعدادات الحساب المحلي ستضاف لاحقًا."
                );
                break;


            case "reset-settings":
                this.resetSettings();
                break;


            default:

                this.showToast(
                    "غير متاح",
                    "هذه الوظيفة ستضاف في مرحلة لاحقة."
                );

        }

    },


    /* =====================================================
       NAVIGATION
       ===================================================== */

    navigate(view) {

        const target =
            document.getElementById(
                `view-${view}`
            );

        if (!target) return;


        document
            .querySelectorAll(".view")
            .forEach(section => {

                section.classList.remove("active");

            });


        target.classList.add("active");


        document
            .querySelectorAll(".nav-item")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.view === view
                );

            });


        this.state.activeView = view;


        const titles = {

            home: "الرئيسية",
            explore: "استكشف",
            articles: "المقالات",
            ideas: "الأفكار",
            tasks: "المهام",
            spaces: "المساحات",
            knowledge: "شبكة المعرفة"

        };


        document.getElementById(
            "pageTitle"
        ).textContent =
            titles[view] || "TalkSpace";


        this.saveState();

        this.closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    },


    /* =====================================================
       CAPTURE
       ===================================================== */

    openCapture(type = "idea") {

        if (type === "article") {
            this.openArticleStudio();
            return;
        }

        this.setCaptureType(type);

        const modal =
            document.getElementById(
                "captureModal"
            );

        modal.classList.add("open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        setTimeout(() => {

            document
                .getElementById("captureInput")
                ?.focus();

        }, 100);

    },


    closeCapture() {

        const modal =
            document.getElementById(
                "captureModal"
            );

        if (!modal) return;

        modal.classList.remove("open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.getElementById(
            "captureInput"
        ).value = "";

        document.getElementById(
            "captureDetails"
        ).value = "";

        const tags = document.getElementById("captureTags");
        const space = document.getElementById("captureSpace");

        if (tags) tags.value = "";
        if (space) space.value = "";

        const saveButton =
            document.querySelector('[data-action="save-capture"]');

        if (saveButton) {
            delete saveButton.dataset.editIdeaId;
        }

    },


    setCaptureType(type) {

        const allowed = [
            "idea",
            "article",
            "task",
            "note"
        ];


        if (!allowed.includes(type)) {

            type = "idea";

        }


        this.state.captureType = type;


        document
            .querySelectorAll(
                "[data-capture-type]"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.captureType === type
                );

            });


        const titles = {

            idea: "التقاط فكرة",
            article: "مقال جديد",
            task: "مهمة جديدة",
            note: "ملاحظة جديدة"

        };


        document.getElementById(
            "captureTitle"
        ).textContent =
            titles[type];

    },


    saveCapture() {

        const title =
            document.getElementById(
                "captureInput"
            ).value.trim();

        const details =
            document.getElementById(
                "captureDetails"
            ).value.trim();

        const tagsRaw =
            document.getElementById(
                "captureTags"
            )?.value.trim() || "";

        const space =
            document.getElementById(
                "captureSpace"
            )?.value.trim() || "";

        if (!title) {

            this.showToast(
                "أحتاج عنوانًا",
                "اكتب عنوانًا قبل الحفظ."
            );

            document
                .getElementById("captureInput")
                .focus();

            return;
        }

        const type = this.state.captureType;

        const saveButton =
            document.querySelector('[data-action="save-capture"]');

        const editingIdeaId =
            Number(saveButton?.dataset.editIdeaId || 0);

        if (type === "idea" && editingIdeaId) {

            const idea =
                this.state.ideas.find(
                    item => Number(item.id) === editingIdeaId
                );

            if (idea) {
                idea.title = title;
                idea.details = details;
                idea.tags = tagsRaw
                    ? tagsRaw.split(",").map(tag => tag.trim()).filter(Boolean)
                    : [];
                idea.space = space;
                idea.updatedAt = new Date().toISOString();

                delete saveButton.dataset.editIdeaId;

                this.saveState();
                this.renderIdeas();
                this.closeCapture();

                this.showToast(
                    "تم تحديث الفكرة",
                    "تم حفظ التعديلات بنجاح."
                );

                return;
            }
        }

        if (type === "idea") {

            const idea = {
                id: Date.now(),
                title,
                details,
                tags: tagsRaw
                    ? tagsRaw
                        .split(",")
                        .map(tag => tag.trim())
                        .filter(Boolean)
                    : [],
                space,
                status: "raw",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.state.ideas.unshift(idea);

            this.addActivity(
                title,
                "idea"
            );

            this.saveState();
            this.renderIdeas();
            this.closeCapture();

            this.showToast(
                "تم حفظ الفكرة",
                "أضيفت إلى صندوق الأفكار كفكرة خام."
            );

            return;
        }

        if (type === "article") {

            const article = {
                id: Date.now(),
                title,
                intro: details,
                content: "",
                space,
                tags: tagsRaw
                    ? tagsRaw.split(",").map(tag => tag.trim()).filter(Boolean)
                    : [],
                sources: [],
                status: "draft",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.state.articles.unshift(article);

            this.addActivity(title, "article");
            this.saveState();
            this.renderArticles();
            this.closeCapture();

            this.showToast(
                "تم حفظ المقال",
                "أضيف إلى قسم المقالات كمسودة."
            );

            this.navigate("articles");
            return;
        }

        const item = {
            id: Date.now(),
            type,
            title,
            details,
            createdAt: new Date().toISOString()
        };

        this.state.items.unshift(item);

        this.addActivity(
            title,
            type
        );

        this.saveState();
        this.closeCapture();

        this.showToast(
            "تم الحفظ",
            `${this.getTypeName(type)} أضيفت إلى مساحة العمل.`
        );

    },

    getTypeName(type) {

        const names = {

            idea: "الفكرة",
            article: "المقال",
            task: "المهمة",
            note: "الملاحظة"

        };

        return names[type] || "العنصر";

    },


    /* =====================================================
       ACTIVITY
       ===================================================== */

    addActivity(title, type) {

        this.state.activity.unshift({

            title:
                `${this.getTypeName(type)}: ${title}`,

            description:
                "تمت إضافته إلى مساحة العمل",

            time: "الآن"

        });


        this.state.activity =
            this.state.activity.slice(0, 6);


        this.renderActivity();

    },


    renderActivity() {

        const container =
            document.getElementById(
                "activityList"
            );

        if (!container) return;


        container.innerHTML =
            this.state.activity
                .map(item => `

                    <div class="activity-item">

                        <span class="activity-dot"></span>

                        <div>

                            <strong>
                                ${this.escapeHTML(item.title)}
                            </strong>

                            <small>
                                ${this.escapeHTML(item.description)}
                            </small>

                        </div>

                        <time>
                            ${this.escapeHTML(item.time)}
                        </time>

                    </div>

                `)
                .join("");

    },


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    openNotifications() {

        const panel =
            document.getElementById(
                "notificationPanel"
            );

        if (!panel) return;
        panel.classList.add("open");

        this.showToast(
            "الإشعارات",
            "لا توجد إشعارات جديدة."
        );

    },


    closeNotifications() {

        document
            .getElementById(
                "notificationPanel"
            )?.classList.remove("open");

    },


    /* =====================================================
       STUDIO
       ===================================================== */

    openStudio() {

        document
            .getElementById(
                "studioPanel"
            )?.classList.add("open");

    },


    closeStudio() {

        document
            .getElementById(
                "studioPanel"
            )?.classList.remove("open");

    },


    applyCustomization() {

        document.documentElement.style.setProperty(
            "--primary",
            this.state.colors.primary
        );

        document.documentElement.style.setProperty(
            "--cyan",
            this.state.colors.cyan
        );

        document.documentElement.style.setProperty(
            "--blur",
            `${this.state.blur}px`
        );


        const primary =
            document.getElementById(
                "primaryColor"
            );

        const cyan =
            document.getElementById(
                "cyanColor"
            );

        const blur =
            document.getElementById(
                "blurRange"
            );


        if (primary) {

            primary.value =
                this.state.colors.primary;

            document.getElementById(
                "primaryColorValue"
            ).textContent =
                this.state.colors.primary;

        }


        if (cyan) {

            cyan.value =
                this.state.colors.cyan;

            document.getElementById(
                "cyanColorValue"
            ).textContent =
                this.state.colors.cyan;

        }


        if (blur) {

            blur.value =
                this.state.blur;

            document.getElementById(
                "blurValue"
            ).textContent =
                `${this.state.blur}px`;

        }

    },


    applyPreset(preset) {

        const presets = {

            cyber: {
                primary: "#0000ff",
                cyan: "#00f2fe",
                blur: 20
            },

            midnight: {
                primary: "#5b5cff",
                cyan: "#8b9cff",
                blur: 28
            },

            minimal: {
                primary: "#2563eb",
                cyan: "#38bdf8",
                blur: 14
            }

        };


        const selected =
            presets[preset];

        if (!selected) return;


        this.state.colors.primary =
            selected.primary;

        this.state.colors.cyan =
            selected.cyan;

        this.state.blur =
            selected.blur;


        this.applyCustomization();

        this.saveState();


        this.showToast(
            "تم تغيير الهوية",
            `تم تطبيق Preset: ${preset}.`
        );

    },


    resetSettings() {

        const confirmed =
            confirm(
                "هل تريد إعادة إعدادات TalkSpace الافتراضية؟"
            );


        if (!confirmed) return;


        this.state.theme = "dark";

        this.state.colors.primary =
            "#0000ff";

        this.state.colors.cyan =
            "#00f2fe";

        this.state.blur = 20;


        this.applyTheme();
        this.applyCustomization();

        this.saveState();


        this.showToast(
            "تمت الإعادة",
            "عادت الهوية إلى الإعدادات الافتراضية."
        );

    },


    /* =====================================================
       THEME
       ===================================================== */

    toggleTheme() {

        this.state.theme =
            this.state.theme === "dark"
                ? "light"
                : "dark";


        this.applyTheme();

        this.saveState();


        this.showToast(
            "المظهر",
            this.state.theme === "dark"
                ? "تم تفعيل الوضع الداكن."
                : "تم تفعيل الوضع الفاتح."
        );

    },


    applyTheme() {

        document.body.classList.toggle(
            "light",
            this.state.theme === "light"
        );


        const button =
            document.getElementById(
                "themeButton"
            );


        if (button) {

            button.textContent =
                this.state.theme === "dark"
                    ? "☾"
                    : "☀";

        }

    },


    /* =====================================================
       COMMAND PALETTE
       ===================================================== */

    openCommand() {

        const layer =
            document.getElementById(
                "commandLayer"
            );

        layer.classList.add("open");


        const input =
            document.getElementById(
                "commandInput"
            );

        input.value = "";

        this.filterCommands();


        setTimeout(
            () => input.focus(),
            100
        );

    },


    closeCommand() {

        document
            .getElementById(
                "commandLayer"
            )
            .classList.remove("open");

    },


    filterCommands() {

        const input =
            document.getElementById(
                "commandInput"
            );

        const query =
            input.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(
                "#commandList button"
            )
            .forEach(button => {

                const text =
                    button.textContent
                        .toLowerCase();

                button.style.display =
                    text.includes(query)
                        ? "flex"
                        : "none";

            });

    },


    /* =====================================================
       IDEAS ENGINE — PHASE 2.1
       ===================================================== */

    setIdeaFilter(filter) {

        const allowed = [
            "all",
            "raw",
            "developing",
            "ready",
            "converted"
        ];

        this.state.ideaFilter =
            allowed.includes(filter)
                ? filter
                : "all";

        document
            .querySelectorAll("[data-idea-filter]")
            .forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.ideaFilter ===
                    this.state.ideaFilter
                );
            });

        this.renderIdeas();
        this.saveState();
    },


    getIdeaStatusName(status) {

        const names = {
            raw: "خام",
            developing: "قيد التطوير",
            ready: "جاهزة",
            converted: "محوّلة"
        };

        return names[status] || "خام";
    },


    getIdeaStatusNext(status) {

        const flow = {
            raw: "developing",
            developing: "ready",
            ready: "converted",
            converted: "converted"
        };

        return flow[status] || "developing";
    },


    formatDate(date) {

        try {
            return new Intl.DateTimeFormat(
                "ar-DZ",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            ).format(new Date(date));
        } catch {
            return "";
        }
    },


    renderArticles() {

        const list = document.getElementById("articlesList");
        if (!list) return;

        const articles = Array.isArray(this.state.articles) ? this.state.articles : [];
        const statusNames = {draft:"مسودة", review:"قيد المراجعة", published:"منشور"};

        if (!articles.length) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">▤</div>
                    <h2>لا توجد مقالات بعد</h2>
                    <p>ابدأ بإنشاء مقال جديد، وستظهر هنا كل مسوداتك ومقالاتك.</p>
                    <button class="primary-button" data-action="capture" data-type="article">＋ مقال جديد</button>
                </div>`;
            return;
        }

        list.innerHTML = articles.map(article => {
            const design = article.design || {};
            const cover = design.coverImage ? `style="background-image:url('${design.coverImage}');background-position:${this.escapeHTML(design.coverPosition || "center")};background-size:${Number(design.coverZoom || 100)}%"` : "";
            const accent = this.escapeHTML(design.accent || this.state.colors.cyan);
            const words = this.countWords(article.content || "");
            return `
            <article class="article-card article-card-studio" style="--article-accent:${accent}">
                <div class="article-card-cover ${design.coverImage ? "has-image" : ""}" ${cover}>
                    <div class="article-card-logo">${design.logoImage ? `<img src="${design.logoImage}" alt="">` : this.escapeHTML(design.symbol || "◎")}</div>
                    ${!design.coverImage ? `<span class="article-cover-placeholder">TALKSPACE</span>` : ""}
                </div>
                <div class="article-card-body">
                    <div class="article-card-top"><span class="status-pill status-${this.escapeHTML(article.status || "draft")}">${statusNames[article.status] || "مسودة"}</span><time>${this.formatDate(article.updatedAt || article.createdAt)}</time></div>
                    <h2>${this.escapeHTML(article.title)}</h2>
                    ${article.intro ? `<p>${this.escapeHTML(article.intro)}</p>` : ""}
                    <div class="article-card-meta"><span>${words} كلمة</span><span>${this.readTime(words)}</span>${article.space ? `<span>◈ ${this.escapeHTML(article.space)}</span>` : ""}</div>
                    ${(article.tags || []).length ? `<div class="idea-tags">${article.tags.map(tag => `<span class="idea-tag">#${this.escapeHTML(tag)}</span>`).join("")}</div>` : ""}
                    <div class="article-card-actions">
                        <button class="small-action" data-article-action="edit" data-id="${article.id}">تحرير</button>
                        <button class="small-action" data-article-action="preview" data-id="${article.id}">معاينة</button>
                        <button class="small-action" data-article-action="advance" data-id="${article.id}">${article.status === "draft" ? "إرسال للمراجعة" : article.status === "review" ? "نشر" : "إبقاء منشور"}</button>
                        <button class="danger-action" data-article-action="delete" data-id="${article.id}">حذف</button>
                    </div>
                </div>
            </article>`;
        }).join("");
    },

    bindArticleStudioEvents() {
        const ids = [
            "articleTitleInput","articleIntroInput","articleSpaceInput","articleTagsInput","articleStatusInput","articleSourcesInput","articleContentInput","articleFontFamily","articleTitleSize","articleBodySize","articleAccentColor","articleCoverPosition","articleCoverZoom","articleSymbolInput"
        ];
        ids.forEach(id => document.getElementById(id)?.addEventListener("input", () => this.syncArticleDraftFromForm()));
        document.getElementById("articleStatusInput")?.addEventListener("change", () => this.syncArticleDraftFromForm());
        document.getElementById("articleFontFamily")?.addEventListener("change", () => this.syncArticleDraftFromForm());
        document.getElementById("articleCoverPosition")?.addEventListener("change", () => this.syncArticleDraftFromForm());
        document.getElementById("articleCoverInput")?.addEventListener("change", e => this.handleArticleImage(e.target.files?.[0], "coverImage"));
        document.getElementById("articleLogoInput")?.addEventListener("change", e => this.handleArticleImage(e.target.files?.[0], "logoImage"));
        document.getElementById("articleStudioModal")?.addEventListener("click", e => { if (e.target.id === "articleStudioModal") this.closeArticleStudio(); });
    },

    defaultArticleDesign() {
        return { coverImage:"", logoImage:"", symbol:"◎", accent:this.state.colors.cyan, fontFamily:"Cairo", titleSize:46, bodySize:18, coverPosition:"center", coverZoom:100, coverStyle:"image" };
    },

    openArticleStudio(articleId = null) {
        const article = articleId ? this.state.articles.find(a => Number(a.id) === Number(articleId)) : null;
        this.state.articleEditingId = article ? article.id : null;
        this.state.articleDraft = article ? JSON.parse(JSON.stringify(article)) : {
            id:null,title:"",intro:"",content:"",space:"",tags:[],sources:[],status:"draft",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),design:this.defaultArticleDesign()
        };
        this.state.articleDraft.design = {...this.defaultArticleDesign(), ...(this.state.articleDraft.design || {})};
        this.fillArticleStudioForm();
        const modal=document.getElementById("articleStudioModal");
        modal?.classList.add("open"); modal?.setAttribute("aria-hidden","false");
        this.switchArticleTab("content");
        setTimeout(()=>document.getElementById("articleTitleInput")?.focus(),100);
    },

    closeArticleStudio() {
        const modal=document.getElementById("articleStudioModal");
        modal?.classList.remove("open"); modal?.setAttribute("aria-hidden","true");
        this.state.articleEditingId=null;
        this.state.articleDraft=null;
    },

    fillArticleStudioForm() {
        const d=this.state.articleDraft || {};
        const design={...this.defaultArticleDesign(), ...(d.design||{})};
        const set=(id,val)=>{const el=document.getElementById(id); if(el) el.value=val ?? "";};
        set("articleTitleInput",d.title); set("articleIntroInput",d.intro); set("articleSpaceInput",d.space); set("articleTagsInput",(d.tags||[]).join(", ")); set("articleStatusInput",d.status||"draft"); set("articleSourcesInput",(d.sources||[]).join("\n")); set("articleContentInput",d.content); set("articleFontFamily",design.fontFamily); set("articleTitleSize",design.titleSize); set("articleBodySize",design.bodySize); set("articleAccentColor",design.accent); set("articleCoverPosition",design.coverPosition); set("articleCoverZoom",design.coverZoom); set("articleSymbolInput",design.symbol);
        document.getElementById("articleStudioTitle").textContent=d.id?"تحرير المقال":"إنشاء مقال";
        document.querySelectorAll("[data-cover-style]").forEach(b=>b.classList.toggle("active",b.dataset.coverStyle===(design.coverStyle||"image")));
        document.getElementById("articleAccentValue")?.replaceChildren(document.createTextNode(design.accent));
        document.getElementById("articleTitleSizeValue")?.replaceChildren(document.createTextNode(`${design.titleSize}px`));
        document.getElementById("articleBodySizeValue")?.replaceChildren(document.createTextNode(`${design.bodySize}px`));
        document.getElementById("articleCoverZoomValue")?.replaceChildren(document.createTextNode(`${design.coverZoom}%`));
        this.renderUploadPreview("coverPreview",design.coverImage,"▧","لا توجد صورة");
        this.renderUploadPreview("logoPreview",design.logoImage,design.symbol||"◎","رمز افتراضي");
        this.updateArticleStats(); this.updateArticlePreview();
    },

    syncArticleDraftFromForm() {
        if(!this.state.articleDraft) return;
        const d=this.state.articleDraft, design={...this.defaultArticleDesign(),...(d.design||{})};
        const get=id=>document.getElementById(id)?.value || "";
        d.title=get("articleTitleInput").trim(); d.intro=get("articleIntroInput").trim(); d.space=get("articleSpaceInput").trim(); d.tags=get("articleTagsInput").split(",").map(x=>x.trim()).filter(Boolean); d.status=get("articleStatusInput")||"draft"; d.sources=get("articleSourcesInput").split(/[\n,]/).map(x=>x.trim()).filter(Boolean); d.content=get("articleContentInput");
        design.fontFamily=get("articleFontFamily")||"Cairo"; design.titleSize=Number(get("articleTitleSize"))||46; design.bodySize=Number(get("articleBodySize"))||18; design.accent=get("articleAccentColor")||this.state.colors.cyan; design.coverPosition=get("articleCoverPosition")||"center"; design.coverZoom=Number(get("articleCoverZoom"))||100; design.symbol=get("articleSymbolInput")||"◎"; d.design=design;
        document.getElementById("articleAccentValue")?.replaceChildren(document.createTextNode(design.accent));
        document.getElementById("articleTitleSizeValue")?.replaceChildren(document.createTextNode(`${design.titleSize}px`));
        document.getElementById("articleBodySizeValue")?.replaceChildren(document.createTextNode(`${design.bodySize}px`));
        document.getElementById("articleCoverZoomValue")?.replaceChildren(document.createTextNode(`${design.coverZoom}%`));
        this.updateArticleStats(); this.updateArticlePreview();
    },

    setArticleDraftValue(key,value){if(!this.state.articleDraft)return; this.state.articleDraft.design={...this.defaultArticleDesign(),...(this.state.articleDraft.design||{})}; this.state.articleDraft.design[key]=value;},

    handleArticleImage(file,key){
        if(!file || !this.state.articleDraft) return;
        if(!file.type.startsWith("image/")){this.showToast("ملف غير صالح","اختر صورة بصيغة PNG أو JPG أو WebP.");return;}
        if(file.size>6*1024*1024){this.showToast("الصورة كبيرة","اختر صورة أقل من 6MB.");return;}
        const reader=new FileReader();
        reader.onload=()=>{
            const img=new Image(); img.onload=()=>{
                const max=1400, scale=Math.min(1,max/Math.max(img.width,img.height)); const canvas=document.createElement("canvas"); canvas.width=Math.max(1,Math.round(img.width*scale)); canvas.height=Math.max(1,Math.round(img.height*scale)); const ctx=canvas.getContext("2d"); ctx.drawImage(img,0,0,canvas.width,canvas.height); const data=canvas.toDataURL("image/webp",.82); this.setArticleDraftValue(key,data); this.renderUploadPreview(key==="coverImage"?"coverPreview":"logoPreview",data,key==="coverImage"?"▧":"◎",key==="coverImage"?"لا توجد صورة":"رمز افتراضي"); this.updateArticlePreview(); };
            img.src=reader.result;
        }; reader.readAsDataURL(file);
    },

    renderUploadPreview(id,data,fallback,label){const el=document.getElementById(id); if(!el)return; el.innerHTML=data?`<img src="${data}" alt="">`:`<span>${this.escapeHTML(fallback)}</span><small>${label}</small>`;},
    removeArticleCover(){if(!this.state.articleDraft)return;this.setArticleDraftValue("coverImage","");this.renderUploadPreview("coverPreview","","▧","لا توجد صورة");this.updateArticlePreview();},
    removeArticleLogo(){if(!this.state.articleDraft)return;this.setArticleDraftValue("logoImage","");this.renderUploadPreview("logoPreview","",this.state.articleDraft.design?.symbol||"◎","رمز افتراضي");this.updateArticlePreview();},

    switchArticleTab(tab){document.querySelectorAll("[data-article-tab]").forEach(b=>b.classList.toggle("active",b.dataset.articleTab===tab));document.querySelectorAll("[data-article-panel]").forEach(p=>p.classList.toggle("active",p.dataset.articlePanel===tab));if(tab==="preview")this.updateArticlePreview();},
    setPreviewMode(mode){document.querySelectorAll("[data-preview-mode]").forEach(b=>b.classList.toggle("active",b.dataset.previewMode===mode));const shell=document.getElementById("articlePreviewShell");shell?.classList.remove("preview-card-mode","preview-mobile-mode");if(mode==="card")shell?.classList.add("preview-card-mode");if(mode==="mobile")shell?.classList.add("preview-mobile-mode");},

    updateArticleStats(){const d=this.state.articleDraft;if(!d)return;const words=this.countWords(d.content||"");const wc=document.getElementById("articleWordCount"),rt=document.getElementById("articleReadTime");if(wc)wc.textContent=words;if(rt)rt.textContent=this.readTime(words);},
    countWords(text){return String(text||"").trim().split(/\s+/).filter(Boolean).length;},
    readTime(words){if(!words)return"أقل من دقيقة";const mins=Math.max(1,Math.ceil(words/220));return `${mins} دقيقة قراءة`;},

    updateArticlePreview(){
        const d=this.state.articleDraft;if(!d)return;const design={...this.defaultArticleDesign(),...(d.design||{})};
        const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;}; set("previewTitle",d.title||"عنوان المقال");set("previewIntro",d.intro||"ستظهر المقدمة هنا.");set("previewSpace",d.space||"TALKSPACE");set("previewStatus",({draft:"مسودة",review:"قيد المراجعة",published:"منشور"})[d.status]||"مسودة");set("previewReadTime",this.readTime(this.countWords(d.content||"")));document.getElementById("previewContent").textContent=d.content||"اكتب محتوى المقال لتظهر المعاينة.";
        const cover=document.getElementById("previewCover"), logo=document.getElementById("previewLogo"), article=document.getElementById("articlePreview"); if(!cover||!logo||!article)return;
        cover.style.backgroundImage=design.coverImage && design.coverStyle!=="none" ? `url("${design.coverImage}")` : ""; cover.style.backgroundPosition=design.coverPosition; cover.style.backgroundSize=`${design.coverZoom}%`; cover.style.setProperty("--article-accent",design.accent); if(design.coverStyle==="gradient"||design.coverStyle==="image-gradient") cover.classList.add("gradient-cover"); else cover.classList.remove("gradient-cover"); logo.innerHTML=design.logoImage?`<img src="${design.logoImage}" alt="">`:this.escapeHTML(design.symbol||"◎"); article.style.setProperty("--article-accent",design.accent);article.style.setProperty("--article-font",design.fontFamily);article.style.setProperty("--article-title-size",`${design.titleSize}px`);article.style.setProperty("--article-body-size",`${design.bodySize}px`);
    },

    saveArticleFromStudio(){
        this.syncArticleDraftFromForm(); const d=this.state.articleDraft;if(!d||!d.title){this.showToast("أحتاج عنوانًا","اكتب عنوان المقال قبل الحفظ.");this.switchArticleTab("content");document.getElementById("articleTitleInput")?.focus();return;}
        const now=new Date().toISOString();d.updatedAt=now;
        if(this.state.articleEditingId){const index=this.state.articles.findIndex(a=>Number(a.id)===Number(this.state.articleEditingId));if(index>=0)this.state.articles[index]=d;}
        else{d.id=Date.now();d.createdAt=now;this.state.articles.unshift(d);}
        this.addActivity(d.title,"article");this.saveState();this.renderArticles();this.closeArticleStudio();this.navigate("articles");this.showToast("تم حفظ المقال","حُفظ المقال مع هويته البصرية وتنسيقه.");
    },

    handleArticleAction(action,button){const id=Number(button?.dataset.id);const article=this.state.articles.find(a=>Number(a.id)===id);if(!article)return;
        if(action==="edit"){this.openArticleStudio(id);return;}
        if(action==="preview"){this.openArticleStudio(id);this.switchArticleTab("preview");return;}
        if(action==="delete"){if(!confirm("هل تريد حذف هذا المقال؟"))return;this.state.articles=this.state.articles.filter(a=>Number(a.id)!==id);this.saveState();this.renderArticles();this.showToast("تم حذف المقال","أزيل المقال من مساحة العمل.");return;}
        if(action==="advance"){article.status=article.status==="draft"?"review":article.status==="review"?"published":"published";article.updatedAt=new Date().toISOString();this.saveState();this.renderArticles();this.showToast("تم تحديث الحالة",({draft:"أرسل للمراجعة.",review:"تم نشر المقال.",published:"المقال منشور بالفعل."})[article.status]);}
    },

    renderIdeas() {

        const list =
            document.getElementById("ideasList");

        if (!list) return;

        const ideas =
            Array.isArray(this.state.ideas)
                ? this.state.ideas
                : [];

        const query =
            (this.state.ideaSearch || "")
                .trim()
                .toLowerCase();

        const filtered =
            ideas.filter(idea => {

                const matchesFilter =
                    this.state.ideaFilter === "all" ||
                    idea.status === this.state.ideaFilter;

                const haystack = [
                    idea.title,
                    idea.details,
                    idea.space,
                    ...(idea.tags || [])
                ]
                    .join(" ")
                    .toLowerCase();

                return matchesFilter &&
                    (!query || haystack.includes(query));
            });

        const counts = {
            all: ideas.length,
            raw: ideas.filter(i => i.status === "raw").length,
            developing: ideas.filter(i => i.status === "developing").length,
            ready: ideas.filter(i => i.status === "ready").length,
            converted: ideas.filter(i => i.status === "converted").length
        };

        Object.entries(counts).forEach(([key, value]) => {

            const element =
                document.getElementById(
                    `ideaCount${key.charAt(0).toUpperCase()}${key.slice(1)}`
                );

            if (element) {
                element.textContent = value;
            }
        });

        const searchInput =
            document.getElementById("ideasSearch");

        if (searchInput &&
            searchInput.value !== (this.state.ideaSearch || "")) {
            searchInput.value =
                this.state.ideaSearch || "";
        }

        document
            .querySelectorAll("[data-idea-filter]")
            .forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.ideaFilter ===
                    this.state.ideaFilter
                );
            });

        if (!ideas.length) {

            list.innerHTML = `
                <div class="ideas-empty">
                    <div class="ideas-empty-eye">✦</div>
                    <span class="section-kicker">NO IDEAS YET</span>
                    <h2>صندوقك ما زال ينتظر أول فكرة.</h2>
                    <p>
                        لا تحاول ترتيب كل شيء قبل أن تكتبه.
                        التقط الفكرة أولًا، وسنرتبها معًا لاحقًا.
                    </p>
                    <button class="primary-button"
                            data-action="capture"
                            data-type="idea">
                        ＋ التقط أول فكرة
                    </button>
                </div>
            `;

            return;
        }

        if (!filtered.length) {

            list.innerHTML = `
                <div class="ideas-empty compact">
                    <div class="ideas-empty-eye">⌕</div>
                    <h2>لا توجد نتائج مطابقة.</h2>
                    <p>جرّب كلمة أخرى أو غيّر حالة التصفية.</p>
                    <button class="secondary-button"
                            data-idea-action="clear-search">
                        مسح البحث
                    </button>
                </div>
            `;

            return;
        }

        list.innerHTML = filtered.map(idea => {

            const statusName =
                this.getIdeaStatusName(idea.status);

            const nextStatus =
                this.getIdeaStatusNext(idea.status);

            const tags =
                (idea.tags || [])
                    .slice(0, 5)
                    .map(tag => `
                        <span class="idea-tag">
                            ${this.escapeHTML(tag)}
                        </span>
                    `)
                    .join("");

            const nextButton =
                idea.status !== "converted"
                    ? `
                        <button class="idea-action primary-mini"
                                data-idea-action="advance"
                                data-id="${idea.id}">
                            ${nextStatus === "developing"
                                ? "بدء التطوير"
                                : nextStatus === "ready"
                                    ? "جاهزة للنشر"
                                    : "تحويل إلى مقال"}
                        </button>
                    `
                    : `
                        <button class="idea-action primary-mini"
                                data-idea-action="convert"
                                data-id="${idea.id}">
                            فتح كمسودة مقال
                        </button>
                    `;

            return `
                <article class="idea-card" data-idea-id="${idea.id}">

                    <div class="idea-card-top">
                        <span class="idea-mark">✦</span>

                        <div class="idea-status status-${this.escapeHTML(idea.status)}">
                            <span></span>
                            ${this.escapeHTML(statusName)}
                        </div>
                    </div>

                    <h3>${this.escapeHTML(idea.title)}</h3>

                    ${
                        idea.details
                            ? `<p>${this.escapeHTML(idea.details)}</p>`
                            : `<p class="idea-no-details">لا توجد تفاصيل إضافية بعد.</p>`
                    }

                    <div class="idea-meta">
                        ${
                            idea.space
                                ? `<span>⬡ ${this.escapeHTML(idea.space)}</span>`
                                : `<span>◷ ${this.formatDate(idea.createdAt)}</span>`
                        }
                        ${
                            idea.space
                                ? `<span>◷ ${this.formatDate(idea.createdAt)}</span>`
                                : ""
                        }
                    </div>

                    ${
                        tags
                            ? `<div class="idea-tags">${tags}</div>`
                            : ""
                    }

                    <div class="idea-card-footer">
                        <div class="idea-actions">
                            ${nextButton}

                            <button class="idea-action"
                                    data-idea-action="edit"
                                    data-id="${idea.id}">
                                تعديل
                            </button>

                            <button class="idea-action danger-mini"
                                    data-idea-action="delete"
                                    data-id="${idea.id}">
                                حذف
                            </button>
                        </div>

                        <span class="idea-id">
                            TS-${String(idea.id).slice(-5)}
                        </span>
                    </div>

                </article>
            `;
        }).join("");
    },


    handleIdeaAction(action, element) {

        const id =
            Number(element?.dataset.id);

        if (action === "clear-search") {

            this.state.ideaSearch = "";

            const input =
                document.getElementById("ideasSearch");

            if (input) input.value = "";

            this.renderIdeas();
            this.saveState();
            return;
        }

        if (!id) return;

        const idea =
            this.state.ideas.find(
                item => Number(item.id) === id
            );

        if (!idea) return;

        switch (action) {

            case "advance":
                this.advanceIdea(idea);
                break;

            case "convert":
                this.convertIdeaToArticle(idea);
                break;

            case "edit":
                this.editIdea(idea);
                break;

            case "delete":
                this.deleteIdea(idea);
                break;
        }
    },


    advanceIdea(idea) {

        if (idea.status === "ready") {

            this.convertIdeaToArticle(idea);
            return;
        }

        if (idea.status === "converted") {
            this.convertIdeaToArticle(idea);
            return;
        }

        const previous =
            this.getIdeaStatusName(idea.status);

        idea.status =
            this.getIdeaStatusNext(idea.status);

        idea.updatedAt =
            new Date().toISOString();

        this.addActivity(
            idea.title,
            "idea"
        );

        this.saveState();
        this.renderIdeas();

        this.showToast(
            "تم تحديث الفكرة",
            `${previous} → ${this.getIdeaStatusName(idea.status)}`
        );
    },


    editIdea(idea) {

        this.setCaptureType("idea");

        document.getElementById(
            "captureInput"
        ).value = idea.title;

        document.getElementById(
            "captureDetails"
        ).value = idea.details || "";

        const tags =
            document.getElementById("captureTags");

        const space =
            document.getElementById("captureSpace");

        if (tags) {
            tags.value =
                (idea.tags || []).join(", ");
        }

        if (space) {
            space.value =
                idea.space || "";
        }

        const saveButton =
            document.querySelector(
                '[data-action="save-capture"]'
            );

        if (saveButton) {
            saveButton.dataset.editIdeaId =
                idea.id;
        }

        this.openCapture("idea");

        this.showToast(
            "تعديل الفكرة",
            "عدّل المحتوى ثم اضغط حفظ."
        );
    },


    deleteIdea(idea) {

        const confirmed =
            confirm(
                `حذف الفكرة "${idea.title}"؟`
            );

        if (!confirmed) return;

        this.state.ideas =
            this.state.ideas.filter(
                item => Number(item.id) !==
                    Number(idea.id)
            );

        this.saveState();
        this.renderIdeas();

        this.showToast(
            "تم حذف الفكرة",
            "تمت إزالتها من صندوق الأفكار."
        );
    },


    convertIdeaToArticle(idea) {

        if (!Array.isArray(this.state.articles)) {
            this.state.articles = [];
        }

        const existing =
            this.state.articles.find(
                article =>
                    Number(article.sourceIdeaId) ===
                    Number(idea.id)
            );

        if (existing) {

            this.navigate("articles");

            this.showToast(
                "المقال موجود",
                "تم إنشاء مسودة من هذه الفكرة سابقًا."
            );

            return;
        }

        const article = {
            id: Date.now(),
            sourceIdeaId: idea.id,
            title: idea.title,
            intro: idea.details || "",
            content: "",
            space: idea.space || "",
            tags: [...(idea.tags || [])],
            sources: [],
            status: "draft",
            createdAt: new Date().toISOString()
        };

        this.state.articles.unshift(article);

        idea.status = "converted";
        idea.updatedAt = new Date().toISOString();

        this.addActivity(
            idea.title,
            "article"
        );

        this.saveState();

        this.navigate("articles");

        this.showToast(
            "تم تحويل الفكرة",
            "أصبحت لديك مسودة مقال مرتبطة بها."
        );
    },



    /* =====================================================
       MOBILE
       ===================================================== */

    toggleSidebar() {

        document
            .getElementById("sidebar")
            .classList.toggle("open");

        document
            .getElementById("mobileOverlay")
            .classList.toggle("open");

    },


    closeSidebar() {

        document
            .getElementById("sidebar")
            .classList.remove("open");

        document
            .getElementById("mobileOverlay")
            .classList.remove("open");

    },


    /* =====================================================
       FOCUS MODE
       ===================================================== */

    focusMode() {

        this.showToast(
            "Focus Mode",
            "وضع التركيز الكامل سيضاف في المرحلة التالية."
        );

    },


    /* =====================================================
       KEYBOARD
       ===================================================== */

    handleKeyboard(event) {

        /* ESC */

        if (event.key === "Escape") {

            this.closeCapture();
            this.closeCommand();
            this.closeNotifications();
            this.closeStudio();
            this.closeSidebar();

            return;

        }


        /* CTRL + K / CMD + K */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            this.openCommand();

        }

    },


    /* =====================================================
       RENDER
       ===================================================== */

    render() {

        this.navigate(
            this.state.activeView || "home"
        );

        this.renderActivity();
        this.renderIdeas();
        this.renderArticles();

    },


    /* =====================================================
       TOAST
       ===================================================== */

    showToast(title, message) {

        const toast =
            document.getElementById("toast");

        if (!toast) return;

        document.getElementById(
            "toastTitle"
        )?.replaceChildren(document.createTextNode(title));

        document.getElementById(
            "toastMessage"
        )?.replaceChildren(document.createTextNode(message));

        toast.classList.add("show");


        clearTimeout(
            this.toastTimer
        );


        this.toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3200);

    },


    /* =====================================================
       SECURITY
       ===================================================== */

    escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

};


/* =========================================================
   START APP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => App.init()
);
