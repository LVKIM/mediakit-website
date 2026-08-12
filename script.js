/* ============================================================
   NEXUS 82 34 — interaction layer
   ============================================================ */

// ===== Navigation scroll state =====
const nav = document.getElementById('nav');

const setNavState = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
};

// ===== Mobile menu =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const closeMenu = () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
});

// ===== Scroll reveal =====
const animated = document.querySelectorAll('[data-animate]');

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animated.forEach(el => el.classList.add('visible'));
} else {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = Number(entry.target.dataset.delay) || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animated.forEach(el => revealObserver.observe(el));
}

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== Active nav link =====
const sections = Array.from(document.querySelectorAll('section[id]'));
const linkFor = new Map(
    Array.from(navLinks.querySelectorAll('a')).map(a => [a.getAttribute('href').slice(1), a])
);

const setActiveLink = () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    linkFor.forEach((a, id) => a.classList.toggle('active', id === current));
};

let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        setNavState();
        setActiveLink();
        ticking = false;
    });
}, { passive: true });

setNavState();
setActiveLink();

/* ===== Contact form =====
   No backend on this site. Rather than showing a fake "Message Sent"
   confirmation and silently dropping the enquiry, the form composes a
   real mail addressed to both co-founders. Replace with a posted
   endpoint (Formspree, Netlify Forms, or an owned handler) when one exists. */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const value = id => (document.getElementById(id).value || '').trim();

    const name = value('name');
    const company = value('company');
    const email = value('email');
    const inquiry = value('inquiry');
    const message = value('message');

    const subject = inquiry ? `${inquiry} — ${name}` : `Enquiry — ${name}`;
    const body = [
        `Name: ${name}`,
        company ? `Company: ${company}` : null,
        `Email: ${email}`,
        inquiry ? `Interest: ${inquiry}` : null,
        '',
        message,
    ].filter(Boolean).join('\n');

    window.location.href =
        'mailto:laura@nexus8234.com' +
        '?cc=' + encodeURIComponent('alvaro@nexus8234.com') +
        '&subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
});
