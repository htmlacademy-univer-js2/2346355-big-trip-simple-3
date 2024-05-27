import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewTripPointButtonView from './view/new-trip-point-view.js';
import { render } from './framework/render.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripContainerForHeaderElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const pointListPresenter = new PointListPresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const newTripPointComponent = new NewTripPointButtonView();

const handleNewPointFormClose = () => {
  newTripPointComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  pointListPresenter.createPoint(handleNewPointFormClose);
  newTripPointComponent.element.disabled = true;
};
render(newTripPointComponent, tripContainerForHeaderElement);
newTripPointComponent.setClickHandler(handleNewPointButtonClick);

filterPresenter.init();
pointListPresenter.init();
