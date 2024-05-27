import { getRadomNumber } from '../utils/utils.js';
import { nanoid } from 'nanoid';

export const generatePoint = () => ({
  basePrice: getRadomNumber(100, 2000),
  dateFrom: '2019-07-10T14:55:56.845Z',
  dateTo: '2019-07-10T15:22:13.375Z',
  destination: 1,
  id: nanoid(),
  offers: [1, 2, 3],
  type: 'bus'
});
