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
    return axios.post(`${BASE_URL}/api/GSKRecharge/eBBPSBillerInfoByBillerID?billerid=${billerId}`, {})
}

export const getWalletBalance = (email: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/GetWalletBalance?emailid=${email}`, {});
}

export const bbpsFetchBill = (payload: any) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eBBPSBillFetch`, payload);
}

export const bbpsPayBill = (requestId: string, payBill: any, serviceCatId: string, serviceId: string, user_EmailID: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eBBPSBillPay?requestid=${requestId}&serviceId=${serviceId}&categoryId=${serviceCatId}&userId=${user_EmailID}`, payBill)
}


export const getMobileNumberDetails = (mobileNo: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eBBPSMNP`, { agentId: '', mobileNo: mobileNo, });
}

export const getPlanForMobileNo = (billerId: string, circle: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eBBPSRechargePlanInfo`, { billerId: billerId, circle: circle, });
}


export const validateTPin = (userid: number, pin: string) => {
    return axios.post(`${BASE_URL}/api/User/ValidateUserTPin`, { "userId": userid, "tpin": pin })
}


export const prepaidRecharge = (recharge: any) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eGSKMobileRecharge`, recharge);
}


export const getTransactionHistory = (emailid: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/GetTransactions?emailid=${emailid}`, {});
}




// User Registration

export const checkRefId = (refId: string) => {
    return axios.get(`${BASE_URL}/api/User/CheckReferenceNumber?rId=${refId}`);
}

export const getStates = (countryId: number) => {
    return axios.get(`${BASE_URL}/api/Master/GetStateMaster?countryId=${countryId}`);
}

export const getDistrict = (stateId: number) => {
    return axios.get(`${BASE_URL}/api/Master/GetDistrictMaster?stateId=${stateId}`);
}

export const getBlocks = (stateId: number, districtId: number) => {
    return axios.get(`${BASE_URL}/api/Master/GetBlockMaster?stateId=${stateId}&distId=${districtId}`);
}

export const getUserLocationType = () => {
    return axios.get(`${BASE_URL}/api/User/GetUserLocations`);
}

export const saveUserRegistrationDetails = (userRegDetails: any) => {
    return axios.post(`${BASE_URL}/api/User/SaveUserMPInfo`, userRegDetails);
}

export const getBankMaster = () => {
    return axios.get(`${BASE_URL}/api/Master/GetBankMaster`);
}

export const updateUserPersonalInfo = (userPersonalInfo: any) => {
    return axios.post(`${BASE_URL}/api/User/UpdateUserPersonalDetail`, userPersonalInfo);
}

export const updateUserBankDetails = (bankDetails: any) => {
    return axios.post(`${BASE_URL}/api/User/UpdateUserBankDetail`, bankDetails);
}

export const saveUserBankDetails = (bankDetails: any) => {
    return axios.post(`${BASE_URL}/api/User/SaveUserBankInfo`, bankDetails);
}

export const updatePassword = (passwords: any) => {
    return axios.post(`${BASE_URL}/api/User/UpdateUserPWD`, passwords);
}

export const updateWalletPin = (userID: number, pin: string, oldpin: string) => {
    return axios.post(`${BASE_URL}/api/User/UpdateUserTPin`, { "userId": userID, "tpin": pin, "otp": oldpin });
}

export const generateOtpForWalletPinChange = (userId: string) => {
    return axios.post(`${BASE_URL}/api/User/PostUserTPin?userId=${userId}`, {});
}


export const saveUserKycDetails = (kycDetials: any) => {
    return axios.post(`${BASE_URL}/api/User/UpdateUserKycDetail`, kycDetials);
}





// DMT

export const getSenderInfo = (payload: any) => {
    return axios.post(`${BASE_URL}/api/DMT/eSenderDetails`, payload)
}

export const getAllDmtBank = () => {
    return axios.get(`${BASE_URL}/api/DMT/eGetAllDMTBanks`)
}

export const registerRecipient = (payload: any) => {
    return axios.post(`${BASE_URL}/api/DMT/eRegisterRecipient`, payload)
}

export const getAllRecipients = (payload: any) => {
    return axios.post(`${BASE_URL}/api/DMT/eAllRecipients`, payload);
}

export const registerSenderInfo = (payload: any) => {
    return axios.post(`${BASE_URL}/api/DMT/eSenderRegistration`, payload)
}

export const verifySender = (payload: any) => {
    return axios.post(`${BASE_URL}/api/DMT/eVerifySender`, payload)
}

export const getConveyanceFee = (payload: any) => {
    return axios.post(`${BASE_URL}/api/DMT/eCustomerConv`, payload);
}

export const dmtFundTransfer = (payload: any, serviceId: string, categoryId: string, userId: string) => {
    return axios.post(`${BASE_URL}/api/DMT/eFundTransfer?serviceId=${serviceId}&categoryId=${categoryId}&userId=${userId}`, payload);
}



export const getEncryptedResponse = (request: string) => {
    return axios.post(`${BASE_URL}/api/GSKRecharge/eEncryptRequest`, {
        "data": request
    }, { responseType: 'text' });
}