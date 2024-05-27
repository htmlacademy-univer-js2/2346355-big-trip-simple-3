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

export { humanizePointEditorDueDate, humanizePointDueDate, getDateForDateTimeWithoutTime,
  getDateForDateTimeWithTime, getTimeFromDateTime, sortPointDay, sortPointPrice, isDatesEqual, isFuture, isFutureThen };
