import { render } from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const pointListPresenter = new PointListPresenter();

render(new FilterView(), tripControlsFiltersElement);
render(new SortView(), tripEventsElement);

pointListPresenter.init(tripEventsElement, pointsModel);
