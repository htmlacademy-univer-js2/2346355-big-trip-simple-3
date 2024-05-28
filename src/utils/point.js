import dayjs from 'dayjs';

const humanizePointEditorDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');
const humanizePointDueDate = (dueData) => dayjs(dueData).format('MMMM DD');
const getDateForDateTimeWithoutTime = (dueData) => dayjs(dueData).format('YYYY-MM-DD');
const getDateForDateTimeWithTime = (dueData) => dayjs(dueData).format('YYYY-MM-DDTHH:mm');
const getTimeFromDateTime = (data) => data.slice(-5);

const isFuture = (date) => date && (dayjs().isBefore(date, 'D'));
const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
const isDatesEqual = (dateA, dateB) => (!dateA && !dateB) || dayjs(dateA).isSame(dateB, 'D');
const isFutureThen = (dateA, dateB) => dayjs(dateA).isAfter(dayjs(dateB));

const getDestination = (id, destinations) => {
  for (const destination of destinations) {
    if (destination.id === id) {
      return destination;
    }
  }
  return null;
};

const getOffers = (type, offers) => {
  for (const offer of offers) {
    if (offer.type === type) {
      return offer;
    }
  }
  return null;
};


export { humanizePointEditorDueDate, humanizePointDueDate, getDateForDateTimeWithoutTime,
  getDateForDateTimeWithTime, getTimeFromDateTime, sortPointDay, sortPointPrice, isDatesEqual, isFuture, isFutureThen, getDestination, getOffers };
