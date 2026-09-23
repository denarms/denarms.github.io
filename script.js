document.getElementById("year").textContent = new Date().getFullYear();

/* Mobile nav toggle */
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* Theme toggle (persisted per-browser via localStorage) */
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
try {
  const saved = localStorage.getItem("cv-theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}
themeToggle.addEventListener("click", () => {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const current = root.getAttribute("data-theme") || (prefersLight ? "light" : "dark");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("cv-theme", next); } catch (e) {}
});

/* Scroll progress bar + topbar shadow */
const progressBar = document.getElementById("progressBar");
const topbar = document.getElementById("topbar");
let ticking = false;
function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
  topbar.classList.toggle("scrolled", scrollTop > 8);
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });
onScroll();

/* Typewriter effect */
const roles = [
  "Técnico de Soporte TI",
  "Especialista en Microinformática",
  "Microsoft 365 & Intune",
  "Active Directory & Entra ID",
  "Soporte L1/L2 · ServiceNow"
];
const typewriterEl = document.getElementById("typewriter");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  typewriterEl.textContent = roles[0];
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeTick() {
    const word = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(typeTick, 1600);
        return;
      }
      setTimeout(typeTick, 55);
    } else {
      charIndex--;
      typewriterEl.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeTick, 300);
        return;
      }
      setTimeout(typeTick, 28);
    }
  }
  typeTick();
}

/* Scroll-reveal via IntersectionObserver */
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
revealEls.forEach((el) => revealObserver.observe(el));

/* Animated stat counters */
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach((el) => counterObserver.observe(el));

/* Animated language bars */
const bars = document.querySelectorAll("[data-bar]");
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.width = el.getAttribute("data-bar") + "%";
    barObserver.unobserve(el);
  });
}, { threshold: 0.5 });
bars.forEach((el) => barObserver.observe(el));

/* Scroll-spy nav highlighting */
const navLinks = document.querySelectorAll("[data-nav]");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = "#" + entry.target.id;
    const link = document.querySelector(`[data-nav][href="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
sections.forEach((sec) => spyObserver.observe(sec));

/* Subtle 3D tilt on skill cards (pointer devices only) */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
