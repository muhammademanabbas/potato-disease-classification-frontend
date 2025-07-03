// Set token to localStorage
const setToken = (Token,username) => {
    localStorage.setItem("token",Token)
    localStorage.setItem("username",username)
    localStorage.setItem("isLoggedIn",true)
};

// Get token from localStorage
const checkToken = () => {
    return localStorage.getItem("token")
};

// Get user from localStorage
const getUser = () => {
    return localStorage.getItem("username")
};

// Clear all keys from localStorage
const clearToken =()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("isLoggedIn")
}
export  { setToken, checkToken , getUser , clearToken };