import Observable from '../framework/observable';
import { UpdateType } from '../const.js';

export default class OffersModel extends Observable {
  #tripPointApiService = null;
  #offers = [];

  constructor (tripPointApiService) {
    super();
    this.#tripPointApiService = tripPointApiService;
  }

  async init() {
    try {
      this.#offers = await this.#tripPointApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  get offers() {
    return this.#offers;
  }
}
