export interface Car {
  x: number;
  y: number;
  scored: boolean;
};

export interface Road {
  cars: Car[];
}

export interface State {
  score: number;
  lives: number;
  level: number;
  duration: number;
  interval: number;
}

export interface Player {
  y: number;
}

export type Game = [State, Road, Player];