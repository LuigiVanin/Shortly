const viewSum = (listObj) => {
    let sum = 0;
    for (const i of listObj) {
        sum += i.views;
    }
    return sum;
};

const refactResult = (listObj) => {
    return {
        id: listObj[0].id,
        name: listObj[0].name,
        visitCount: viewSum(listObj),
        shortenedUrls: listObj.map(({ url, shortUrl, views, urlId }) => ({
            id: urlId,
            shortUrl,
            url,
            visitCount: views,
        })),
    };
};

export { refactResult };
