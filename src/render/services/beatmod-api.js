

export function getMods(searchText = "", gameVersion = "1.19.0", sortOption = "category_lower") {
  const uri = `https://beatmods.com/api/v1/mod?search=${searchText}&status=approved&gameVersion=${gameVersion}&sort=${sortOption}&sortDirection=1`
  return fetch(uri)
    .then(res => {
      return res.json();
    })
}