document.addEventListener('DOMContentLoaded', function () {

    // ===== ВКЛАДКИ МЕНЮ =====
    const tabs = document.querySelectorAll('.tab-btn');
    const categories = document.querySelectorAll('.menu-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            categories.forEach(cat => cat.classList.remove('active'));
            const categoryId = this.dataset.category;
            document.getElementById(categoryId).classList.add('active');
        });
    });

    // ===== ГАЛЕРЕЯ (ПРОСТАЯ ВЕРСИЯ) =====
    const galleryGrid = document.getElementById('galleryGrid');

    // СПИСОК ТВОИХ ФОТО — МЕНЯЙ ЗДЕСЬ
    const photos = [
        '1.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg',
        '6.jpg'
    ];

    if (galleryGrid) {
        photos.forEach(function(photo) {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = 'img/' + photo;
            img.alt = 'Фото';
            
            // Если фото не загрузилось — покажем ошибку в консоли
            img.onerror = function() {
                console.log('Не удалось загрузить: img/' + photo);
            };
            
            div.appendChild(img);
            galleryGrid.appendChild(div);
        });
    } else {
        console.log('Ошибка: galleryGrid не найден!');
    }

    // ===== ОТЗЫВЫ =====
    const form = document.getElementById('reviewForm');
    const reviewsList = document.getElementById('reviewsList');
    const noReviewsMsg = document.querySelector('.no-reviews');

    loadReviews();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked');

        if (!name || !text) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        if (!rating) {
            alert('Пожалуйста, поставьте оценку!');
            return;
        }

        const review = {
            id: Date.now(),
            name: name,
            text: text,
            rating: parseInt(rating.value),
            date: new Date().toLocaleDateString('ru-RU')
        };

        saveReview(review);
        addReviewToPage(review);
        form.reset();
        
        if (noReviewsMsg) {
            noReviewsMsg.style.display = 'none';
        }
    });

    function saveReview(review) {
        let reviews = JSON.parse(localStorage.getItem('shaurmaReviews')) || [];
        reviews.push(review);
        localStorage.setItem('shaurmaReviews', JSON.stringify(reviews));
    }

    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('shaurmaReviews')) || [];
        if (reviews.length === 0) return;
        if (noReviewsMsg) noReviewsMsg.style.display = 'none';
        reviews.sort((a, b) => b.id - a.id);
        reviews.forEach(review => addReviewToPage(review));
    }

    function addReviewToPage(review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review-item');

        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += i <= review.rating ? '★' : '☆';
        }

        reviewDiv.innerHTML = `
            <div class="review-header">
                <span class="review-name">${escapeHTML(review.name)}</span>
                <span class="review-stars">${starsHTML}</span>
            </div>
            <div class="review-text">${escapeHTML(review.text)}</div>
            <div class="review-date">${review.date}</div>
        `;

        reviewsList.prepend(reviewDiv);
    }

    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

});
