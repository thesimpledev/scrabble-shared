import { CellsType, CurrentTurn } from "../App";
import { Direction } from "./validate";

export function getCurrentTurnsWords(
  cells: CellsType,
  currentTurn: CurrentTurn[]
) {
  if (currentTurn.length === 1) {
    console.log("LENGTH OF 1");
    return [
      buildWordFromTurnInDirection(currentTurn, cells, Direction.Vertical),
      buildWordFromTurnInDirection(currentTurn, cells, Direction.Horizontal),
    ].filter(Boolean);
  } else {
    const direction =
      currentTurn[0].column === currentTurn[1].column
        ? Direction.Vertical
        : Direction.Horizontal;

    if (direction === Direction.Vertical) {
      console.log("Vertical word");
      const words = [
        buildWordFromTurnInDirection(currentTurn, cells, Direction.Vertical),
      ];

      currentTurn.forEach((turn) => {
        words.push(
          buildWordFromTurnInDirection([turn], cells, Direction.Horizontal)
        );
      });

      return words.filter(Boolean);
    } else {
      console.log("Horizontal word");
      const words = [
        buildWordFromTurnInDirection(currentTurn, cells, Direction.Horizontal),
      ];

      currentTurn.forEach((turn) => {
        words.push(
          buildWordFromTurnInDirection([turn], cells, Direction.Vertical)
        );
      });

      return words.filter(Boolean);
    }
  }
}

function buildWordFromTurnInDirection(
  turns: CurrentTurn[],
  cells: CellsType,
  direction: Direction
) {
  const constantProp = direction === Direction.Vertical ? "column" : "row";
  const changingProp = direction === Direction.Vertical ? "row" : "column";

  const constantValue = turns[0][constantProp];
  let word = turns[0].tile.letter;

  [-1, 1].forEach((decrementOrIncrement) => {
    let anyTilesInDirection = true;
    let currentValue = turns[0][changingProp];

    while (anyTilesInDirection) {
      currentValue = currentValue + decrementOrIncrement;

      const aboveTileInCells =
        cells[changingProp === "row" ? currentValue : constantValue][
          changingProp === "column" ? currentValue : constantValue
        ];
      const aboveTileInCurrentTurn = turns.find(
        (turn) =>
          turn[changingProp] === currentValue &&
          turn[constantProp] === constantValue
      );

      const letter = aboveTileInCurrentTurn
        ? aboveTileInCurrentTurn.tile.letter
        : aboveTileInCells;

      if (letter) {
        if (decrementOrIncrement === -1) {
          word = letter + word;
        } else {
          word += letter;
        }
      } else {
        anyTilesInDirection = false;
      }
    }
  });

  return word.length === 1 ? undefined : word;
}