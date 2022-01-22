import axios from 'axios';

export const IP_ADDRESS = '192.168.38.188';

export const getAccessToken = async refreshToken => {
  try {
    let res = await axios.post(
      `http://${IP_ADDRESS}:3007/v1/api/auth/get-access-token`,
      {
        token: refreshToken,
      },
    );
    if (res.data.isAuth) {
      return res.data.accessToken;
    } else {
      alert('Cannot get accessToken');
    }
  } catch (error) {
    console.error(error);
  }
};
