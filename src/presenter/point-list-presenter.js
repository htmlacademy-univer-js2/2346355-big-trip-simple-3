import TripListView from '../view/trip-list-view';
import TripPointView from '../view/trip-point-view';
import TripPointCreatorView from '../view/trip-point-creator-view';
import TripPointEditorView from '../view/trip-point-editor-view';
import { render } from '../render';

export default class PointListPresenter {
  pointList = new TripListView();

  constructor({pointListContainer}) {
    this.pointListContainer = pointListContainer;
  }

  init() {
    render(this.pointList, this.pointListContainer);
    render(new TripPointEditorView, this.pointList.getElement());
    render(new TripPointCreatorView, this.pointList.getElement());
    for (let i = 0; i < 3; i++) {
      render(new TripPointView, this.pointList.getElement());
    }
  }
}
