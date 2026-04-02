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
            // 1. Theme Configuration
            if (data.primary_color) document.documentElement.style.setProperty('--primary', data.primary_color);
            if (data.background_color) document.documentElement.style.setProperty('--bg-main', data.background_color);
            
            // 2. Navbar & Logo
            if(data.logo_text) { const nlogo = document.getElementById('nav-logo'); if (nlogo) nlogo.innerText = data.logo_text; }
            if(data.logo_color) { const nlogo = document.getElementById('nav-logo'); if (nlogo) nlogo.style.color = data.logo_color; }
            
            if(data.nav_about_text) { const el = document.getElementById('nav-about'); if (el) el.innerText = data.nav_about_text; }
            if(data.nav_skills_text) { const el = document.getElementById('nav-skills'); if (el) el.innerText = data.nav_skills_text; }
            if(data.nav_projects_text) { const el = document.getElementById('nav-projects'); if (el) el.innerText = data.nav_projects_text; }
            if(data.nav_experience_text) { const el = document.getElementById('nav-experience'); if (el) el.innerText = data.nav_experience_text; }
            if(data.nav_contact_text) { const el = document.getElementById('nav-contact'); if (el) el.innerText = data.nav_contact_text; }

            // 3. Hero Section
            if (data.name) document.getElementById('hero-name').innerText = data.name;
            if (data.job_title) document.getElementById('hero-job').innerText = data.job_title;
            if (data.bio) document.getElementById('hero-bio').innerText = data.bio;
            if (data.hero_btn_projects_text) {
                const btnP = document.getElementById('hero-btn-projects');
                if(btnP) btnP.innerText = data.hero_btn_projects_text;
            }
            if (data.hero_btn_contact_text) {
                const btnC = document.getElementById('hero-btn-contact');
                if(btnC) btnC.innerText = data.hero_btn_contact_text;
            }

            if (data.profile_image) {
                let imgPath = data.profile_image;
                if(imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);
                const profImg = document.getElementById('profile-img');
                if (profImg) profImg.src = imgPath;
            }

            // 4. Skills Section
            if (data.skills_section_title) document.getElementById('skills-section-title').innerHTML = data.skills_section_title;
            if (data.skills_title_color) document.getElementById('skills-section-title').style.color = data.skills_title_color;
            if (data.skills_bg_color) document.getElementById('skills').style.backgroundColor = data.skills_bg_color;

            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer && data.skill_categories && Array.isArray(data.skill_categories)) {
                skillsContainer.style.display = '';
                skillsContainer.style.flexWrap = '';
                skillsContainer.style.justifyContent = '';
                skillsContainer.style.gap = '';
                skillsContainer.className = 'skills-grid';
                skillsContainer.innerHTML = ''; 
                
                data.skill_categories.forEach(cat => {
                    let iconHtml = '';
                    if (cat.icon_image) {
                        let imgPath = cat.icon_image;
                        if(imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);
                        iconHtml = `<div style="text-align: center; margin-bottom: 20px;"><img src="${imgPath}" alt="${cat.category_title}" style="max-width: 70px; max-height: 70px; width: auto; height: auto; border-radius: 10px; margin: 0 auto;"></div>`;
                    }
                    let badgesHtml = '';
                    if (cat.skills_list && Array.isArray(cat.skills_list)) {
                        cat.skills_list.forEach(skill => {
                            badgesHtml += `<span class="badge">${skill.name}</span>`;
                        });
                    }
                    const catHtml = `
                        <div class="skill-category">
                            ${iconHtml}
                            <h3>${cat.category_title}</h3>
                            <div class="badges">
                                ${badgesHtml}
                            </div>
                        </div>
                    `;
                    skillsContainer.innerHTML += catHtml;
                });
            }

            // 5. Projects Section
            if(data.projects_section_title) {
                const ts = document.getElementById('projects-section-title');
                if(ts) ts.innerHTML = data.projects_section_title;
            }
            if(data.projects_title_color) {
                const tc = document.getElementById('projects-section-title');
                if(tc) tc.style.color = data.projects_title_color;
            }

            const projectsContainer = document.getElementById('projects-container');
            if (projectsContainer && data.projects && Array.isArray(data.projects)) {
                projectsContainer.innerHTML = '';
                const pBtnText = data.projects_button_text || "Λεπτομέρειες";
                const pBtnStyle = data.projects_button_color ? `style="background-color: ${data.projects_button_color}; border-color: ${data.projects_button_color}; color: white;"` : '';

                data.projects.forEach((proj, index) => {
                    let imgPath = proj.image;
                    if(imgPath && imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);
                    
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.projectIdx = index;
                    card.innerHTML = `
                        <img src="${imgPath}" alt="${proj.title}" class="card-img">
                        <div class="card-content">
                            <h3 class="card-title">${proj.title}</h3>
                            <button class="btn btn-primary open-modal" data-index="${index}" ${pBtnStyle}>${pBtnText}</button>
                        </div>
                    `;
                    projectsContainer.appendChild(card);
                });
            }
            bindModalLogic(data.projects || []);

            // 6. Experience Section
            if(data.experience_section_title) {
                const ts = document.getElementById('experience-section-title');
                if(ts) ts.innerHTML = data.experience_section_title;
            }
            if(data.experience_title_color) {
                const tc = document.getElementById('experience-section-title');
                if(tc) tc.style.color = data.experience_title_color;
            }

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

            // 7. Contact Section
            if(data.contact_section_title) {
                const cs = document.getElementById('contact-section-title');
                if(cs) cs.innerHTML = data.contact_section_title;
            }
            if(data.contact_title_color) {
                const cc = document.getElementById('contact-section-title');
                if(cc) cc.style.color = data.contact_title_color;
            }
            if(data.contact_section_desc) {
                const cd = document.getElementById('contact-section-desc');
                if(cd) cd.innerText = data.contact_section_desc;
            }

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
                 let btnText = data.cv_button_text || "Download Full CV (PDF)";
                 let btnStyle = data.cv_button_color ? `style="background-color: ${data.cv_button_color}; border-color: ${data.cv_button_color}; color: white;"` : '';
                 cvContainer.innerHTML = `<a href="${cvPath}" class="btn btn-accent" download target="_blank" ${btnStyle}><i class="fas fa-file-pdf"></i> ${btnText}</a>`;
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
                    
                    // Rendering Problem, Approach, Result sections:
                    modalBody.innerHTML = `
                        ${proj.problem ? `
                        <div class="modal-section">
                            <h4><i class="fas fa-exclamation-circle"></i> Πρόβλημα</h4>
                            <p>${proj.problem}</p>
                        </div>` : ''}
                        
                        ${proj.approach ? `
                        <div class="modal-section">
                            <h4><i class="fas fa-tools"></i> Προσέγγιση</h4>
                            <p>${proj.approach}</p>
                        </div>` : ''}

                        ${proj.result ? `
                        <div class="modal-section">
                            <h4><i class="fas fa-check-circle"></i> Αποτέλεσμα</h4>
                            <p>${proj.result}</p>
                        </div>` : ''}
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
