import TripListView from '../view/trip-list-view';
import SortView from '../view/sort-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import { sortPointDay, sortPointPrice } from '../utils/point';
import { filter } from '../utils/filter';
import PointNewPresenter from './point-new-presenter';

export default class PointListPresenter {
  #pointListComponent = new TripListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #sortComponent = null;
  #pointListContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;
  #pointNewPresenter = null;
  #createNewForm = false;
  #isLoading = true;
  #destinationsModel = null;
  #offersModel = null;
  #initCounter = 0;

  constructor(pointListContainer, pointsModel, filterModel, destinationsModel, offersModel){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderPointList();
  };

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get points () {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
    }

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#createNewForm = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(() => {
      callback?.();
      this.#clearPointList({destroyNewPresenter: false});
      this.#renderPointList();
    }, this.#sortComponent.element, this.destinations, this.offers);
    this.#createNewForm = false;
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderPointList();
        break;
      case UpdateType.INIT:
        this.#initCounter += 1;
        if (this.#initCounter >= 3){
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#renderPointList();
          break;
        }
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearPointList = ({resetSortType = false, destroyNewPresenter = true} = {}) => {
    if (destroyNewPresenter){
      this.#pointNewPresenter.destroy();
    }
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#pointListComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#pointListContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0 && !this.#createNewForm) {
      this.#renderNoPoint();
      return;
    }
    this.#renderSort();
    this.#renderPoints(this.points);
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoint = () => {
    this.#noPointComponent = new EmptyListView(this.#filterType);
    render(this.#noPointComponent, this.#pointListContainer);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.destinations, this.offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };
}
