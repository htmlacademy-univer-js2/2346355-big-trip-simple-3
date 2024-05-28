import PointListPresenter from './presenter/point-list-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewTripPointButtonView from './view/new-trip-point-view.js';
import { render } from './framework/render.js';
import PointApiService from './api/point-api-service.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const AUTHORIZATION = 'Basic PwIAlL7yyAjdtH4TlvJVWLBoZ';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripContainerForHeaderElement = document.querySelector('.trip-main');

const apiService = new PointApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel(apiService);
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel(apiService);
const offersModel = new OffersModel(apiService);

const pointListPresenter = new PointListPresenter(tripEventsElement, pointsModel, filterModel, destinationsModel, offersModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const newTripPointComponent = new NewTripPointButtonView();

const handleNewPointFormClose = () => {
  newTripPointComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  pointListPresenter.createPoint(handleNewPointFormClose);
  newTripPointComponent.element.disabled = true;
};

filterPresenter.init();
pointListPresenter.init();
Promise.all([pointsModel.init(), destinationsModel.init(), offersModel.init()]).finally(() => {
  render(newTripPointComponent, tripContainerForHeaderElement);
  newTripPointComponent.setClickHandler(handleNewPointButtonClick);
});
