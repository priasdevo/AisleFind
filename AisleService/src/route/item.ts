import express from "express";
// import { protect } from "../middleware/auth"; // TODO add protect middleware by calling User service?
import { getItemList, findItem, addItem, editItem, deleteItem, getItemStats, getItemByAisle } from "../controllers/item";

const router = express.Router()

router.get('/', getItemList)
router.post('/', addItem)

router.put('/:id', editItem)
router.get('/:id', findItem)
router.delete('/:id', deleteItem)

router.get('/stats/:id', getItemStats)
router.get('/aisle/:id', getItemByAisle)


export default router