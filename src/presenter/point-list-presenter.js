import TripListView from '../view/trip-list-view';
import SortView from '../view/sort-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import { sortPointDay, sortPointPrice } from '../utils/point';
import { filter } from '../utils/filter';
import PointNewPresenter from './point-new-presenter';

export default class PointListPresenter {
  #pointListComponent = new TripListView();
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

  constructor(pointListContainer, pointsModel, filterModel){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderPointList();
  };

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
    }, this.#sortComponent.element);
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
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderPointList();
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
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    remove(this.#pointListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderPointList = () => {
    if (this.points.length === 0 && !this.#createNewForm) {
      this.#renderNoPoint();
      return;
    }
    this.#renderSort();
    this.#renderPointListComponent();
    this.#renderPoints(this.points);
  };

  #renderNoPoint = () => {
    this.#noPointComponent = new EmptyListView(this.#filterType);
    render(this.#noPointComponent, this.#pointListContainer);
  };

  #renderPointListComponent = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };
}
