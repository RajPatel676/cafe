document.addEventListener('DOMContentLoaded', () => {
    // --- Intro Curtain Reveal ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 800);
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .menu-item');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // --- Hamburger / Mobile Drawer ---
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        hamburger?.classList.add('open');
        drawer?.classList.add('open');
        drawerOverlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        hamburger?.classList.remove('open');
        drawer?.classList.remove('open');
        drawerOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', openDrawer);
    drawerClose?.addEventListener('click', closeDrawer);
    drawerOverlay?.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('.site-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Interactive Menu Image Swap ---
    const menuRows = document.querySelectorAll('.menu-row');
    const dynamicMenuImg = document.getElementById('dynamic-menu-img');

    if (menuRows.length > 0 && dynamicMenuImg) {
        menuRows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                const newImgSrc = this.getAttribute('data-img');
                if (dynamicMenuImg.src !== newImgSrc) {
                    dynamicMenuImg.style.opacity = 0; // Fade out
                    setTimeout(() => {
                        dynamicMenuImg.src = newImgSrc;
                        dynamicMenuImg.onload = () => {
                            dynamicMenuImg.style.opacity = 1; // Fade in after load
                        };
                    }, 300); // Wait for fade out to complete
                }
            });
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.replace('ph-sun', 'ph-moon');
            } else {
                icon.classList.replace('ph-moon', 'ph-sun');
            }
        });
    }

    // --- Testimonial Slider ---
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    if (track && slides.length > 0) {
        let currentIndex = 0;

        const updateSlider = (index) => {
            track.scrollTo({
                left: slides[index].offsetLeft,
                behavior: 'smooth'
            });
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) nextIndex = 0;
                updateSlider(nextIndex);
            });

            prevBtn.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) prevIndex = slides.length - 1;
                updateSlider(prevIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
            });
        });

        // Auto-play
        setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            updateSlider(nextIndex);
        }, 5000);
    }

    // --- Subtle Parallax Effect for Images ---
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxImages.forEach(img => {
            const speed = 0.05; // Reduced from 0.15 — much more subtle
            const yPos = -(scrolled * speed);
            const clamped = Math.max(yPos, -40); // Never move more than 40px up
            img.style.transform = `translateY(${clamped}px)`;
        });
    });

    // --- Intersection Observer for Scroll Reveals ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Unobserve for performance so it only runs once
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));

    // Hero Slider Logic
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroNums = document.querySelectorAll('.slide-num');
    const heroProgress = document.getElementById('hero-progress');
    const btnPrev = document.getElementById('hero-prev');
    const btnNext = document.getElementById('hero-next');
    let currentHeroSlide = 0;
    let heroInterval;
    const slideDuration = 6000; // 6 seconds per slide

    function goToHeroSlide(index) {
        if (!heroSlides.length) return;
        
        heroSlides[currentHeroSlide].classList.remove('active');
        heroNums[currentHeroSlide].classList.remove('active');
        
        currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
        
        heroSlides[currentHeroSlide].classList.add('active');
        heroNums[currentHeroSlide].classList.add('active');
        
        if (heroProgress) {
            heroProgress.style.transition = 'none';
            heroProgress.style.width = '0%';
            setTimeout(() => {
                heroProgress.style.transition = `width ${slideDuration}ms linear`;
                heroProgress.style.width = '100%';
            }, 50);
        }
    }

    function nextHeroSlide() {
        goToHeroSlide(currentHeroSlide + 1);
    }

    function prevHeroSlide() {
        goToHeroSlide(currentHeroSlide - 1);
    }

    function resetHeroInterval() {
        clearInterval(heroInterval);
        heroInterval = setInterval(nextHeroSlide, slideDuration);
    }

    if (heroSlides.length > 0) {
        if (heroProgress) {
            setTimeout(() => {
                heroProgress.style.transition = `width ${slideDuration}ms linear`;
                heroProgress.style.width = '100%';
            }, 50);
        }
        
        heroInterval = setInterval(nextHeroSlide, slideDuration);

        btnNext?.addEventListener('click', () => {
            nextHeroSlide();
            resetHeroInterval();
        });

        btnPrev?.addEventListener('click', () => {
            prevHeroSlide();
            resetHeroInterval();
        });

        heroNums.forEach(num => {
            num.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-slide'));
                goToHeroSlide(idx);
                resetHeroInterval();
            });
        });
    }
});
