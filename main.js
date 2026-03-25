(function() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            alert('Screenshots e impressões não são permitidas neste site.');
        }
    });
    document.addEventListener('beforeprint', function() {
        alert('Impressão não é permitida neste site.');
        window.print = function() {};
    });
})();

(function() {
    function protectImage(img) {
        img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        img.addEventListener('dragstart', function(e) { e.preventDefault(); });
    }
    document.querySelectorAll('img.no-download').forEach(protectImage);
    var modalImg = document.getElementById('modal-image');
    if (modalImg) protectImage(modalImg);
})();

(function() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var iconMenu = document.getElementById('icon-menu');
    var iconClose = document.getElementById('icon-close');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function() {
        menu.classList.toggle('open');
        var isOpen = menu.classList.contains('open');
        if (iconMenu) iconMenu.classList.toggle('hidden', isOpen);
        if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
        toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('open');
            if (iconMenu) iconMenu.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');
            toggle.setAttribute('aria-label', 'Abrir menu');
        });
    });
})();

(function() {
    var modal = document.getElementById('gallery-modal');
    var modalImg = document.getElementById('modal-image');
    var btnClose = document.getElementById('modal-close');
    var mainContent = document.getElementById('main-content');
    if (!modal || !modalImg) return;

    var lastFocusedElement = null;

    function getFocusableElements() {
        var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        return Array.prototype.filter.call(focusable, function(el) {
            return el.offsetParent !== null && !el.disabled;
        });
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        var focusable = getFocusableElements();
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function openModal(src, openedBy) {
        lastFocusedElement = openedBy || document.activeElement;
        modalImg.src = src;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'hidden';
        modal.addEventListener('keydown', trapFocus);
        btnClose.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = '';
        modal.removeEventListener('keydown', trapFocus);
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    document.querySelectorAll('.gallery-img').forEach(function(img) {
        img.addEventListener('click', function() { openModal(this.src, this); });
    });
    btnClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
})();

(function() {
    var videoModal = document.getElementById('video-modal');
    var modalVideo = document.getElementById('modal-video');
    var btnClose = document.getElementById('video-modal-close');
    var mainContent = document.getElementById('main-content');
    if (!videoModal || !modalVideo) return;

    var lastFocusedElement = null;

    function openVideoModal(src, openedBy) {
        lastFocusedElement = openedBy || document.activeElement;
        modalVideo.querySelector('source').src = src;
        modalVideo.load();
        videoModal.classList.add('open');
        videoModal.setAttribute('aria-hidden', 'false');
        if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'hidden';
        modalVideo.play();
        btnClose.focus();
    }

    function closeVideoModal() {
        modalVideo.pause();
        videoModal.classList.remove('open');
        videoModal.setAttribute('aria-hidden', 'true');
        if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
        lastFocusedElement = null;
    }

    document.querySelectorAll('.video-thumb').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var videoSrc = this.getAttribute('data-video');
            if (videoSrc) openVideoModal(videoSrc, this);
        });
    });
    btnClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) closeVideoModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideoModal();
    });
})();
