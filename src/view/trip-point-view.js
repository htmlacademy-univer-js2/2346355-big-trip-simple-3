import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate, getDateForDateTimeWithoutTime,
  getDateForDateTimeWithTime, getTimeFromDateTime } from '../utils/point.js';
import { generateOffer } from '../mock/offer.js';
import { generateDestination } from '../mock/destination.js';

const createOffersTemplate = (offers) => offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');

const createTripPointTemplate = (point) => {
  const { basePrice, dateFrom, dateTo, offers, type, destination } = point;
  const startDateForHuman = humanizePointDueDate(dateFrom);
  const dateForDateTimeWithoutTime = getDateForDateTimeWithoutTime(dateFrom);
  const dateForDateTimeWithStartTime = getDateForDateTimeWithTime(dateFrom);
  const dateForDateTimeStartTime = getTimeFromDateTime(dateForDateTimeWithStartTime);
  const dateForDateTimeWithEndTime = getDateForDateTimeWithTime(dateTo);
  const dateForDateTimeEndTime = getTimeFromDateTime(dateForDateTimeWithEndTime);
  const offersTemplate = createOffersTemplate(generateOffer(offers));
  return (`<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateForDateTimeWithoutTime}">${startDateForHuman}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${generateDestination(destination).name}</h3>
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

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createTripPointTemplate(this.#point);
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
