export const restaurants = [
  'Мама рома',
  'Китайцы звенигородская',
  'Узбекский плов',
  'Столовая солнечный день',
  'Юми',
  'Kimchi to go',
  'Шаверма',
  'Добрый грузин',
  'Ламбик',
  'Хачапури и вино',
];

export const getRandomRestaurant = () => {
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  return restaurants[randomIndex];
};

export const stringifyRestaurants = () => {
  return restaurants.join(', ');
};

export const removeRestaurant = (restaurant: string): void => {
  if (restaurants.includes(restaurant)) {
    const i = restaurants.indexOf(restaurant);
    restaurants.splice(i, 1);
  }
};

export const addRestaurant = (restaurant: string): void => {
  restaurants.push(restaurant);
};
