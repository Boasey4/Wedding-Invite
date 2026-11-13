// ===== Lenis Smooth Scroll =====
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

// Connect Lenis to GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);


// ===== Preloader =====
function runPreloader() {
    return new Promise(resolve => {
        const tl = gsap.timeline({ onComplete: resolve });

        // Animate monogram in
        tl.to('.preloader-monogram', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        })
        // Expand decorative line
        .to('.preloader-line', {
            width: 80,
            opacity: 0.4,
            duration: 0.6,
            ease: 'power2.inOut'
        }, '-=0.3')
        // Hold briefly
        .to({}, { duration: 0.4 })
        // Slide preloader up and away
        .to('.preloader', {
            yPercent: -100,
            duration: 0.9,
            ease: 'power3.inOut'
        })
        // Mark as gone
        .set('.preloader', { display: 'none' });
    });
}


// ===== Hero Swoop-in Entrance (GSAP version) =====
function swoopHeroImages() {
    const images = document.querySelectorAll('.hero-img');

    // Starting positions: each image flies from a unique off-screen spot
    const swoopConfigs = [
        { x: '-120%', y: '-60%',  rotation: -15, scale: 0.6, finalRotation: -2  },  // img-1
        { x: '0%',    y: '-120%', rotation: 5,   scale: 0.6, finalRotation: 0   },  // img-2
        { x: '120%',  y: '-40%',  rotation: 12,  scale: 0.6, finalRotation: 1.5 },  // img-3
        { x: '-100%', y: '80%',   rotation: -10, scale: 0.6, finalRotation: 2   },  // img-4
        { x: '30%',   y: '120%',  rotation: 8,   scale: 0.6, finalRotation: -1  },  // img-5
        { x: '120%',  y: '60%',   rotation: -12, scale: 0.6, finalRotation: 3   },  // img-6
    ];

    images.forEach((img, i) => {
        const config = swoopConfigs[i] || swoopConfigs[0];

        gsap.fromTo(img,
            {
                x: config.x,
                y: config.y,
                rotation: config.rotation,
                scale: config.scale,
                opacity: 0,
            },
            {
                x: '0%',
                y: '0%',
                rotation: config.finalRotation,
                scale: 1,
                opacity: 1,
                duration: 1.3,
                delay: 0.08 * i,
                ease: 'power3.out',
            }
        );
    });
}


// ===== Nav Entrance =====
function showNav() {
    gsap.to('.nav', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    });
}


// ===== GSAP ScrollTrigger Parallax =====
function initParallax() {
    // Hero images parallax
    document.querySelectorAll('[data-parallax-speed]').forEach(el => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;

        gsap.to(el, {
            yPercent: speed * -30,
            ease: 'none',
            scrollTrigger: {
                trigger: el.closest('section') || el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
            }
        });
    });

    // Story photos: slight rotation + y shift on scroll
    document.querySelectorAll('.story-photo').forEach((photo, i) => {
        const direction = i % 2 === 0 ? -1 : 1;

        gsap.to(photo, {
            yPercent: direction * -15,
            rotation: direction * 2,
            ease: 'none',
            scrollTrigger: {
                trigger: photo.closest('.story-stage'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
            }
        });
    });
}


// ===== Scroll Reveal Animations =====
function initReveals() {
    // General reveals
    gsap.utils.toArray('.reveal').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    // Detail cards stagger
    ScrollTrigger.batch('.detail-card', {
        onEnter: (batch) => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
            });
        },
        start: 'top 85%',
    });

    // FAQ items stagger
    ScrollTrigger.batch('.faq-item', {
        onEnter: (batch) => {
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.7,
                ease: 'power3.out',
            });
        },
        start: 'top 85%',
    });
}


// ===== Custom Cursor =====
function initCursor() {
    // Only on devices with a fine pointer (mouse)
    if (!window.matchMedia('(hover: hover)').matches) return;

    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursor-dot');

    // Use GSAP quickTo for silky-smooth lag
    const xTo = gsap.quickTo(cursor, 'left', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'top', { duration: 0.5, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'left', { duration: 0.15, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'top', { duration: 0.15, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
        xTo(e.clientX - 18);
        yTo(e.clientY - 18);
        dotX(e.clientX - 2.5);
        dotY(e.clientY - 2.5);

        if (!cursor.classList.contains('active')) {
            cursor.classList.add('active');
            dot.classList.add('active');
        }
    });

    // Grow cursor over interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, select, .story-photo');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}


// ===== Magnetic Buttons =====
function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });
}


// ===== Navbar Scroll Shrink =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ===== Countdown Timer =====
const WEDDING_DATE = new Date('2027-08-07T16:00:00');

function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Tick animation on seconds change
    const secEl = document.getElementById('seconds');
    const newSec = String(seconds).padStart(2, '0');
    if (secEl.textContent !== newSec) {
        secEl.classList.add('tick');
        setTimeout(() => secEl.classList.remove('tick'), 200);
    }

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = newSec;
    document.getElementById('seconds').textContent = newSec;
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ===== Smooth Scroll for Nav Links (Lenis) =====
document.querySelectorAll('.nav-right a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});


// ===== RSVP Form with Confetti =====
document.getElementById('rsvp-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Thank you!';
    btn.disabled = true;
    btn.style.background = '#6b8f71';
    btn.style.pointerEvents = 'none';

    // Confetti burst
    if (typeof confetti === 'function') {
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 80,
            spread: 70,
            origin: { x, y },
            colors: ['#b8860b', '#e2ccb1', '#d4a574', '#faf8f5', '#c9a87c'],
            ticks: 200,
            gravity: 0.8,
            scalar: 0.9,
        });

        // Second burst slightly delayed
        setTimeout(() => {
            confetti({
                particleCount: 40,
                spread: 100,
                origin: { x, y: y - 0.05 },
                colors: ['#b8860b', '#e2ccb1', '#d4a574', '#faf8f5'],
                ticks: 150,
                gravity: 1,
                scalar: 0.7,
            });
        }, 200);
    }
});


// ===== Mobile: simplify parallax =====
ScrollTrigger.matchMedia({
    '(max-width: 767px)': function() {
        // On mobile, kill parallax for performance / iOS compat
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars?.scrub) st.kill();
        });
    }
});


// ===== Boot Sequence =====
window.addEventListener('load', async () => {
    // 1. Run preloader
    await runPreloader();

    // 2. Swoop hero images in
    swoopHeroImages();

    // 3. Reveal nav
    showNav();

    // 4. Init everything else after a beat
    setTimeout(() => {
        initParallax();
        initReveals();
        initCursor();
        initMagnetic();
    }, 800);
});
