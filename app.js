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
