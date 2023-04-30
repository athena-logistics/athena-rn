export function addOrRemoveFromArray<Entry extends { id: string }>(
  itemToAdd: Entry,
  array: Entry[]
): Entry[] {
  const existingIndex = array.findIndex((item) => item.id === itemToAdd.id);
  if (existingIndex >= 0) {
    const updatedArray = [...array];
    updatedArray.splice(existingIndex, 1);
    return updatedArray;
  } else {
    return [...array, itemToAdd];
  }
}
