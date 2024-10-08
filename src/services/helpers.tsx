import styles from 'src/pages/Main/Main.module.scss';
import { numCols, numRows } from 'src/services/const';
import Arrow from 'src/ui/Arrow/Arrow';
import { membersProps } from 'src/services/types';
import Card from 'src/ui/Card/Card';

// Отрисовка дерева без редактирования
export const renderCardsServer = (
  card: membersProps,
 ) => {

  if (!card.cellId || !card.subordinates) {
    return null;
  }

  const [col, row] = card.cellId.split('-').map(Number);
  return (
    <div
      key={card.id}
      data-cell-id={card.id}
      style={{ gridColumn: col + 1, gridRow: row + 1 }}
    >
      <Card
        id={card.id}
        image={card.image}
        title={card.position}
        full_name={card.full_name}
        department={card.department}
        count={card.subordinates.length}
      />
    </div>
  );
};

// Рендер карточек в дереве
export const renderCards = (
  card: membersProps,
  setPersonalTeam: React.Dispatch<React.SetStateAction<membersProps[]>>,
  originalCards: membersProps[],
  setOriginalCards: React.Dispatch<React.SetStateAction<membersProps[]>>,
) => {

  if (!card.cellId || !card.subordinates) {
    return null;
  }
  const hideMembers = () => {

    setOriginalCards(allCards => [...allCards]);
    if (!card.cellId) {
      return card;
    }
    const [col, row] = card.cellId.split('-').map(Number);

    if (card.cellId === '1-0') {
      setPersonalTeam((prevCards) => {
        return prevCards.map((member) => {
          if (member.cellId !== '1-0') {
            return { ...member, cellId: '' };
          }
          return member;
        });
      });
    } else {
      setPersonalTeam((prevCards) => {
        return prevCards.map((item) => {
          if (!item.cellId) {
            return item;
          }
          const [cCol, cRow] = item.cellId.split('-').map(Number);
          if (cCol === col && cRow > row) {
            return { ...item, cellId: '' };
          }
          return item;
        });
      });
    }
  };

  const restoreMembers = () => {
    setPersonalTeam(originalCards);
  };

   const [col, row] = card.cellId.split('-').map(Number);
  return (
    <div
      key={card.id}
      data-cell-id={card.id}
      style={{ gridColumn: col + 1, gridRow: row + 1 }}
    >
      <Card
        id={card.id}
        image={card.image}
        title={card.position}
        full_name={card.full_name}
        department={card.department}
        count={card.subordinates.length}
        hideMembers={hideMembers}
        restoreMembers={restoreMembers}
      />
    </div>
  );
};

// Рендер пустых ячеек в дереве для раскрашивания
export const renderEmptyCells = (
  busyCells: string[],
  isFilterOpen: boolean
) => {
  const busyCellIds = new Set(busyCells);
  const emptyCells = [];
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cellId = `${col}-${row}`;
      if (!busyCellIds.has(cellId)) {
        emptyCells.push(cellId);
      }
    }
  }

  return emptyCells.map((cellId) => {
    const [col, row] = cellId.split('-').map(Number);
    let backgroundColor = 'transparent';
    const shouldShowHighlight = isFilterOpen === true;

    if (busyCellIds.has('1-0') && shouldShowHighlight) {
      if (row === 1 && col >= 0 && col <= 2) {
        backgroundColor = '#EBF7FF';
      } else if (row > 1 && col >= 0 && col <= 2) {
        const aboveCellId = `${col}-${row - 1}`;
        if (busyCellIds.has(aboveCellId)) {
          backgroundColor = '#EBF7FF';
        }
      }
    } else if (shouldShowHighlight) {
      const belowCellId = `${col}-${row + 1}`;
      if (busyCellIds.has(belowCellId)) {
        backgroundColor = '#EBF7FF';
      }
    }
    return (
      <div
        key={cellId}
        data-cell-id={cellId}
        className={styles.cell}
        style={{
          gridColumn: col + 1,
          gridRow: row + 1,
          backgroundColor: backgroundColor,
        }}
      />
    );
  });
};

// Рендер стрелок между карточками
export const renderArrows = (
  personalTeam: membersProps[],
  setArrows: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) => {
  const newArrows = personalTeam.map((card) => {
    const parentCard = personalTeam.find((item) => item.id === card.parentId);
    if (parentCard) {
      const parentElement = document.querySelector(
        `[data-cell-id="${parentCard.id}"]`
      ) as HTMLElement;
      const childElement = document.querySelector(
        `[data-cell-id="${card.id}"]`
      ) as HTMLElement;

      if (parentElement && childElement) {
        const from = {
          x: parentElement.offsetLeft + parentElement.offsetWidth / 2,
          y: parentElement.offsetTop + parentElement.offsetHeight,
        };
        const to = {
          x: childElement.offsetLeft + childElement.offsetWidth / 2,
          y: childElement.offsetTop,
        };

        return (
          <Arrow
            key={`${parentCard.id}-${card.id}`}
            startX={from.x}
            startY={from.y}
            endX={to.x}
            endY={to.y}
          />
        );
      }
    }
    return null;
  });
  setArrows(newArrows.filter((arrow): arrow is JSX.Element => arrow !== null));
};
