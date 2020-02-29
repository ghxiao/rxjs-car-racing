import { Game } from './interfaces';
import { gameHeight, gameWidth, car, player } from './constants';

const createElem = (column: number) => (elem =>
  (
    elem.style.display = 'inline-block',
    elem.style.marginLeft = '3px',
    elem.style.height = '12px',
    elem.style.width = '6px',
    elem.style.borderRadius = '40%',
    elem.style['background-color'] = column === car
      ? 'green'
      : column === player
        ? 'blue'
        : 'white',
    elem
  ))(document.createElement('div'))

export const render = ([state, road, playerPosition]: Game) => (renderFrame => (
  road.cars.forEach(c => renderFrame[c.x][c.y] = car),
  document.getElementById('game').innerHTML = `Score: ${state.score} Lives: ${state.lives} Level: ${state.level}`,
  renderFrame[gameHeight - 1][playerPosition.y] = player,
  renderFrame.forEach(r => {
    const rowContainer = document.createElement('div');
    r.forEach(c => rowContainer.appendChild(createElem(c)));
    document.getElementById('game').appendChild(rowContainer);
  })
))(Array(gameHeight).fill(0).map(e => Array(gameWidth).fill(0)));

export const renderGameOver = () => document.getElementById('game').innerHTML += '<br/>GAME OVER!!!';