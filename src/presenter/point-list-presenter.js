import TripListView from '../view/trip-list-view';
import TripPointView from '../view/trip-point-view';
// import TripPointCreatorView from '../view/trip-point-creator-view';
import TripPointEditorView from '../view/trip-point-editor-view';
import SortView from '../view/sort-view.js';
import { render } from '../render';
import EmptyListView from '../view/trip-list-empty-view';

export default class PointListPresenter {
  #pointListComponent = new TripListView();
  #pointListContainer = null;
  #pointsModel = null;
  #pointListPoints = [];

  constructor(pointListContainer, pointsModel){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#pointListPoints = [...this.#pointsModel.points];
    this.#renderTripList();
  };

  #renderTripList = () => {
    if (this.#pointListPoints.length === 0) {
      render(new EmptyListView(), this.#pointListContainer);
      return;
    }
    render(new SortView(), this.#pointListContainer);
    render(this.#pointListComponent, this.#pointListContainer);
    this.#pointListPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderPoint = (point) => {
    const tripPointComponent = new TripPointView(point);
    const tripEditPointComponent = new TripPointEditorView(point);

    const replaceCardToForm = () => {
      this.#pointListComponent.element.replaceChild(tripEditPointComponent.element, tripPointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#pointListComponent.element.replaceChild(tripPointComponent.element, tripEditPointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const closeTripPointEditor = () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripEditPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      closeTripPointEditor();
    });

    tripEditPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', closeTripPointEditor);

    render(tripPointComponent, this.#pointListComponent.element);
  };
}
