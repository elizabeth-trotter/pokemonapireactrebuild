import IPokemon from "../Interfaces/IPokemon";

export const GetData = async (pokemon: string | number) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    const data: IPokemon = await promise.json();
    return data;
};

// export const GetLocation = async (pokeData: IPokemon) => {
//     const promise = await fetch(pokeData.location_area_encounters);
//     const data: IPokemon = await promise.json();
//     return data;
// };