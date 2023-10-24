import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { sendMessage } from "../utils/logService";

export const handleRESTServiceRequest = (service_URL: string) => {
    return async (req: Request, res: Response) => {
        // get the Bearer token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // try to send REST request
        try {
            const response = await axios({
                method: req.method,
                url: `${service_URL}${req.path}`,
                data: req.body,
                headers: {
                    'Authorization': `Bearer ${token}` // Send the bearer token in the request header
                }
            });
            res.send(response.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            sendMessage('Log', 'error gateway forward', { targetService: service_URL, error: axiosError.message });
            
            // If there's a response from the server, use its status and data
            if (axiosError.response) {
                res.status(axiosError.response.status).send(axiosError.response.data);
            } else {
                // If there's no response from the server, use a default error message and status
                res.status(500).send({ message: 'Internal Server Error' });
            }
        }
    };
};
