
function getLast15Days(startDate, endDate) {
    let currentDate = null;
    let loopLength = 15
    if (endDate) {
        currentDate = new Date(endDate);
    } else {
        currentDate = new Date();
    }

    if (startDate && endDate) {
        const timeDifference = new Date(endDate) - new Date(startDate);

        // Calculate the difference in days
        loopLength = timeDifference / (1000 * 60 * 60 * 24)+1;
    }
    const last15Days = [];

    for (let i = 0; i < loopLength; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);

        const dateObject = {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // Months are 0-based in JavaScript
            day: date.getDate(),
        };

        last15Days.push(dateObject);
    }

    return last15Days;
}


module.exports = getLast15Days;