import React, { useEffect, useState } from 'react'
import IPokemon from '../../Interfaces/IPokemon';
import { GetData } from '../../DataServices/DataServices';
import { ILocalArray } from '../../Interfaces/ILocal';
import { Chain, IEvolution } from '../../Interfaces/IEvolution';
import { getLocalStorage, removeFromLocalStorage, saveToLocalStorage } from '../../Utils/localstorage';
import ModalComponent from '../Modal/ModalComponent';

const HomeComponent = () => {
    //Background
    type BackgroundClass = 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';
    const backgroundClasses = {
        normal: 'bg-normal',
        fire: 'bg-fire',
        water: 'bg-water',
        electric: 'bg-electric',
        grass: 'bg-grass',
        ice: 'bg-ice',
        fighting: 'bg-fighting',
        poison: 'bg-poison',
        ground: 'bg-ground',
        flying: 'bg-flying',
        psychic: 'bg-psychic',
        bug: 'bg-bug',
        rock: 'bg-rock',
        ghost: 'bg-ghost',
        dragon: 'bg-dragon',
        dark: 'bg-dark',
        steel: 'bg-steel',
        fairy: 'bg-fairy',
    };

    const [input, setInput] = useState<string | number>('');
    const [searchItem, setSearchItem] = useState<string | number>(1);
    const [pokemon, setPokemon] = useState<IPokemon>();

    const [background, setBackground] = useState<string>('');
    const [image, setImage] = useState('');
    const [isShiny, setIsShiny] = useState(false);
    const [shinyFormBtn, setShinyFormBtn] = useState('');
    const [types, setTypes] = useState('');
    const [location, setLocation] = useState('');
    const [localData, setLocalData] = useState<ILocalArray | null>(null);
    const [abilities, setAbilities] = useState('');
    const [moves, setMoves] = useState('');

    const [evoData, setEvoData] = useState<IEvolution | null>(null);
    const [evolution, setEvolution] = useState('');

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteHeartBtn, setFavoriteHeartBtn] = useState('');
    const [openModal, setOpenModal] = useState(false);
    

    const handleSearchClick = () => {
        if (input) {
            setSearchItem(input)
        }
        setInput('');
    };

    const handleRandomClick = () => {
        const randNum = Math.floor(Math.random() * 649);
        if (randNum) {
            setSearchItem(randNum);
        }
        setInput('');
    };

    const handleShinyClick = () => {
        setIsShiny(!isShiny);
    };

    const handleFavoriteClick = () => {
        const favorites = getLocalStorage();

        if(pokemon){
            if (favorites.includes(pokemon.name)) {
                removeFromLocalStorage(pokemon.name);
                setFavoriteHeartBtn("./assets/HeartEmpty.png");
            } else {
                saveToLocalStorage(pokemon.name);
                setFavoriteHeartBtn("./assets/HeartFilled.png");
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            const pokeData = await GetData(searchItem);
            setPokemon(pokeData);
            console.log(pokeData);
        }
        getData();
    }, [searchItem])

    useEffect(() => {
        const getData = async () => {
            if (pokemon) {
                const localFetch = await fetch(pokemon.location_area_encounters);
                const data = await localFetch.json();
                setLocalData(data);

                const speciesPromise = await fetch(`${pokemon.species.url}`);
                const speciesData = await speciesPromise.json();
            
                const evolutionPromise = await fetch(`${speciesData.evolution_chain.url}`);
                const evolutionData = await evolutionPromise.json();
                setEvoData(evolutionData);
            }
        }
        getData();

        setShinyFormBtn('./assets/Sparkle.png');
        setIsShiny(false);

        if (pokemon && pokemon.sprites.other && pokemon.sprites.other['official-artwork']) {
            setImage(pokemon.sprites.other['official-artwork'].front_default);
        }

        if (pokemon) {
            let pokeTypesArr = pokemon.types;
            let pokeTypes = pokeTypesArr.map(element => element.type.name);
            setTypes(pokeTypes.map(capitalizeFirstLetter).join(", "));

            const backgroundKey = pokeTypes[0] as BackgroundClass;
            if (backgroundKey in backgroundClasses) {
                setBackground(backgroundClasses[backgroundKey]);
            } else {
                // Handle the case where pokeTypes[0] is not a valid key
                // For example, set a default background color
                setBackground(backgroundClasses.normal);
            }

            let pokeAbilitiesArr = pokemon.abilities;
            const pokeAbilities = pokeAbilitiesArr.map(element => capitalizeFirstLetter(element.ability.name));
            setAbilities(pokeAbilities.join(", "));

            const pokeMovesArr = pokemon.moves;
            const pokeMoves = pokeMovesArr.map(element => capitalizeFirstLetter(element.move.name));
            setMoves(pokeMoves.join(", "));

            const favorites = getLocalStorage();
            if (!favorites.includes(pokemon.name)) {
                setFavoriteHeartBtn("./assets/HeartEmpty.png");
            } else {
                setFavoriteHeartBtn("./assets/HeartFilled.png");
            }
        }
        
    }, [pokemon]);

    useEffect(() => {
        if(!isShiny){
            if (pokemon && pokemon.sprites.other && pokemon.sprites.other['official-artwork']) {
                setImage(pokemon.sprites.other['official-artwork'].front_default);
                setShinyFormBtn('./assets/Sparkle.png');
            }
        } else {
            if (pokemon && pokemon.sprites.other && pokemon.sprites.other['official-artwork']) {
                setImage(pokemon.sprites.other['official-artwork'].front_shiny);
                setShinyFormBtn('./assets/SparkleFilled.png');
            }
        }
    }, [isShiny]);

    useEffect(() => {
        if (!localData || Object.keys(localData).length === 0) {
            setLocation("N/a");
        } else if (localData[0]?.location_area) {
            setLocation(capitalizeAndRemoveHyphens(localData[0].location_area.name));
        } else {
            setLocation("N/a");
        }
    }, [localData]);

    useEffect(() => {
        if (evoData?.chain && evoData.chain.evolves_to.length !== 0) {
            const evolutionArr = [evoData.chain.species.name];
            //Recursive Function
            const traverseEvolutions = (chain: Chain) => {
                // Base case
                if (chain.evolves_to.length === 0) return;
                // Recursive case
                chain.evolves_to.forEach((evolution) => {
                    evolutionArr.push(evolution.species.name);
                    traverseEvolutions(evolution); // Continues until base case is reached
                });
            };
            traverseEvolutions(evoData.chain);
            setEvolution(evolutionArr.map(capitalizeFirstLetter).join(' - '))
        } else {
            setEvolution("N/a");
        }
    }, [evoData]);
    

    // Formatting
    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function capitalizeAndRemoveHyphens(str: string) {
        const words = str.split('-');
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(' ');
    }

    return (
        <body className={background}>
            <main className="flex flex-wrap mx-10 sm:mx-20 md:mx-32 lg:mx-20 2xl:mx-40 py-16">
                <header className="w-full lg:w-[45%]">
                    <nav>
                        <h1 className="palette-mosaic text-5xl sm:text-7xl pb-10" style={{ color: '#1F2937' }}>Pokedex</h1>
                    </nav>

                    <section className="lg:pe-10 xl:pe-20 xl:border-r-2 border-black w-full">
                        <div className="bg-white bg-opacity-50 flex w-[100%] h-16 sm:h-14 items-center rounded-lg">
                            <input value={input} onChange={(e) => setInput(e.target.value)}
                                className="montserrat text-xl font-medium border-none w-full flex-1 px-4 bg-transparent" type="text"
                                placeholder="Pokémon name/ number" />
                            <button onClick={handleSearchClick} className="icon-btn px-1 py-1">
                                <img className="h-7" src="./assets/faSearch.png" alt="search icon" />
                            </button>
                            <button onClick={handleRandomClick} className="mx-2 lg:mx-1 xl:mx-2 icon-btn px-1 py-1">
                                <img className="h-7" src="./assets/faRandom.png" alt="random icon" />
                            </button>
                        </div>
                        <div className="flex items-end pt-10 sm:pt-16">
                            <h2 className="pe-5 montserrat font-extrabold text-3xl sm:text-5xl">{pokemon && capitalizeFirstLetter(pokemon.name)}</h2>
                            <button onClick={handleFavoriteClick}>
                                <img id="heartIcon" className="h-12 ps-5" src={favoriteHeartBtn} alt="heart icon" />
                            </button>
                        </div>

                        <div className="flex justify-center items-center py-5">
                            <img src={image} alt="pokemon image" />
                        </div>

                        <div className="flex justify-between items-end">
                            <button onClick={handleShinyClick}>
                                <img className="h-14" src={shinyFormBtn} alt="shiny icon" />
                            </button>
                            <h4 className="montserrat font-extrabold text-2xl sm:text-4xl">#<span>{pokemon && pokemon.id.toString().padStart(3, '0')}</span></h4>
                        </div>
                    </section>
                </header>

                <aside className="w-full lg:w-[55%] lg:ps-5 xl:ps-16 pt-16 lg:pt-0">
                    <div className="flex justify-center lg:justify-end pt-6">
                        <ModalComponent />
                    </div>

                    <article
                        className="montserrat font-semibold text-[22px] sm:text-[25px] md:text-3xl lg:text-2xl xl:text-4xl pb-16 pt-16 lg:pb-0 md:pt-24">
                        <div className="grid grid-cols-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)' }}>
                            <div className="">
                                <h3 className="font-bold h-12 mb-4">Type:</h3>
                                <h3 className="font-bold h-12 mb-4">Location:</h3>
                                <h3 className="font-bold h-12 mb-4">Abilities:</h3>
                                <h3 className="font-bold h-12 mb-4">Moves:</h3>
                            </div>
                            <div className="overflow-hidden">
                                <div className="h-12 mb-4 overflow-y-auto">{types}</div>
                                <p className="h-12 mb-4 overflow-y-auto">{location}</p>
                                <p className="h-12 mb-4 overflow-y-auto">{abilities}</p>
                                <p className="h-32 overflow-y-auto">{moves}</p>
                            </div>
                        </div>

                        <div className="pt-10 w-full">
                            <h3 className="font-bold">Evolution:</h3>
                            <div className="overflow-x-auto pt-10 flex justify-between items-center text-base sm:text-xl md:text-xl lg:text-xl xl:text-4xl">{evolution}</div>
                        </div>
                    </article>
                </aside>
            </main>
        </body>
    )
}

export default HomeComponent
