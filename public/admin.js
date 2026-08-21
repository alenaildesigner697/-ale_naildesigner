document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const panelSection = document.getElementById('panel-section');
    const uploadForm = document.getElementById('upload-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    loginSection.classList.add('hidden');
                    panelSection.classList.remove('hidden');
                    loadAdminGallery();
                } else {
                    alert(data.message || 'Erro ao entrar.');
                }
            })
            .catch(err => console.error('Erro de login:', err));
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);

            fetch('/api/admin/gallery', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Imagem enviada com sucesso para a galeria! ✨');
                    uploadForm.reset();
                    loadAdminGallery();
                } else {
                    alert('Erro ao enviar imagem.');
                }
            })
            .catch(err => console.error('Erro no upload:', err));
        });
    }
});

function loadAdminGallery() {
    const list = document.getElementById('admin-gallery-list');
    if (!list) return;

    fetch('/api/gallery')
        .then(res => res.json())
        .then(images => {
            list.innerHTML = '';
            images.forEach(img => {
                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.justifyContent = 'space-between';
                div.style.padding = '10px';
                div.style.marginBottom = '10px';
                div.style.background = '#faf7f5';
                div.style.borderRadius = '10px';

                div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="/assets/images/${img.filename}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                        <span>${img.title || 'Sem título'}</span>
                    </div>
                    <button onclick="deleteImage(${img.id})" style="background: #ff6b6b; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer;">Excluir</button>
                `;
                list.appendChild(div);
            });
        });
}

function deleteImage(id) {
    if (!confirm('Deseja realmente excluir esta imagem?')) return;

    fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadAdminGallery();
        } else {
            alert('Erro ao excluir imagem.');
        }
    });
}
