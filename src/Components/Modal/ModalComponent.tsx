'use client';

import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import { getLocalStorage } from '../../Utils/localstorage';

function ModalComponent() {
  const [openModal, setOpenModal] = useState(false);
  const favorites = getLocalStorage();

  // Formatting
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <>
      <Button onClick={() => setOpenModal(true)} className="bg-gray-800 h-16 w-72 rounded-lg flex justify-center items-center">
        <p className="text-white montserrat font-semibold text-2xl pe-3">See Favorites</p>
        <img className="h-8" src="./assets/faHeart.png" alt="heart icon" />
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Favorite Pokémon</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {favorites.map((fav: string) => {
              return <p>{capitalizeFirstLetter(fav)}</p>;
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComponent