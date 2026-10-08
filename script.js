(() => {
  const root = document.documentElement;
  const scriptUrl =
    document.currentScript?.src ||
    [...document.scripts]
      .map((script) => script.src)
      .find((src) => src && new URL(src).pathname.endsWith('/script.js'));
  const siteRoot = new URL('.', scriptUrl || window.location.href);
  document.body.classList.add(
    'page-' + (window.location.pathname.split('/').pop().replace('.html', '') || 'index'),
  );
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  let showBoot = false;
  try {
    showBoot = !sessionStorage.getItem('chhavi-booted');
    if (showBoot) sessionStorage.setItem('chhavi-booted', '1');
  } catch {
    showBoot = false;
  }
  if (!document.querySelector('#boot-screen')) {
    const bootPanel = document.createElement('div');
    bootPanel.className = 'boot-screen';
    bootPanel.id = 'boot-screen';
    bootPanel.setAttribute('aria-hidden', 'true');
    bootPanel.innerHTML =
      '<div class="boot-orb"><span></span><span></span><span></span></div><p class="boot-kicker">CS / ENGINEERING PORTFOLIO</p><div class="boot-title">INITIALIZING<br><em>CONTROL SYSTEMS</em></div><div class="boot-progress"><i></i></div><div class="boot-status"><span>CALIBRATING INTERFACE</span><span id="boot-percent">00%</span></div><button class="boot-skip" type="button">SKIP INTRO ↗</button>';
    document.body.prepend(bootPanel);
  }
  const bootPanel = document.querySelector('#boot-screen');
  if (bootPanel) {
    let bootTimer;
    const finishBoot = () => {
      window.clearInterval(bootTimer);
      bootPanel.classList.add('boot-done');
      window.setTimeout(() => bootPanel.remove(), 700);
    };
    if (showBoot && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bootPanel.classList.add('boot-live');
      let value = 0;
      const counter = bootPanel.querySelector('#boot-percent');
      bootTimer = window.setInterval(() => {
        value = Math.min(100, value + 10);
        if (counter) counter.textContent = String(value).padStart(2, '0') + '%';
        if (value >= 100) {
          window.clearInterval(bootTimer);
          window.setTimeout(finishBoot, 250);
        }
      }, 75);
      bootPanel.querySelector('.boot-skip')?.addEventListener('click', finishBoot);
    } else if (showBoot) finishBoot();
    else bootPanel.remove();
  }
  try {
    root.dataset.theme = localStorage.getItem('chhavi-theme') || 'dark';
  } catch {
    root.dataset.theme = 'dark';
  }
  const paintThemeButton = () => {
    const dark = root.dataset.theme === 'dark';
    if (themeButton) {
      themeButton.querySelector('.theme-icon').textContent = dark ? '☼' : '☾';
      themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    }
  };
  paintThemeButton();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('chhavi-theme', root.dataset.theme);
    } catch {
      /* private browsing */
    }
    paintThemeButton();
  });
  menuButton?.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = opened ? '×' : '☰';
  });
  nav
    ?.querySelectorAll('a')
    .forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
  const headerActions = document.querySelector('.header-actions');
  if (headerActions && !headerActions.querySelector('.hub-toggle')) {
    const hub = document.createElement('button');
    hub.className = 'hub-toggle';
    hub.type = 'button';
    hub.setAttribute('aria-controls', 'map-overlay');
    hub.innerHTML = '<span class="hub-radar">⊕</span> SYSTEM MAP';
    headerActions.prepend(hub);
  }
  if (!document.querySelector('#map-overlay')) {
    const mapPanel = document.createElement('section');
    mapPanel.className = 'map-overlay';
    mapPanel.id = 'map-overlay';
    mapPanel.setAttribute('aria-hidden', 'true');
    mapPanel.setAttribute('aria-label', 'Portfolio navigation');
    mapPanel.innerHTML =
      '<button class="map-close" type="button" aria-label="Close system map">×</button><div class="map-inner"><p class="eyebrow"><span class="pulse-dot"></span> SELECT A DESTINATION / SYSTEM MAP</p><h2>Where to<br><em>next?</em></h2><div class="map-grid"><a href="index.html" class="map-door"><span>00 · ORIGIN</span><b>Home</b><i>↗</i></a><a href="research.html" class="map-door"><span>01 · SIGNAL</span><b>Research</b><i>↗</i></a><a href="projects.html" class="map-door"><span>02 · BUILD</span><b>Projects</b><i>↗</i></a><a href="experience.html" class="map-door"><span>03 · TRAJECTORY</span><b>Experience</b><i>↗</i></a><a href="leadership.html" class="map-door"><span>04 · NETWORK</span><b>Leadership</b><i>↗</i></a><a href="hobbies.html" class="map-door"><span>05 · HUMAN MODE</span><b>Off the clock</b><i>↗</i></a><a href="awards.html" class="map-door"><span>06 · SIGNAL BOOST</span><b>Highlights</b><i>↗</i></a></div><p class="map-foot">EVERY SYSTEM HAS ANOTHER STATE.</p></div>';
    mapPanel.querySelectorAll('.map-door').forEach((link) => {
      link.href = new URL(link.getAttribute('href'), siteRoot).href;
    });
    document.body.append(mapPanel);
  }
  const mapPanel = document.querySelector('#map-overlay');
  if (!document.querySelector('[data-world-module]')) {
    const worldModule = document.createElement('script');
    worldModule.type = 'module';
    const worldUrl = new URL('world.js', siteRoot);
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      worldUrl.searchParams.set('dev', Date.now().toString());
    }
    worldModule.src = worldUrl.href;
    worldModule.dataset.worldModule = 'true';
    worldModule.addEventListener('error', () => mapPanel?.classList.add('world-fallback'));
    document.body.append(worldModule);
  }
  const headerHub = headerActions?.querySelector('.hub-toggle');
  const closeMap = () => {
    mapPanel?.classList.remove('map-open');
    mapPanel?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('map-active');
  };
  headerHub?.addEventListener('click', () => {
    mapPanel?.classList.add('map-open');
    mapPanel?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('map-active');
    mapPanel?.querySelector('.map-close')?.focus();
  });
  document
    .querySelectorAll('[data-world-enter]')
    .forEach((button) => button.addEventListener('click', () => headerHub?.click()));
  mapPanel?.querySelector('.map-close')?.addEventListener('click', closeMap);
  mapPanel?.addEventListener('click', (event) => {
    if (event.target === mapPanel) closeMap();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMap();
  });
  if (!document.querySelector('#vault-transition')) {
    const vaultPanel = document.createElement('div');
    vaultPanel.className = 'vault-transition';
    vaultPanel.id = 'vault-transition';
    vaultPanel.setAttribute('aria-hidden', 'true');
    vaultPanel.innerHTML =
      '<div class="vault-wing wing-left"></div><div class="vault-wing wing-right"></div><div class="vault-core"><span>TRANSFERRING TO</span><b id="vault-destination">NEXT SECTION</b><i></i></div>';
    document.body.append(vaultPanel);
  }
  const vaultPanel = document.querySelector('#vault-transition');
  let navigating = false;
  const resetVault = () => {
    navigating = false;
    vaultPanel?.classList.remove('vault-open');
    vaultPanel?.setAttribute('aria-hidden', 'true');
  };
  window.addEventListener('pageshow', resetVault);
  resetVault();
  const navigateTo = (href, label) => {
    const destination = new URL(href, window.location.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname === window.location.pathname ||
      navigating ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    navigating = true;
    closeMap();
    const labelNode = vaultPanel?.querySelector('#vault-destination');
    const destinationPath = destination.pathname.toLowerCase();
    const destinationLabel = destinationPath.includes('/research/')
      ? 'RESEARCH ARTICLE'
      : destinationPath.includes('/projects/')
        ? 'PROJECT'
        : label || 'NEXT ZONE';
    if (labelNode) labelNode.textContent = destinationLabel.toUpperCase();
    vaultPanel?.classList.add('vault-open');
    vaultPanel?.setAttribute('aria-hidden', 'false');
    const currentUrl = window.location.href;
    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 920);
    window.setTimeout(() => {
      if (window.location.href === currentUrl) resetVault();
    }, 4000);
  };
  window.navigateToPortfolioPage = navigateTo;
  document.querySelectorAll('a[href$=".html"]').forEach((link) =>
    link.addEventListener('click', (event) => {
      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === '_blank' ||
        link.matches('.back-link') ||
        navigating ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;
      event.preventDefault();
      const label =
        link.dataset.transitionLabel ||
        link.querySelector('h1, h2, h3')?.textContent ||
        link.getAttribute('aria-label') ||
        link.textContent;
      navigateTo(
        destination.href,
        label.replace(/\s+/g, ' ').replace(/↗/g, '').trim().slice(0, 48),
      );
    }),
  );
  document
    .querySelectorAll('[data-year]')
    .forEach((el) => (el.textContent = new Date().getFullYear()));
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    reveals.forEach((el) => observer.observe(el));
  } else reveals.forEach((el) => el.classList.add('visible'));
  const art = document.querySelector('.hero-art');
  if (
    art &&
    matchMedia('(pointer:fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    art.addEventListener('pointermove', (event) => {
      const r = art.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - 0.5;
      const y = (event.clientY - r.top) / r.height - 0.5;
      const svg = art.querySelector('.control-art');
      svg.style.transform = `translate(${x * 7}px,${y * 7}px) scale(1.015)`;
    });
    art.addEventListener(
      'pointerleave',
      () => (art.querySelector('.control-art').style.transform = ''),
    );
  }
  document.querySelectorAll('[data-hero-portrait]').forEach((image) => {
    const updatePortrait = () => {
      image.hidden = !image.complete || image.naturalWidth === 0;
    };
    image.addEventListener('load', updatePortrait);
    image.addEventListener('error', updatePortrait);
    updatePortrait();
  });
  // Case files behave like a small stack of inspectable records.
  document
    .querySelectorAll('.project-dossiers, .case-list, .page-experience .mission-log')
    .forEach((group) => {
      const cards = [...group.querySelectorAll(':scope > details')];
      cards.forEach((card) => {
        card.addEventListener('toggle', () => {
          if (card.open)
            cards.forEach((other) => {
              if (other !== card) other.open = false;
            });
          const status = card.querySelector('.mission-status');
          if (status)
            status.textContent = card.open ? 'ACTIVE SIGNAL' : card.dataset.status || 'ARCHIVED';
        });
        card.dataset.status = card.querySelector('.mission-status')?.textContent || '';
        card.addEventListener('pointermove', (event) => {
          if (
            !matchMedia('(pointer:fine)').matches ||
            matchMedia('(prefers-reduced-motion: reduce)').matches
          )
            return;
          const r = card.getBoundingClientRect();
          const x = (event.clientX - r.left) / r.width - 0.5;
          const y = (event.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--ry', (x * 1.5).toFixed(2) + 'deg');
          card.style.setProperty('--rx', (-y * 1.2).toFixed(2) + 'deg');
        });
        card.addEventListener('pointerleave', () => {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });
    });
  document.querySelectorAll('.content-card, .focus-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (!matchMedia('(pointer:fine)').matches) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - r.left}px`);
      card.style.setProperty('--my', `${event.clientY - r.top}px`);
    });
  });
  document.querySelectorAll('.painting-canvas[data-palette]').forEach((canvas) =>
    canvas.addEventListener('click', () => {
      const next = (Number(canvas.dataset.palette || 1) % 3) + 1;
      canvas.dataset.palette = String(next);
      canvas.classList.remove('palette-2', 'palette-3');
      if (next > 1) canvas.classList.add(`palette-${next}`);
    }),
  );
  const lightbox = document.querySelector('#art-lightbox');
  const showPainting = (src, label) => {
    if (!lightbox) return;
    lightbox.querySelector('img').src = src;
    lightbox.querySelector('img').alt = label;
    lightbox.querySelector('p').textContent = label;
    lightbox.showModal();
  };
  lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  document.querySelectorAll('[data-painting-files]').forEach((input) =>
    input.addEventListener('change', () => {
      const gallery = input.closest('[data-painting-gallery]');
      [...(input.files || [])]
        .filter((file) => file.type.startsWith('image/'))
        .forEach((file) => {
          const url = URL.createObjectURL(file);
          const preview = document.createElement('button');
          preview.type = 'button';
          preview.className = 'painting-preview';
          const image = document.createElement('img');
          image.src = url;
          image.alt = file.name;
          const caption = document.createElement('span');
          caption.textContent = file.name;
          preview.append(image, caption);
          gallery.insertBefore(preview, input.closest('.painting-upload'));
          preview.addEventListener('click', () => showPainting(url, file.name));
        });
      input.value = '';
    }),
  );
  document.querySelectorAll('[data-video-target]').forEach((input) =>
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      const slot = input.closest('.video-slot');
      const video = slot?.querySelector('video');
      if (!file || !video) return;
      if (video.dataset.objectUrl) URL.revokeObjectURL(video.dataset.objectUrl);
      const url = URL.createObjectURL(file);
      video.dataset.objectUrl = url;
      video.src = url;
      slot.classList.add('has-video');
      video.play().catch(() => {});
    }),
  );

  document.querySelectorAll('[data-cover-image]').forEach((image) => {
    const frame = image.closest('[data-cover-frame]');
    const updateCoverState = () => {
      const hasImage = image.complete && image.naturalWidth > 0;
      if (frame) frame.hidden = !hasImage;
      else image.hidden = !hasImage;
    };
    image.addEventListener('load', updateCoverState);
    image.addEventListener('error', updateCoverState);
    updateCoverState();
  });

  document.querySelectorAll('[data-copy-citation]').forEach((button) =>
    button.addEventListener('click', async () => {
      const title = document.querySelector('.detail-page-hero h1')?.textContent.trim() || '';
      const details =
        document.querySelector('.detail-page-hero > p:last-child')?.textContent.trim() || '';
      const citation = `${title}. ${details}.`;
      try {
        await navigator.clipboard.writeText(citation);
        const originalLabel = button.textContent;
        button.textContent = 'CITATION COPIED';
        window.setTimeout(() => (button.textContent = originalLabel), 1600);
      } catch {
        button.textContent = 'COPY UNAVAILABLE';
        window.setTimeout(() => (button.textContent = 'COPY CITATION'), 1600);
      }
    }),
  );
})();
