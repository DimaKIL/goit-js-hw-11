import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './api-service';
import { makeMarkUp } from './makeMarkUp';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmit);
refs.gallery.addEventListener('click', e => {
  e.preventDefault();
});

let page = 1;
let query = "";

let previousY = 0;


function loadPage(pageNumber, query) {
  // Loads paginated data from API and appends it's rendered template into the gallery

  API.getData(query, pageNumber).then(data => {
    if (data.data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    makeMarkUp(data.data.hits, refs.gallery);
    lightbox.refresh();
    observer.observe(refs.gallery.lastElementChild);
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function onSubmit(e) {
  // When new query is submitted
  page = 1;
  previousY = 0;

  query = refs.form.elements.searchQuery.value;

  e.preventDefault();
  clearGallery();
  loadPage(page, query);
}

let lightbox = new SimpleLightbox('.gallery a');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    const currentY = entry.boundingClientRect.y;
    console.log(currentY);

    if (currentY > previousY && entry.isIntersecting) {
      loadPage(page, query);
      page += 1;
    }

    previousY = currentY;
  });
});