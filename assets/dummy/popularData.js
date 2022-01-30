export const popularData = [
  {
    id: 1,
    title: 'Pizza Hut',
    image: require('../image/ProviderImage/ProviderImage1.jpg'),
    deliveryTime: '30-45 minutes',
    rating: 4.5,
    numberRating: 200,
    mainCategory: 'Pizza',
    openHour: '5 AM',
    closedHour: '10 PM',
    categories: [
      {
        categoryId: 1,
        categoryTitle: 'Picked for you',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: 4.99,
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
            additionalOptions: [
              {
                additionalOptionsId: 1,
                optionName: 'Toppings',
                isMultiple: true,
                checkbox: false,
                radio: false,
                required: false,
                optionList: [
                  {
                    optionItemId: 1,
                    optionItemName: 'Cheese',
                    price: 0.99,
                    image: require('../image/Topping/cheese.png'),
                  },
                  {
                    optionItemId: 2,
                    optionItemName: 'Garlic',
                    price: 0.99,
                    image: require('../image/Topping/garlic.png'),
                  },
                  {
                    optionItemId: 3,
                    optionItemName: 'Ham',
                    price: 0.99,
                    image: require('../image/Topping/ham.png'),
                  },
                  {
                    optionItemId: 4,
                    optionItemName: 'Tomato',
                    price: 0.99,
                    image: require('../image/Topping/tomato.png'),
                  },
                ],
              },
              {
                additionalOptionsId: 2,
                optionName: 'Size',
                isMultiple: false,
                checkbox: false,
                radio: true,
                required: true,
                optionList: [
                  {
                    optionItemId: 1,
                    optionItemName: 'Small',
                    price: 0,
                  },
                  {
                    optionItemId: 2,
                    optionItemName: 'Medium',
                    price: 5.0,
                  },
                  {
                    optionItemId: 3,
                    optionItemName: 'Large',
                    price: 10,
                  },
                ],
              },
              {
                additionalOptionsId: 3,
                optionName: 'Extra dishes',
                isMultiple: true,
                checkbox: false,
                radio: false,
                required: false,
                optionList: [
                  {
                    optionItemId: 1,
                    optionItemName: 'Salad',
                    price: 0,
                  },
                  {
                    optionItemId: 2,
                    optionItemName: 'Fries',
                    price: 5.0,
                  },
                ],
              },
              {
                additionalOptionsId: 4,
                optionName: 'Spiciness',
                isMultiple: false,
                checkbox: false,
                radio: true,
                required: true,
                optionList: [
                  {
                    optionItemId: 1,
                    optionItemName: 'Spicy',
                    price: 0,
                  },
                  {
                    optionItemId: 2,
                    optionItemName: 'No spicy',
                    price: 0,
                  },
                ],
              },
            ],
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
            additionalOptions: [
              {
                additionalOptionsId: 1,
                optionName: 'Toppings',
                isMultiple: true,
                optionList: [
                  {
                    optionItemId: 1,
                    optionItemName: 'Cheese',
                    price: '$0.99',
                    image: require('../image/Topping/cheese.png'),
                  },
                  {
                    optionItemId: 2,
                    optionItemName: 'Garlic',
                    price: '$0.99',
                    image: require('../image/Topping/garlic.png'),
                  },
                  {
                    optionItemId: 3,
                    optionItemName: 'Ham',
                    price: '$0.99',
                    image: require('../image/Topping/ham.png'),
                  },
                  {
                    optionItemId: 4,
                    optionItemName: 'Tomato',
                    price: '$0.99',
                    image: require('../image/Topping/tomato.png'),
                  },
                ],
              },
              {
                additionalOptionsId: 2,
                optionName: 'Size',
                isMultiple: false,
                optionList: [
                  {
                    optionItemId: 1,
                    optionItemName: 'Small',
                    price: '$0',
                  },
                  {
                    optionItemId: 2,
                    optionItemName: 'Medium',
                    price: '$5.0',
                  },
                  {
                    optionItemId: 3,
                    optionItemName: 'Large',
                    price: '$10',
                  },
                ],
              },
            ],
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 2,
        categoryTitle: 'Appetizers',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 3,
        categoryTitle: 'Pizza',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 4,
        categoryTitle: 'Italia',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 5,
        categoryTitle: 'Spaghetti',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'KFC - Kentucky Fried Chicken',
    image: require('../image/ProviderImage/ProviderImage2.jpg'),
    deliveryTime: '30-45 minutes',
    rating: 4.5,
    numberRating: 200,
    mainCategory: 'Chicken',
    openHour: '5 AM',
    closedHour: '10 PM',
    categories: [
      {
        categoryId: 1,
        categoryTitle: 'Picked for you',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 2,
        categoryTitle: 'Appetizers',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 3,
        categoryTitle: 'Pizza',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 4,
        categoryTitle: 'Italia',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 5,
        categoryTitle: 'Spaghetti',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Thai Express',
    image: require('../image/ProviderImage/ProviderImage3.jpg'),
    deliveryTime: '30-45 minutes',
    rating: 4.5,
    numberRating: 200,
    mainCategory: 'Hotpot',
    openHour: '5 AM',
    closedHour: '10 PM',
    categories: [
      {
        categoryId: 1,
        categoryTitle: 'Picked for you',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 2,
        categoryTitle: 'Appetizers',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 3,
        categoryTitle: 'Pizza',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 4,
        categoryTitle: 'Italia',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 5,
        categoryTitle: 'Spaghetti',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Baskin Robbins',
    image: require('../image/ProviderImage/ProviderImage4.jpg'),
    deliveryTime: '30-45 minutes',
    rating: 4.5,
    numberRating: 200,
    mainCategory: 'Ice cream',
    openHour: '5 AM',
    closedHour: '10 PM',
    categories: [
      {
        categoryId: 1,
        categoryTitle: 'Picked for you',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 2,
        categoryTitle: 'Appetizers',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 3,
        categoryTitle: 'Pizza',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 4,
        categoryTitle: 'Italia',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 5,
        categoryTitle: 'Spaghetti',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Phuc Long',
    image: require('../image/ProviderImage/ProviderImage5.jpg'),
    deliveryTime: '30-45 minutes',
    rating: 4.5,
    numberRating: 200,
    mainCategory: 'Tea & Drink',
    openHour: '5 AM',
    closedHour: '10 PM',
    categories: [
      {
        categoryId: 1,
        categoryTitle: 'Picked for you',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 2,
        categoryTitle: 'Appetizers',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 3,
        categoryTitle: 'Pizza',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 4,
        categoryTitle: 'Italia',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 5,
        categoryTitle: 'Spaghetti',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'Burger King',
    image: require('../image/ProviderImage/ProviderImage6.jpg'),
    deliveryTime: '30-45 minutes',
    rating: 4.5,
    numberRating: 200,
    mainCategory: 'Fastfood',
    openHour: '5 AM',
    closedHour: '10 PM',
    categories: [
      {
        categoryId: 1,
        categoryTitle: 'Picked for you',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 2,
        categoryTitle: 'Appetizers',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 3,
        categoryTitle: 'Pizza',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 4,
        categoryTitle: 'Italia',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
      {
        categoryId: 5,
        categoryTitle: 'Spaghetti',
        items: [
          {
            itemId: 1,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture1.jpg'),
          },
          {
            itemId: 2,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture2.jpg'),
          },
          {
            itemId: 3,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture3.jpg'),
          },
          {
            itemId: 4,
            itemTitle: 'Garlic Knots',
            price: '$4.99',
            note: '*Limit 2 Pizza Pies per Order*',
            image: require('../image/SlideShowImg/Picture4.jpg'),
          },
        ],
      },
    ],
  },
];
