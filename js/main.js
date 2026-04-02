document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // Mobile Menu & Routing Adjustments
    // ----------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    navLinks.style.display = 'none';
                }
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                navLinks.style.display = '';
            }
        });
    }

    // Handle Mobile Menu CSS dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @media(max-width: 767px) {
            .nav-links {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 70px;
                left: 0;
                width: 100%;
                background: white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 10px 0;
            }
            .mobile-menu-btn { display: block !important; }
            .nav-links li { text-align: center; padding: 10px 0; }
        }
    `;
    document.head.appendChild(style);

    // ----------------------------------------
    // 1. Fetch CMS JSON Content
    // ----------------------------------------
    fetch('data/content.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load content.json");
            return response.json();
        })
        .then(data => {
            // 2. Dynamic CSS Theme Colors
            if (data.primary_color) document.documentElement.style.setProperty('--primary', data.primary_color);
            if (data.background_color) document.documentElement.style.setProperty('--bg-main', data.background_color);

            // 3. Update Hero Section dynamically
            if (data.name) document.getElementById('hero-name').innerText = data.name;
            if (data.job_title) document.getElementById('hero-job').innerText = data.job_title;
            if (data.bio) document.getElementById('hero-bio').innerText = data.bio;
            if (data.profile_image) {
                let imgPath = data.profile_image;
                if(imgPath.startsWith('/assets')) imgPath = imgPath.substring(1); // Fix local loading
                const profImg = document.getElementById('profile-img');
                if (profImg) profImg.src = imgPath;
            }

            // 4. Update Skills dynamically with nested categories
            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer && data.skill_categories && Array.isArray(data.skill_categories)) {
                
                // Clear any inline styles that made it a flat list previously
                skillsContainer.style.display = '';
                skillsContainer.style.flexWrap = '';
                skillsContainer.style.justifyContent = '';
                skillsContainer.style.gap = '';
                skillsContainer.className = 'skills-grid'; // Assure CSS applies
                
                skillsContainer.innerHTML = ''; 
                
                data.skill_categories.forEach(cat => {
                    const iconClass = cat.icon || "fas fa-check-circle";
                    let badgesHtml = '';
                    if (cat.skills_list && Array.isArray(cat.skills_list)) {
                        cat.skills_list.forEach(skill => {
                            badgesHtml += `<span class="badge">${skill.name}</span>`;
                        });
                    }

                    const catHtml = `
                        <div class="skill-category">
                            <div class="skill-icon"><i class="${iconClass}"></i></div>
                            <h3>${cat.category_title}</h3>
                            <div class="badges">
                                ${badgesHtml}
                            </div>
                        </div>
                    `;
                    skillsContainer.innerHTML += catHtml;
                });
            }

            // 5. Build Projects dynamically & Initialize Modals
            const projectsContainer = document.getElementById('projects-container');
            if (projectsContainer && data.projects && Array.isArray(data.projects)) {
                projectsContainer.innerHTML = '';
                
                // Keep the flex/grid behavior
                data.projects.forEach((proj, idx) => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.projectIdx = idx;

                    let imgPath = proj.image || 'assets/images/project1.jpg';
                    if(imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);

                    const shortDesc = (proj.description && proj.description.length > 80) 
                                      ? proj.description.substring(0, 80) + '...' 
                                      : (proj.description || '');

                    card.innerHTML = `
                        <div class="card-img">
                            <img src="${imgPath}" alt="${proj.title}" onerror="this.src='https://images.unsplash.com/photo-1574682737604-5cbd700680a6?auto=format&fit=crop&w=600&q=80'">
                        </div>
                        <div class="card-content">
                            <h3>${proj.title}</h3>
                            <p>${shortDesc}</p>
                            <button class="btn btn-outline open-modal">Λεπτομέρειες</button>
                        </div>
                    `;
                    projectsContainer.appendChild(card);
                });
            }

            // Bind Modals logic after elements generate
            bindModalLogic(data.projects || []);

            // 6. Build Timeline / Experience dynamically
            const expContainer = document.getElementById('experience-container');
            if (expContainer && data.experience && Array.isArray(data.experience)) {
                expContainer.innerHTML = '';
                data.experience.forEach(exp => {
                    const item = document.createElement('div');
                    item.className = 'timeline-item';
                    item.innerHTML = `
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h3>${exp.title}</h3>
                            <h4>${exp.subtitle}</h4>
                            <p style="white-space: pre-wrap;">${exp.description || ''}</p>
                        </div>
                    `;
                    expContainer.appendChild(item);
                });
            }

            // 7. Update Footer Contacts and Copyright
            const contactLinks = document.getElementById('contact-links-container');
            if (contactLinks) {
                contactLinks.innerHTML = '';
                if (data.email) {
                    contactLinks.innerHTML += `<a href="mailto:${data.email}" class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</a>`;
                }
                if (data.linkedin) {
                    contactLinks.innerHTML += `<a href="${data.linkedin}" target="_blank" class="contact-item"><i class="fab fa-linkedin"></i> LinkedIn</a>`;
                }
                if (data.github) {
                    contactLinks.innerHTML += `<a href="${data.github}" target="_blank" class="contact-item"><i class="fab fa-github"></i> GitHub</a>`;
                }
            }

            const cvContainer = document.getElementById('cv-container');
            if (cvContainer && data.cv_file) {
                 let cvPath = data.cv_file;
                 if(cvPath.startsWith('/assets')) cvPath = cvPath.substring(1);
                 cvContainer.innerHTML = `<a href="${cvPath}" class="btn btn-accent" download target="_blank"><i class="fas fa-file-pdf"></i> Download Full CV (PDF)</a>`;
            }

            const copyrightContainer = document.getElementById('copyright-container');
            if (copyrightContainer && data.copyright_year && data.name) {
                 copyrightContainer.innerHTML = `<p>&copy; ${data.copyright_year} ${data.name}</p>`;
            }
        })
        .catch(err => console.error("CMS integration error:", err));

    
    // Function to attach Event Listeners to Modals dynamically
    function bindModalLogic(projects) {
        const modal = document.getElementById('project-modal');
        const modalClose = document.querySelector('.close-modal');
        const mTitle = document.getElementById('modal-title');
        const modalBody = document.querySelector('.modal-body');
        const mLink = document.getElementById('modal-github');

        document.querySelectorAll('.open-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                const pIdx = card.dataset.projectIdx;
                const proj = projects[pIdx];
                
                if (proj) {
                    mTitle.textContent = proj.title;
                    
                    // The CMS provides one big text element, rendering it neatly:
                    modalBody.innerHTML = `
                        <div class="modal-section" style="margin-top: 15px;">
                            <p style="white-space: pre-wrap; font-size: 1.05rem;">${proj.description}</p>
                        </div>
                    `;
                    
                    if (proj.github_link) {
                        mLink.style.display = 'flex';
                        mLink.href = proj.github_link;
                    } else {
                        mLink.style.display = 'none';
                    }
                    
                    modal.style.display = 'flex';
                    setTimeout(() => { modal.style.opacity = '1'; }, 10);
                }
            });
        });

        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };

        if(modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

});
