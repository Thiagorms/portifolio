document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Initialize AOS after preloader is done
                AOS.init({
                    once: false,
                    offset: 100,
                    duration: 800,
                    easing: 'ease-out-cubic'
                });
            }, 500);
        }, 1500); // 1.5s loading simulation
    });

    // --- 2. Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        // Direct cursor
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Follower delay (smoothness using GSAP is better, but this works natively)
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hover effect on interactable elements
    const links = document.querySelectorAll('a, button, .project-card, .skill-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // --- 3. Typing Effect ---
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Desenvolvedor Front-End", "Especialista JavaScript", "Criador de Interfaces", "Entusiasta UI/UX"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // --- 4. Mobile Menu & Sticky Header ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
    }));

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(7, 7, 20, 0.9)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(7, 7, 20, 0.7)';
            header.style.boxShadow = 'none';
        }

        // Active link highlight based on scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 5. Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Re-trigger AOS animation
                    setTimeout(() => { card.classList.add('aos-animate'); }, 100);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('aos-animate');
                }
            });
            // Refresh AOS
            setTimeout(() => AOS.refresh(), 200);
        });
    });

    // --- 6. Animated Wave Grid Background (Hero Section) ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let time = 0;
        
        function drawGridWave() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Grid Properties
            const cols = 20;
            const rows = 15;
            const spacingX = canvas.width / cols;
            const spacingY = canvas.height / rows;
            
            // Flowing Wave Parameters
            const frequencyX = 0.05;
            const frequencyY = 0.05;
            const amplitude = 30;
            const speed = 0.02;

            ctx.lineWidth = 1;

            // Draw horizontal lines
            for (let y = 0; y <= rows; y++) {
                ctx.beginPath();
                for (let x = 0; x <= cols; x++) {
                    const posX = x * spacingX;
                    const posY = y * spacingY;
                    
                    // Wave distortion
                    const waveY = Math.sin(posX * frequencyX + time) * amplitude;
                    const waveX = Math.cos(posY * frequencyY + time) * amplitude;

                    const finalX = posX + waveX;
                    const finalY = posY + waveY;

                    if (x === 0) {
                        ctx.moveTo(finalX, finalY);
                    } else {
                        ctx.lineTo(finalX, finalY);
                    }
                }
                
                // Opacity based on height (fade out lower down)
                const alpha = 1 - (y/rows);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
                ctx.stroke();
            }

            // Draw vertical lines
            for (let x = 0; x <= cols; x++) {
                ctx.beginPath();
                for (let y = 0; y <= rows; y++) {
                    const posX = x * spacingX;
                    const posY = y * spacingY;
                    
                    // Wave distortion
                    const waveY = Math.sin(posX * frequencyX + time) * amplitude;
                    const waveX = Math.cos(posY * frequencyY + time) * amplitude;

                    const finalX = posX + waveX;
                    const finalY = posY + waveY;

                    if (y === 0) {
                        ctx.moveTo(finalX, finalY);
                    } else {
                        ctx.lineTo(finalX, finalY);
                    }
                }
                
                const alpha = Math.sin((x/cols) * Math.PI); // Stronger in middle
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
                ctx.stroke();
            }

            time += speed;
            requestAnimationFrame(drawGridWave);
        }

        drawGridWave();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // --- 7. GSAP Specific Animations (Optional additions beyond AOS) ---
    // Example: Parallax effect on hero
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        
        gsap.to('.hero-content', {
            x: x,
            y: y,
            duration: 1,
            ease: 'power1.out'
        });
    });
});
