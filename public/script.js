document.addEventListener('DOMContentLoaded', () => {
    // Menu Responsivo Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Carregar Serviços Dinamicamente
    loadServices();

    // Carregar Galeria Dinamicamente
    loadGallery();
});

function loadServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    fetch('/api/services')
        .then(res => res.json())
        .then(services => {
            grid.innerHTML = '';
            services.forEach(service => {
                // Definir durações estimadas para cada serviço da lista
                let duration = '⏱️ Aprox. 1h 30min';
                if (service.name.toLowerCase().includes('manicure')) duration = '⏱️ Aprox. 45min';
                if (service.name.toLowerCase().includes('pedicure')) duration = '⏱️ Aprox. 50min';
                if (service.name.toLowerCase().includes('banho')) duration = '⏱️ Aprox. 1h';
                if (service.name.toLowerCase().includes('nail art')) duration = '⏱️ Varia conforme design';
                if (service.name.toLowerCase().includes('manutenção')) duration = '⏱️ Aprox. 1h 30min';

                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <img src="${service.image}" alt="${service.name}" class="service-img" onerror="this.src='https://images.unsplash.com/photo-1632345031435-877ff6c2ae3d?q=80&w=600'">
                    <div class="service-info">
                        <div>
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
                            <span class="service-duration">${duration}</span>
                        </div>
                        <div class="service-footer">
                            <span class="service-price">${service.price}</span>
                            <a href="https://wa.me/5531992212015?text=Olá! Gostaria de agendar o serviço: ${encodeURIComponent(service.name)}" target="_blank" class="btn-card-agendar">AGENDAR 💅</a>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => console.error('Erro ao carregar serviços:', err));
}

function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');

    if (!grid) return;

    fetch('/api/gallery')
        .then(res => res.json())
        .then(images => {
            grid.innerHTML = '';
            images.forEach(img => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                const imgSrc = `/assets/images/${img.filename}`;
                const imgTitle = img.title || 'Ale Nail Designer';

                item.innerHTML = `
                    <img src="${imgSrc}" alt="${imgTitle}" onerror="this.src='https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600'">
                    <div class="gallery-overlay">
                        <p>✨ ${imgTitle}</p>
                    </div>
                `;

                // Evento para abrir o modal lightbox ao clicar na foto
                item.addEventListener('click', () => {
                    if (modal && modalImg && modalTitle) {
                        modalImg.src = imgSrc;
                        modalTitle.textContent = `✨ ${imgTitle}`;
                        modal.classList.remove('hidden');
                    }
                });

                grid.appendChild(item);
            });
        })
        .catch(err => console.error('Erro ao carregar galeria:', err));

    // Fechar modal
    const modal = document.getElementById('gallery-modal');
    const modalClose = document.getElementById('modal-close');
    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
}
