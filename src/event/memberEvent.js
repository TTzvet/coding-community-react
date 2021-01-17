
// API call to get single event
export const memberEvent = (eventId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/event/${eventId}`, {
      method: "GET",
  })
      .then(res => {
          return res.json()
      })
      .catch(err => console.log(err))
}
