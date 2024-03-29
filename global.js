import axios from 'axios';
import moment from 'moment';

// export const IP_ADDRESS = '192.168.55.5';
export const IP_ADDRESS = '128.199.82.111';
// export const IP_ADDRESS = 'localhost';

export const GEOCODING_API = '4c75ce09d9294dc48ebc552677fcedea';
export const GEOAPIFY = '936151db693c4437aefc3ab950f1c033';
export const MAPBOXGS_ACCESS_TOKEN =
  'pk.eyJ1IjoiaG9hbmduYW0yNDMiLCJhIjoiY2t1dHJxdjdlMHg5ZDJwbnlpcmo0a2NnMiJ9.DUrlIOzvO6-kWt-VCKZW1g';
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0121;

export const getAccessToken = async refreshToken => {
  try {
    let res = await axios.post(`https://${IP_ADDRESS}/v1/api/auth/get-access-token`, {
      token: refreshToken,
    });
    if (res.data.isAuth) {
      return res.data.accessToken;
    } else {
      alert('Cannot get accessToken');
    }
  } catch (error) {
    console.error(error);
  }
};

export const convertDollar = vnd => {
  return parseFloat((vnd / 22862.0).toFixed(2));
};
export const convertVND = dollar => {
  return parseInt((dollar * 22862.0).toFixed(0));
};

export const shuffle = array => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const currentDateString = () => {
  return (
    new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDay() + 1)
  );
};

export const cleanOperationTime = data => {
  const array = [];
  const temp = [];

  for (const day of Object.keys(data)) {
    const index = temp.indexOf(data[day].open_time + ' - ' + data[day].close_time);
    if (index === -1) {
      temp.push(data[day].open_time + ' - ' + data[day].close_time);
      array.push({
        date: day[0].toUpperCase() + day.slice(1), // uppercase the first letter
        time: data[day].open_time + ' - ' + data[day].close_time,
      });
    } else {
      array[index].date += ', ' + day[0].toUpperCase() + day.slice(1);
    }
  }

  return array;
};

export const formatDate = date => {
  const d = new Date(date);
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-'); // 2022-05-04
};

export const OpenStatus = operation_time => {
  /*
    OFF: the restaurant is off today -> do not show 
    CLOSED: the restaurant is closed at the moment -> show but low opacity
    OPEN: the restaurant is available -> show as normal
  */
  const currentDay = moment().format('dddd').toLowerCase();
  const currentTime = new Date().toLocaleTimeString();

  if (operation_time[currentDay].is_day_off) {
    return 'OFF';
  } else if (operation_time[currentDay].close_time <= currentTime) {
    return 'CLOSED';
  }

  return 'OPEN';
};

export const countTotalPrice = (items, delivery_fee, discount, maxDiscountValue) => {
  const totalPrice = items.reduce((acc, curr) => {
    return acc + curr.totalProductPrice;
  }, 0.0);

  // const totalPrice = 100;

  // in some case the discount value is 50 or 0.5
  const discountedValue = discount > 1 ? totalPrice * (discount / 100) : totalPrice * discount;
  if (discountedValue <= maxDiscountValue) {
    return {
      finalPrice: parseFloat((totalPrice - discountedValue + delivery_fee).toFixed(2)),
      discountedValue: parseFloat(discountedValue.toFixed(2)),
    };
  } else if (discountedValue > maxDiscountValue && maxDiscountValue === 0.0) {
    return {
      finalPrice: parseFloat((totalPrice - discountedValue + delivery_fee).toFixed(2)),
      discountedValue: parseFloat(discountedValue.toFixed(2)),
    };
  }
  return {
    finalPrice: parseFloat((totalPrice - maxDiscountValue + delivery_fee).toFixed(2)),
    discountedValue: maxDiscountValue,
  };

  // return ((totalPrice + delivery_fee) * (1 - discount)).toFixed(2);
};

export const discount = (price, percentage) => {
  return price - price * percentage;
};
