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
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <img src="${service.image}" alt="${service.name}" class="service-img" onerror="this.src='https://images.unsplash.com/photo-1632345031435-877ff6c2ae3d?q=80&w=600'">
                    <div class="service-info">
                        <div>
                            <h3>${service.name}</h3>
                            <p>${service.description}</p>
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
    if (!grid) return;

    fetch('/api/gallery')
        .then(res => res.json())
        .then(images => {
            grid.innerHTML = '';
            images.forEach(img => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `
                    <img src="/assets/images/${img.filename}" alt="${img.title || 'Nail Art'}" onerror="this.src='https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600'">
                    <div class="gallery-overlay">
                        <p>✨ ${img.title || 'Ale Nail Designer'}</p>
                    </div>
                `;
                grid.appendChild(item);
            });
        })
        .catch(err => console.error('Erro ao carregar galeria:', err));
}
