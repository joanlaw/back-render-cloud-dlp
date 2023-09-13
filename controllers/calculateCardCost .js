import Card from '../models/card.model.js';
import Box from '../models/box.model.js';

export const calculateCardCost = async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) return res.status(404).json({ message: 'Carta no encontrada' });

    // Buscar todas las cajas que contienen esta carta
    const boxes = await Box.find({
      $or: [
        {'cartas_ur.cardId': cardId},
        {'cartas_sr.cardId': cardId},
        {'cartas_r.cardId': cardId},
        {'cartas_n.cardId': cardId}
      ]
    });

    if (!boxes.length) return res.status(404).json({ message: 'Cajas no encontradas' });

    // Aquí se colocaría el algoritmo de Monte Carlo para calcular el costo para cada caja
    const costs = await Promise.all(boxes.map(async box => {
      const rarity = getCardRarityInBox(cardId, box); // Supongamos que esta función devuelve la rareza de la carta en la caja
      const deck = { ur: 0, sr: 0, r: 0, n: 0 };
      deck[rarity.toLowerCase()] = 1; // Supongamos que queremos 1 copia de la carta
      const cost = monte_carlo_simulation(deck, box.tipo_de_box);
      return {
        boxId: box._id,
        boxName: box.nombre,
        estimatedCost: cost
      };
    }));

    return res.json(costs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Esta función determinaría la rareza de la carta en la caja dada
function getCardRarityInBox(cardId, box) {
  // Implementación aquí (devuelve 'UR', 'SR', 'R', 'N')
  return 'UR'; // Ejemplo
}

// Función de simulación de Monte Carlo adaptada
export const monte_carlo_simulation = (deck, boxType) => {
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
    let deckCopy = { ...deck };

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
