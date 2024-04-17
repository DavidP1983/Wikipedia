
const form = document.querySelector('.form');
const inputValue = document.querySelector('.form__input');
const result = document.querySelector(".wiki__result");

const message = {
    loading: 'spinner/loading.svg',
    failure: 'Samething went wrong'
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    result.innerHTML = "Кол-во найденных статей: 0";

    if (inputValue.value.trim() !== '') {

        const statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = 'position: absolute;display: block;margin: 0px auto;top: 130px;left: 0;right: 0;';
        document.querySelector(".container").append(statusMessage);


        searchWiki(inputValue.value, statusMessage);
    }
});

async function searchWiki(value, statusMessage) {
    const url = `https://ru.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=50&srsearch=${encodeURIComponent(
        value,
    )}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }
        const data = await response.json();
        displayResult(data.query.search);
        statusMessage.remove();

    } catch (e) {
        statusMessage.remove();
        messageError(message.failure);
        throw e;
    }
}

function messageError(message) {
    const errorMessage = document.createElement("h2");
    errorMessage.classList.add("wrapper__error");
    errorMessage.innerHTML = message;

    document.querySelector(".container").append(errorMessage);
}

function displayResult(results) {
    result.innerHTML = `Кол-во найденных статей: ${results.length}`;

    const wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML = '';
    results.forEach((item) => {
        const element = document.createElement('div');
        element.classList.add('wrapper__article');
        element.innerHTML = `
        <h2 class="wrapper__title">${item.title}</h2>
                    <div class="wrapper__descr">${item.snippet}</div>
                    <button class="wrapper__info" type="button"><a href="https://ru.wikipedia.org/?curid=${item.pageid}" target="_blank">Читать больше</a></button>
        `;
        wrapper.appendChild(element);
    });

    inputValue.value = '';
}