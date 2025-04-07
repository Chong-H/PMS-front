import axios from 'axios';
import { ResponseMessage } from './pojo/ResponseMessage';
import { AccountDto } from './pojo/AccountDto';
//import { TransactionDto } from './pojo/dto/TransactionDto';
//import { Transaction } from './pojo/Transaction';

const API_BASE_URL = '/api';

// DigitalCollectible API



export const getAllAccAPI = async (vfnum : String): Promise<ResponseMessage<AccountDto[]>> => {
    const response = await axios.get(`${API_BASE_URL}/accs`, {
        params: { vfnum } // axios会自动将参数拼接到URL中
    });
    return response.data;
};
