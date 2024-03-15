const saveToLocalStorage = (pokemon: string) => {
    // favorites will get the current values in local storage
    // aka saves the array in favorites
    let favorites = getLocalStorage();

    // if the name is already included in the local storages, we will not push into favorites (no repeats)
    if(!favorites.includes(pokemon)){
        favorites.push(pokemon);
    }

    // JSON.stringify insures whatever we save into local storage is a string
    localStorage.setItem("Favorites", JSON.stringify(favorites));
};

const getLocalStorage = () => {
    // getting our values from local storage
    let localStorageData = localStorage.getItem("Favorites");

    // we check if that data is null, is so we return an empty array
    if(localStorageData == null){
        return [];
    }

    // we return an array of local storage
    return JSON.parse(localStorageData);
};

const removeFromLocalStorage = (pokemon: string) => {
    // we're saving local storage data into favorites variable
    let favorites = getLocalStorage();

    // finding the index of our parameter (pokemon)
    let namedIndex = favorites.indexOf(pokemon);

    // remove the name from the array using the .splice method
    favorites.splice(namedIndex, 1);

    // we set our new mutated favorites array inside our local storage
    localStorage.setItem("Favorites", JSON.stringify(favorites));
};

export { saveToLocalStorage, getLocalStorage, removeFromLocalStorage };