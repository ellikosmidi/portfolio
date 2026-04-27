import { getStr, state } from '../state.js';
import { bindModalLogic } from './modal.js';

export function renderContent(data) {
    if (!data) return;

    // 1. DYNAMIC THEME SETTINGS (CSS Variables via JavaScript)
    // Here we inject all colors chosen in CMS as CSS variables into the :root.
    // CSS handles all the actual color applications.
    if (data.primary_color) document.documentElement.style.setProperty('--primary', data.primary_color);
    if (data.background_color) document.documentElement.style.setProperty('--bg-main', data.background_color);
    if (data.logo_color) document.documentElement.style.setProperty('--logo-color', data.logo_color);
    if (data.skills_title_color) document.documentElement.style.setProperty('--skills-title-color', data.skills_title_color);
    if (data.skills_bg_color) document.documentElement.style.setProperty('--skills-bg-color', data.skills_bg_color);
    if (data.projects_title_color) document.documentElement.style.setProperty('--projects-title-color', data.projects_title_color);
    if (data.experience_title_color) document.documentElement.style.setProperty('--experience-title-color', data.experience_title_color);
    if (data.contact_title_color) document.documentElement.style.setProperty('--contact-title-color', data.contact_title_color);
    if (data.cv_button_color) document.documentElement.style.setProperty('--cv-btn-color', data.cv_button_color);

    // 2. NAVBAR
    let logoText = getStr(data, 'logo_text');
    if (logoText) { const ntxt = document.getElementById('nav-logo-text'); if (ntxt) ntxt.innerText = logoText; }
    
    if (data.logo_image) {
        const nimg = document.getElementById('nav-logo-img');
        if (nimg) {
            let imgPath = data.logo_image;
            if (imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);
            nimg.src = imgPath;
            nimg.classList.add('show');
        }
    }

    let navAbout = getStr(data, 'nav_about_text'); if (navAbout) { const el = document.getElementById('nav-about'); if (el) el.innerText = navAbout; }
    let navSkills = getStr(data, 'nav_skills_text'); if (navSkills) { const el = document.getElementById('nav-skills'); if (el) el.innerText = navSkills; }
    let navProjects = getStr(data, 'nav_projects_text'); if (navProjects) { const el = document.getElementById('nav-projects'); if (el) el.innerText = navProjects; }
    let navExp = getStr(data, 'nav_experience_text'); if (navExp) { const el = document.getElementById('nav-experience'); if (el) el.innerText = navExp; }
    let navContact = getStr(data, 'nav_contact_text'); if (navContact) { const el = document.getElementById('nav-contact'); if (el) el.innerText = navContact; }

    // 3. HERO SECTION
    let nameStr = getStr(data, 'name'); if (nameStr) document.getElementById('hero-name').innerText = nameStr;
    let jobStr = getStr(data, 'job_title'); if (jobStr) document.getElementById('hero-job').innerText = jobStr;
    let bioStr = getStr(data, 'bio'); if (bioStr) document.getElementById('hero-bio').innerText = bioStr;
    
    const heroBtns = document.querySelectorAll('.hero-buttons a');
    let heroBtn1 = getStr(data, 'hero_btn_projects_text');
    if (heroBtn1 && heroBtns[0]) heroBtns[0].innerText = heroBtn1;

    let heroBtn2 = getStr(data, 'hero_btn_contact_text');
    if (heroBtn2 && heroBtns[1]) heroBtns[1].innerText = heroBtn2;

    if (data.profile_image) {
        let imgPath = data.profile_image;
        if (imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);
        const profImg = document.getElementById('profile-img');
        if (profImg) profImg.src = imgPath;
    }

    // 4. SKILLS SECTION
    let skillsTitle = getStr(data, 'skills_section_title');
    if (skillsTitle) document.getElementById('skills-section-title').innerHTML = skillsTitle;

    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && data.skill_categories && Array.isArray(data.skill_categories)) {
        skillsContainer.className = 'skills-grid';
        skillsContainer.innerHTML = '';

        data.skill_categories.forEach(cat => {
            let iconHtml = '';
            if (cat.icon_image) {
                let imgPath = cat.icon_image;
                if (imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);
                iconHtml = `<div class="skill-icon-wrapper"><img src="${imgPath}" alt="${cat.category_title}" class="skill-icon-img"></div>`;
            }
            let badgesHtml = '';
            if (cat.skills_list && Array.isArray(cat.skills_list)) {
                cat.skills_list.forEach(skill => {
                    badgesHtml += `<span class="badge">${getStr(skill, 'name')}</span>`;
                });
            }
            const catHtml = `
                <div class="skill-category">
                    ${iconHtml}
                    <h3>${getStr(cat, 'category_title')}</h3>
                    <div class="badges">
                        ${badgesHtml}
                    </div>
                </div>
            `;
            skillsContainer.innerHTML += catHtml;
        });
    }

    // 5. PROJECTS SECTION
    let projTitle = getStr(data, 'projects_section_title');
    if (projTitle) {
        const ts = document.getElementById('projects-section-title');
        if (ts) ts.innerHTML = projTitle;
    }

    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer && data.projects && Array.isArray(data.projects)) {
        projectsContainer.innerHTML = '';
        const pBtnText = getStr(data, 'projects_button_text') || (state.currentLang === 'en' ? "Details" : "Λεπτομέρειες");

        data.projects.forEach((proj, index) => {
            let imgPath = proj.image;
            if (imgPath && imgPath.startsWith('/assets')) imgPath = imgPath.substring(1);

            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.projectIdx = index;
            card.innerHTML = `
                <img src="${imgPath}" alt="${getStr(proj, 'title')}" class="card-img">
                <div class="card-content">
                    <h3 class="card-title">${getStr(proj, 'title')}</h3>
                    <button class="btn btn-project open-modal" data-index="${index}">${pBtnText}</button>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }
    bindModalLogic(data.projects || []);

    // 6. EXPERIENCE SECTION
    let expTitle = getStr(data, 'experience_section_title');
    if (expTitle) {
        const ts = document.getElementById('experience-section-title');
        if (ts) ts.innerHTML = expTitle;
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
                    <h3>${getStr(exp, 'title')}</h3>
                    <h4>${getStr(exp, 'subtitle')}</h4>
                    <p class="timeline-desc">${getStr(exp, 'description')}</p>
                </div>
            `;
            expContainer.appendChild(item);
        });
    }

    // 7. CONTACT SECTION
    let contactTitle = getStr(data, 'contact_section_title');
    if (contactTitle) {
        const cs = document.getElementById('contact-section-title');
        if (cs) cs.innerHTML = contactTitle;
    }
    let contactDesc = getStr(data, 'contact_section_desc');
    if (contactDesc) {
        const cd = document.getElementById('contact-section-desc');
        if (cd) cd.innerText = contactDesc;
    }

    const contactLinks = document.getElementById('contact-links-container');
    if (contactLinks) {
        contactLinks.innerHTML = '';
        if (data.email) {
            contactLinks.innerHTML += `<a href="mailto:${data.email}" class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</a>`;
        }
        if (data.linkedin) {
            let lnUrl = data.linkedin.startsWith('http') ? data.linkedin : 'https://www.linkedin.com/in/' + data.linkedin;
            let lnName = data.linkedin.startsWith('http') ? new URL(data.linkedin).pathname.split('/').filter(Boolean).pop() : data.linkedin;
            contactLinks.innerHTML += `<a href="${lnUrl}" target="_blank" class="contact-item"><i class="fab fa-linkedin"></i> ${lnName}</a>`;
        }
        if (data.github) {
            let ghUrl = data.github.startsWith('http') ? data.github : 'https://github.com/' + data.github;
            let ghName = data.github.startsWith('http') ? new URL(data.github).pathname.split('/').filter(Boolean).pop() : data.github;
            contactLinks.innerHTML += `<a href="${ghUrl}" target="_blank" class="contact-item"><i class="fab fa-github"></i> ${ghName}</a>`;
        }
    }

    const cvContainer = document.getElementById('cv-container');
    if (cvContainer) {
        let cvPath = data.cv_file || '#';
        if (cvPath.startsWith('/assets')) cvPath = cvPath.substring(1);
        let btnText = getStr(data, 'cv_button_text') || (state.currentLang === 'en' ? "Download Full CV (PDF)" : "Κατέβασμα Βιογραφικού (PDF)");
        cvContainer.innerHTML = `<a href="${cvPath}" class="btn cv-btn" download target="_blank"><i class="fas fa-file-pdf"></i> ${btnText}</a>`;
    }

    const copyrightContainer = document.getElementById('copyright-container');
    if (copyrightContainer) {
        let defaultCopy = `2026 ${getStr(data, 'name')}`;
        let copyText = getStr(data, 'copyright_text') || defaultCopy;
        copyrightContainer.innerHTML = `
            <p>&copy; ${copyText}</p>
            <p class="copyright-credits">
                Created by <strong>Elli Kosmidi</strong> | 
                <a href="https://www.linkedin.com/in/elli-kosmidi-220895358" target="_blank" class="linkedin-credit-link">
                    <i class="fab fa-linkedin"></i> Elli Kosmidi
                </a>
            </p>
        `;
    }
}
