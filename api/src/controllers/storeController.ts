import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Request, Response } from 'express';
import path from 'path';

// const PROTO_PATH = path.join(__dirname, '..', '..', 'public', 'gRPC', 'proto', 'helloworld.proto'); // Update with actual path
const PROTO_PATH = path.join(__dirname, '..', '..', '..', 'SharedFile', 'proto', 'services', 'store', 'v1', 'store_service.proto'); // Update with actual path
// const PROTO_PATH = '../../public/gRPC/proto/helloworld.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const serviceProto: any = grpc.loadPackageDefinition(packageDefinition);

const client = new serviceProto.StoreService(
  'localhost:50051', // Assuming your gRPC server is running on localhost on port 50051
  grpc.credentials.createInsecure()
);
export const handleGetStoresList = () => {
  return async (req: Request, res: Response) => {
    client.GetStoresList(req.body, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
}
export const handleCreateStore = () => {
  return async (req: Request, res: Response) => {
    client.CreateStore(req.body, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
}

export const handleUpdateStore = () => {
  return async (req: Request, res: Response) => {
    client.UpdateStore(req.body, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
}
export const handleDeleteStore = () => {
  return async (req: Request, res: Response) => {
    client.DeleteStore(req.body, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
}
export const handleGetStore = () => {
  return async (req: Request, res: Response) => {
    const requestBody = { ...req.body, id: req.params.id };
    client.GetStore(requestBody, (error: { message: any; }, response: any) => {
      if (!error) {
        res.json(response);
      } else {
        res.status(500).send(error.message);
      }
    });
  };
}
//layout
export const handleGetStoreLayout = () => {
  return async (req: Request, res: Response) => {
      const requestBody = { ...req.body, id: req.params.id };
      client.GetStoreLayout(requestBody, (error: { message: any; }, response: any) => {
          if (!error) {
              res.json(response);
          } else {
              res.status(500).send(error.message);
          }
      });
  };
}

export const handleAddLayout = () => {
  return async (req: Request, res: Response) => {
      const requestBody = { layout: {...req.body, store_id: req.params.id } };
      client.AddLayout(requestBody, (error: { message: any; }, response: any) => {
          if (!error) {
              res.json(response);
          } else {
              res.status(500).send(error.message);
          }
      });
  };
}

export const handleUpdateLayout = () => {
  return async (req: Request, res: Response) => {
      const requestBody = { layout:{...req.body, store_id: req.params.id, id: req.params.layoutId} };
      client.UpdateLayout(requestBody, (error: { message: any; }, response: any) => {
          if (!error) {
              res.json(response);
          } else {
              res.status(500).send(error.message);
          }
      });
  };
}

export const handleDeleteLayout = () => {
  return async (req: Request, res: Response) => {
      const requestBody = { ...req.body, store_id: req.params.id, layout_id: req.params.layoutId };
      client.DeleteLayout(requestBody, (error: { message: any; }, response: any) => {
          if (!error) {
              res.json(response);
          } else {
              res.status(500).send(error.message);
          }
      });
  };
}
