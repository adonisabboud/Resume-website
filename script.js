document.addEventListener('DOMContentLoaded', () => {
  // Typewriter effect for header
  const header = document.querySelector('header h1');
  const fullText = header.textContent;
  header.textContent = '';
  let idx = 0;
  function typeWriter() {
    if (idx < fullText.length) {
      header.textContent += fullText.charAt(idx++);
      setTimeout(typeWriter, 100);
    }
  }
  typeWriter();

  // Smooth scroll for nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Reveal-on-scroll & stagger badges
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.id === 'skills') {
          const badges = entry.target.querySelectorAll('.badge');
          badges.forEach((badge, i) => setTimeout(() => badge.classList.add('active'), i * 100));
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));

  // Back to Top button & Progress Bar
  const backToTop = document.querySelector('.back-to-top');
  const prog = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    backToTop.classList.toggle('show', scrolled > 300);
    if (prog) {
      const percent = (scrolled / (document.body.scrollHeight - window.innerHeight)) * 100;
      prog.style.width = percent + '%';
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Wrap text nodes in paragraphs into word spans, preserving links
  document.querySelectorAll('p.description').forEach(p => {
    const frag = document.createDocumentFragment();
    p.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/\s+/).filter(w => w.length).forEach((w, i, arr) => {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = w;
          frag.appendChild(span);
          if (i < arr.length - 1) frag.appendChild(document.createTextNode(' '));
        });
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });
    p.textContent = '';
    p.appendChild(frag);
  });

  // Scroll‑spy: highlight nav links based on which section is in view
  const sections = document.querySelectorAll('main section');
  const scrollSpy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
    threshold: 0.6
  });
  sections.forEach(section => scrollSpy.observe(section));
  // Rotating subtitle under header
  const tags = [
    'CS Graduate',
    'Open‑Source Enthusiast',
    'Lifelong Learner'
  ];
  let ti = 0, tj = 0, dir = 1;
  const sub = document.getElementById('subline');
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
    setTimeout(typeTag, dir > 0 ? 150 : 75);
  }
  typeTag();

});
