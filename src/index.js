import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import getRefs from './js/refs';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();
console.log(refs);

refs.searchEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
refs.countryList.style.cssText = `
    list-style-type: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

function onSearch(e) {
    e.preventDefault();
    const trimmedValue = refs.searchEl.value.trim();
    cleanHtml();

    if (trimmedValue) {
        fetchCountries(trimmedValue).then(r => {
            if (r.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            }
            else if(r.length === 0) {
                Notiflix.Notify.failure("Oops, there is no country with that name");
            }
            else if (r.length >= 2 && r.length <= 10) {
                renderCountriesList(r);
            }
            else if (r.length === 1) {
                renderCountry(r);
            }
        });
    }
}

function renderCountriesList(countries) {
    const markup = countries.map(country => {
        return `
        <li>
            <img src="${country.flags.svg}" 
            alt="Flag of ${country.name.official}"
            width="30" hight="20">
            <b>${country.name.official}</p>
        </li>`;
    }).join('');
    refs.countryList.innerHTML = markup;
}

function renderCountry(countries) {
    const markup = countries.map(country => {
        return `<div>
            <img src="${country.flags.svg}" 
            alt="Flag of ${country.name.official}" 
            width="30" hight="20">
            <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
        </div>`;
    }).join('');
    refs.countryInfo.innerHTML = markup;
}

function cleanHtml() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }
