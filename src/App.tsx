import * as React from 'react';
import './App.css';

const Mine = -1;

function createField(size: number): number[] {
  const field: number[] = new Array(size * size).fill(0);

  function inc(x: number, y: number) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === Mine) return;

      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < size; ) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === Mine) continue;

    field[y * size + x] = Mine;

    i += 1;

    inc(x + 1, y);
    inc(x - 1, y);
    inc(x, y + 1);
    inc(x, y - 1);
    inc(x + 1, y - 1);
    inc(x - 1, y - 1);
    inc(x + 1, y + 1);
    inc(x - 1, y + 1);
  }

  return field;
}

enum Mask {
  Transparent,
  Fill,
  Flag,
  Question,
}

const mapMaskToView: Record<Mask, React.ReactNode> = {
  [Mask.Transparent]: null,
  [Mask.Fill]: <div className="icon fill"></div>,
  [Mask.Flag]: <div className="icon flag"></div>,
  [Mask.Question]: <div className="icon question"></div>,
};

export default function App() {
  const size = 16;
  const dimension = new Array(size).fill(null);

  const [death, setDeath] = React.useState(false);
  const [field, setField] = React.useState<number[]>(() => createField(size));
  const [mask, setMask] = React.useState<Mask[]>(() => new Array(size * size).fill(Mask.Fill));

  const win = React.useMemo(
    () =>
      !field.some((f, i) => f === Mine && mask[i] !== Mask.Flag && mask[i] !== Mask.Transparent),
    [field, mask],
  );

  let xLine = `cell ${death ? 'death ' : win ? 'win' : 'default'}`;

  const leftHendler = (x: number, y: number) => {
    if (win || death) return;

    if (mask[y * size + x] === Mask.Transparent) return;

    const clearing: [number, number][] = [];

    function clear(x: number, y: number) {
      if (x >= 0 && x < size && y >= 0 && y < size) {
        if (mask[y * size + x] === Mask.Transparent) return;

        clearing.push([x, y]);
      }
    }

    clear(x, y);

    while (clearing.length) {
      const [x, y] = clearing.pop()!!;
      mask[y * size + x] = Mask.Transparent;

      if (field[y * size + x] !== 0) continue;

      clear(x + 1, y);
      clear(x - 1, y);
      clear(x, y + 1);
      clear(x, y - 1);
    }

    if (field[y * size + x] === Mine) {
      mask.forEach((_, i) => (mask[i] = Mask.Transparent));
      setDeath(true);
    }

    setMask((prev) => [...prev]);
  };

  const rightHendler = (e: React.FormEvent, x: number, y: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (win || death) return;
    if (mask[y * size + x] === Mask.Transparent) return;
    if (mask[y * size + x] === Mask.Fill) {
      mask[y * size + x] = Mask.Flag;
    } else if (mask[y * size + x] === Mask.Flag) {
      mask[y * size + x] = Mask.Question;
    } else if (mask[y * size + x] === Mask.Question) {
      mask[y * size + x] = Mask.Fill;
    }

    setMask((prev) => [...prev]);
  };

  return (
    <div className="app">
      {dimension.map((_, y) => {
        return (
          <div key={y} className="yLine">
            {dimension.map((_, x) => {
              return (
                <div
                  className={xLine}
                  key={x}
                  onClick={() => leftHendler(x, y)}
                  onContextMenu={(e) => {
                    rightHendler(e, x, y);
                  }}>
                  {mask[y * size + x] !== Mask.Transparent ? (
                    mapMaskToView[mask[y * size + x]]
                  ) : field[y * size + x] === Mine ? (
                    <div className="icon mine"></div>
                  ) : field[y * size + x] === 1 ? (
                    <div className="icon one"></div>
                  ) : field[y * size + x] === 2 ? (
                    <div className="icon two"></div>
                  ) : field[y * size + x] === 3 ? (
                    <div className="icon three"></div>
                  ) : (
                    <div className="icon zero"></div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
