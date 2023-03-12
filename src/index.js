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
let lightbox;

refs.searchForm.addEventListener('submit', onSearch);
refs.btn.addEventListener('click', onLoadMore);
refs.btnUp.addEventListener('click', scrollBtn);

async function onSearch(e) {
  e.preventDefault();
  clearArticleContainer();

  newApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newApiService.query === '') {
    Notiflix.Notify.failure('Please type something.');
    addClass();
    return;
  }

  const elements = await newApiService.fetchPixabay();
  console.log(elements);

  if (elements.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    addClass();
    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${elements.totalHits} images.`);
    removeClass();
    cardMarkup(elements.hits);
    simpleLightbox();
    return;
  }
}

async function onLoadMore() {
  newApiService.incrementPage();
  lightbox.destroy();

  const elements = await newApiService.fetchPixabay();

  const totalPages = Math.ceil(elements.totalHits / newApiService.perPage);

  if (newApiService.page >= totalPages) {
    addClass();
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
  cardMarkup(elements.hits);
  simpleLightbox();
}

function clearArticleContainer() {
  refs.gallery.innerHTML = '';
}

function simpleLightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
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
  return (
    refs.btn.classList.add('visually-hidden'),
    refs.btnUp.classList.add('visually-hidden')
  );
}

function removeClass() {
  refs.btn.classList.remove('visually-hidden');
  refs.btnUp.classList.remove('visually-hidden');
}
