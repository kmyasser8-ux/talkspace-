// فتح وإغلاق لوحة التحكم
function toggleCustomizer() {
    const panel = document.getElementById('customizer-panel');
    if (panel) panel.classList.toggle('hidden');
}

// إظهار الإشعارات السريعة (Toast)
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const msgSpan = document.getElementById('toast-message');
    if (toast && msgSpan) {
        msgSpan.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}

function triggerCardAction(msg) { showToast(msg); }
function runTool(toolName) { showToast(`جاري تشغيل: ${toolName}...`); }

document.addEventListener('DOMContentLoaded', () => {

    // 1. التنقل السليم والتفاعلي بين التبويبات (Navigation Tabs)
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(targetId)?.classList.add('active');
        });
    });

    // 2. تفعيل زر الوضع الليلي/النهاري
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeLabel = document.getElementById('theme-mode-label');
    const themeIcon = document.getElementById('theme-mode-icon');

    themeBtn?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('talkspace_theme_mode', newTheme);

        if (themeLabel) themeLabel.textContent = newTheme === 'light' ? 'فاتح' : 'داكن';
        if (themeIcon) themeIcon.className = newTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        showToast(`تم التغيير للوضع ${newTheme === 'light' ? 'النهاري' : 'الليلي'}`);
    });

    // 3. تفعيل الألوان والضباب والخطوط
    const primaryPicker = document.getElementById('primary-color-picker');
    primaryPicker?.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
        localStorage.setItem('talkspace_primary', e.target.value);
    });

    const blurRange = document.getElementById('blur-range');
    blurRange?.addEventListener('input', (e) => {
        document.documentElement.style.setProperty('--glass-blur', e.target.value + 'px');
    });

    const fontSelect = document.getElementById('font-family-select');
    fontSelect?.addEventListener('change', (e) => {
        document.body.style.fontFamily = e.target.value;
    });

    // 4. زر الإشعارات العلوي
    document.getElementById('user-alert-btn')?.addEventListener('click', () => {
        showToast('لا توجد إشعارات جديدة حالياً.');
    });

    // 5. زر إعادة الضبط
    document.getElementById('reset-theme-btn')?.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });
});
