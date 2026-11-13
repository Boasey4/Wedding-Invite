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
    gsap.fromTo('.hero-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
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


// ===== Tab title misses you when you switch away =====
const pageTitle = document.title;
document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Come back, we miss you already' : pageTitle;
});


// ===== Countdown Timer =====
// Queensland time (no daylight saving), so the countdown is right for guests anywhere
const WEDDING_DATE = new Date('2027-08-07T16:00:00+10:00');

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
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = newSec;
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ===== Smooth Scroll for Nav Links (Lenis) =====
document.querySelectorAll('.nav-right a[href^="#"], .hero-rsvp').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});


// ===== Add to Apple / Outlook calendar (.ics download) =====
document.getElementById('ics-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Annie and Connor//Wedding//EN',
        'BEGIN:VEVENT',
        'UID:annie-connor-wedding-20270807',
        'DTSTAMP:20261024T000000Z',
        'DTSTART:20270807T060000Z',
        'DTEND:20270807T140000Z',
        "SUMMARY:Annie & Connor's Wedding",
        'LOCATION:Elm House\\, 1956 Mount Glorious Rd\\, Mount Glorious QLD 4520',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'annie-and-connor-wedding.ics';
    a.click();
    URL.revokeObjectURL(a.href);
});


// ===== RSVP: yes / no choice =====
// On a computer, "no" runs away from the mouse. On phones (no hover), every
// "no" tap makes "yes" a bit bigger, and the third tap goes through.
const choiceYes = document.getElementById('choice-yes');
const choiceNo = document.getElementById('choice-no');
const choiceQuip = document.getElementById('choice-quip');
const choiceEscape = document.getElementById('choice-escape');
const rsvpExtras = document.getElementById('rsvp-extras');
let attending = null;

const dodgeQuips = [
    'Nice try.',
    'Nope.',
    "That button has cold feet.",
    "It's quick in the mountain air.",
    "We can do this all day. We're on leave.",
    'Have you tried saying yes?',
    'The yes button is right there. Looking lovely.',
    'Annie says no.',
    'Connor also says no.',
    'This is a legally binding chase.',
    'Okay, you are persistent. We respect it.',
];
const tapQuips = ['Are you sure?', 'Like... really sure? Look how big yes is getting.'];
let dodges = 0;
let noTaps = 0;

function setAttending(value) {
    attending = value;
    choiceYes.classList.toggle('selected', value === 'yes');
    choiceNo.classList.toggle('selected', value === 'no');
    rsvpExtras.hidden = value !== 'yes';
    if (value === 'yes') choiceQuip.textContent = 'Best answer.';
    if (value === 'no') choiceQuip.textContent = "We'll miss you, and we'll raise a glass for you.";
    if (value === 'no') {
        gsap.to(choiceNo, { x: 0, y: 0, rotation: 0, duration: 0.6, ease: 'power3.out' });
        choiceEscape.hidden = true;
    }
}

choiceYes.addEventListener('click', () => {
    setAttending('yes');
    gsap.to(choiceYes, { scale: 1, duration: 0.4 });
});

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canHover) {
    const arena = document.getElementById('rsvp');
    const FLEE_RADIUS = 120;
    let pos = { x: 0, y: 0 };

    function dodge(mouseX, mouseY) {
        if (attending === 'no') return;
        const r = choiceNo.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let dx = cx - mouseX;
        let dy = cy - mouseY;
        const dist = Math.hypot(dx, dy) || 1;

        // Where the button sits with no offset, and how far it may go while
        // staying inside the RSVP section and on screen
        const baseLeft = r.left - pos.x;
        const baseTop = r.top - pos.y;
        const a = arena.getBoundingClientRect();
        const pad = 24;
        const minX = Math.max(a.left, 0) + pad - baseLeft;
        const maxX = Math.min(a.right, window.innerWidth) - pad - r.width - baseLeft;
        const minY = Math.max(a.top, 0) + pad - baseTop;
        const maxY = Math.min(a.bottom, window.innerHeight) - pad - r.height - baseTop;
        const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

        const push = FLEE_RADIUS + 40;
        let nx = clamp(pos.x + (dx / dist) * push, minX, maxX);
        let ny = clamp(pos.y + (dy / dist) * push, minY, maxY);

        // Cornered: jump somewhere far from the mouse instead
        const newCx = baseLeft + nx + r.width / 2;
        const newCy = baseTop + ny + r.height / 2;
        if (Math.hypot(newCx - mouseX, newCy - mouseY) < FLEE_RADIUS) {
            for (let i = 0; i < 12; i++) {
                const tx = minX + Math.random() * (maxX - minX);
                const ty = minY + Math.random() * (maxY - minY);
                const tcx = baseLeft + tx + r.width / 2;
                const tcy = baseTop + ty + r.height / 2;
                if (Math.hypot(tcx - mouseX, tcy - mouseY) > FLEE_RADIUS * 2) {
                    nx = tx;
                    ny = ty;
                    break;
                }
            }
        }

        pos = { x: nx, y: ny };
        gsap.to(choiceNo, {
            x: nx,
            y: ny,
            rotation: (Math.random() - 0.5) * 16,
            duration: 0.35,
            ease: 'power3.out',
        });

        choiceQuip.textContent = dodgeQuips[Math.min(dodges, dodgeQuips.length - 1)];
        dodges++;
        if (dodges === 8) choiceEscape.hidden = false;
    }

    let lastDodge = 0;
    window.addEventListener('mousemove', (e) => {
        const r = choiceNo.getBoundingClientRect();
        const dist = Math.hypot(
            r.left + r.width / 2 - e.clientX,
            r.top + r.height / 2 - e.clientY
        );
        const now = performance.now();
        if (dist < FLEE_RADIUS && now - lastDodge > 120) {
            lastDodge = now;
            dodge(e.clientX, e.clientY);
        }
    });

    // If the mouse somehow lands on it, it still won't take the click.
    // Keyboard users (Tab + Enter, where e.detail is 0) can still pick it.
    choiceNo.addEventListener('click', (e) => {
        if (e.detail > 0) {
            dodge(e.clientX, e.clientY);
            return;
        }
        setAttending('no');
    });

    // Put it back where it started if they scroll away
    window.addEventListener('scroll', () => {
        if (pos.x === 0 && pos.y === 0) return;
        const a = arena.getBoundingClientRect();
        if (a.bottom < 0 || a.top > window.innerHeight) {
            pos = { x: 0, y: 0 };
            gsap.set(choiceNo, { x: 0, y: 0, rotation: 0 });
        }
    }, { passive: true });
} else {
    choiceNo.addEventListener('click', () => {
        if (noTaps < tapQuips.length) {
            choiceQuip.textContent = tapQuips[noTaps];
            noTaps++;
            gsap.to(choiceYes, { scale: 1 + noTaps * 0.18, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            return;
        }
        gsap.to(choiceYes, { scale: 1, duration: 0.4 });
        setAttending('no');
    });
}

choiceEscape.addEventListener('click', () => setAttending('no'));


// ===== RSVP Form with Confetti =====
document.getElementById('rsvp-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!attending) {
        choiceQuip.textContent = 'Pick one first. (We know which one we hope for.)';
        gsap.fromTo('.choice-row', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        return;
    }

    // TODO: nothing is sent anywhere yet. Hook this up to Formspree / Google
    // Sheets / etc. with new FormData(e.target) plus `attending`.

    const btn = e.target.querySelector('.btn-rsvp');
    btn.textContent = attending === 'yes' ? 'See you on the mountain!' : 'Thank you for letting us know';
    btn.disabled = true;
    btn.style.background = '#6b8f71';
    btn.style.pointerEvents = 'none';

    // Confetti burst
    if (attending === 'yes' && typeof confetti === 'function') {
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
