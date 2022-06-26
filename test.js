const b = [
  {
    name: 'A',
    products: [{label: 'A'}],
  },
  {
    name: 'B',
    products: [{label: 'B'}, {label: 'C'}],
  },
];
// const reducer = (r,s) => r.products.length + s.products.length;
// const number = b.reduce(reducer, 1);
// const c = [...a].map(item => item.menu_category_name);
// console.log(c);

const items = [
  {
    product_id: 1002441,
    product_name: 'Canada Dry (500 ml)',
    price: 2.490000009536743,
    image: null,
    quantity: 1,
    special_instruction: '',
    product_options: [
      {
        label: '',
        value: '',
      },
    ],
  },
  {
    product_id: 1002441,
    product_name: 'Canada Dry (500 ml)',
    price: 2.490000009536743,
    image: null,
    quantity: 3,
    special_instruction: '',
    product_options: [
      {
        label: '',
        value: '',
      },
    ],
  },
];
const countTotalPrice = (items, delivery_fee, discount, maxDiscountValue) => {
  // const totalPrice = items.reduce((acc, curr) => {
  //   return acc + curr.price * curr.quantity;
  // }, 0.0);

  const totalPrice = 100;
  const discountedValue = totalPrice * (discount / 100);
  if (discountedValue <= maxDiscountValue) {
    return {
      finalPrice: parseFloat((totalPrice - discountedValue + delivery_fee).toFixed(2)),
      discountedValue,
    };
  } else if (discountedValue > maxDiscountValue && maxDiscountValue === 0.0) {
    return {
      finalPrice: parseFloat((totalPrice - discountedValue + delivery_fee).toFixed(2)),
      discountedValue,
    };
  }
  return {
    finalPrice: parseFloat((totalPrice - maxDiscountValue + delivery_fee).toFixed(2)),
    discountedValue: maxDiscountValue,
  };

  // return ((totalPrice + delivery_fee) * (1 - discount)).toFixed(2);
};

console.log(countTotalPrice(items, 0.0, 50, 0));
