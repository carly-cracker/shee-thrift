document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews-container');
    const REVIEWS_API_URL = 'https://shee-store-server.vercel.app/reviews'; 
  
    loadReviews();
  
    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameInput = document.getElementById('name');
      const ratingInput = document.getElementById('rating');
      const commentInput = document.getElementById('comment');
  
      const newReview = {
        name: nameInput.value.trim(),
        rating: ratingInput.value,
        comment: commentInput.value.trim(),
        date: new Date().toLocaleDateString()
      };
  
      if (newReview.name && newReview.comment) {
        submitReview(newReview);
        reviewForm.reset();
      } else {
        alert('Please enter your name and comment.');
      }
    });
  
    async function loadReviews() {
      try {
        const response = await fetch(REVIEWS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayReviews(data); 
      } catch (error) {
        console.error('Failed to load reviews:', error);
        reviewsContainer.innerHTML = '<p class="error">Failed to load reviews.</p>';
      }
    }
  
    async function submitReview(review) {
      try {
        const response = await fetch(REVIEWS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(review),
        });
        console.log("Submitting review:", JSON.stringify(review));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        displaySingleReview(review); 
      } catch (error) {
        console.error('Failed to submit review:', error);
        alert('Failed to submit review. Please try again.');
      }
    }

    function displaySingleReview(review) {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');
      
        const nameHeading = document.createElement('h4');
        nameHeading.textContent = review.name;
      
        const ratingStars = '★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating));
        const ratingSpan = document.createElement('p');
        ratingSpan.classList.add('rating');
        ratingSpan.textContent = ratingStars;
      
        const commentParagraph = document.createElement('p');
        commentParagraph.textContent = review.comment;
      
        const dateParagraph = document.createElement('p');
        dateParagraph.classList.add('review-date');
        dateParagraph.textContent = `Reviewed on: ${review.date}`;
      
        reviewCard.appendChild(nameHeading);
        reviewCard.appendChild(ratingSpan);
        reviewCard.appendChild(commentParagraph);
        reviewCard.appendChild(dateParagraph);
        reviewsContainer.appendChild(reviewCard);
      }
  
    function displayReviews(reviews) {
      reviewsContainer.innerHTML = '';
      if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to leave one!</p>';
        return;
      }
  
      reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');
  
        const nameHeading = document.createElement('h4');
        nameHeading.textContent = review.name;
  
        const ratingStars = '★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating));
        const ratingSpan = document.createElement('p');
        ratingSpan.classList.add('rating');
        ratingSpan.textContent = ratingStars;
  
        const commentParagraph = document.createElement('p');
        commentParagraph.textContent = review.comment;
  
        const dateParagraph = document.createElement('p');
        dateParagraph.classList.add('review-date');
        dateParagraph.textContent = `Reviewed on: ${review.date}`;
  
        reviewCard.appendChild(nameHeading);
        reviewCard.appendChild(ratingSpan);
        reviewCard.appendChild(commentParagraph);
        reviewCard.appendChild(dateParagraph);
        reviewsContainer.appendChild(reviewCard);
      });
    }
  });
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const categoryCards = document.querySelectorAll('.shop .categories .card');

  function filterCards(searchTerm) {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    categoryCards.forEach(card => {
      const categoryText = card.querySelector('p').textContent.toLowerCase();
      const categoryData = card.dataset.category ? card.dataset.category.toLowerCase() : '';
      const altText = card.querySelector('img').alt.toLowerCase();

      if (categoryText.includes(lowercasedSearchTerm) || categoryData.includes(lowercasedSearchTerm) || altText.includes(lowercasedSearchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim();
      filterCards(searchTerm);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim();
      filterCards(searchTerm);
    });
  }
;