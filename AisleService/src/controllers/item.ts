import Item, {IItem} from "../entity/item";
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

export const getItemList = async (req: Request, res: Response) => {
    const items = await getRepository(Item).find();
    res.json(items);
}

export const findItem = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    const item = await getRepository(Item).findOne({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
}

export const addItem = async (req: Request, res: Response) => {
    let body: IItem = req.body;
    body.searchCount = req.body.searchCount || 0;
    const newItem = getRepository(Item).create(req.body);
    const result = await getRepository(Item).save(newItem);
    res.status(201).json(result);
}

export const editItem = async (req: Request, res: Response) => {
    const id = Number(req.params.id);  // Convert the ID from string to number
    const item = await getRepository(Item).findOne({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    getRepository(Item).merge(item, req.body); // merge new data
    const result = await getRepository(Item).save(item);
    res.json(result);
}

export const deleteItem = async (req: Request, res: Response) => {
    const result = await getRepository(Item).delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
}

// Get stats about items
export const getItemStats = (req: Request, res: Response) => {
    //TODO : Returning item statistics
    res.json({ message: "Returning item statistics", data: {} });
}

// Get items by aisle
export const getItemByAisle = (req: Request, res: Response) => {
    //TODO : waiting for Store service
    const aisle = req.query.aisle;
    res.json({ message: `Returning items for aisle ${aisle}`, data: [] });
}