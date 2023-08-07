import moment from "moment"

export const handleNumber = (number: number) => {
  if (number > Math.pow(10, 9)) {
    return `${Math.round(number * 10 / Math.pow(10, 9)) / 10}B`
  } else if (number > Math.pow(10, 6)) {
    return `${Math.round(number * 10 / Math.pow(10, 6)) / 10}M`
  } else if (number > Math.pow(10, 3)) {
    return `${Math.round(number * 10 / Math.pow(10, 3)) / 10}K`
  } else {
    return number
  }
}

export const formatDate = (date: string) => {
  const viewDate = moment(date);
  const now = moment();
  const isToday = now.isSame(viewDate, 'day');
  const diffInDays = now.diff(viewDate, 'days');
  const diffInWeeks = now.diff(viewDate, 'weeks');
  const isThisYear = now.year() === viewDate.year();

  if (isToday) {
    return "Today";
  } else if (diffInDays <= 6 && diffInDays >= 0) {
    return viewDate.format('dddd');
  } else if (diffInDays > 6 && isThisYear) {
    return viewDate.format('MMM DD');
  } else {
    return viewDate.format('YYYY, MMM DD');
  }
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

