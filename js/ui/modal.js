import { getStr, state } from '../state.js';

export function bindModalLogic(projects) {
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
                mTitle.textContent = getStr(proj, 'title');

                let problemText = getStr(proj, 'problem');
                let approachText = getStr(proj, 'approach');
                let resultText = getStr(proj, 'result');
                
                let problemHeader = state.currentLang === 'en' ? 'Problem' : 'Πρόβλημα';
                let approachHeader = state.currentLang === 'en' ? 'Approach' : 'Προσέγγιση';
                let resultHeader = state.currentLang === 'en' ? 'Result' : 'Αποτέλεσμα';
                let githubText = state.currentLang === 'en' ? 'View Code/Files on GitHub' : 'Δείτε τον κώδικα/αρχεία στο GitHub';

                modalBody.innerHTML = `
                    ${problemText ? `
                    <div class="modal-section">
                        <h4><i class="fas fa-exclamation-circle"></i> ${problemHeader}</h4>
                        <p>${problemText}</p>
                    </div>` : ''}
                    
                    ${approachText ? `
                    <div class="modal-section">
                        <h4><i class="fas fa-tools"></i> ${approachHeader}</h4>
                        <p>${approachText}</p>
                    </div>` : ''}

                    ${resultText ? `
                    <div class="modal-section">
                        <h4><i class="fas fa-check-circle"></i> ${resultHeader}</h4>
                        <p>${resultText}</p>
                    </div>` : ''}
                `;
                
                mLink.innerHTML = `<i class="fab fa-github"></i> ${githubText}`;

                if (proj.github_link) {
                    mLink.style.display = 'flex';
                    mLink.href = proj.github_link;
                } else {
                    mLink.style.display = 'none';
                }

                modal.classList.add('show');
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
    };

    if (modalClose && !modalClose.dataset.bound) {
        modalClose.addEventListener('click', closeModal);
        modalClose.dataset.bound = "true";
    }
    
    if (!window.modalBound) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        window.modalBound = true;
    }
}
