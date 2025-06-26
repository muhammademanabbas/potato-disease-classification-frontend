const setToken = (Token,username) => {
    localStorage.setItem("token",Token)
    localStorage.setItem("username",username)
    localStorage.setItem("isLoggedIn",true)
};
const checkToken = () => {
    return localStorage.getItem("token")
};
const getUser = () => {
    return localStorage.getItem("username")
};

const clearToken =()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("isLoggedIn")
}

export  { setToken, checkToken , getUser , clearToken };