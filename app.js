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
                }

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


        if (!title) {

            this.showToast(
                "أحتاج عنوانًا",
                "اكتب عنوانًا قبل الحفظ."
            );

            document
                .getElementById(
                    "captureInput"
                )
                .focus();

            return;

        }


        const item = {

            id: Date.now(),

            type: this.state.captureType,

            title,

            details,

            createdAt:
                new Date().toISOString()

        };


        this.state.items.unshift(item);


        this.addActivity(
            title,
            this.state.captureType
        );


        this.saveState();

        this.closeCapture();

        this.showToast(
            "تم الحفظ",
            `${this.getTypeName(
                this.state.captureType
            )} أضيفت إلى مساحة العمل.`
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
            )
            .classList.remove("open");

    },


    /* =====================================================
       STUDIO
       ===================================================== */

    openStudio() {

        document
            .getElementById(
                "studioPanel"
            )
            .classList.add("open");

    },


    closeStudio() {

        document
            .getElementById(
                "studioPanel"
            )
            .classList.remove("open");

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

    },


    /* =====================================================
       TOAST
       ===================================================== */

    showToast(title, message) {

        const toast =
            document.getElementById("toast");

        document.getElementById(
            "toastTitle"
        ).textContent = title;

        document.getElementById(
            "toastMessage"
        ).textContent = message;


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
