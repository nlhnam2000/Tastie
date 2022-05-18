import axios from 'axios';

export const IP_ADDRESS = '192.168.55.6';
export const GEOCODING_API = '4c75ce09d9294dc48ebc552677fcedea';
export const MAPBOXGS_ACCESS_TOKEN =
  'pk.eyJ1IjoiaG9hbmduYW0yNDMiLCJhIjoiY2t1dHJxdjdlMHg5ZDJwbnlpcmo0a2NnMiJ9.DUrlIOzvO6-kWt-VCKZW1g';

export const getAccessToken = async refreshToken => {
  try {
    let res = await axios.post(`http://${IP_ADDRESS}:3007/v1/api/auth/get-access-token`, {
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
  return (vnd / 22862.0).toFixed(2);
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
  /* 
    array = [
      {
        date: 'Monday, Tuesday', 
        time: 08:00:00 - 23:00:00
      }, 
      {
        date: 'Friday, Sunday', 
        time: 10:00:00 - 23:00:00
      }
    ]
  */
  for (const day of Object.keys(data)) {
    const index = array.lastIndexOf(data[day].open_time + ' - ' + data[day].close_time);
    if (index === -1) {
      array.push({
        date: day,
        time: data[day].open_time + ' - ' + data[day].close_time,
      });
    } else {
      array[index].date += ', ' + day;
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
