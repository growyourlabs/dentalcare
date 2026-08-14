/**
 * DentalCare Studio - Optimized Premium Script (Mobile-friendly)
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Detección de dispositivo táctil ---
    // En touch no hay mouse real, así que desactivamos el cursor personalizado
    // (evita cursores "fantasma" pegados en la última posición tocada en iOS/Android).
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactive = document.querySelectorAll('a, button, .faq-question, .gallery-item');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.background = 'rgba(6, 182, 212, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.background = 'transparent';
            });
        });
    }

    // --- Navbar Scroll ---
    const header = document.querySelector('#header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // --- Mobile Menu ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    const closeMenu = () => {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
        document.body.classList.remove('nav-open');
    };

    const toggleMenu = () => {
        const isOpen = nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
    };

    burger.addEventListener('click', toggleMenu);

    // Cierra el menú al tocar un enlace (mejora UX en móvil de una sola página)
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cierra el menú si cambia el tamaño de pantalla a escritorio
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const isVisible = el.getBoundingClientRect().top < window.innerHeight - 150;
            if (isVisible) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- Stats Counter ---
    const counters = document.querySelectorAll('.counter');
    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const inc = target / 200;
            const updateCount = () => {
                if (count < target) {
                    count += inc;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + (target > 100 ? '+' : '');
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                statsObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.close-lightbox');

    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', closeLightbox);
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    // --- Testimonial Slider (con soporte de swipe táctil) ---
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(track.children);
    const dotsNav = document.querySelector('.slider-dots');

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            slideIndex = i;
            moveToSlide(slideIndex);
        });
        dotsNav.appendChild(dot);
    });

    const moveToSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        document.querySelectorAll('.dot')[index].classList.add('active');
    };

    let slideIndex = 0;
    let autoSlide = setInterval(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        moveToSlide(slideIndex);
    }, 5000);

    // Swipe táctil para el slider de testimonios
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlide);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 40;

        if (diff > threshold) {
            slideIndex = (slideIndex + 1) % slides.length;
            moveToSlide(slideIndex);
        } else if (diff < -threshold) {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            moveToSlide(slideIndex);
        }

        autoSlide = setInterval(() => {
            slideIndex = (slideIndex + 1) % slides.length;
            moveToSlide(slideIndex);
        }, 5000);
    }, { passive: true });

    // --- FAQ ---
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- Ripple Effect ---
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || rect.width / 2;
            const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || rect.height / 2;
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-span');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // --- Back to Top ---
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btt.style.display = window.scrollY > 500 ? 'block' : 'none';
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Inject Ripple CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .ripple-span { position: absolute; background: rgba(255,255,255,0.4); transform: translate(-50%,-50%); border-radius: 50%; pointer-events: none; animation: rippleAnim 0.6s linear; }
        @keyframes rippleAnim { from { width: 0; height: 0; opacity: 1; } to { width: 500px; height: 500px; opacity: 0; } }
        @keyframes navLinkFade { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    `;
    document.head.appendChild(style);
});
