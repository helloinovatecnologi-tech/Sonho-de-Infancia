(() => {
  'use strict';

  const onReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };



  onReady(() => {
    const body = document.body;
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const menuButton = document.querySelector('.menu-button');
    const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
    const sections = [...document.querySelectorAll('main section[id]')];
    const backToTop = document.querySelector('.back-to-top');
    const preloader = document.querySelector('.preloader');

    // Scroll suave premium via Lenis (com fallback nativo).
    let lenis = null;
    if (typeof window.Lenis === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.1 });
      const raf = (time) => { lenis.raf(time); window.requestAnimationFrame(raf); };
      window.requestAnimationFrame(raf);
    }

    // Entrada cinematográfica do hero com GSAP.
    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const gsap = window.gsap;
      document.documentElement.classList.add('hero-ready');
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
      timeline
        .from('.header__inner', { y: -26, opacity: 0, duration: 0.8, clearProps: "transform" })
        .from('.hero__copy .eyebrow', { y: 18, opacity: 0, duration: 0.55 }, '-=0.35')
        .from('.hero__copy h1 span, .hero__copy h1 em', { y: 70, opacity: 0, rotate: 2, stagger: 0.09, duration: 0.85 }, '-=0.25')
        .from('.hero__copy > p', { y: 24, opacity: 0, duration: 0.6 }, '-=0.45')
        .from('.hero__actions', { y: 22, opacity: 0, duration: 0.55 }, '-=0.35')
        .from('.hero__trust span', { y: 14, opacity: 0, stagger: 0.07, duration: 0.45 }, '-=0.25')
        .from('.hero__visual', { x: 50, opacity: 0, duration: 0.9 }, '-=0.75')
        .from('.scroll-cue', { opacity: 0, y: -10, duration: 0.45 }, '-=0.25');
    }

    // Preloader: remove rapidamente e garante que nunca bloqueie a página.
    const hidePreloader = () => preloader?.classList.add('hidden');
    window.addEventListener('load', () => window.setTimeout(hidePreloader, 350), { once: true });
    window.setTimeout(hidePreloader, 1800);

    // Ano atual no rodapé.
    const year = document.querySelector('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Header, navegação ativa e botão voltar ao topo.
    const updateOnScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle('scrolled', y > 30);
      backToTop?.classList.toggle('show', y > 700);

      let currentSection = '';
      sections.forEach((section) => {
        if (y >= section.offsetTop - 190) currentSection = section.id;
      });

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
      });
    };

    updateOnScroll();
    window.addEventListener('scroll', updateOnScroll, { passive: true });

    // Menu mobile.
    const closeMenu = () => {
      nav?.classList.remove('open');
      body.classList.remove('menu-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Abrir menu');
    };

    menuButton?.addEventListener('click', () => {
      if (!nav) return;
      const isOpen = nav.classList.toggle('open');
      body.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    });
    // Fecha o menu ao clicar fora dele
document.addEventListener('click', (event) => {

    if (!nav?.classList.contains('open')) return;

    const clicouNoMenu = nav.contains(event.target);
    const clicouNoBotao = menuButton?.contains(event.target);

    if (!clicouNoMenu && !clicouNoBotao) {
        closeMenu();
    }

});

    // Animações de entrada.
    const revealElements = [...document.querySelectorAll('.reveal')];
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

      revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => element.classList.add('visible'));
    }

    // Parallax leve no desktop, usando requestAnimationFrame.
    const parallaxElements = [...document.querySelectorAll('[data-parallax]')];
    let parallaxFrame = null;
    const updateParallax = () => {
      parallaxFrame = null;
      if (window.innerWidth <= 800) {
        parallaxElements.forEach((element) => { element.style.transform = ''; });
        return;
      }
      const y = window.scrollY;
      parallaxElements.forEach((element) => {
        const speed = Number(element.dataset.parallax || 0.1);
        element.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    };
    window.addEventListener('scroll', () => {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();

    // Lightbox da galeria.
// ======================================================
// ÁLBUNS DA GALERIA
// ======================================================

const albums = {

    bercario: [
        {
            src: 'assets/img/bercario.jpeg',
            alt: 'Berçário'
        },
        {
            src: 'assets/img/bercario1.jpeg',
            alt: 'Outra visão do berçário'
        }
    ],

    atelie: [
        {
            src: 'assets/img/Sala Atelie.jpeg',
            alt: 'Sala Ateliê'
        }
    ],

    maternal: [
        {
            src: 'assets/img/Sala Maternal.jpeg',
            alt: 'Sala Maternal'
        },
        {
            src: 'assets/img/Sala Maternal2.jpeg',
            alt: 'Outra visão da Sala Maternal'
        }
    ]

};


// ======================================================
// ELEMENTOS DO LIGHTBOX
// ======================================================

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox__image');
const lightboxClose = lightbox?.querySelector('.lightbox__close');
const lightboxPrev = lightbox?.querySelector('.lightbox__prev');
const lightboxNext = lightbox?.querySelector('.lightbox__next');
const lightboxCounter = lightbox?.querySelector('.lightbox__counter');

let currentAlbum = [];
let currentImageIndex = 0;


// ======================================================
// MOSTRAR IMAGEM ATUAL
// ======================================================

const showCurrentImage = () => {

    if (!lightboxImage || currentAlbum.length === 0) return;

    const currentImage = currentAlbum[currentImageIndex];

    lightboxImage.src = currentImage.src;
    lightboxImage.alt = currentImage.alt || '';

    if (lightboxCounter) {

        lightboxCounter.textContent =
            `${currentImageIndex + 1} de ${currentAlbum.length}`;

    }

    const hasMultipleImages = currentAlbum.length > 1;

    if (lightboxPrev) {
        lightboxPrev.hidden = !hasMultipleImages;
    }

    if (lightboxNext) {
        lightboxNext.hidden = !hasMultipleImages;
    }

};


// ======================================================
// ABRIR LIGHTBOX
// ======================================================

const openLightbox = (images, startIndex = 0) => {

    if (!lightbox || !lightboxImage || !images?.length) return;

    currentAlbum = images;
    currentImageIndex = startIndex;

    showCurrentImage();

    lightbox.classList.add('open');
    body.classList.add('lightbox-open');

    lightboxClose?.focus();

};


// ======================================================
// FECHAR LIGHTBOX
// ======================================================

const closeLightbox = () => {

    lightbox?.classList.remove('open');
    body.classList.remove('lightbox-open');

    currentAlbum = [];
    currentImageIndex = 0;

    if (lightboxImage) {
        lightboxImage.src = '';
        lightboxImage.alt = '';
    }

};


// ======================================================
// PRÓXIMA IMAGEM
// ======================================================

const showNextImage = () => {

    if (currentAlbum.length <= 1) return;

    currentImageIndex =
        (currentImageIndex + 1) % currentAlbum.length;

    showCurrentImage();

};


// ======================================================
// IMAGEM ANTERIOR
// ======================================================

const showPreviousImage = () => {

    if (currentAlbum.length <= 1) return;

    currentImageIndex =
        (currentImageIndex - 1 + currentAlbum.length)
        % currentAlbum.length;

    showCurrentImage();

};


// ======================================================
// CARDS DA GALERIA
// ======================================================

document.querySelectorAll('[data-lightbox]').forEach((item) => {

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    const openItem = () => {

        const albumName = item.dataset.album;
        const source = item.tagName === "IMG" ? item : item.querySelector("img");

        /*
         * Caso o card tenha data-album, abre todas
         * as imagens cadastradas no álbum.
         */
        if (albumName && albums[albumName]) {

            const album = albums[albumName];

            const clickedImage = source.getAttribute("src");

            const clickedIndex = album.findIndex(image => {

                return image.src.split('/').pop() === clickedImage.split('/').pop();

            });

            openLightbox(
                album,
                clickedIndex >= 0 ? clickedIndex : 0
            );

            return;

        }

        /*
         * Caso não tenha álbum, abre somente
         * a imagem existente no card.
         */
        if (!source) return;

        openLightbox([
            {
                src: source.currentSrc || source.src,
                alt: source.alt || ''
            }
        ]);

    };

    item.addEventListener('click', openItem);

    item.addEventListener('keydown', (event) => {

        if (event.key !== 'Enter' && event.key !== ' ') return;

        event.preventDefault();

        openItem();

    });

});


// ======================================================
// CONTROLES
// ======================================================

lightboxClose?.addEventListener('click', closeLightbox);

lightboxNext?.addEventListener('click', (event) => {

    event.stopPropagation();

    showNextImage();

});

lightboxPrev?.addEventListener('click', (event) => {

    event.stopPropagation();

    showPreviousImage();

});

lightbox?.addEventListener('click', (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


// ======================================================
// CONTROLE PELO TECLADO
// ======================================================

window.addEventListener('keydown', (event) => {

    if (!lightbox?.classList.contains('open')) return;

    if (event.key === 'Escape') {
        closeLightbox();
    }

    if (event.key === 'ArrowRight') {
        showNextImage();
    }

    if (event.key === 'ArrowLeft') {
        showPreviousImage();
    }

});

    // FAQ: mantém somente uma pergunta aberta.
    document.querySelectorAll('.accordion details').forEach((detail) => {
      detail.addEventListener('toggle', () => {
        if (!detail.open) return;
        document.querySelectorAll('.accordion details').forEach((other) => {
          if (other !== detail) other.open = false;
        });
      });
    });

    // Interações de inclinação e botões magnéticos apenas em dispositivos com mouse.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (finePointer.matches) {
      document.querySelectorAll('[data-tilt]').forEach((card) => {
        card.addEventListener('mousemove', (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });

      document.querySelectorAll('.magnetic').forEach((button) => {
        button.addEventListener('mousemove', (event) => {
          const rect = button.getBoundingClientRect();
          const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
          const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
          button.style.transform = `translate(${x}px, ${y}px)`;
        });
        button.addEventListener('mouseleave', () => { button.style.transform = ''; });
      });
    }

    // Brilho que acompanha o cursor nos cards.
    document.querySelectorAll('.feature-card, .service-card, .info-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      });
    });

    // Halo sutil seguindo o mouse no desktop.
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && finePointer.matches) {
      body.classList.add('has-pointer');
      let mouseX = 0;
      let mouseY = 0;
      let glowX = 0;
      let glowY = 0;
      window.addEventListener('pointermove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      }, { passive: true });
      const animateGlow = () => {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        cursorGlow.style.transform = `translate3d(${glowX - 160}px, ${glowY - 160}px, 0)`;
        window.requestAnimationFrame(animateGlow);
      };
      animateGlow();
    }

    // Scroll suave para links internos também quando Lenis estiver ativo.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target || !lenis) return;
        event.preventDefault();
        closeMenu();
        lenis.scrollTo(target, { offset: -92 });
      });
    });

    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
const brandCarousel = document.querySelector('.brand-carousel');

if (brandCarousel) {

    const track = brandCarousel.querySelector('.brand-carousel__track');

    const slides = brandCarousel.querySelectorAll(
        '.brand-carousel__slide'
    );

    const previousButton = brandCarousel.querySelector(
        '.brand-carousel__button--prev'
    );

    const nextButton = brandCarousel.querySelector(
        '.brand-carousel__button--next'
    );

    const dots = brandCarousel.querySelectorAll(
        '.brand-carousel__dot'
    );

    let currentSlide = 0;

    const updateBrandCarousel = () => {

        track.style.transform =
            `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                'active',
                index === currentSlide
            );

        });

    };

    const showNextSlide = () => {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        updateBrandCarousel();

    };

    const showPreviousSlide = () => {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        updateBrandCarousel();

    };

    nextButton?.addEventListener(
        'click',
        showNextSlide
    );

    previousButton?.addEventListener(
        'click',
        showPreviousSlide
    );

    dots.forEach((dot, index) => {

        dot.addEventListener('click', () => {

            currentSlide = index;

            updateBrandCarousel();

        });

    });

    let autoplay = setInterval(showNextSlide, 3000);

    brandCarousel.addEventListener('mouseenter', () => {

        clearInterval(autoplay);

    });

    brandCarousel.addEventListener('mouseleave', () => {

        autoplay = setInterval(showNextSlide, 3000);

    });

}
