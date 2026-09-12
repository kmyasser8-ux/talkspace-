function toggleCustomizer() {
    const panel = document.getElementById('customizer-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // العناصر الأساسية
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeModeLabel = document.getElementById('theme-mode-label');
    const themeModeIcon = document.getElementById('theme-mode-icon');
    const primaryColorPicker = document.getElementById('primary-color-picker');
    const blurRange = document.getElementById('blur-range');
    const fontSelect = document.getElementById('font-family-select');
    const fontSizeRange = document.getElementById('font-size-range');
    const bgUrlInput = document.getElementById('bg-url-input');
    const applyUrlBtn = document.getElementById('apply-url-btn');
    const bgFileInput = document.getElementById('bg-file-input');
    const removeBgBtn = document.getElementById('remove-bg-btn');
    const resetBtn = document.getElementById('reset-theme-btn');

    // 1. التبديل بين الوضع الليلي والنهاري (Dark / Light Mode)
    themeToggleBtn?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('talkspace_theme_mode', newTheme);
        updateThemeUI(newTheme);
    });

    function updateThemeUI(mode) {
        if (mode === 'light') {
            if (themeModeLabel) themeModeLabel.textContent = 'فاتح';
            if (themeModeIcon) themeModeIcon.className = 'fa-solid fa-sun';
        } else {
            if (themeModeLabel) themeModeLabel.textContent = 'داكن';
            if (themeModeIcon) themeModeIcon.className = 'fa-solid fa-moon';
        }
    }

    // 2. لون التوهج (Neon Color)
    primaryColorPicker?.addEventListener('input', (e) => {
        const color = e.target.value;
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('talkspace_primary_color', color);
    });

    // 3. قوة الضباب للزجاج (Glass Blur)
    blurRange?.addEventListener('input', (e) => {
        const blurVal = e.target.value + 'px';
        document.documentElement.style.setProperty('--glass-blur', blurVal);
        localStorage.setItem('talkspace_glass_blur', blurVal);
    });

    // 4. اختيار الخط ورسمه
    fontSelect?.addEventListener('change', (e) => {
        const font = e.target.value;
        document.body.style.fontFamily = font;
        localStorage.setItem('talkspace_font', font);
    });

    fontSizeRange?.addEventListener('input', (e) => {
        const size = e.target.value + 'px';
        document.body.style.fontSize = size;
        localStorage.setItem('talkspace_fontsize', size);
    });

    // 5. صورة خلفية من رابط
    function applyBgUrl() {
        const url = bgUrlInput.value.trim();
        if (url) {
            const bgVal = `url("${url}")`;
            document.body.style.backgroundImage = bgVal;
            localStorage.setItem('talkspace_bg_img', bgVal);
        }
    }

    applyUrlBtn?.addEventListener('click', applyBgUrl);
    bgUrlInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyBgUrl();
    });

    // 6. رفع صورة خلفية من الحاسوب
    bgFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                const imgData = `url("${evt.target.result}")`;
                document.body.style.backgroundImage = imgData;
                try {
                    localStorage.setItem('talkspace_bg_img', imgData);
                } catch (err) {
                    alert('حجم الصورة كبير، تم تطبيقها مؤقتاً.');
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // 7. إزالة خلفية الصورة المخصصة
    removeBgBtn?.addEventListener('click', () => {
        document.body.style.backgroundImage = 'none';
        localStorage.removeItem('talkspace_bg_img');
        if (bgUrlInput) bgUrlInput.value = '';
    });

    // 8. تحميل التفضيلات المحفوظة عند فتح الصفحة
    function loadSavedSettings() {
        const savedMode = localStorage.getItem('talkspace_theme_mode') || 'dark';
        document.documentElement.setAttribute('data-theme', savedMode);
        updateThemeUI(savedMode);

        const savedPrimary = localStorage.getItem('talkspace_primary_color');
        if (savedPrimary) {
            document.documentElement.style.setProperty('--primary-color', savedPrimary);
            if (primaryColorPicker) primaryColorPicker.value = savedPrimary;
        }

        const savedBlur = localStorage.getItem('talkspace_glass_blur');
        if (savedBlur) {
            document.documentElement.style.setProperty('--glass-blur', savedBlur);
            if (blurRange) blurRange.value = parseInt(savedBlur);
        }

        const savedFont = localStorage.getItem('talkspace_font');
        if (savedFont) {
            document.body.style.fontFamily = savedFont;
            if (fontSelect) fontSelect.value = savedFont;
        }

        const savedFontSize = localStorage.getItem('talkspace_fontsize');
        if (savedFontSize) {
            document.body.style.fontSize = savedFontSize;
            if (fontSizeRange) fontSizeRange.value = parseInt(savedFontSize);
        }

        const savedBgImg = localStorage.getItem('talkspace_bg_img');
        if (savedBgImg) {
            document.body.style.backgroundImage = savedBgImg;
        }
    }

    // 9. إرجاع ضبط المصنع
    resetBtn?.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    loadSavedSettings();
});
