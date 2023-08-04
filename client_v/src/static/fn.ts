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
    const diffInDays = now.diff(viewDate, 'days');
    const diffInWeeks = now.diff(viewDate, 'weeks');
    const isThisYear = now.year() === viewDate.year();

    if (diffInDays == 0) {
      return "Today"
    } else if (diffInDays < 7 && diffInDays > 0) {
      return viewDate.format('dddd');
    } else if (diffInWeeks < 52 && isThisYear) {
      return viewDate.format('MMM DD');
    } else {
      return viewDate.format('YYYY, MMM DD');
    }
  }

