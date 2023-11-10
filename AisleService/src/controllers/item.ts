import Item, {IItem} from "../entity/item";
import Store, {IStore} from "../entity/store";
import Layout, {ILayout} from "../entity/layout";
import { Request, Response } from 'express';
import { getRepository, getConnection, Like } from 'typeorm';
import { sendMessage } from "../utils/logService";

//find item by id
export const findItem = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const item = await getRepository(Item).findOne({ where: { id } });
    if (!item) {
      sendMessage('Log', 'user searched for item id that does not exist', { id });
      return res.status(404).json({ message: 'Item not found' });
    }
    sendMessage('Log', 'user searched for item id', { id });
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
            select: ["id", "title", "description", "layout_id", "store_id"] // Added "store_id" to the selection
        });

        // If items are found, increase the search_count for each item
        if (items.length > 0) {
            await getConnection()
                .createQueryBuilder()
                .update(Item)
                .set({ search_count: () => "search_count + 1" }) // Increment search_count by 1
                .whereInIds(items.map(item => item.id)) // Apply the update only to items found in the search
                .execute();
        } else {
          sendMessage('Log', 'user searched for item title that does not exist', { title });
            return res.status(404).json([]);
        }
        sendMessage('Log', 'user searched for item title', { title });
        res.json(items);
    } else {
        // If there's no title query param, return all items
        const items = await getRepository(Item).find({
            select: ["id", "title", "description", "layout_id", "store_id"] // Added "store_id" to the selection
        });
        sendMessage('Log', 'user searched for all items', { items });
        res.json(items);
    }
};


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
        sendMessage('Log', 'user tried to add item to store that does not exist', { store_id });
        return res.status(404).json({ message: 'Store not found.' });
        }

        if (store.owner_id !== owner_Id) {
        sendMessage('Log', 'user tried to add item to store not belonging to them', { store_id });
        return res.status(403).json({ message: 'You are not authorized to add items to this store.' });
        }

        // Verify that the layout belongs to the correct store
        const layoutRepository = getRepository(Layout);
        const layout = await layoutRepository.findOne({
        where: { id: layout_id, store_id: store_id }
        });

        if (!layout) {
        sendMessage('Log', 'user tried to add item to invalid layout id', { layout_id });
        return res.status(404).json({ message: 'Layout not found in this store.' });
        }

        // Proceed to add the item
        const newItem = getRepository(Item).create(body);
        const result = await getRepository(Item).save(newItem);
        sendMessage('Log', 'user added new item to layout', { newItem, layout_id });
        res.status(201).json(result);
    } catch (error) {
        // Handle any unexpected errors
        sendMessage('Log', 'server error while adding item', { error });
        res.status(500).json({ message: 'Server error while adding item.', error });
    }
}

export const editItem = async (req: Request, res: Response) => {
    const itemId = Number(req.params.id);
    const owner_Id = req.user?.id; // Assuming req.user is populated with the authenticated user's information
    const newLayoutId = req.body.layout_id;
  
    if (isNaN(itemId)) {
      sendMessage('Log', 'user tried to edit item with invalid id', { itemId });
      return res.status(400).json({ message: 'Invalid item ID provided.' });
    }
  
    // Retrieve the item along with the store and layout information
    const itemRepository = getRepository(Item);
    const item = await itemRepository.findOne({
      where: { id: itemId },
      relations: ['store', 'layout'] // Assuming there's a relation 'layout' defined in your Item entity
    });
  
    if (!item) {
      sendMessage('Log', 'user tried to edit item that does not exist', { itemId });
      return res.status(404).json({ message: 'Item not found.' });
    }
  
    // Check if the user is the owner of the store associated with the item
    if (item.store.owner_id !== owner_Id) {
      sendMessage('Log', 'user tried to edit item not belonging to them', { itemId });
      return res.status(403).json({ message: 'You are not authorized to edit this item.' });
    }
  
    // If new layout_id is provided, check if it exists within the same store
    if (newLayoutId) {
      const layoutRepository = getRepository(Layout);
      const layout = await layoutRepository.findOne({
        where: { id: newLayoutId, store_id: item.store.id }
      });
      if (!layout) {
        sendMessage('Log', 'user tried to edit item with invalid layout id', { newLayoutId });
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
      sendMessage('Log', 'user edited item with id', { itemId });
      return res.json(itemData);
    } catch (error) {
      sendMessage('Log', 'server error while editing item', { error });
      return res.status(500).json({ message: 'Error updating item.', error });
    }
  }
  
  

export const deleteItem = async (req: Request, res: Response) => {
    const itemId = Number(req.params.id);
    const owner_Id = req.user?.id;
  
    if (isNaN(itemId)) {
      sendMessage('Log', 'user tried to delete item with invalid id', { itemId });
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
        sendMessage('Log', 'user tried to delete item that does not exist', { itemId });
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      // Check if the store owner ID matches the user's ID
      if (itemWithStore.store.owner_id !== owner_Id) {
        await queryRunner.rollbackTransaction();
        sendMessage('Log', 'user tried to delete item not belonging to them', { itemId });
        return res.status(403).json({ message: 'You are not authorized to delete this item.' });
      }
  
      // Proceed with deletion as the user is authorized
      const result = await queryRunner.manager.delete(Item, itemId);
  
      if (result.affected === 0) {
        await queryRunner.rollbackTransaction();
        sendMessage('Log', 'user tried to delete item that does not exist', { itemId });
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      // Commit the transaction if everything is fine
      await queryRunner.commitTransaction();
      sendMessage('Log', 'user deleted item with id', { itemId });
      res.json({ message: 'Item deleted successfully.' });
    } catch (error) {
      // If there's an error, roll back the transaction
      await queryRunner.rollbackTransaction();
      sendMessage('Log', 'server error while deleting item', { error });
      res.status(500).json({ message: 'Server error while deleting the item.', error });
    } finally {
      // Always release the query runner to prevent memory leaks
      await queryRunner.release();
    }
  }
  
  

// Get stats about all own items
export const getItemStats = async (req: Request, res: Response) => {
    const ownerId = req.user?.id;
    console.log("Querying items for owner: ", ownerId);
    try {
        const items = await getRepository(Item).createQueryBuilder("item")
            .innerJoin("item.store", "store")
            .where("store.owner_id = :ownerId", { ownerId })
            .select([
                "item.id", 
                "item.title", 
                "item.description", // Make sure to include the description if it's part of the item entity
                "item.search_count", 
                "item.layout_id",
                "store.id AS store_id" // This line will rename the selected store.id to store_id
            ])
            .orderBy("item.search_count", "DESC")
            .getRawMany(); // Use getRawMany() to get flat data rather than nested.

        // Format the raw results to match the desired output
        const formattedItems = items.map(item => ({
            id: item.item_id,
            title: item.item_title,
            description: item.item_description, // Make sure this field exists in your entity
            search_count: item.item_search_count,
            layout_id: item.item_layout_id,
            store_id: item.store_id
        }));
        sendMessage('Log', 'user searched for all item stats', { });
        res.json(formattedItems);
    } catch (error) {
        sendMessage('Log', 'server error while getting item stats', { error });
        res.status(500).json({ message: "Error retrieving item statistics.", error });
    }
}

// Get stats about a item
export const getItemStatsById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        sendMessage('Log', 'user searched for item stats with invalid id', { id });
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const item = await getRepository(Item).findOne({
        where: { id },
        relations: ['store'], // Include the store relation
        select: ["id", "title", "search_count", "layout_id", "store"] // Ensure store is included
    });
    if (!item) {
        sendMessage('Log', 'user searched for item stats with invalid id', { id });
        return res.status(404).json({ message: 'Item not found' });
    }
    
    const ownerId = req.user?.id.toString();

    // Assuming the store entity has owner_id and you have loaded it correctly
    if (item.store.owner_id != ownerId) {
        sendMessage('Log', 'user searched for item stats not belonging to them', { id });
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Remove store information before sending to client if it's not needed
    const { store, ...itemWithoutStore } = item;
    sendMessage('Log', 'user searched for item stats with id', { id });
    res.json(itemWithoutStore);
};

// Get stats about all own items in specific store
export const getItemStatsByStore = async (req: Request, res: Response) => {
    const storeId = Number(req.params.storeId);
    const ownerId = req.user?.id; // Assuming the user's ID is in req.user.id
  
    if (isNaN(storeId)) {
      sendMessage('Log', 'user searched for item stats with invalid store id', { storeId });
      return res.status(400).json({ message: 'Invalid store ID provided.' });
    }
  
    try {
      // Check if the store belongs to the user
      const store = await getRepository(Store).findOne({
        where: { id: storeId, owner_id: ownerId } // Match both store ID and owner ID
      });

      if (!store) {
        // If the store is not found or not owned by the user, return a Forbidden response
        sendMessage('Log', 'user searched for item stats in store not belonging to them', { storeId });
        return res.status(403).json({ message: 'Forbidden: You do not own this store.' });
      }

      // Retrieve all items from the store owned by the user and sort by search_count in descending order
      const items = await getRepository(Item)
        .createQueryBuilder("item")
        .where("item.store_id = :storeId", { storeId })
        .orderBy("item.search_count", "DESC")
        .getMany();
  
      // Return the sorted items
      sendMessage('Log', 'user searched for item stats in store with id', { storeId });
      return res.json(items);
    } catch (error) {
      // Handle any errors
      sendMessage('Log', 'server error while getting item stats in store', { error });
      return res.status(500).json({ message: 'Error retrieving store item statistics.', error });
    }
}

  


// Get items by aisle
export const getItemByAisle = async (req: Request, res: Response) => {
    const aisle = req.params.layout_id;
    // parse aisle to number
    if (isNaN(Number(aisle))) {
        sendMessage('Log', 'user searched for item by aisle with invalid id', { aisle });
        return res.status(400).json({ message: 'Invalid aisle ID provided' });
    }
    const aisleId = Number(aisle);
    const item = await getRepository(Item).find({
        where: { layout_id: aisleId },
        select: ["id", "title", "description", "layout_id"]
    });
    sendMessage('Log', 'user searched for item by aisle with id', { aisleId });
    res.json(item);
}