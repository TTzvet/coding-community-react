
// API call to get single blog
export const memberBlog = (blogId) => {
  return fetch(`${process.env.REACT_APP_API_URL}/blog/${blogId}`, {
      method: "GET",
  })
      .then(res => {
          return res.json()
      })
      .catch(err => console.log(err))
}
