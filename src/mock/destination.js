const generateDestinations = () => [
  {
    id: 1,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: 'img/photos/1.jpg',
        description: 'Chamonix parliament building'
      }
    ]
  }
];

let destinations = null;

const getDestination = (id) => {
  if (!id) {
    return null;
  }
  if (!destinations) {
    destinations = generateDestinations();
  }
  for (const destination of destinations) {
    if (destination.id === id) {
      return destination;
    }
  }
};

export {getDestination};
