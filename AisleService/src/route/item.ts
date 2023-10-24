import express from "express";
import { protect, isOwner } from "../middleware/auth"; // TODO add protect middleware by calling User service?
import { searchItem, findItem, addItem, editItem, deleteItem, getItemStats, getItemStatsById, getItemByAisle } from "../controllers/item";

const router = express.Router()

router.get('/aisle/:id', getItemByAisle)
router.get('/stats/:id', protect, isOwner, getItemStatsById) 
router.get('/stats/', protect, isOwner, getItemStats)

router.get('/:id', findItem)
router.put('/:id', protect, isOwner, editItem)
router.delete('/:id', protect, isOwner, deleteItem)

router.get('/', searchItem)
router.post('/', protect, isOwner, addItem)


export default router