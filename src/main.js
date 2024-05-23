import { render } from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import PointListPresenter from './presenter/point-list-presenter.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointListPresenter = new PointListPresenter({pointListContainer: tripEventsElement});

render(new FilterView(), tripControlsFiltersElement);
render(new SortView(), tripEventsElement);

pointListPresenter.init();
