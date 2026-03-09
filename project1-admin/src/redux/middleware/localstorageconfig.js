// Function to save user details to local storage
export const saveUserDetails = (key,userData) => {
    localStorage.setItem(key, JSON.stringify(userData));
  };
  
  // Function to retrieve user details from local storage
export  const retrieveUserDetails = (key) => {
    const userData = localStorage.getItem(key);
    return userData ? JSON.parse(userData) : {};
  };
  
  export const removeFromLocalStorage=(key) =>{
    localStorage.removeItem(key);
}