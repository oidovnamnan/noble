// QPay API Implementation Mock/Stub
import axios from 'axios';

const QPAY_CONFIG = {
    authUrl: 'https://merchant.qpay.mn/v2/auth/token',
    invoiceUrl: 'https://merchant.qpay.mn/v2/invoice',
    username: process.env.QPAY_USERNAME,
    password: process.env.QPAY_PASSWORD,
};

export async function getQPayToken() {
    try {
        // In real scenario, you'd call QPay's auth endpoint
        // const response = await axios.post(QPAY_CONFIG.authUrl, {}, {
        //   auth: {
        //     username: QPAY_CONFIG.username!,
        //     password: QPAY_CONFIG.password!,
        //   }
        // });
        // return response.data.access_token;

        return 'mock_access_token_123';
    } catch (error) {
        console.error('QPay Auth Error:', error);
        throw error;
    }
}

export async function createInvoice(params: {
    amount: number;
    description: string;
    orderId: string;
}) {
    try {
        const token = await getQPayToken();

        // In real scenario:
        // const response = await axios.post(QPAY_CONFIG.invoiceUrl, {
        //   invoice_code: process.env.QPAY_INVOICE_CODE,
        //   sender_invoice_no: params.orderId,
        //   invoice_receiver_code: 'terminal',
        //   invoice_description: params.description,
        //   amount: params.amount,
        //   callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback?orderId=${params.orderId}`,
        // }, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // return response.data;

        // Mock response
        return {
            invoice_id: 'QPAY-INV-12345',
            qr_text: 'qpay_qr_code_data_here',
            qr_image: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example',
            urls: [
                { name: 'Khan Bank', url: 'khanbank://' },
                { name: 'TDB', url: 'tdb://' },
                { name: 'QPay', url: 'qpay://' },
            ]
        };
    } catch (error) {
        console.error('QPay Invoice Error:', error);
        throw error;
    }
}

export async function checkPaymentStatus(invoiceId: string) {
    // Logic to poll or check status manually if webhook fails
    return 'paid';
}
