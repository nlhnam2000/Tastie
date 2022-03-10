import axios from 'axios';

export const IP_ADDRESS = '192.168.100.3';
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
