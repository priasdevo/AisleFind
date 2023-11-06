import express from 'express';
import { 
    handleGetStoresList, 
    handleCreateStore, 
    handleUpdateStore, 
    handleDeleteStore, 
    handleGetStore,
    handleGetStoreLayout,
    handleAddLayout,
    handleUpdateLayout,
    handleDeleteLayout
} from '../controllers/storeController';

const storeRouter = express.Router();

// Get the list of stores
storeRouter.get('/', handleGetStoresList());
// Get a specific store
storeRouter.get('/:id', handleGetStore());
// Add a new store
storeRouter.post('/', handleCreateStore());
// Update a store
storeRouter.put('/:id', handleUpdateStore());
// Delete a store
storeRouter.delete('/:id', handleDeleteStore());

// layout

// Get a store layout
storeRouter.get('/:id/layout', handleGetStoreLayout());
// Add a new layout to a store
storeRouter.post('/:id/layout', handleAddLayout());
// Update a layout in a store
storeRouter.put('/:id/layout/:layoutId', handleUpdateLayout());
// Delete a layout in a store
storeRouter.delete('/:id/layout/:layoutId', handleDeleteLayout());

export default storeRouter;
