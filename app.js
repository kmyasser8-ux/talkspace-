/* ==========================================================================
   TalkSpace Platform - Logic & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. الجزء البرمجي الخاص بإدارة الأولويات (Task & Priorities Logic)
    // ==========================================================================
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // جلب الأولويات المخزنة سابقاً أو إنشاء قائمة فارغة
    let tasks = JSON.parse(localStorage.getItem('talkspace_tasks')) || [];

    // دالة عرض المهام في الواجهة
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.priority}`;
            li.innerHTML = `
                <span>${task.text}</span>
                <button onclick="removeTask(${index})" style="background:none; border:none; color: var(--priority-high);">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            taskList.appendChild(li);
        });
        // حفظ القائمة في المتصفح تلقائياً
        localStorage.setItem('talkspace_tasks', JSON.stringify(tasks));
    }

    // إضافة مهمة جديدة عند الضغط على الزر
    addTaskBtn.addEventListener('click', () => {
        if (!taskInput.value.trim()) return; // حماية من إضافة نص فارغ
        tasks.push({ text: taskInput.value, priority: prioritySelect.value });
        taskInput.value = ''; // تفريغ الخانة بعد الإضافة
        renderTasks();
    });

    // دالة حذف أولوية محددة
    window.removeTask = (index) => {
        tasks.splice(index, 1);
        renderTasks();
    };

    renderTasks(); // تشغيل العرض الأولي عند فتح الصفحة

    // ==========================================================================
    // 2. الجزء البرمجي الخاص بلوحة الرسم (Canvas Logic)
    // ==========================================================================
    const canvas = document.getElementById('paint-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('brush-color');
    const sizePicker = document.getElementById('brush-size');
    const clearBtn = document.getElementById('clear-canvas');
    const downloadBtn = document.getElementById('download-canvas');

    let painting = false;

    // بدء الرسم عند ضغط زر الماوس
    function startPosition(e) {
        painting = true;
        draw(e);
    }

    // إيقاف الرسم عند رفع زر الماوس
    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    // تنفيذ عملية الرسم وتتبع المؤشر
    function draw(e) {
        if (!painting) return;
        const rect = canvas.getBoundingClientRect();
        
        ctx.lineWidth = sizePicker.value;      // تطبيق سمك الفرشاة المختار
        ctx.lineCap = 'round';                // جعل حواف الخط دائرية
        ctx.strokeStyle = colorPicker.value;  // تطبيق اللون المختار

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    // الاستماع لأحداث الماوس للرسم
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);

    // مسح لوحة الرسم
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // تحميل اللوحة كصورة بصيغة PNG
    downloadBtn.addEventListener('click', () => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'TalkSpace-Sketch.png';
        link.click();
    });

    // ==========================================================================
    // 3. الجزء البرمجي الخاص بنشر وحفظ المقالات (Publish & Drafts)
    // ==========================================================================
    const draftTitle = document.getElementById('article-title');
    const draftBody = document.getElementById('article-body');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const publishGithubBtn = document.getElementById('publish-github-btn');

    // استرجاع المسودة المخزنة فور فتح الصفحة
    draftTitle.value = localStorage.getItem('talkspace_draft_title') || '';
    draftBody.value = localStorage.getItem('talkspace_draft_body') || '';

    // حفظ المسودة في التخزين المحلي للمتصفح
    saveDraftBtn.addEventListener('click', () => {
        localStorage.setItem('talkspace_draft_title', draftTitle.value);
        localStorage.setItem('talkspace_draft_body', draftBody.value);
        alert('تم حفظ المسودة بنجاح في TalkSpace!');
    });

    // توجيه النص لنشره مباشرة كـ Issue في GitHub
    publishGithubBtn.addEventListener('click', () => {
        const title = encodeURIComponent(draftTitle.value);
        const body = encodeURIComponent(draftBody.value);
        
        if (!title) { 
            alert('يرجى كتابة عنوان المقال أولاً'); 
            return; 
        }
        
        /* 
          تنبيه للتعديل المستقبلي: 
          قم باستبدال YOUR_USERNAME باسم حسابك، و YOUR_REPO باسم المودع الخاص بك على GitHub
        */
        const githubUrl = `https://github.com/YOUR_USERNAME/YOUR_REPO/issues/new?title=${title}&body=${body}`;
        window.open(githubUrl, '_blank');
    });

}); 
// ==========================================
// تفعيل أزرار الأيقونات للتنقل بين الأقسام
// ==========================================
document.querySelectorAll('.icon-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // منع القفز المباشر السريع
        
        // جلب معرف القسم المطلوب من خاصية href
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // التمرير السلس إلى القسم المحدد
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// --- كود فتح وإغلاق لوحة التحكم بشكل مضمون ---
document.addEventListener('DOMContentLoaded', () => {
    const customizerPanel = document.getElementById('customizer-panel');
    const toggleBtn = document.getElementById('toggle-customizer-btn');
    const closeBtn = document.getElementById('close-customizer-btn');

    // 1. زر الفتح والتبديل
    if (toggleBtn && customizerPanel) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            customizerPanel.classList.toggle('hidden');
        });
    }

    // 2. زر الإغلاق داخل اللوحة
    if (closeBtn && customizerPanel) {
        closeBtn.addEventListener('click', () => {
            customizerPanel.classList.add('hidden');
        });
    }

    // 3. إغلاق اللوحة عند النقر خارجها (اختياري وسلس)
    document.addEventListener('click', (e) => {
        if (customizerPanel && 
            !customizerPanel.contains(e.target) && 
            !toggleBtn?.contains(e.target) && 
            !customizerPanel.classList.contains('hidden')) {
            customizerPanel.classList.add('hidden');
        }
    });
});

    // 1. تغيير لون التوهج النيون
    primaryColorPicker?.addEventListener('input', (e) => {
        const color = e.target.value;
        document.documentElement.style.setProperty('--border-section-1', color);
        localStorage.setItem('talkspace_custom_primary', color);
    });

    // 2. تغيير لون الخلفية
    bgColorPicker?.addEventListener('input', (e) => {
        const color = e.target.value;
        document.body.style.backgroundColor = color;
        localStorage.setItem('talkspace_custom_bg', color);
    });

   const fontSelect = document.getElementById('font-family-select');

fontSelect?.addEventListener('change', (e) => {
    const selectedFont = e.target.value;
    document.body.style.fontFamily = selectedFont;
    localStorage.setItem('talkspace_custom_font', selectedFont);
});

// استرجاع الخط المحفوظ فور فتح الصفحة
const savedFont = localStorage.getItem('talkspace_custom_font');
if (savedFont) {
    document.body.style.fontFamily = savedFont;
    if (fontSelect) fontSelect.value = savedFont;
}

    // 4. تغيير حجم الخط
    fontSizeRange?.addEventListener('input', (e) => {
        const size = e.target.value + 'px';
        document.body.style.fontSize = size;
        localStorage.setItem('talkspace_custom_fontsize', size);
    });

    // 5. تحميل التفضيلات المحفوظة تلقائياً عند فتح الصفحة
    function loadSavedTheme() {
        const savedPrimary = localStorage.getItem('talkspace_custom_primary');
        const savedBg = localStorage.getItem('talkspace_custom_bg');
        const savedFont = localStorage.getItem('talkspace_custom_font');
        const savedFontSize = localStorage.getItem('talkspace_custom_fontsize');

        if (savedPrimary) {
            document.documentElement.style.setProperty('--border-section-1', savedPrimary);
            if (primaryColorPicker) primaryColorPicker.value = savedPrimary;
        }
        if (savedBg) {
            document.body.style.backgroundColor = savedBg;
            if (bgColorPicker) bgColorPicker.value = savedBg;
        }
        if (savedFont) {
            document.body.style.fontFamily = savedFont;
            if (fontSelect) fontSelect.value = savedFont;
        }
        if (savedFontSize) {
            document.body.style.fontSize = savedFontSize;
            if (fontSizeRange) fontSizeRange.value = parseInt(savedFontSize);
        }
    }

    // 6. استعادة الإعدادات الافتراضية
    resetBtn?.addEventListener('click', () => {
        localStorage.removeItem('talkspace_custom_primary');
        localStorage.removeItem('talkspace_custom_bg');
        localStorage.removeItem('talkspace_custom_font');
        localStorage.removeItem('talkspace_custom_fontsize');
        location.reload();
    });

    loadSavedTheme();
});

document.addEventListener('DOMContentLoaded', () => {
    const bgUrlInput = document.getElementById('bg-url-input');
    const applyUrlBtn = document.getElementById('apply-url-btn');
    const bgFileInput = document.getElementById('bg-file-input');
    const removeBgBtn = document.getElementById('remove-bg-btn');

    // دالة تنفيذ وتطبيق الخلفية
    function processAndApplyUrl() {
        const url = bgUrlInput.value.trim();
        if (url) {
            applyBackgroundImage(`url("${url}")`);
            localStorage.setItem('talkspace_custom_bg_img', `url("${url}")`);
        }
    }

    // 1. التطبيق عند الضغط على زر "تطبيق" المباشر
    applyUrlBtn?.addEventListener('click', processAndApplyUrl);

    // 2. التطبيق التلقائي اللحظي فور اللصق (input)
    bgUrlInput?.addEventListener('input', processAndApplyUrl);

    // 3. تطبيق عند رفع صورة من الجهاز
    bgFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imgData = `url("${event.target.result}")`;
                applyBackgroundImage(imgData);
                try {
                    localStorage.setItem('talkspace_custom_bg_img', imgData);
                } catch (err) {
                    alert('حجم الصورة كبير جداً للحفظ الدائم!');
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. إزالة الخلفية
    removeBgBtn?.addEventListener('click', () => {
        document.body.style.backgroundImage = 'none';
        localStorage.removeItem('talkspace_custom_bg_img');
        if (bgUrlInput) bgUrlInput.value = '';
    });

    function applyBackgroundImage(bgValue) {
        document.body.style.backgroundImage = bgValue;
    }

    // استرجاع الخلفية عند التحديث
    const savedBgImg = localStorage.getItem('talkspace_custom_bg_img');
    if (savedBgImg) {
        applyBackgroundImage(savedBgImg);
    }
});
    // 2. تطبيق خلفية مرفوعة من جهاز الحاسوب (Base64)
    bgFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imgData = `url("${event.target.result}")`;
                applyBackgroundImage(imgData);
                try {
                    localStorage.setItem('talkspace_custom_bg_img', imgData);
                } catch (err) {
                    alert('حجم الصورة كبير جداً للحفظ الدائم!');
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. إزالة صورة الخلفية
    removeBgBtn?.addEventListener('click', () => {
        document.body.style.backgroundImage = 'none';
        localStorage.removeItem('talkspace_custom_bg_img');
        if (bgUrlInput) bgUrlInput.value = '';
    });

    // دالة مساعدة للتطبيق
    function applyBackgroundImage(bgValue) {
        document.body.style.backgroundImage = bgValue;
    }

    // 4. استرجاع الخلفية المحفوظة فور فتح الصفحة
    const savedBgImg = localStorage.getItem('talkspace_custom_bg_img');
    if (savedBgImg) {
        applyBackgroundImage(savedBgImg);
    }
});
