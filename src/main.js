import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "41633959-4ab3a3c79df0d7e6ffc2251eb";

const form = document.querySelector(".form");
const photoContainer = document.querySelector(".photo-container");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more");

let gallery;
let currentPage = 1;
let currentQuery = "";
let totalHits = 0;
let cardHeight = 0; 


loadMoreBtn.style.display = "none";

const getBaseUrl = () => {
    const url = new URL(BASE_URL);
    url.searchParams.append("key", API_KEY);
    url.searchParams.append("image_type", "photo");
    url.searchParams.append("orientation", "horizontal");
    url.searchParams.append("safesearch", "true");
    url.searchParams.append("page", currentPage);
    url.searchParams.append("per_page", 40); 

    return url;
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = event.currentTarget.elements[0].value;

    if (query.length < 4) {
        alert("Sorry, Yours length is not enough. Min 4 letters.");
    } else {
        loader.style.display = "block";
        loadMoreBtn.style.display = "none"; 
        currentQuery = query.toLowerCase();
        currentPage = 1; 
        try {
            await renderPhoto();
        } catch (error) {
            console.error(error);
        }
    }
});

loadMoreBtn.addEventListener("click", async () => {
    loader.style.display = "block";
    currentPage++;
    try {
        await renderPhoto();
    } catch (error) {
        console.error(error);
    }
});

const getPhoto = async () => {
    const url = getBaseUrl();
    url.searchParams.append("q", currentQuery);

    try {
        const response = await axios.get(url.toString());

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Request is not okay");
        }
    } catch (error) {
        console.error(error);
    }
};

const renderPhoto = async () => {
    try {
        const images = await getPhoto();

        if (images.hits.length === 0 && currentPage === 1) {
            iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight'
            });
            loader.style.display = "none";
            return;
        } else if (images.hits.length === 0) {
            iziToast.info({
                message: 'We\'re sorry, but you\'ve reached the end of search results.',
                position: 'topRight'
            });
            loader.style.display = "none";
            loadMoreBtn.style.display = "none";
            return;
        }

        totalHits = images.totalHits;

        if (currentPage === 1) {
            const firstCard = document.querySelector('.photo-card');
            if (firstCard) {
                const cardRect = firstCard.getBoundingClientRect();
                cardHeight = cardRect.height;
            }
        }

        const photoList = images.hits.reduce((html, hit, index) => {
            return html +
                `<div class="photo-card">
                    <div class="photo">
                        <a href="${hit.largeImageURL}" data-lightbox="gallery-${index}">
                            <img src="${hit.webformatURL}" alt="${hit.tags}" width="360" height="200" />
                        </a>
                    </div>
                    <div class="info-container">
                        <div class="label-value">
                            <div class="label-likes">Likes</div>
                            <div class="value">${hit.likes}</div>
                        </div>
                        <div class="label-value">
                            <div class="label-likes">Views</div>
                            <div class="value">${hit.views}</div>
                        </div>
                        <div class="label-value">
                            <div class="label-likes">Comments</div>
                            <div class="value">${hit.comments}</div>
                        </div>
                        <div class="label-value">
                            <div class="label-likes">Downloads</div>
                            <div class="value">${hit.downloads}</div>
                        </div>
                    </div>
                </div>`;
        }, '');

        if (currentPage === 1) {
            photoContainer.innerHTML = photoList;
        } else {
            photoContainer.innerHTML += photoList;
        }

        loader.style.display = "none";

        loadMoreBtn.style.display = currentPage * 40 >= totalHits ? "none" : "block";

        gallery = new SimpleLightbox('.photo a', {
            captionsData: 'alt',
            captionPosition: 'bottom',
            captionDelay: 250,
        });
        gallery.refresh();

      
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth'
        });
    } catch (error) {
        console.error(error);
    }
};

window.scrollBy(0, window.innerHeight);
window.scrollBy(0, -window.innerHeight);
window.scrollBy({
    top: 100,
    left: 100,
    behavior: "smooth",
});
