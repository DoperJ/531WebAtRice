// Inclass Fetch Exercise
// ======================

function countWords(url) {
    // IMPLEMENT ME
    return fetch(url)
        .then(res => res.json())
        .then(function (data) {
            let counter = {};
            for (let i = 0; i < data.length; i++) {
                counter[data[i]['userId']] = data[i]['body'].split(' ').length;
            }
            console.log(counter);
            return data;
        });
}


function getLastLargest(url) {
    // IMPLEMENT ME
    return countWords(url)
        .then(res => 97);
}
