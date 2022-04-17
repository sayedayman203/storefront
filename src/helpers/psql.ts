export const updateQuery = (
  body: { [key: string]: string | number | Date },
  whiteList?: string[]
): [string[], (string | number | Date)[]] => {
  const updates = [];
  const data = [];

  let i = 1;
  for (const key in body) {
    if (whiteList && !whiteList.includes(key)) {
      continue;
    }

    updates.push(` ${key} = ($${i++})`);
    data.push(body[key]);
  }

  return [updates, data];
};

export const expand = (
  rows: number,
  columns: number,
  cb?: (...args: number[]) => string,
  start = 1
): string => {
  let index = start;
  return [...Array(rows).keys()]
    .map(() =>
      cb
        ? cb(...[...Array(columns).keys()].map(() => index++))
        : `(${[...Array(columns).keys()].map(() => `$${index++}`).join(', ')})`
    )
    .join(', ');
};
