import TripListView from '../view/trip-list-view';
// import TripPointCreatorView from '../view/trip-point-creator-view';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/trip-list-empty-view';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/utils.js';
import { SortType } from '../const';
import { sortPointDay, sortPointPrice } from '../utils/point';

export default class PointListPresenter {
  #pointListComponent = new TripListView();
  #sortComponent = new SortView();
  #noPointComponent = new EmptyListView();
  #pointListContainer = null;
  #pointsModel = null;
  #pointListPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(pointListContainer, pointsModel){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#pointListPoints = [...this.#pointsModel.points];
    this.#renderPointList();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointListPoints = updateItem(this.#pointListPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#pointListPoints.sort(sortPointDay);
        break;
      case SortType.PRICE:
        this.#pointListPoints.sort(sortPointPrice);
        break;
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#pointListContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoPoint = () => {
    render(this.#noPointComponent, this.#pointListContainer);
  };

  #renderPointListContainer = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderTripList = () => {
    this.#pointListPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderPointList = () => {
    if (this.#pointListPoints.length === 0) {
      this.#renderNoPoint();
      return;
    }
    this.#renderSort();
    this.#renderPointListContainer();
    this.#renderTripList();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };
}
