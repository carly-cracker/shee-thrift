document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-container');
  const REVIEWS_API_URL = 'https://shee-store-server.vercel.app/reviews';

  let currentReviewIndex = 0;
  let allReviews = [];

  if (reviewForm) {
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
  }

  async function loadReviews() {
    try {
      const response = await fetch(REVIEWS_API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      console.log("Submitting review:", review);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const savedReview = await response.json();

      allReviews.unshift(savedReview); 
    displaySingleReview(savedReview)
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Thank you for the review, it’s being staged.');
    }
  }

  function displaySingleReview(review) {
    const reviewCard = createReviewCard(review);
    reviewsContainer.appendChild(reviewCard);
  }

  function createReviewCard(review) {
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

    reviewCard.append(nameHeading, ratingSpan, commentParagraph, dateParagraph);
    return reviewCard;
  }

  function displayReviews(reviews) {
    reviewsContainer.innerHTML = '';
    allReviews = reviews;
    currentReviewIndex = 0;

    const viewMoreBtn = document.createElement('button');
    viewMoreBtn.textContent = 'View More Reviews';
    viewMoreBtn.id = 'view-more-btn';
    viewMoreBtn.classList.add('view-more-btn');

    function renderNextReviews() {
      const nextReviews = allReviews.slice(currentReviewIndex, currentReviewIndex + 5);
      nextReviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsContainer.appendChild(reviewCard);
      });

      currentReviewIndex += nextReviews.length;

      if (currentReviewIndex >= allReviews.length) {
        viewMoreBtn.remove();
      }
    }

    renderNextReviews();
    viewMoreBtn.addEventListener('click', renderNextReviews);
    reviewsContainer.appendChild(viewMoreBtn);
  }

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const categoryCards = document.querySelectorAll('.shop .categories .card');

  function filterCards(searchTerm) {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    categoryCards.forEach(card => {
      const categoryText = card.querySelector('p')?.textContent.toLowerCase() || '';
      const categoryData = card.dataset.category?.toLowerCase() || '';
      const altText = card.querySelector('img')?.alt.toLowerCase() || '';

      if (
        categoryText.includes(lowercasedSearchTerm) ||
        categoryData.includes(lowercasedSearchTerm) ||
        altText.includes(lowercasedSearchTerm)
      ) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim();
      filterCards(searchTerm);
    });

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim();
      filterCards(searchTerm);
    });
  }

  // Load reviews initially
  loadReviews();
});
