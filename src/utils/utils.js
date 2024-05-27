const getRadomNumber = (start, end) =>
  Math.round(Math.random() * (end - start) + start);

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.is === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRadomNumber, updateItem };
