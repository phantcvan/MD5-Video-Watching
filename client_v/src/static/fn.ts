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

