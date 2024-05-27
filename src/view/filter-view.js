import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createFilterTemplate = (currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currentFilter === FilterType.EVERYTHING ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilter === FilterType.FUTURE ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FilterView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
