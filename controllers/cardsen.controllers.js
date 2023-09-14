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
    const cardIds = req.params.id;
    let allCosts = [];

    for (const cardId of cardIds) {
      const card = await Card.findById(cardId);
      if (!card) continue;

      const boxes = await Box.find({
        $or: [
          {'cartas_ur._id': cardId},
          {'cartas_sr._id': cardId},
          {'cartas_r._id': cardId},
          {'cartas_n._id': cardId}
        ]
      });

      if (!boxes.length) continue;

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

      costs.sort((a, b) => a.estimatedCost - b.estimatedCost);
      allCosts.push(costs[0]);
    }

    // Agrupar cartas por caja
    const cardsByBox = {};
    for (const cost of allCosts) {
      if (!cardsByBox[cost.boxId]) {
        cardsByBox[cost.boxId] = [];
      }
      cardsByBox[cost.boxId].push(cost);
    }

    // Ajustar los costos estimados
    for (const boxId in cardsByBox) {
      const cardsInBox = cardsByBox[boxId];
      const urCards = cardsInBox.filter(card => getCardRarityInBox(card.cardId) === 'UR');
      if (urCards.length > 0) {
        for (const card of cardsInBox) {
          const rarity = getCardRarityInBox(card.cardId);
          const boxType = card.boxType;  // Asume que tienes acceso al tipo de caja aquí
          if (rarity === 'SR') {
            card.estimatedCost = card.estimatedCost / (boxType === 'main box' ? 2 : 4);
          } else if (rarity === 'R' || rarity === 'N') {
            card.estimatedCost = 0;
          }
        }
      }
    }

    // Calcular el costo total estimado modificado
    const modifiedTotalEstimatedCost = Object.values(cardsByBox)
      .flat()
      .reduce((acc, curr) => acc + curr.estimatedCost, 0);

    return res.json({
      cards: allCosts,
      totalEstimatedCost: modifiedTotalEstimatedCost
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


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

  // Modificar el deck objetivo según la lógica que consideres
  if (targetDeck.ur >= 3) {
    targetDeck.r = Math.max(0, targetDeck.r - 1); // Reducir la cantidad de R y N
    targetDeck.n = Math.max(0, targetDeck.n - 1);
    targetDeck.sr = Math.ceil(targetDeck.sr / 2); // Reducir la cantidad de SR a la mitad
  }

  for (let i = 0; i < trials; i++) {
    let cost = 0;
    let deckCopy = { ...targetDeck };

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
