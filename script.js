document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================
       Map Initialization (Local africa.geo.json - Africa Only)
    ====================================================== */
    const mapElement = document.getElementById('africa-leaflet-map');
    if (mapElement) {
        var map = L.map('africa-leaflet-map', {
            zoomControl: true,
            attributionControl: false
        }).setView([3, 20], 3);

        map.setMinZoom(3);
        map.setMaxZoom(7);
        map.setMaxBounds([[-40, -30], [40, 60]]);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Leaflet | &copy; OpenStreetMap contributors'
        }).addTo(map);

        // Highlighted countries with English names and client count
        const highlightedData = {
            'EG': { name: 'Egypt', clients: 12 },
            'NG': { name: 'Nigeria', clients: 18 },
            'KE': { name: 'Kenya', clients: 10 },
            'ZA': { name: 'South Africa', clients: 15 },
            'CD': { name: 'DR Congo', clients: 8 },
            'MG': { name: 'Madagascar', clients: 6 }
        };

        const highlightedCountries = Object.keys(highlightedData);

        function getStyle(feature) {
            const code = feature.properties.iso_a2;

            if (!code || code === '-99') {
                return {
                    fillColor: '#e0e0e0',
                    weight: 1,
                    color: '#ffffff',
                    fillOpacity: 0.6,
                    interactive: false  // disables all interactions
                };
            }

            if (highlightedCountries.includes(code)) {
                return {
                    fillColor: '#C12A30',  // Updated to new primary color
                    weight: 2,
                    color: '#C12A30',
                    fillOpacity: 1
                };
            }

            return {
                fillColor: '#e0e0e0',
                weight: 1,
                color: '#ffffff',
                fillOpacity: 0.6,
                interactive: false  // no hover or tooltip for non-highlighted
            };
        }

        function onEachFeature(feature, layer) {
            const code = feature.properties.iso_a2;

            // Only add interaction for highlighted countries
            if (highlightedCountries.includes(code)) {
                const data = highlightedData[code];
                const tooltipContent = `
                    <strong>${data.name}</strong><br>
                    <span style="font-size:13px; opacity:0.9;">${data.clients} Clients</span>
                `;

                layer.bindTooltip(tooltipContent, {
                    permanent: false,
                    sticky: true,
                    direction: 'top',
                    className: 'highlight-tooltip',
                    offset: [0, -10]
                });

                layer.on({
                    mouseover: function(e) {
                        e.target.setStyle({
                            weight: 4,
                            color: '#ffffff',
                            fillOpacity: 1
                        });
                        e.target.bringToFront();
                    },
                    mouseout: function(e) {
                        layer.setStyle(getStyle(feature));
                    }
                });
            }
            // No events or tooltip for other countries
        }

        // تحميل الملف المحلي africa.geo.json
        fetch('africa.geo.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load africa.geo.json - تأكد إنه موجود في نفس المجلد');
                }
                return response.json();
            })
            .then(data => {
                // إضافة طبقة الـ GeoJSON إلى الخريطة
                const geoLayer = L.geoJson(data, {
                    style: getStyle,
                    onEachFeature: onEachFeature
                }).addTo(map);

                // مهم جدًا للريسبونسيف: إعادة حساب حجم الخريطة بعد التحميل
                // (خاصة على الموبايل أو عند تغيير حجم النافذة)
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);

                // في حالة تغيير حجم الشاشة (rotate أو resize)
                window.addEventListener('resize', () => {
                    map.invalidateSize();
                });
            })
            .catch(err => {
                console.error('خطأ في تحميل الخريطة:', err);
                mapElement.innerHTML = `
                    <p style="padding: 2rem; color: #555; text-align: center;">
                        Unable to load the map.<br>
                        Please ensure that <strong>africa.geo.json</strong> is in the same folder as the HTML file.
                    </p>`;
            });
    }

    /* ======================================================
       1. Hero Lottie Animation
    ====================================================== */
    const chefContainer = document.getElementById('lottie-cooking-container');
    if (chefContainer) {
        lottie.loadAnimation({
            container: chefContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'Cooking Loop Animation.json'
        });
    }

    /* ======================================================
       2. Premium Solutions (FIXED – Works on Mobile & Desktop)
    ====================================================== */
    const setupSolutionSwitching = () => {
        const rows = document.querySelectorAll('.solution-row');

        rows.forEach((row, index) => {
            const container = row.querySelector('.image-inner');
            if (!container) return;

            const lottieId = index === 0 ? 'lottie-bakery' : 'lottie-pharma';
            const lottiePath = index === 0
                ? 'Cream-Fil Ube.json'
                : 'Scientist.json';

            const lottieContainer = document.getElementById(lottieId);
            if (!lottieContainer) return;

            let animationInstance = null;
            let isLottiePhase = true;

            const loadAndStartAnimation = () => {
                animationInstance = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: lottiePath
                });

                const runCycle = () => {
                    if (isLottiePhase) {
                        container.classList.remove('show-img');
                        container.classList.add('show-lottie');
                        setTimeout(() => {
                            isLottiePhase = false;
                            runCycle();
                        }, 6000);
                    } else {
                        container.classList.remove('show-lottie');
                        container.classList.add('show-img');
                        setTimeout(() => {
                            isLottiePhase = true;
                            runCycle();
                        }, 3000);
                    }
                };

                animationInstance.addEventListener('DOMLoaded', runCycle);
            };

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadAndStartAnimation();
                    observer.disconnect();
                }
            }, { threshold: 0.1 });

            observer.observe(row);
        });
    };

    setupSolutionSwitching();

    /* ======================================================
       3. Scroll Reveal Animations
    ====================================================== */
    const revealElements = () => {
        const reveals = document.querySelectorAll(
            '.reveal-left, .reveal-right, .reveal-up, .solution-row'
        );
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                el.classList.add('active-reveal');
            }
        });
    };

    /* ======================================================
       4. Odometer Counters
    ====================================================== */
    const statsSection = document.querySelector('.stats-counter');
    let started = false;

    const startCounters = () => {
        if (!statsSection || started) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            setTimeout(() => {
                const el = document.getElementById('years-odometer');
                if (el) el.innerHTML = 20;
            }, 200);

            setTimeout(() => {
                const el = document.getElementById('clients-odometer');
                if (el) el.innerHTML = 1500;
            }, 500);

            setTimeout(() => {
                const el = document.getElementById('countries-odometer');
                if (el) el.innerHTML = 25;
            }, 800);

            started = true;
        }
    };

    /* ======================================================
       5. Products Slider
    ====================================================== */
    const slides = document.querySelectorAll('#productsSlider .slide');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    let currentSlide = 0;

    if (slides.length > 0) {
        const showSlide = (index) => {
            slides.forEach((slide, i) =>
                slide.classList.toggle('active', i === index)
            );
            currentSlide = index;
        };

        const nextSlide = () =>
            showSlide((currentSlide + 1) % slides.length);
        const prevSlide = () =>
            showSlide((currentSlide - 1 + slides.length) % slides.length);

        let sliderInterval = setInterval(nextSlide, 5000);

        if (nextBtn) nextBtn.addEventListener('click', () => {
            clearInterval(sliderInterval);
            nextSlide();
            sliderInterval = setInterval(nextSlide, 5000);
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            clearInterval(sliderInterval);
            prevSlide();
            sliderInterval = setInterval(nextSlide, 5000);
        });

        showSlide(0);
    }

    /* ======================================================
       6. Scroll Events
    ====================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        revealElements();
        startCounters();

        if (navbar) {
            navbar.classList.toggle('fixed', window.scrollY > 100);
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('show', window.scrollY > 300);
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ======================================================
       7. Hamburger Menu & Loading Screen
    ====================================================== */
    const hamburger = document.getElementById('hamburger');
    const navContainer = document.querySelector('.nav-container');

    if (hamburger && navContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navContainer.classList.toggle('active');
        });
    }

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
        }, 2000);
    }

    /* Initial run */
    revealElements();

/* ======================================================
       AI Assistant Button - Show on Scroll + Full Functionality (محدث)
    ====================================================== */
    const aiAssistantBtn = document.getElementById('aiAssistantBtn');
    const aiPopup = document.getElementById('aiChatPopup');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatBody = document.getElementById('chatBody');

    // إخفاء الزر في البداية
    if (aiAssistantBtn) {
        aiAssistantBtn.style.opacity = '0';
        aiAssistantBtn.style.visibility = 'hidden';
        aiAssistantBtn.style.transform = 'translateY(20px) scale(0.9)';
        aiAssistantBtn.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
    }

    // دالة لتحديث حالة الزر
    const updateAiButtonVisibility = () => {
        if (!aiAssistantBtn) return;

        // لو الشات مفتوح → خلي الزر ظاهر دايماً
        if (aiPopup && aiPopup.classList.contains('open')) {
            aiAssistantBtn.style.opacity = '1';
            aiAssistantBtn.style.visibility = 'visible';
            aiAssistantBtn.style.transform = 'translateY(0) scale(1)';
        } else {
            // السلوك العادي: يظهر بس لما scrollY > 100
            if (window.scrollY > 100) {
                aiAssistantBtn.style.opacity = '1';
                aiAssistantBtn.style.visibility = 'visible';
                aiAssistantBtn.style.transform = 'translateY(0) scale(1)';
            } else {
                aiAssistantBtn.style.opacity = '0';
                aiAssistantBtn.style.visibility = 'hidden';
                aiAssistantBtn.style.transform = 'translateY(20px) scale(0.9)';
            }
        }
    };

    // استدعاء الدالة عند السكرول وعند فتح/إغلاق الشات
    window.addEventListener('scroll', updateAiButtonVisibility);

    // فتح وإغلاق الشات
    if (aiAssistantBtn && aiPopup) {
        aiAssistantBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            aiPopup.classList.toggle('open');
            updateAiButtonVisibility(); // تحديث فوري
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            aiPopup.classList.remove('open');
            updateAiButtonVisibility(); // تحديث فوري
        });
    }

    // إغلاق الشات لو ضغطت بره
    document.addEventListener('click', (e) => {
        if (aiPopup && aiPopup.classList.contains('open')) {
            if (!aiPopup.contains(e.target) && !aiAssistantBtn.contains(e.target)) {
                aiPopup.classList.remove('open');
                updateAiButtonVisibility();
            }
        }
    });

    /* باقي كود الشات (إرسال الرسايل والرد التلقائي) نفس ما كان... */

    if (sendMessage && chatInput) {
        const sendUserMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage(text, 'user-message');
            chatInput.value = '';

            setTimeout(() => {
                const botResponses = [
                    "شكرًا على رسالتك! 👋 هساعدك في أي استفسار عن منتجات RAJ أو الشحن.",
                    "ممكن توضح استفسارك أكتر؟ أنا هنا عشان أساعدك 😊",
                    "جاهز للإجابة على أي سؤال عن المكونات، الأسعار، أو الطلبات!",
                    "هل تقصد منتج معين؟ زي Food Colors أو Snack Pellets؟"
                ];
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                appendMessage(randomResponse, 'bot-message');
            }, 800 + Math.random() * 700);
        };

        sendMessage.addEventListener('click', sendUserMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendUserMessage();
            }
        });
    }

    function appendMessage(text, className) {
        const message = document.createElement('div');
        message.classList.add('message', className);
        message.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        chatBody.appendChild(message);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Vanilla Tilt إذا موجود
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".ai-assistant-btn"), {
            max: 25,
            speed: 400,
            glare: true,
            "max-glare": 0.5,
            perspective: 1000,
            scale: 1.1
        });
    }

    // تحديث أولي للزر
    updateAiButtonVisibility();
    
});