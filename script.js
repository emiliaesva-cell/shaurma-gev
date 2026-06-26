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
    // 2. КОРЗИНА
    // ============================================
    let cart = [];

    // Элементы DOM
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Функция обновления корзины
    function updateCart() {
        // Обновляем счётчик на кнопке
        cartCount.textContent = cart.length;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center;color:#888;">Корзина пуста</p>';
            cartTotal.textContent = 'Итого: 0 ₽';
            return;
        }

        // Группируем одинаковые товары
        const grouped = {};
        cart.forEach(item => {
            const key = item.name;
            if (grouped[key]) {
                grouped[key].count += 1;
            } else {
                grouped[key] = { ...item, count: 1 };
            }
        });

        let html = '';
        let total = 0;
        for (const key in grouped) {
            const item = grouped[key];
            const sum = item.price * item.count;
            total += sum;
            html += `
                <div class="cart-item">
                    <span class="item-name">${item.name} × ${item.count}</span>
                    <span class="item-price">${sum} ₽</span>
                    <button class="item-remove" data-name="${item.name}">✕</button>
                </div>
            `;
        }

        cartItems.innerHTML = html;
        cartTotal.textContent = `Итого: ${total} ₽`;

        // Вешаем обработчики на кнопки удаления
        document.querySelectorAll('.item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.dataset.name;
                // Удаляем все товары с таким именем
                cart = cart.filter(item => item.name !== name);
                updateCart();
            });
        });
    }

    // Добавление в корзину
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Чтобы не срабатывал аккордеон
            const card = this.closest('.menu-card');
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);
            cart.push({ name, price });
            updateCart();
            // Визуальный фидбек
            this.textContent = '✓';
            setTimeout(() => { this.textContent = '+'; }, 600);
        });
    });

    // Открыть корзину
    cartBtn.addEventListener('click', function() {
        cartModal.classList.add('show');
        updateCart();
    });

    // Закрыть корзину
    closeBtn.addEventListener('click', function() {
        cartModal.classList.remove('show');
    });

    // Закрыть по клику вне окна
    cartModal.addEventListener('click', function(e) {
        if (e.target === this) {
            cartModal.classList.remove('show');
        }
    });

    // Очистить корзину
    clearCartBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        if (confirm('Очистить корзину?')) {
            cart = [];
            updateCart();
        }
    });

    // Оформить заказ
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const items = cart.map(item => item.name).join(', ');
        alert(`✅ Заказ оформлен!\n\nБлюда: ${items}\nИтого: ${total} ₽\n\nСпасибо за заказ! Ждём вас снова 🥙`);
        cart = [];
        updateCart();
        cartModal.classList.remove('show');
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