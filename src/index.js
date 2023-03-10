import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { ApiService } from './fetchPixabay';
import { cardMarkup } from './markup';

export const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('.load-more'),
  btnUp: document.querySelector('.btn-up'),
};

const newApiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.btn.addEventListener('click', onLoadMore);
refs.btnUp.addEventListener('click', scrollBtn);

function onSearch(e) {
  e.preventDefault();
  clearArticleContainer();
  addClass();

  newApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  newApiService
    .fetchPixabay()
    .then(response => {
      if (response.data.total === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        removeClass();
        cardMarkup(response.data.hits);
        lightbox();

        return Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images!`
        );
      }
    })
    .catch(error => console.log(error));
}

function onLoadMore() {
  newApiService.incrementPage();

  newApiService.fetchPixabay().then(response => {
    cardMarkup(response.data.hits);
    lightbox();

    const totalPages = Math.ceil(
      response.data.totalHits / newApiService.perPage
    );

    if (newApiService.page + 1 > totalPages) {
      addClass();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function clearArticleContainer() {
  refs.gallery.innerHTML = '';
}

function lightbox() {
  simpleLightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

function scrollBtn() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function addClass() {
  refs.btn.classList.add('visually-hidden');
  refs.btnUp.classList.add('visually-hidden');
}

function removeClass() {
  refs.btn.classList.remove('visually-hidden');
  refs.btnUp.classList.remove('visually-hidden');
}

