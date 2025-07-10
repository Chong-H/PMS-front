import axios from 'axios';
import { ResponseMessage } from './pojo/ResponseMessage';
import { AccountDto } from './pojo/AccountDto';
//import { TransactionDto } from './pojo/dto/TransactionDto';
//import { Transaction } from './pojo/Transaction';
import{store} from '@/stores/storeAuth';
const API_BASE_URL = '/api';

// DigitalCollectible API



export const getAllAccAPI = async (vfnum : String): Promise<ResponseMessage<AccountDto[]>> => {

    const response = await axios.get(`${API_BASE_URL}/accs`, {
        params: { vfnum ,sessionid: store.communicationcode} // axios会自动将参数拼接到URL中
    });
    return response.data;

};
export const Negotiate = async (vfnum : String): Promise<ResponseMessage<AccountDto[]>> => {

    const response = await axios.get(`${API_BASE_URL}/Negotiate`, {
        params: { vfnum,sessionid: store.communicationcode, pkeyalice:store.pkeyalice } // axios会自动将参数拼接到URL中
    });
    alert("getAllAccAPI , Sessionid= " + response.data.sessionId );
    return response.data;

};
