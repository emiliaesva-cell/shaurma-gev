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
    // 2. ПОИСК ПО МЕНЮ
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
    // 3. ОТЗЫВЫ (настоящие, с сохранением в localStorage)
    // ============================================
    const reviewForm = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const noReviewsMsg = document.querySelector('.no-reviews');

    // Загружаем сохранённые отзывы
    loadReviews();

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const rating = parseInt(document.getElementById('reviewRating').value);
        const text = document.getElementById('reviewText').value.trim();

        if (!name || !text) {
            alert('Заполните все поля!');
            return;
        }

        // Создаём объект отзыва
        const review = {
            id: Date.now(),
            name: name,
            text: text,
            rating: rating,
            date: new Date().toLocaleDateString('ru-RU')
        };

        // Сохраняем в localStorage
        saveReview(review);

        // Добавляем отзыв на страницу
        addReviewToPage(review);

        // Очищаем форму
        reviewForm.reset();

        // Убираем сообщение "Пока нет отзывов"
        if (noReviewsMsg) {
            noReviewsMsg.style.display = 'none';
        }

        alert('Спасибо за отзыв! ❤️');
    });

    // Функция сохранения отзыва
    function saveReview(review) {
        let reviews = JSON.parse(localStorage.getItem('shaurmaReviews')) || [];
        reviews.push(review);
        localStorage.setItem('shaurmaReviews', JSON.stringify(reviews));
    }

    // Функция загрузки отзывов
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('shaurmaReviews')) || [];
        
        if (reviews.length === 0) {
            return;
        }

        // Убираем сообщение "Пока нет отзывов"
        if (noReviewsMsg) {
            noReviewsMsg.style.display = 'none';
        }

        // Сортируем отзывы: новые сверху
        reviews.sort((a, b) => b.id - a.id);

        // Добавляем каждый отзыв на страницу
        reviews.forEach(review => {
            addReviewToPage(review);
        });
    }

    // Функция добавления отзыва на страницу
    function addReviewToPage(review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review-card');

        // Звёзды рейтинга
        const stars = '⭐'.repeat(review.rating);

        reviewDiv.innerHTML = `
            <div class="review-header">
                <span class="review-name">${escapeHTML(review.name)}</span>
                <span class="review-rating">${stars}</span>
            </div>
            <p class="review-text">"${escapeHTML(review.text)}"</p>
            <span class="review-date">${review.date}</span>
        `;

        // Добавляем в начало списка
        reviewsList.prepend(reviewDiv);
    }

    // Простая защита от XSS (безопасное отображение текста)
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // 4. ПЕРВАЯ КАТЕГОРИЯ ОТКРЫТА ПО УМОЛЧАНИЮ
    // ============================================
    const firstCategory = document.querySelector('.category');
    if (firstCategory) {
        firstCategory.classList.add('active');
    }

});
