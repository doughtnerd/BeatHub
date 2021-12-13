

function makeQuery(endpoint, nextPage) {
    return fetch(`${endpoint}${nextPage}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        return data.docs;
      });
  }

export function fetchMapsByRating(page) {
    return fetch(`https://beatsaver.com/api/search/text/${page}?sortOrder=Rating`).then(res => {
        return res.json();
      })
      .then(data => {
        return data.docs;
      });;
}

export function fetchMapsByLatest(page) {
    return fetch(`https://beatsaver.com/api/search/text/${page}?sortOrder=Latest`).then(res => {
        return res.json();
      })
      .then(data => {
        return data.docs;
      });;
}