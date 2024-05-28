import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES } from '../const.js';
import { humanizePointEditorDueDate, isFutureThen, getDestination, getOffers } from '../utils/point.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 1,
  dateFrom: Date(),
  dateTo: Date(),
  destination: [],
  offers: [],
  type: 'bus',
  isNewPoint: true,
  isDisabled: false,
  isSaving: false,
  isDeleting: false,
};

const toUpperCaseFirstSymbol = (str) => str.replace(/^\w/, (match) => match.toUpperCase());

const generateEventTypeGroup = (type, isDisabled) => POINT_TYPES.map((typeNow)=>
  `<div class="event__type-item">
    <input id="event-type-${typeNow}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeNow}" ${type === typeNow ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__type-label  event__type-label--${typeNow}" for="event-type-${typeNow}-1">${toUpperCaseFirstSymbol(typeNow)}</label>
  </div>`).join('');

const generateOffersGroup = (offers, allOffers, isDisabled) => allOffers.offers.map((offerNow) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerNow.title.replace(' ', '-')}-1" data-offer-id="${offerNow.id}" type="checkbox" name="event-offer-${offerNow.title.replace(' ', '-')}" ${offers && offers.includes(offerNow.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offerNow.title.replace(' ', '-')}-1">
      <span class="event__offer-title">${offerNow.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offerNow.price}</span>
    </label>
  </div>
`).join('');

const generateOfferSection = (offers, allOffers, isDisabled) => `
<section class="event__section  event__section--offers">
<h3 class="event__section-title  event__section-title--offers">Offers</h3>

<div class="event__available-offers">
  ${generateOffersGroup(offers, allOffers, isDisabled)}
</div>
</section>
`;

const generateDestinationPhotosGroup = (photos) => photos.map((photo) => `
  <img class="event__photo" src="${photo.src}" alt="${photo.description}">
`).join('');

const generateDestinationSection = (destination) => `
<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>

  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${generateDestinationPhotosGroup(destination.pictures)}
    </div>
  </div>
</section>`;

const createDestinationList = (destinations) => (destinations
  .map((destination) => `
    <option value="${destination.name}"></option>`)
  .join(''));

const createTripPointEditorTemplate = (point, allOffers, allDestinations) => {
  const { basePrice, dateFrom, dateTo, offers, type, destination, isOffers, isDestination, isNewPoint, isDisabled, isDeleting, isSaving } = point;
  const destinationInfo = getDestination(destination, allDestinations);
  const offersInfo = getOffers(type, allOffers);
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1" ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${generateEventTypeGroup(type, isDisabled)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${toUpperCaseFirstSymbol(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" autocomplete="off" value="${destinationInfo ? destinationInfo.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${createDestinationList(allDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointEditorDueDate(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointEditorDueDate(dateTo)}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      ${isNewPoint ? '<button class="event__reset-btn" type="reset">Cancel</button>' : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button><button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>`}
    </header>
    <section class="event__details">
      ${isOffers ? generateOfferSection(offers, offersInfo, isDisabled) : ''}
      ${isDestination ? generateDestinationSection(destinationInfo) : ''}
    </section>
  </form>
</li>`;
};

export default class TripPointEditView extends AbstractStatefulView {
  #fromDatepicker = null;
  #toDatepicker = null;
  #destinations = null;
  #offers = null;

  constructor(offers, destinations, point = BLANK_POINT) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    if (point === BLANK_POINT) {
      point = {
        ...point,
        destination: destinations[0].id,
      };
    }
    this._state = TripPointEditView.parsePointToState(point, this.#offers);
    this.#setInnerHandlers();
  }

  removeElement() {
    super.removeElement();
    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }
    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  get template() {
    return createTripPointEditorTemplate(this._state, this.#offers, this.#destinations);
  }

  reset = (point) => {
    this.updateElement(
      TripPointEditView.parsePointToState(point, this.#offers)
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    if (!this._state.isNewPoint){
      this.setCloseClickHandler(this._callback.closeClick);
    }
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(TripPointEditView.parseStateToPoint(this._state));
  };

  #typeChangedHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
      isOffers: this.#offers.find((el) => el.type === evt.target.value).offers.length > 0,
    });
  };

  #offersChangedHandler = (evt) => {
    const offerId = parseInt(evt.target.dataset.offerId, 10);
    if (evt.target.checked) {
      this._state.offers.push(offerId);
    } else {
      this._state.offers.splice(this._state.offers.indexOf(offerId), 1);
    }
  };

  #basedPriceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = parseInt(evt.target.value, 10);
    if (!(/^\d+$/.test(evt.target.value)) || newPrice <= 0) {
      evt.target.value = this._state.basePrice;
      return;
    }
    this._setState({
      basePrice: newPrice
    });
  };

  #destinationChangedHandler = (evt) => {
    evt.preventDefault();
    const newDest = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (!newDest) {
      return;
    }
    const newDestination = true;
    this.updateElement({
      isDestination: newDestination,
      destination: newDest.id
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripPointEditView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #fromDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        dateFrom: userDate.toISOString(),
      });
      if (isFutureThen(this._state.dateFrom, this._state.dateTo)) {
        this._setState({
          dateTo: userDate.toISOString(),
        });
        this.#toDatepicker.setDate(this._state.dateFrom);
      }
      this.#toDatepicker.set('minDate', userDate);
    }
  };


  #toDateChangeHandler = ([userDate]) => {
    if (userDate) {
      this._setState({
        dateTo: userDate.toISOString(),
      });
    }
  };

  #setFromDatePicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: humanizePointEditorDueDate(this._state.dateFrom),
        onChange: this.#fromDateChangeHandler,
      },
    );
  }

  #setToDatePicker() {
    this.#toDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: humanizePointEditorDueDate(this._state.dateTo),
        minDate: humanizePointEditorDueDate(this._state.dateFrom),
        onChange: this.#toDateChangeHandler,
      },
    );
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangedHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangedHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#basedPriceChangeHandler);
    if (this._state.isOffers) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offersChangedHandler);
    }
    this.#setFromDatePicker();
    this.#setToDatePicker();
  };

  static parsePointToState = (point, offers) => ({
    isNewPoint: false,
    ...point,
    isOffers: offers.find((el) => el.type === point.type).offers.length > 0,
    isDestination: point.destination !== null,
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    delete point.isOffers;
    delete point.isDestination;
    delete point.isNewPoint;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };
}
