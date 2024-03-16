import IPokemon from "../Interfaces/IPokemon";

export const GetData = async (pokemon: string | number) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
    const data: IPokemon = await promise.json();
    return data;
};
