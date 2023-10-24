import Item, {IItem} from "../entity/item";
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
    body.search_count = req.body.searchCount || 0;
    const newItem = getRepository(Item).create(req.body);
    const result = await getRepository(Item).save(newItem);
    res.status(201).json(result);
}

export const editItem = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const item = await getRepository(Item).findOne({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    getRepository(Item).merge(item, req.body); // merge new data
    const result = await getRepository(Item).save(item);
    res.json(result);
}

export const deleteItem = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const result = await getRepository(Item).delete(id);
    if (result.affected === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
}

// Get stats about items
// TODO : get only item that match ownerId (direct query using store entity)
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
// TODO : get only item that match ownerId (direct query using store entity)
export const getItemStatsById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID provided' });
    }
    const item = await getRepository(Item).findOne({
        where: { id },
        select: ["id", "title", "search_count", "layout_id"]
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const ownerId = req.user?.id.toString();
    // each item has a store_id, each store has an owner_id
    // if item.store.owner_id != ownerId, return forbidden
    if(item.store.owner_id != ownerId){
        return res.status(403).json({ message: 'Forbidden' });
    }
    
    res.json(item);
}


// Get items by aisle
export const getItemByAisle = async (req: Request, res: Response) => {
    //TODO : waiting for Store service
    const aisle = req.query.layout_id;
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