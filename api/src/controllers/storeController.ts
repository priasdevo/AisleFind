import { Request, Response } from 'express';
import { Metadata } from '@grpc/grpc-js';

function generateMetadata(req: Request): Metadata {
    const metadata = new Metadata();
    const bearerToken = req.headers.authorization; // assuming the token is sent in the Authorization header
    if (bearerToken) {
        metadata.add('authorization', bearerToken);
    }
    return metadata;
}

export const handleGetStoresList = (client: any) => {
  return async (req: Request, res: Response) => {
    const metadata = generateMetadata(req);
    client.GetStoresList(req.body, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleCreateStore = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { store: {...req.body} };
    const metadata = generateMetadata(req);
    client.CreateStore(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleUpdateStore = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { store: {id: req.params.id, ...req.body} };
    const metadata = generateMetadata(req);
    client.UpdateStore(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleDeleteStore = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { id: req.params.id };
    const metadata = generateMetadata(req);
    client.DeleteStore(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleGetStore = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { id: req.params.id };
    const metadata = generateMetadata(req);
    client.GetStore(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

// Layout functions:

export const handleGetStoreLayout = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { id: req.params.id };
    const metadata = generateMetadata(req);
    client.GetStoreLayout(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleAddLayout = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { layout: {...req.body, store_id: req.params.id } };
    const metadata = generateMetadata(req);
    client.AddLayout(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleUpdateLayout = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { layout: {...req.body, store_id: req.params.id, id: req.params.layoutId} };
    const metadata = generateMetadata(req);
    client.UpdateLayout(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};

export const handleDeleteLayout = (client: any) => {
  return async (req: Request, res: Response) => {
    const requestBody = { store_id: req.params.id, layout_id: req.params.layoutId };
    const metadata = generateMetadata(req);
    client.DeleteLayout(requestBody, metadata, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
};
