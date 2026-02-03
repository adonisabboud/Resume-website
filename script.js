document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // 1) Header typewriter (faster + mobile-friendly)
  // ---------------------------
  const header = document.querySelector("header h1");
  if (header) {
    const fullText = header.textContent.trim();
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.matchMedia && window.matchMedia("(max-width: 520px)").matches;

    // If reduced motion or small screen: show immediately
    if (prefersReducedMotion || isMobile) {
      header.textContent = fullText;
    } else {
      header.textContent = "";
      let idx = 0;
      const speed = 45; // faster than 100ms
      (function typeWriter() {
        if (idx < fullText.length) {
          header.textContent += fullText.charAt(idx++);
          setTimeout(typeWriter, speed);
        }
      })();
    }
  }

  // ---------------------------
  // 2) Smooth scroll for nav links
  // ---------------------------
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---------------------------
  // 3) Reveal-on-scroll
  // ---------------------------
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ---------------------------
  // 4) Back to Top + Progress bar
  // ---------------------------
  const backToTop = document.querySelector(".back-to-top");
  const prog = document.getElementById("progress-bar");

  function onScroll() {
    const scrolled = window.scrollY;
    if (backToTop) backToTop.classList.toggle("show", scrolled > 320);

    if (prog) {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const percent = (scrolled / Math.max(1, docH - winH)) * 100;
      prog.style.width = percent.toFixed(2) + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------------------------
  // 5) Scroll-spy (ensure only ONE active link)
  // ---------------------------
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

  function setActiveLink(id) {
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  }

  const scrollSpy = new IntersectionObserver(
    (entries) => {
      // Choose the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveLink(visible.target.id);
    },
    {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
      threshold: [0.25, 0.4, 0.55, 0.7, 0.85],
    }
  );
  sections.forEach((section) => scrollSpy.observe(section));

  // ---------------------------
  // ---------------------------
  const tags = [
    "Music + Microtonal Tuning (Maqām)",
    "Audio ML • Transcription (AMT)",
    "Full-Stack (FastAPI + MongoDB)",
  ];

  const sub = document.getElementById("subline");
  if (sub) {
    let ti = 0,
      tj = 0,
      dir = 1;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sub.textContent = tags[0];
    } else {
      function typeTag() {
        const text = tags[ti].slice(0, tj);
        sub.textContent = text;
        tj += dir;

        if (tj > tags[ti].length || tj < 0) {
          dir *= -1;
          if (tj < 0) {
            ti = (ti + 1) % tags.length;
            dir = 1;
          }
        }

        setTimeout(typeTag, dir > 0 ? 110 : 55);
      }
      typeTag();
    }
  }
});
