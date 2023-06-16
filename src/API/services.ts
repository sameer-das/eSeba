import axios from 'axios';

const BASE_URL = `https://api.esebakendra.com`;

const GET_ALL_BILLERS = '/api/GSKRecharge/eBBPSBillerInfoByCategory';
export const getAllBillers = (category: string) => {
    return axios.post(`https://api.esebakendra.com/api/GSKRecharge/eBBPSBillerInfoByCategory?category=${category}`)
}
export const validateUser = (usercred: any) => {
    return axios.post(`${BASE_URL}/api/User/ValidateUser`, {
        userId: usercred.userid,
        password: usercred.password,
    })
}
export const getUserInfo = (user_id: number) => {
    return axios.get(`${BASE_URL}/api/User/GetUserInfos?uId=${user_id}`)
}

export const getBillerInfo = (billerId: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eBBPSBillerInfoByBillerID?billerid=${billerId}`,{})
}

export const getWalletBalance = (email: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/GetWalletBalance?emailid=${email}`, {});
}


