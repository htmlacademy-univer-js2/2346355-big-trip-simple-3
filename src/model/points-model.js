import {generateTask} from '../mock/point.js';

export default class PointsModel {
  points = Array.from({length: 3}, generateTask);

  getTasks = () => this.points;
}
