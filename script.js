document.addEventListener('DOMContentLoaded', function () {

    // ===== ГАЛЕРЕЯ: список твоих фото =====
    // СЮДА ДОБАВЛЯЙ НАЗВАНИЯ СВОИХ ФОТО
    const galleryImages = [
        'gallery1.jpg',
        'gallery2.jpg',
        'gallery3.jpg',
        'gallery4.jpg',
        'gallery5.jpg'
        // Добавляй новые фото сюда, например:
        // 'moya_foto.jpg',
        // 'eda.jpg'
    ];

    const galleryGrid = document.getElementById('galleryGrid');

    // Проверяем, есть ли контейнер для галереи
    if (galleryGrid) {
        galleryImages.forEach(imageName => {
            const div = document.createElement('div');
            div.classList.add('gallery-item');
            
            // Проверяем, видео ли это
            if (imageName.endsWith('.mp4') || imageName.endsWith('.webm') || imageName.endsWith('.mov')) {
                const video = document.createElement('video');
                video.src = `img/${imageName}`;
                video.controls = true;
                video.muted = true;
                div.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = `img/${imageName}`;
                img.alt = 'Фото нашей шаурмичной';
                div.appendChild(img);
            }
            
            galleryGrid.appendChild(div);
        });
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
