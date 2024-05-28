import Observable from '../framework/observable';
import { UpdateType } from '../const.js';

export default class DestinationsModel extends Observable {
  #tripPointApiService = null;
  #destinations = [];

  constructor (tripPointApiService) {
    super();
    this.#tripPointApiService = tripPointApiService;
  }

  async init() {
    try {
      this.#destinations = await this.#tripPointApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
    this._notify(UpdateType.INIT);
  }

  get destinations() {
    return this.#destinations;
  }
}
