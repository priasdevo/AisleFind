import express from "express";
import { protect, isOwner, isCustomer } from "../middleware/auth";
import { searchItem, findItem, getItemsByStore, addItem, editItem, deleteItem, getItemStats, getItemStatsById, getItemStatsByStore, getItemByAisle } from "../controllers/item";

const router = express.Router()

router.get('/aisle/:layout_id', getItemByAisle)
router.get('/stats/', protect, isOwner, getItemStats)
router.get('/stats/:id', protect, isOwner, getItemStatsById) 
router.get('/stats/store/:storeId', protect, isOwner, getItemStatsByStore)

router.get('/:id', findItem)
router.put('/:id', protect, isOwner, editItem)
router.delete('/:id', protect, isOwner, deleteItem)

router.get('/', searchItem)
router.post('/', protect, isOwner, addItem)

router.get('/store/:storeId', protect, isCustomer, getItemsByStore)

export default router