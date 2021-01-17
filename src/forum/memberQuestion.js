
// API call get single question
export const memberQuestion = (questionId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/question/${questionId}`, {
      method: "GET",
  })
      .then(res => {
          return res.json()
      })
      .catch(err => console.log(err))
}
