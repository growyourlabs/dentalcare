/**
 * DentalCare Studio - Optimized Premium Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.custom-cursor-outline');
    
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

    // --- Navbar Scroll ---
    const header = document.querySelector('#header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 100);
    });

    // --- Mobile Menu ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        navLinks.forEach((link, i) => {
            link.style.animation = link.style.animation ? '' : `navLinkFade 0.5s ease forwards ${i / 7 + 0.3}s`;
        });
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

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounters();
            statsObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });
    statsObserver.observe(document.querySelector('.stats'));

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // --- Testimonial Slider ---
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(track.children);
    const dotsNav = document.querySelector('.slider-dots');
    
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
    });

    const moveToSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        document.querySelectorAll('.dot')[index].classList.add('active');
    };

    let slideIndex = 0;
    setInterval(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        moveToSlide(slideIndex);
    }, 5000);

    // --- FAQ ---
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- Ripple Effect ---
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
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