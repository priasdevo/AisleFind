import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Request, Response } from 'express';
import { Metadata } from '@grpc/grpc-js';
import dotenv from "dotenv";
import path from "path";

function generateMetadata(req: Request): Metadata {
    const metadata = new Metadata();
    const bearerToken = req.headers.authorization; // assuming the token is sent in the Authorization header
    if (bearerToken) {
        metadata.add('authorization', bearerToken);
    }
    return metadata;
}
const PROTO_PATH = path.join(__dirname, '..', '..', '..', 'SharedFile', 'proto', 'services', 'store', 'v1', 'store_service.proto'); // Update with actual path

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const serviceProto: any = grpc.loadPackageDefinition(packageDefinition);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const client = new serviceProto.StoreService(
  process.env.STORE_SERVICE_URL || "localhost:50051", 
  grpc.credentials.createInsecure()
);

export const handleGetStoresList = () => {
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

export const handleCreateStore = () => {
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

export const handleUpdateStore = () => {
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

export const handleDeleteStore = () => {
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

export const handleGetStore = () => {
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

export const handleGetStoreLayout = () => {
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

export const handleAddLayout = () => {
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

export const handleUpdateLayout = () => {
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

export const handleDeleteLayout = () => {
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
