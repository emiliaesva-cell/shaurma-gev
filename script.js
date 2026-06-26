// ============================================
// 1. АККОРДЕОН (раскрытие категорий меню)
// ============================================
document.addEventListener('DOMContentLoaded', function() {

    const headers = document.querySelectorAll('.category-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const category = this.parentElement;
            // Закрываем все другие категории
            document.querySelectorAll('.category').forEach(cat => {
                if (cat !== category) {
                    cat.classList.remove('active');
                }
            });
            // Открываем/закрываем текущую
            category.classList.toggle('active');
        });
    });

 
    // ============================================
    // 3. ПОИСК ПО МЕНЮ
    // ============================================
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.menu-card');

        cards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            if (query === '' || name.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Автоматически раскрываем все категории, если есть поиск
        const categories = document.querySelectorAll('.category');
        if (query !== '') {
            categories.forEach(cat => cat.classList.add('active'));
        } else {
            // Если поиск пустой - сворачиваем все, кроме первой
            categories.forEach((cat, index) => {
                if (index === 0) {
                    cat.classList.add('active');
                } else {
                    cat.classList.remove('active');
                }
          });
    
    
    // ============================================
    // 4. ОТЗЫВЫ (добавление новых)
    // ============================================
    const reviewForm = document.getElementById('reviewForm');
    const reviewsGrid = document.querySelector('.reviews-grid');

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const rating = parseInt(document.getElementById('reviewRating').value);
        const text = document.getElementById('reviewText').value.trim();

        if (!name || !text) {
            alert('Заполните все поля!');
            return;
        }

        // Создаём звёзды
        const stars = '⭐'.repeat(rating);

        // Создаём карточку отзыва
        const card = document.createElement('div');
        card.classList.add('review-card');
        card.innerHTML = `
            <div class="review-header">
                <span class="review-name">${name}</span>
                <span class="review-rating">${stars}</span>
            </div>
            <p class="review-text">"${text}"</p>
            <span class="review-date">Только что</span>
        `;

        // Вставляем в начало
        reviewsGrid.prepend(card);

        // Очищаем форму
        reviewForm.reset();

        // Показываем уведомление
        alert('Спасибо за отзыв! ❤️');
    });

    // ============================================
    // 5. ЗАГРУЗКА ФОТО И ВИДЕО
    // ============================================
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const gallery = document.getElementById('gallery');

    // Создаём сообщение "Пока нет файлов"
    function showEmptyMessage() {
        if (gallery.children.length === 0) {
            const msg = document.createElement('p');
            msg.id = 'emptyGalleryMsg';
            msg.textContent = '📷 Пока нет загруженных файлов. Будьте первыми!';
            msg.style.textAlign = 'center';
            msg.style.color = '#888';
            msg.style.gridColumn = '1 / -1';
            msg.style.padding = '30px 0';
            gallery.appendChild(msg);
        }
    }
    showEmptyMessage();

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const files = fileInput.files;
        if (files.length === 0) {
            alert('Выберите хотя бы один файл!');
            return;
        }

        // Удаляем сообщение "Пока нет файлов"
        const emptyMsg = document.getElementById('emptyGalleryMsg');
        if (emptyMsg) emptyMsg.remove();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const div = document.createElement('div');
            div.classList.add('gallery-item');

            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.muted = true;
                video.preload = 'metadata';
                div.appendChild(video);
            } else if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = 'Загруженное фото';
                div.appendChild(img);
            } else {
                alert(`Файл "${file.name}" не является фото или видео.`);
                continue;
            }

            gallery.prepend(div);
        }

        fileInput.value = '';
    });

    // ============================================
    // 6. ПЕРВАЯ КАТЕГОРИЯ ОТКРЫТА ПО УМОЛЧАНИЮ
    // ============================================
    const firstCategory = document.querySelector('.category');
    if (firstCategory) {
        firstCategory.classList.add('active');
    }

});
