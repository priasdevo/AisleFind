import Item, {IItem} from "../entity/item";
import Store, {IStore} from "../entity/store";
import Layout, {ILayout} from "../entity/layout";
import { Request, Response } from 'express';
import { getRepository, getConnection, Like } from 'typeorm';

//find item by id
export const findItem = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const item = await getRepository(Item).findOne({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
}

//search item by name
export const searchItem = async (req: Request, res: Response) => {
    if (req.query.title) {
        let title: string = req.query.title as string;
        
        // Use the Like operator to search for items containing the title substring
        const items = await getRepository(Item).find({
            where: {
                title: Like(`%${title}%`)
            },
            select: ["id", "title", "description", "layout_id"]
        });

         // If items are found, increase the searchCount for each item
         if (items.length > 0) {
            await getConnection()
                .createQueryBuilder()
                .update(Item)
                .set({ search_count: () => "search_count + 1" }) // Increment searchCount by 1
                .whereInIds(items.map(item => item.id)) // Apply the update only to items found in the search
                .execute();
        } else {
            return res.status(404).json([]);
        }
        res.json(items);
    } else {
        // If there's no title query param, return all items
        const items = await getRepository(Item).find({
            select: ["id", "title", "description", "layout_id"]
        });
        res.json(items);
    }
}

export const addItem = async (req: Request, res: Response) => {
    let body: IItem = req.body;
    body.search_count = body.search_count || 0; // Ensure that body.search_count is assigned properly
    const layout_id = body.layout_id;
    const store_id = body.store_id;
    const owner_Id = req.user?.id;

    try {
        // Get the store to verify the owner
        const storeRepository = getRepository(Store);
        const store = await storeRepository.findOne({
        where: { id: store_id }
        });

        if (!store) {
        return res.status(404).json({ message: 'Store not found.' });
        }

        if (store.owner_id !== owner_Id) {
        return res.status(403).json({ message: 'You are not authorized to add items to this store.' });
        }

        // Verify that the layout belongs to the correct store
        const layoutRepository = getRepository(Layout);
        const layout = await layoutRepository.findOne({
        where: { id: layout_id, store_id: store_id }
        });

        if (!layout) {
        return res.status(404).json({ message: 'Layout not found in this store.' });
        }

        // Proceed to add the item
        const newItem = getRepository(Item).create(body);
        const result = await getRepository(Item).save(newItem);
        res.status(201).json(result);
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ message: 'Server error while adding item.', error });
    }
}

export const editItem = async (req: Request, res: Response) => {
    const itemId = Number(req.params.id);
    const owner_Id = req.user?.id; // Assuming req.user is populated with the authenticated user's information
    const newLayoutId = req.body.layout_id;
  
    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID provided.' });
    }
  
    // Retrieve the item along with the store and layout information
    const itemRepository = getRepository(Item);
    const item = await itemRepository.findOne({
      where: { id: itemId },
      relations: ['store', 'layout'] // Assuming there's a relation 'layout' defined in your Item entity
    });
  
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
  
    // Check if the user is the owner of the store associated with the item
    if (item.store.owner_id !== owner_Id) {
      return res.status(403).json({ message: 'You are not authorized to edit this item.' });
    }
  
    // If new layout_id is provided, check if it exists within the same store
    if (newLayoutId) {
      const layoutRepository = getRepository(Layout);
      const layout = await layoutRepository.findOne({
        where: { id: newLayoutId, store_id: item.store.id }
      });
      if (!layout) {
        return res.status(400).json({ message: 'The provided layout does not exist in this store.' });
      }
    }
  
    // Prevent modification of store_id and search_count
    const updatedData = { ...req.body };
    delete updatedData.store_id;
    delete updatedData.search_count;
  
    // Merge new data with the existing item, excluding store_id and search_count
    itemRepository.merge(item, updatedData);
  
    // Save the updated item
    try {
      const result = await itemRepository.save(item);

      const itemData = {
        ...result,
        store: undefined,
        layout: undefined,
        // any other relations to exclude...
      };
  
      return res.json(itemData);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating item.', error });
    }
  }
  
  

export const deleteItem = async (req: Request, res: Response) => {
    const itemId = Number(req.params.id);
    const owner_Id = req.user?.id;
  
    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID provided.' });
    }
  
    // Start a transaction to ensure atomicity
    const queryRunner = getRepository(Item).manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // Retrieve the item and its store in a single find operation
      const itemWithStore = await queryRunner.manager.findOne(Item, {
        where: { id: itemId },
        relations: ['store']
      });
  
      if (!itemWithStore) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      // Check if the store owner ID matches the user's ID
      if (itemWithStore.store.owner_id !== owner_Id) {
        await queryRunner.rollbackTransaction();
        return res.status(403).json({ message: 'You are not authorized to delete this item.' });
      }
  
      // Proceed with deletion as the user is authorized
      const result = await queryRunner.manager.delete(Item, itemId);
  
      if (result.affected === 0) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      // Commit the transaction if everything is fine
      await queryRunner.commitTransaction();
      res.json({ message: 'Item deleted successfully.' });
    } catch (error) {
      // If there's an error, roll back the transaction
      await queryRunner.rollbackTransaction();
      res.status(500).json({ message: 'Server error while deleting the item.', error });
    } finally {
      // Always release the query runner to prevent memory leaks
      await queryRunner.release();
    }
  }
  
  

// Get stats about items
export const getItemStats = async (req: Request, res: Response) => {
    const ownerId = req.user?.id;
    // each item has a store_id, each store has an owner_id
    // query all items that has store with owner_id = ownerId
    // join item and store table
    console.log("querying items for owner : ", ownerId);
    const items = await getRepository(Item).createQueryBuilder("item")
        .innerJoin("item.store", "store")
        .where("store.owner_id = :ownerId", { ownerId })
        .select(["item.id", "item.title", "item.search_count", "item.layout_id"])
        .getMany();
    res.json(items);
}


// Get stats about a item
export const getItemStatsById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const item = await getRepository(Item).findOne({
        where: { id },
        relations: ['store'], // Include the store relation
        select: ["id", "title", "search_count", "layout_id", "store"] // Ensure store is included
    });
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    
    const ownerId = req.user?.id.toString();
    console.log("Test item : ", item);
    console.log("Test item.store : ", item.store);

    // Assuming the store entity has owner_id and you have loaded it correctly
    if (item.store.owner_id != ownerId) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Remove store information before sending to client if it's not needed
    const { store, ...itemWithoutStore } = item;
    res.json(itemWithoutStore);
};



// Get items by aisle
export const getItemByAisle = async (req: Request, res: Response) => {
    const aisle = req.params.layout_id;
    // parse aisle to number
    if (isNaN(Number(aisle))) {
        return res.status(400).json({ message: 'Invalid aisle ID provided' });
    }
    const aisleId = Number(aisle);
    const item = await getRepository(Item).find({
        where: { layout_id: aisleId },
        select: ["id", "title", "description", "layout_id"]
    });
    res.json(item);
}