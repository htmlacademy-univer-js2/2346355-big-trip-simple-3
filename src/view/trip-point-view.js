import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate, getDateForDateTimeWithoutTime,
  getDateForDateTimeWithTime, getTimeFromDateTime } from '../utils/point.js';
import { getDestination } from '../utils/point.js';

const createOffersTemplate = (offers) => offers.length !== 0 ? offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('') : `<li class="event__offer">
  <span class="event__offer-title">No additional offers</span>
</li>`;

const createTripPointTemplate = (point, allOffers, allDestinations) => {
  const { basePrice, dateFrom, dateTo, offers, type, destination } = point;
  const startDateForHuman = humanizePointDueDate(dateFrom);
  const dateForDateTimeWithoutTime = getDateForDateTimeWithoutTime(dateFrom);
  const dateForDateTimeWithStartTime = getDateForDateTimeWithTime(dateFrom);
  const dateForDateTimeStartTime = getTimeFromDateTime(dateForDateTimeWithStartTime);
  const dateForDateTimeWithEndTime = getDateForDateTimeWithTime(dateTo);
  const dateForDateTimeEndTime = getTimeFromDateTime(dateForDateTimeWithEndTime);
  const offersType = allOffers.find((el) => el.type === type).offers;
  const offersTemplate = createOffersTemplate(offersType.filter((el) => offers && offers.includes(el.id)));
  return (`<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateForDateTimeWithoutTime}">${startDateForHuman}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${getDestination(destination, allDestinations).name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateForDateTimeWithStartTime}">${dateForDateTimeStartTime}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateForDateTimeWithEndTime}">${dateForDateTimeEndTime}</time>
      </p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      <li class="event__offer">
        ${offersTemplate}
      </li>
    </ul>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`);
};

export default class TripPointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;

  constructor(offers, destinations, point) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#point = point;
  }

  get template() {
    return createTripPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  setClickOpenEditorHandler = (callback) => {
    this._callback.clickOpenEditor = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickOpenEditor);
  };

  #clickOpenEditor = (evt) => {
    evt.preventDefault();
    this._callback.clickOpenEditor();
  };
}
