const basePath = "/satisfactory-recipes";

const getItemSearch = async (input) => {
  const url = `${basePath}/item/search?input=${input}`;
  const response = await fetch(url);

  if (response.status == 400) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
};

const getItem = async (itemName) => {
  const response = await fetch(`${basePath}/item?itemName=${itemName}`);
  return response.json();
};

const getHardDriveRecipes = async () => {
  const response = await fetch(`${basePath}/hard-drive-recipes.json`);
  return response.json();
};

const getItems = async () => {
  const response = await fetch(`${basePath}/items.json`);
  return response.json();
};

export { getItemSearch, getItem, getHardDriveRecipes, getItems };
