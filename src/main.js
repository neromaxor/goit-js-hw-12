import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from "axios";

const api = axios.create({
  baseURL: "https://pixabay.com/api/",
  params: {
    key: "41633959-4ab3a3c79df0d7e6ffc2251eb",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  },
});

const form = document.querySelector(".form");
const photoContainer = document.querySelector(".photo-container");
const loader = document.querySelector(".loader");
const buttonLoadMore = document.querySelector(".button-load-more");

let gallery;
let page = 1;
let limit = 40;
let currentQuery = "";
let totalPages = 1;

const getPhoto = async (query = "") => {
  try {
    const response = await api.get("", {
      params: {
        q: query,
        page: page,
        per_page: limit,
      },
    });

    if (response.status === 200) {
      totalPages = Math.ceil(response.data.totalHits / limit);
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

function smoothScrollToNextGroup() {
  const cardHeight = document.querySelector(".photo-card")?.getBoundingClientRect().height;
  const scrollDistance = 2 * (cardHeight || 0); 

  window.scrollBy({
    top: scrollDistance,
    behavior: "smooth",
  });
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = event.currentTarget.elements[0].value;

  if (query.length < 3) {
    alert("Sorry, Yours length is not enough. Min 4 letters.");
  }
  else {
      
    try {
      currentQuery = query.toLowerCase();
      page = 1;
      await renderPhoto(currentQuery);
    } catch (error) {
      console.error(error);
    }
  }
});

async function renderPhoto(query) {
  try {
    buttonLoadMore.style.display = "none";
    const images = await getPhoto(query);


    if (images.hits.length === 0 && page === 1) {
      
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight'
      });
    }

    if (page === 1) {
      photoContainer.innerHTML = '';
    }

    const photoList = images.hits
      .map((hit, index) => (
        `<div class="photo-card">
          <div class="photo">
            <a href="${hit.largeImageURL}" data-lightbox="gallery-${index}">
              <img src="${hit.webformatURL}" alt="${hit.tags}" width="360" height="200" />
            </a>
          </div>
          <div class="info">
            <div class="label-value">
              <div class="label">Likes</div>
              <div class="value">${hit.likes}</div>
            </div>
            <div class="label-value">
              <div class="label">Views</div>
              <div class="value">${hit.views}</div>
            </div>
            <div class="label-value">
              <div class="label">Comments</div>
              <div class="value">${hit.comments}</div>
            </div>
            <div class="label-value">
              <div class="label">Downloads</div>
              <div class="value">${hit.downloads}</div>
            </div>
          </div>
        </div>`
      ))
      .join('');

    photoContainer.insertAdjacentHTML("beforeend", photoList);

    gallery = new SimpleLightbox('.photo a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });
    gallery.refresh();

    if (page > 1) {
      smoothScrollToNextGroup();
    }
    
    if (page < totalPages) {
      buttonLoadMore.style.display = "inline";
    }
  } catch (error) {
    console.error(error);
  } 
}
buttonLoadMore.addEventListener("click", async () => {
  page += 1;
  loader.style.display = "block";
  try {
    await renderPhoto(currentQuery);
    if (page >= totalPages) {
      
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight'
      });
      buttonLoadMore.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = "none";
  }
});