// فتح وإغلاق استوديو التحكم
function openStudioDrawer() {
    document.getElementById('studio-drawer')?.classList.remove('hidden');
}

function closeStudioDrawer() {
    document.getElementById('studio-drawer')?.classList.add('hidden');
}

// عرض رسائل الإشعار الفورية
function showNotification(msg) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (toast && toastText) {
        toastText.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}

function executeCardTask(text) { showNotification(text); }
function runConsoleCmd(cmd) { showNotification(`تم تنفيذ الأمر: ${cmd}`); }

document.addEventListener('DOMContentLoaded', () => {

    // 1. التنقل بين أزرار التبويبات بالكامل
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            navTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(target)?.classList.add('active');
        });
    });

    // 2. تفعيل وإغلاق الاستوديو
    document.getElementById('open-studio-btn')?.addEventListener('click', () => {
        document.getElementById('studio-drawer')?.classList.toggle('hidden');
    });

    document.getElementById('close-studio-btn')?.addEventListener('click', closeStudioDrawer);

    // 3. زر التبديل السريع بين الوضع الداكن والفاتح
    const quickThemeBtn = document.getElementById('quick-theme-btn');
    const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
    const themeLabelText = document.getElementById('theme-label-text');

    function toggleAppTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('talkspace_theme', nextTheme);

        if (themeLabelText) themeLabelText.textContent = nextTheme === 'light' ? 'الوضع النهاري' : 'الوضع الداكن';
        showNotification(`تم التبديل إلى ${nextTheme === 'light' ? 'الوضع النهاري' : 'الوضع الداكن'}`);
    }

    quickThemeBtn?.addEventListener('click', toggleAppTheme);
    drawerThemeToggle?.addEventListener('click', toggleAppTheme);

    // 4. محاكي العدادات المباشرة لمركز الرصد
    document.getElementById('start-metrics-btn')?.addEventListener('click', () => {
        let val1 = 0;
        const interval = setInterval(() => {
            val1 += 5;
            document.getElementById('counter-1').textContent = val1 + '%';
            document.getElementById('counter-2').textContent = Math.floor(val1 * 1.2);
            document.getElementById('counter-3').textContent = (val1 * 0.4).toFixed(1) + ' GB';

            if (val1 >= 95) {
                clearInterval(interval);
                showNotification('تم تحديث القياسات بنجاح!');
            }
        }, 30);
    });

    // 5. تخصيص لون التوهج النيوني
    document.getElementById('primary-color')?.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
        localStorage.setItem('talkspace_color', e.target.value);
    });

    // 6. التحكم بضباب الشفافية
    document.getElementById('blur-slider')?.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--glass-blur', e.target.value + 'px');
    });

    // 7. تطبيق خلفية مخصصة
    document.getElementById('apply-bg-btn')?.addEventListener('click', () => {
        const url = document.getElementById('bg-url')?.value.trim();
        if (url) {
            document.body.style.backgroundImage = `url("${url}")`;
            showNotification('تم تطبيق الخلفية الجديدة!');
        }
    });

    // 8. زر التنبيهات علوياً
    document.getElementById('bell-btn')?.addEventListener('click', () => {
        showNotification('لا توجد تنبيهات جديدة في الوقت الحالي.');
    });

    // 9. إرجاع الضبط
    document.getElementById('reset-all-btn')?.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });
});
