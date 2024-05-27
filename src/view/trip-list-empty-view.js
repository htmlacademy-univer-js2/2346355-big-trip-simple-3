import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const noTasksTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createEmptyListTemplate = (filterType) => (`<p class="trip-events__msg">${noTasksTextType[filterType]}</p>`);

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
