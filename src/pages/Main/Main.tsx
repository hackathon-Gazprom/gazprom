import styles from 'src/pages/Main/Main.module.scss';
import { useOutletContext } from 'react-router-dom';
import { membersProps } from 'src/services/types';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  renderArrows,
  renderCards,
  renderEmptyCells,
} from 'src/services/helpers';

export default function Main() {
  const { allowDrop, handleDrop, cards } = useOutletContext<{
    allowDrop: (e: React.DragEvent<HTMLImageElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    cards: membersProps[];
  }>();
  const [allCards, setAllCards] = useState<membersProps[]>([]);
  const [arrows, setArrows] = useState<JSX.Element[]>([]);
  const [busyCells, setBusyCells] = useState<string[]>([]);

  const collectCellIds = (card: membersProps, collected: string[]) => {
    if (card.cellId) {
      collected.push(card.cellId);
    }
    if (card.subordinates) {
      card.subordinates.forEach((subordinate) =>
        collectCellIds(subordinate, collected)
      );
    }
  };

  useEffect(() => {
    const collectCards = (card: membersProps, collected: membersProps[]) => {
      collected.push(card);
      if (card.subordinates) {
        card.subordinates.forEach((subordinate) =>
          collectCards(subordinate, collected)
        );
      }
    };
    const newAllCards: membersProps[] = [];
    const newBusyCells: string[] = [];

    cards.forEach((card) => {
      collectCards(card, newAllCards);
      collectCellIds(card, newBusyCells);
    });

    setAllCards(newAllCards);
    setBusyCells(newBusyCells);
  }, [cards]);

  useLayoutEffect(() => {
    if (allCards.length > 0) {
      renderArrows(allCards, setArrows);
    }
  }, [allCards]);

  return (
    <section className={styles.main} onDragOver={allowDrop} onDrop={handleDrop}>
      <div className={styles.cardContainer}>
        {allCards.map(renderCards)}
        {renderEmptyCells(busyCells)}
        {arrows}
      </div>
    </section>
  );
}
