import { fetchBreeds, fetchCatByBreed } from "./js/cat-api";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css';
import "./css/styles.css"

let firstLoade = true;

const ref = {
    selectMenu: document.querySelector('.breed-select'),
    catInfo: document.querySelector('.cat-info'),
    loader: document.querySelector('.loader'),
    error: document.querySelector('.error'),
};
const { catInfo, loader, error } = ref;

loader.classList.replace('loader', 'is-hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');

let selector = null;

let arrBreedsId = [];
fetchBreeds()
.then(data => {
    data.forEach(element => {
        arrBreedsId.push({text: element.name, value: element.id});
    });

    selector = new SlimSelect({
        select: '.breed-select',
        data: arrBreedsId
    });
    ref.selectMenu.classList.remove('is-hidden')
})
.catch(onFetchError);

document.querySelector('.breed-select').addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
    if (firstLoade) {
        return (firstLoade = false);
    }

    loader.classList.replace('is-hidden', 'loader');
    catInfo.classList.add('is-hidden');

    const breedId = event.currentTarget.value;
    fetchCatByBreed(breedId)
    .then(data => {
        loader.classList.replace('loader', 'is-hidden');
        selector.enable();
        const { url, breeds } = data[0];
        
        catInfo.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`
        catInfo.classList.remove('is-hidden');
        
    })
    .catch(onFetchError);
}

function onFetchError(error) {
    selector.enable();
    loader.classList.replace('loader', 'is-hidden');

    Notify.failure('Oops! Something went wrong! Try reloading the page or select another cat breed!', {
        position: 'center-center',
        timeout: 5000,
        width: '400px',
        fontSize: '24px'
    });
    
}