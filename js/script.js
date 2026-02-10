/**
 * Fun Maths Academy - Shared Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // --- Navigation: Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('header');

    if (mobileMenuButton && mobileMenu) {
        const toggleMenu = (show) => {
            const isVisible = show !== undefined ? show : !mobileMenu.classList.contains('active');

            if (isVisible) {
                mobileMenu.classList.add('active');
                mobileMenuButton.innerHTML = '<i data-lucide="x"></i>';
                document.body.classList.add('menu-open');
            } else {
                mobileMenu.classList.remove('active');
                mobileMenuButton.innerHTML = '<i data-lucide="menu"></i>';
                document.body.classList.remove('menu-open');
            }
            if (window.lucide) lucide.createIcons();
        };

        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !mobileMenuButton.contains(e.target) &&
                !header.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // Handle Resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const animateElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // --- Blog Filtering Logic (if present) ---
    const searchInput = document.getElementById('blog-search');
    const categoryFilter = document.getElementById('category-filter');
    const blogItems = document.querySelectorAll('.blog-item');

    if (searchInput || categoryFilter) {
        const filterBlogs = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const selectedCategory = categoryFilter ? categoryFilter.value : 'all';

            blogItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const category = item.getAttribute('data-category');
                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

                if (matchesSearch && matchesCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };

        if (searchInput) searchInput.addEventListener('input', filterBlogs);
        if (categoryFilter) categoryFilter.addEventListener('change', filterBlogs);
    }

    // --- Form Validation (Generic) ---
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

            inputs.forEach(input => {
                const errorEl = input.nextElementSibling;
                if (!input.value.trim()) {
                    input.classList.add('border-red-500');
                    if (errorEl && errorEl.classList.contains('error-msg')) {
                        errorEl.classList.remove('hidden');
                    }
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500');
                    if (errorEl && errorEl.classList.contains('error-msg')) {
                        errorEl.classList.add('hidden');
                    }
                }
            });

            if (isValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                submitBtn.disabled = true;
                submitBtn.innerText = 'Processing...';

                // Simulate success
                setTimeout(() => {
                    const successMsg = form.querySelector('.success-msg');
                    if (successMsg) {
                        successMsg.classList.remove('hidden');
                        form.reset();
                    }
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }, 1500);
            }
        });
    });
    // --- Tab Switching Logic (for Services) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');

                // Update buttons
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update panes
                tabPanes.forEach(pane => {
                    if (pane.id === target) {
                        pane.classList.remove('hidden');
                    } else {
                        pane.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Improved Testimonial Slider Logic ---
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.testimonial-nav');

    if (track && cards.length > 0) {
        let currentIndex = 0;
        const slideInterval = 5000;

        // Clear previous dots if any and create new ones
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            cards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('nav-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            const dots = document.querySelectorAll('.nav-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const updateCarousel = () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = 32; // Matches 2rem gap in CSS
            track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            updateDots();
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        };

        // Initialize and setup observer for responsive recalculation
        window.addEventListener('resize', updateCarousel);
        setInterval(nextSlide, slideInterval);
    }

    // --- Course Catalog Filtering Logic ---
    const courseSearch = document.getElementById('course-search');
    const courseFilters = document.querySelectorAll('.course-filter-btn');
    const courseItems = document.querySelectorAll('.course-card');

    if (courseItems.length > 0) {
        let activeFilter = 'all';

        const filterCourses = () => {
            const searchTerm = courseSearch ? courseSearch.value.toLowerCase() : '';

            courseItems.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const category = card.getAttribute('data-category');
                const level = card.getAttribute('data-level');

                const matchesSearch = title.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || category === activeFilter || level === activeFilter;

                if (matchesSearch && matchesFilter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };

        if (courseSearch) {
            courseSearch.addEventListener('input', filterCourses);
        }

        courseFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                courseFilters.forEach(b => b.classList.remove('active', 'bg-primary-blue', 'text-white'));
                courseFilters.forEach(b => b.classList.add('bg-white', 'text-slate-600'));

                btn.classList.add('active', 'bg-primary-blue', 'text-white');
                btn.classList.remove('bg-white', 'text-slate-600');

                activeFilter = btn.getAttribute('data-filter');
                filterCourses();
            });
        });
    }
    // --- Dynamic Navbar CTA Logic ---
    const updateNavbarCTA = () => {
        const cta = document.getElementById('navbar-cta');
        if (!cta) return;

        const path = window.location.pathname;
        const inPagesDir = path.includes('/pages/');

        // Helper for relative links
        const getPath = (dest) => {
            // If destination is in root (e.g. index.html)
            if (dest === 'index.html') return inPagesDir ? '../index.html' : 'index.html';

            // If destination is in pages/ (e.g. signup.html)
            // If we are in root, go to pages/signup.html
            // If we are in pages/, go to signup.html
            if (inPagesDir) return dest;
            return 'pages/' + dest;
        };

        // CONSISTENT CTA BUTTON on all pages
        cta.innerText = 'Get Started';
        cta.href = getPath('signup.html');
    };

    updateNavbarCTA();
});

// Modal Global Controls
function openModal(id = 'demoModal') {
    const modal = document.getElementById(id);
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        if (content) content.classList.remove('scale-95');
    }, 10);
}

function closeModal(id = 'demoModal') {
    const modal = document.getElementById(id);
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    modal.classList.add('opacity-0');
    if (content) content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// Attach to window for global access
window.openModal = openModal;
window.closeModal = closeModal;

// --- User Dropdown Logic ---
document.addEventListener('click', (e) => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');

    if (userMenuButton && userDropdown) {
        if (userMenuButton.contains(e.target)) {
            userDropdown.classList.toggle('show');
            userDropdown.classList.toggle('hidden'); // Ensure hidden state is also toggled if present
        } else if (!userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
            userDropdown.classList.add('hidden');
        }
    }
});
