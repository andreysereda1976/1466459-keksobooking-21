'use strict';

(() => {

  const PIN_X_SHIFT = 25;
  const PIN_Y_SHIFT = 70;

  const map = document.querySelector(`.map`);
  const form = document.querySelector(`.ad-form`);
  const address = form.querySelector(`#address`);

  const findCardToShow = (evt) => {
    if (!evt.target.closest(`.map__pin`) || evt.target.closest(`.map__pin`).classList.contains(`map__pin--main`)) {
      return;
    }
    let activePin = evt.target.closest(`.map__pin`);
    let dataToShow = cardsList.filter(function (item) {
      return item.offer.title === activePin.querySelector(`img`).alt && activePin.style.left === `${item.location.x - PIN_X_SHIFT}px` && activePin.style.top === `${item.location.y - PIN_Y_SHIFT}px`;
    });
    window.card.newCard(dataToShow[0]);
  };

  const setAddress = () => {
    if (map.classList.contains(`map--faded`)) {
      address.value = `601, 450`;
    } else {
      address.value = `601, 459`;
    }
  };

  let cardsList = [];

  const onDataLoad = (response) => {
    cardsList = response;
  };

  const errorHandler = (errorMessage) => {
    let node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  window.backend.load(onDataLoad, errorHandler);

  const renderPin = (data) => {

    const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
    let pinElement = pinTemplate.cloneNode(true);

    let pinX = data.location.x - PIN_X_SHIFT;
    let pinY = data.location.y - PIN_Y_SHIFT;

    pinElement.querySelector(`img`).src = data.author.avatar;
    pinElement.querySelector(`img`).alt = data.offer.title;
    pinElement.style = `left: ${pinX}px; top: ${pinY}px;`;

    return pinElement;
  };

  const makePinsList = (array) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < array.length; i++) {
      fragment.appendChild(renderPin(array[i]));
    }
    return fragment;
  };

  const renderPins = () => {
    const mapPins = document.querySelector(`.map__pins`);
    mapPins.appendChild(makePinsList(cardsList));
    map.addEventListener(`click`, findCardToShow);
  };

  const activateMap = () => {
    map.classList.remove(`map--faded`);
    if (!map.querySelector(`.map__card`)) {
      renderPins();
    }
    setAddress();
    // window.card.newCard(cardsList[0]);
  };

  const deactivateMap = () => {
    map.classList.add(`map--faded`);
    setAddress();
  };

  window.mapPins = {
    activateMap,
    deactivateMap,
  };

})();
