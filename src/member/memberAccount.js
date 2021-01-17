// API call get member 
export const getMember = (memberId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/member/${memberId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            return res.json()
        })
        .catch(err => console.log(err))
};

// API call logout
export const logout = next => {
    if (typeof window !== 'undefined') localStorage.removeItem('jwt');
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'GET'
    })
        .then(res => {
            console.log('signout', res);
            return res.json();
        })
        .catch(err => console.log(err));
};

// Check if user is logged in
export const isLoggedin = () => {
    if (typeof window == "undefined") {
        return false
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    } else {
        return false
    }
};