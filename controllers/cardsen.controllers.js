import { truncateSync } from 'fs';
import Card from '../models/carden.model.js'
import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'
import mongoose from 'mongoose';
import Box from '../models/box.model.js';


//METODO GET 
export const getCardsen = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const query = {
      $or: [
        { nombre: { $regex: search, $options: 'i' } },
        { name_english: { $regex: search, $options: 'i' } }
      ]
    };

    const cards = await Card.paginate(query, options);
    res.send(cards);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO POST
export const createCardsen = async (req, res) => {
  try {
    const { nombre, name_english, tipo_de_carta, atributo, tipo, tipo_magica_trampa, nivel_rango_link, escala, rareza, limitacion, atk, def, materiales, descripcion, descripcion_es, efecto_pendulo, adicional } = req.body;

    const secure_url = `https://res.cloudinary.com/dqofcbeaq/image/upload/v1688597356/dlprocards/${encodeURIComponent(nombre)}.jpg`;

    const card = new Card({
      nombre,
      name_english,
      tipo_de_carta,
      atributo,
      tipo,
      tipo_magica_trampa,
      nivel_rango_link,
      escala,
      rareza,
      limitacion,
      atk,
      def,
      materiales,
      descripcion,
      descripcion_es,
      efecto_pendulo,
      adicional,
      image: {
        secure_url
      }
    });

    await card.save();
    res.json(card);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//METODO DELETE
export const deleteCardsen = async (req, res) => {


  try {

    const cards = await
      Card.findByIdAndDelete(req.params.id)

    if (!cards) return res.status(404).json({
      message: 'La carta no existe'
    })

    if (cards.image?.public_id) {
      await deleteImage(product.image.public_id)
    }

    return res.json(cards)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}


  //METODO GET UNA CARTA
  export const getCarden = async (req, res) => {
    try {
      const { id } = req.params;

      let card;
      if (mongoose.Types.ObjectId.isValid(id)) {
        card = await Card.findById(id);
      } else {
        card = await Card.findOne({ 
          $or: [
            { nombre: id },
            { name_english: id }
          ] 
        });
      }

      if (!card) return res.status(404).json({ message: 'La carta no existe' });

      return res.json(card);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };




//METODO UPDATE
export const updateCardsen = async (req, res) => {

  try {

    const { id } = req.params;
    const cardsUpdate = await
      Card.findByIdAndUpdate(id, req.body, {
        new: true
      })

    return res.json(cardsUpdate)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}

//CALCULADORA DE PRECIOS

export const calculateCardCost = async (req, res) => {
  try {
    // req.params.id ya es un array, gracias al middleware
    const cardIds = req.params.id;
    let allCosts = [];

    for (const cardId of cardIds) {
      const card = await Card.findById(cardId);
      if (!card) continue;  // Skip this card if not found
      
      const boxes = await Box.find({
        $or: [
          {'cartas_ur._id': cardId},
          {'cartas_sr._id': cardId},
          {'cartas_r._id': cardId},
          {'cartas_n._id': cardId}
        ]
      });
      
      if (!boxes.length) continue;  // Skip this card if no boxes found
      
      const costs = await Promise.all(boxes.map(async box => {
        const rarity = getCardRarityInBox(cardId, box);
        const deck = { ur: 0, sr: 0, r: 0, n: 0 };
        deck[rarity.toLowerCase()] = 1;
        
        return {
          cardId,
          boxId: box._id,
          boxName: box.nombre,
          estimatedCost: monte_carlo_simulation(deck, box.tipo_de_box)
        };
      }));

// Find the box with the lowest estimated cost for this card
costs.sort((a, b) => a.estimatedCost - b.estimatedCost);
allCosts.push(costs[0]);
}

// Calculate the total estimated cost
const totalEstimatedCost = allCosts.reduce((acc, curr) => acc + curr.estimatedCost, 0);

// Send the individual and total estimated costs in the response
return res.json({
  cards: allCosts,
  totalEstimatedCost
});

} catch (error) {
  return res.status(500).json({ message: error.message });
}
}
// Esta función determinaría la rareza de la carta en la caja dada
function getCardRarityInBox(cardId, box) {
  // Implementación aquí (devuelve 'UR', 'SR', 'R', 'N')
  return 'UR'; // Ejemplo
}

// Función de simulación de Monte Carlo adaptada
export const monte_carlo_simulation = (targetDeck, boxType) => {
  const trials = 10000;
  let totalCost = 0;

  let urCount, srCount, rCount, nCount;
  if (boxType === "main box") {
    urCount = 9;
    srCount = 22;
    rCount = 168;
    nCount = 341;
  } else if (boxType === "mini box") {
    urCount = 3;
    srCount = 10;
    rCount = 105;
    nCount = 182;
  } else {
    urCount = 9;
    srCount = 22;
    rCount = 168;
    nCount = 341;
  }

  for (let i = 0; i < trials; i++) {
    let cost = 0;
    let deckCopy = { ...targetDeck }; // Usamos el "deck objetivo" aquí

    let urBox = urCount;
    let srBox = srCount;
    let rBox = rCount;
    let nBox = nCount;

    while (deckCopy.ur > 0 || deckCopy.sr > 0 || deckCopy.r > 0 || deckCopy.n > 0) {
      cost += 50;

      const totalCards = urBox + srBox + rBox + nBox;
      const probUR = urBox / totalCards;
      const probSR = srBox / totalCards;
      const probR = rBox / totalCards;

      const rand = Math.random();
      if (rand < probUR && urBox > 0) {
        deckCopy.ur--;
        urBox--;
      } else if (rand < probUR + probSR && srBox > 0) {
        deckCopy.sr--;
        srBox--;
      } else if (rand < probUR + probSR + probR && rBox > 0) {
        deckCopy.r--;
        rBox--;
      } else if (nBox > 0) {
        deckCopy.n--;
        nBox--;
      }
    }

    totalCost += cost;
  }

  const averageCost = totalCost / trials;
  const roundedAverageCost = Math.round(averageCost / 50) * 50;
  return roundedAverageCost;
};

