console.clear();
import {interval, fromEvent, combineLatest, of, BehaviorSubject, noop, Observable} from 'rxjs';
import { scan, tap, pluck, startWith, takeWhile, finalize, switchMap } from 'rxjs/operators';
import {Car, Road, Player, Game, State} from './interfaces';
import { gameHeight, gameWidth, levelDuration } from './constants';
import { updateState } from './state';
import { render, renderGameOver } from './html-renderer';

const car = (x: number, y: number): Car => ({ x, y, scored: false });

const randomCar = (): Car => car(0, Math.floor(Math.random() * Math.floor(gameWidth)));

const gameSpeed$: BehaviorSubject<number> = new BehaviorSubject(200);

const road$: Observable<Road> = gameSpeed$.pipe(
  switchMap(i =>
    interval(i)
      .pipe(
        scan((road: Road, _: number): Road => {
          road.cars = road.cars.filter(c => c.x < gameHeight - 1);
          road.cars[0].x === (gameHeight / 2) ? road.cars.push(randomCar()) : noop;
          road.cars.forEach(c => c.x++);
          return road
        }, { cars: [randomCar()] })
      )
  ));

const keys$: Observable<string> = fromEvent(document, 'keyup')
  .pipe(
    startWith({ code: '' }),
    pluck('code')
  );

const player$: Observable<Player> = keys$
  .pipe(
    scan((player: Player, key: string): Player => {
        player.y +=
            key === 'ArrowLeft' && player.y > 0
                ? -1
            : key === 'ArrowRight' && player.y < gameWidth - 1
                ? 1
            : 0;
        return player}
    , { y: 0 })
  );

const state$: Observable<State> = of({
  score: 1,
  lives: 3,
  level: 1,
  duration: levelDuration,
  interval: 200
});

const isNotGameOver = ([state]: Game) => state.lives > 0;

const game$ = combineLatest(state$, road$, player$)
  .pipe(
    scan(updateState(gameSpeed$)),
    tap(render),
    takeWhile(isNotGameOver),
    finalize(renderGameOver)
  );

game$.subscribe();
