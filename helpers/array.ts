export const addOrRemoveFromArray = (
  itemToAdd: { id: string },
  array: Array<{ id: string }>
): any[] => {
  const existingIndex = array.findIndex((item) => item.id === itemToAdd.id);
  if (existingIndex >= 0) {
    const updatedArray = [...array];
    updatedArray.splice(existingIndex, 1);
    return updatedArray;
  } else {
    return [...array, itemToAdd];
  }
};
