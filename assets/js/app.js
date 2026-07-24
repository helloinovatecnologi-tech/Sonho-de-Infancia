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
    ],
    avaliacoes:[

        {
            src:"assets/img/avaliacoes/1.png"
        },

        {
            src:"assets/img/avaliacoes/2.png"
        },

        {
            src:"assets/img/avaliacoes/3.png"
        },

        {
            src:"assets/img/avaliacoes/4.png"
        },
                {
            src:"assets/img/avaliacoes/5.png"
        },

        {
            src:"assets/img/avaliacoes/6.png"
        },

        {
            src:"assets/img/avaliacoes/7.png"
        },
                {
            src:"assets/img/avaliacoes/8.png"
        },

        {
            src:"assets/img/avaliacoes/9.png"
        },

        {
            src:"assets/img/avaliacoes/10.png"
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
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


/* ======================================================
   CARROSSEL DA IDENTIDADE VISUAL
====================================================== */

const brandCarousel = document.querySelector('.brand-carousel');

  if (brandCarousel) {

    const track = brandCarousel.querySelector(
        '.brand-carousel__track'
    );

    const slides = [
        ...brandCarousel.querySelectorAll(
            '.brand-carousel__slide'
        )
    ];

    const carouselImages = [
        ...brandCarousel.querySelectorAll(
            '.brand-carousel__slide img'
        )
    ];

    const previousButton = brandCarousel.querySelector(
        '.brand-carousel__button--prev'
    );

    const nextButton = brandCarousel.querySelector(
        '.brand-carousel__button--next'
    );

    const dots = [
        ...brandCarousel.querySelectorAll(
            '.brand-carousel__dot'
        )
    ];

    let currentSlide = 0;
    let autoplay = null;

    const updateBrandCarousel = () => {

        if (!track || slides.length === 0) return;

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

        currentSlide =
            (currentSlide + 1) % slides.length;

        updateBrandCarousel();

    };

    const showPreviousSlide = () => {

        currentSlide =
            (currentSlide - 1 + slides.length)
            % slides.length;

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


    /* Monta o álbum usando as próprias imagens do carrossel */

    const carouselAlbum = carouselImages.map((image) => ({
        src: image.getAttribute('src'),
        alt: image.getAttribute('alt') || ''
    }));


    /* Abre a imagem clicada no lightbox */

    carouselImages.forEach((image, index) => {

        image.setAttribute('tabindex', '0');
        image.setAttribute('role', 'button');

        const openCarouselImage = () => {

            openLightbox(
                carouselAlbum,
                index
            );

        };

        image.addEventListener(
            'click',
            openCarouselImage
        );

        image.addEventListener('keydown', (event) => {

            if (
                event.key !== 'Enter' &&
                event.key !== ' '
            ) {
                return;
            }

            event.preventDefault();
            openCarouselImage();

        });

    });


    /* Autoplay */

    const startAutoplay = () => {

        clearInterval(autoplay);

        autoplay = setInterval(
            showNextSlide,
            3000
        );

    };

    const stopAutoplay = () => {

        clearInterval(autoplay);
        autoplay = null;

    };

    brandCarousel.addEventListener(
        'mouseenter',
        stopAutoplay
    );

    brandCarousel.addEventListener(
        'mouseleave',
        startAutoplay
    );

    updateBrandCarousel();
    startAutoplay();

  }

  /* ======================================================
    CARROSSEL DE AVALIAÇÕES
    ====================================================== */

    const testimonialsCarousel =
        document.querySelector(".testimonials-carousel");

    if (testimonialsCarousel) {

        const viewport = testimonialsCarousel.querySelector(
            ".testimonials-carousel__viewport"
        );

        const track = testimonialsCarousel.querySelector(
            ".testimonials-carousel__track"
        );

        const prevButton = testimonialsCarousel.querySelector(
            ".testimonials-carousel__button--prev"
        );

        const nextButton = testimonialsCarousel.querySelector(
            ".testimonials-carousel__button--next"
        );

        const dotsContainer = testimonialsCarousel.querySelector(
            ".testimonials-carousel__dots"
        );

        const slides = Array.from(
            track.querySelectorAll(".testimonial-slide")
        );

        let autoplayInterval = null;
        let scrollTimeout = null;

        const autoplayTime = 3500;

        /* ==========================================
        PREPARA OS SLIDES
        ========================================== */

        slides.forEach((slide, index) => {

            slide.dataset.index = String(index);

            const image = slide.querySelector("img");

            if (!image) return;

            image.dataset.index = String(index);
            image.setAttribute("tabindex", "0");
            image.setAttribute("role", "button");
            image.setAttribute(
                "aria-label",
                `Ampliar avaliação ${index + 1}`
            );

        });

        /* ==========================================
        TAMANHO DO PASSO
        ========================================== */

        function getScrollStep() {

            const firstSlide =
                track.querySelector(".testimonial-slide");

            if (!firstSlide) return viewport.clientWidth;

            const trackStyles = window.getComputedStyle(track);

            const gap =
                Number.parseFloat(trackStyles.columnGap) ||
                Number.parseFloat(trackStyles.gap) ||
                0;

            return firstSlide.getBoundingClientRect().width + gap;

        }

        /* ==========================================
        ÍNDICE ATUAL
        ========================================== */

        function getCurrentIndex() {

            const step = getScrollStep();

            if (!step) return 0;

            return Math.round(viewport.scrollLeft / step);

        }

        /* ==========================================
        NAVEGAÇÃO
        ========================================== */

        function goToSlide(index, smooth = true) {

            if (!slides.length) return;

            const normalizedIndex =
                (index + slides.length) % slides.length;

            viewport.scrollTo({
                left: normalizedIndex * getScrollStep(),
                behavior: smooth ? "smooth" : "auto"
            });

        }

        function nextSlide() {

            const currentIndex = getCurrentIndex();

            if (currentIndex >= slides.length - 1) {

                goToSlide(0);

                return;

            }

            goToSlide(currentIndex + 1);

        }

        function previousSlide() {

            const currentIndex = getCurrentIndex();

            if (currentIndex <= 0) {

                goToSlide(slides.length - 1);

                return;

            }

            goToSlide(currentIndex - 1);

        }

        /* ==========================================
        AUTOPLAY
        ========================================== */

        function stopAutoplay() {

            if (!autoplayInterval) return;

            clearInterval(autoplayInterval);
            autoplayInterval = null;

        }

        function startAutoplay() {

            stopAutoplay();

            if (slides.length <= 1) return;

            autoplayInterval = setInterval(
                nextSlide,
                autoplayTime
            );

        }

        function restartAutoplay() {

            stopAutoplay();
            startAutoplay();

        }

        /* ==========================================
        DOTS
        ========================================== */

        function createDots() {

            if (!dotsContainer) return;

            dotsContainer.innerHTML = "";

            slides.forEach((_, index) => {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "testimonials-carousel__dot";

                dot.setAttribute(
                    "aria-label",
                    `Ir para avaliação ${index + 1}`
                );

                dot.addEventListener("click", () => {

                    goToSlide(index);
                    restartAutoplay();

                });

                dotsContainer.appendChild(dot);

            });

        }

        function updateDots() {

            if (!dotsContainer) return;

            const currentIndex = getCurrentIndex();

            const dots = dotsContainer.querySelectorAll(
                ".testimonials-carousel__dot"
            );

            dots.forEach((dot, index) => {

                const isActive = index === currentIndex;

                dot.classList.toggle("active", isActive);

                dot.setAttribute(
                    "aria-current",
                    isActive ? "true" : "false"
                );

            });

        }

        /* ==========================================
        LIGHTBOX
        ========================================== */

        function openTestimonialImage(image) {

            const index = Number(image.dataset.index);

            if (
                !Number.isInteger(index) ||
                !albums.avaliacoes?.length
            ) {
                return;
            }

            openLightbox(
                albums.avaliacoes,
                index
            );

        }

        track.addEventListener("click", (event) => {

            const image = event.target.closest(
                ".testimonial-slide img"
            );

            if (!image) return;

            openTestimonialImage(image);

        });

        track.addEventListener("keydown", (event) => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }

            const image = event.target.closest(
                ".testimonial-slide img"
            );

            if (!image) return;

            event.preventDefault();

            openTestimonialImage(image);

        });

        /* ==========================================
        EVENTOS
        ========================================== */

        nextButton?.addEventListener("click", () => {

            nextSlide();
            restartAutoplay();

        });

        prevButton?.addEventListener("click", () => {

            previousSlide();
            restartAutoplay();

        });

        viewport.addEventListener(
            "scroll",
            () => {

                clearTimeout(scrollTimeout);

                scrollTimeout = setTimeout(
                    updateDots,
                    80
                );

            },
            { passive: true }
        );

        testimonialsCarousel.addEventListener(
            "mouseenter",
            stopAutoplay
        );

        testimonialsCarousel.addEventListener(
            "mouseleave",
            startAutoplay
        );

        testimonialsCarousel.addEventListener(
            "focusin",
            stopAutoplay
        );

        testimonialsCarousel.addEventListener(
            "focusout",
            startAutoplay
        );

        viewport.addEventListener(
            "touchstart",
            stopAutoplay,
            { passive: true }
        );

        viewport.addEventListener(
            "touchend",
            startAutoplay,
            { passive: true }
        );

        window.addEventListener("resize", () => {

            const currentIndex = getCurrentIndex();

            window.requestAnimationFrame(() => {

                goToSlide(currentIndex, false);

            });

        });

        /* ==========================================
        INICIALIZAÇÃO
        ========================================== */

        createDots();
        updateDots();
        startAutoplay();

    }

  });
})();
