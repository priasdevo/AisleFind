import axios from 'axios';
import { Request, Response } from 'express';

export const handleRESTServiceRequest = (service_URL: string) => {
    return async (req: Request, res: Response) => {
        //get the Bearer token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        //try send REST request
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
            console.log("Error : ", error);
            res.status(500).send(`Error forwarding to Service at ${service_URL}`);
        }
    };
};
