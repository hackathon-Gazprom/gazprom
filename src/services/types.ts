export interface initialCardsProps {
  id: string;
  name: string;
  position: string;
  title: string;
  photo: string;
  cellId: string;
  subordinates: initialCardsProps[];
  // coordinates?: { top: number; left: number };
}

export interface RegisterDataProps {
  email: string;
  password: string;
}