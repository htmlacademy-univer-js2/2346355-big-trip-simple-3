import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const pointListPresenter = new PointListPresenter(tripEventsElement, pointsModel);

render(new FilterView(), tripControlsFiltersElement);

pointListPresenter.init();
