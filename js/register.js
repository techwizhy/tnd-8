document.addEventListener('DOMContentLoaded', () => {
    // 1. 3D Tilt Effect on Course Cards
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const maxRotate = 8; // Max rotation degrees
            const rotateX = ((centerY - y) / centerY) * maxRotate;
            const rotateY = ((x - centerX) / centerX) * maxRotate;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 2. Syllabus Accordion Toggle
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                }
            });
            
            // Toggle active state
            if (isActive) {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    // 3. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('reveal-visible'));
    }

    // 4. Floating Gold Dust Particles Simulation
    const canvas = document.getElementById('gold-dust-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 30;
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.reset(true);
            }
            
            reset(init = false) {
                this.x = Math.random() * canvas.width;
                this.y = init ? Math.random() * canvas.height : canvas.height + 15;
                this.size = Math.random() * 2 + 0.6;
                this.speedY = Math.random() * 0.35 + 0.15;
                this.speedX = (Math.random() - 0.5) * 0.15;
                this.maxLife = Math.random() * 350 + 200;
                this.life = init ? Math.random() * this.maxLife : this.maxLife;
                this.opacity = 0;
            }
            
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.life--;
                
                if (this.life > this.maxLife * 0.85) {
                    this.opacity = (this.maxLife - this.life) / (this.maxLife * 0.15);
                } else if (this.life < this.maxLife * 0.25) {
                    this.opacity = this.life / (this.maxLife * 0.25);
                } else {
                    this.opacity = 1;
                }
                
                if (this.life <= 0 || this.y < -10 || this.x < 0 || this.x > canvas.width) {
                    this.reset(false);
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                if (document.body.classList.contains('light-theme')) {
                    ctx.fillStyle = `rgba(180, 83, 9, ${this.opacity * 0.25})`;
                } else {
                    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity * 0.2})`;
                }
                ctx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        const drawLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(drawLoop);
        };
        
        requestAnimationFrame(drawLoop);
    }
});
