
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page

//count the number of pages for pagination
function countPages(totalDocuments) {
    return Math.ceil(totalDocuments / limit)
};

module.exports = countPages;