import dayjs from 'dayjs';

const humanizePointEditorDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');
const humanizePointDueDate = (dueData) => dayjs(dueData).format('MMMM DD');
const getDateForDateTimeWithoutTime = (dueData) => dayjs(dueData).format('YYYY-MM-DD');
const getDateForDateTimeWithTime = (dueData) => dayjs(dueData).format('YYYY-MM-DDTHH:mm');
const getTimeFromDateTime = (data) => data.slice(-5);

const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export { humanizePointEditorDueDate, humanizePointDueDate, getDateForDateTimeWithoutTime,
  getDateForDateTimeWithTime, getTimeFromDateTime, sortPointDay, sortPointPrice };
