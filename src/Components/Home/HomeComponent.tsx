import React, { useEffect, useState } from 'react'
import IPokemon from '../../Interfaces/IPokemon';
import GetData from '../../DataServices/DataServices';

const HomeComponent = () => {
    //Background
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

    const handleSearchClick = () => {
        if (input) {
            setSearchItem(input)
        }
    };

    const handleRandomClick = () => {
        const randNum = Math.floor(Math.random() * 649);
        if (randNum) {
            setSearchItem(randNum);
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

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <body className={backgroundClasses.grass}>
            <main className="flex flex-wrap mx-10 sm:mx-20 md:mx-32 lg:mx-20 2xl:mx-40 py-16">
                <header className="w-full lg:w-[45%]">
                    <nav>
                        <h1 className="palette-mosaic text-5xl sm:text-7xl pb-10" style={{ color: '#1F2937' }}>Pokedex</h1>
                    </nav>

                    <section className="lg:pe-10 xl:pe-20 xl:border-r-2 border-black w-full">
                        <div className="bg-white bg-opacity-50 flex w-[100%] h-16 sm:h-14 items-center rounded-lg">
                            <input value={input} onChange={(e) => setInput(e.target.value)}
                                className="montserrat text-xl font-medium border-none w-full flex-1 px-4 bg-transparent" type="text"
                                placeholder="Pokémon name/ number"/>
                            <button onClick={handleSearchClick} className="icon-btn px-1 py-1">
                                <img className="h-7" src="./assets/faSearch.png" alt="search icon" />
                            </button>
                            <button onClick={handleRandomClick} className="mx-2 lg:mx-1 xl:mx-2 icon-btn px-1 py-1">
                                <img className="h-7" src="./assets/faRandom.png" alt="random icon" />
                            </button>
                        </div>
                        <div className="flex items-end pt-10 sm:pt-16">
                            <h2 className="pe-5 montserrat font-extrabold text-3xl sm:text-5xl">{pokemon && capitalizeFirstLetter(pokemon.name)}</h2>
                            <button id="favHeartBtn">
                                <img id="heartIcon" className="h-12 ps-5" src="./assets/HeartEmpty.png" alt="heart icon" />
                            </button>
                        </div>

                        <div className="flex justify-center items-center py-5">
                            <img id="pokeImg" src={pokemon && pokemon.sprites.other && pokemon.sprites.other["official-artwork"].front_default} alt="pokemon image" />
                        </div>

                        <div className="flex justify-between items-end">
                            <button id="shinyFormBtn">
                                <img id="shinyIcon" className="h-14" src="./assets/Sparkle.png" alt="shiny icon" />
                            </button>
                            <h4 className="montserrat font-extrabold text-2xl sm:text-4xl">#<span>{pokemon && pokemon.id.toString().padStart(3, '0')}</span></h4>
                        </div>
                    </section>
                </header>

                <aside className="w-full lg:w-[55%] lg:ps-5 xl:ps-16 pt-16 lg:pt-0">
                    <div className="hidden lg:flex justify-end pt-6">
                        <button id="seeFavoritesBtn" type="button" data-drawer-target="drawer-swipe"
                            data-drawer-show="drawer-swipe" data-drawer-placement="bottom" data-drawer-edge="true"
                            data-drawer-edge-offset="bottom-[60px]" aria-controls="drawer-swipe"
                            className="bg-gray-800 h-16 w-72 rounded-lg flex justify-center items-center">
                            <p className="text-white montserrat font-semibold text-2xl pe-3">Open Favorites</p>
                            <img className="h-8" src="./assets/faHeart.png" alt="heart icon" />
                        </button>
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
                                <div id="pokeType" className="h-12 mb-4 overflow-y-auto">{pokemon && pokemon.types.map(element => element.type.name)}</div>
                                <p id="pokeLocation" className="h-12 mb-4 overflow-y-auto"></p>
                                <p id="pokeAbilities" className="h-12 mb-4 overflow-y-auto"></p>
                                <p id="pokeMoves" className="h-32 overflow-y-auto"></p>
                            </div>
                        </div>

                        <div className="pt-10 w-full">
                            <h3 className="font-bold">Evolution:</h3>
                            <div id="evolutionDiv" className="overflow-x-auto flex justify-between items-center text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl"></div>
                        </div>
                    </article>
                </aside>
            </main>
        </body>
    )
}

export default HomeComponent
