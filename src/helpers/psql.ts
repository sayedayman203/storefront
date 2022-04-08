export const updateQuery = (
  body: { [key: string]: string | number },
  whiteList?: string[]
): [string[], (string | number)[]] => {
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

export const expand = (rows: number, columns: number, start = 1): string => {
  let index = start;
  return [...Array(rows).keys()]
    .map(
      () =>
        `(${[...Array(columns).keys()].map(() => `$${index++}`).join(', ')})`
    )
    .join(', ');
};
