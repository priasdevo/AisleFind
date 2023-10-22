import express from "express";
// import { protect } from "../middleware/auth"; // TODO add protect middleware by calling User service?
import { searchItem, findItem, addItem, editItem, deleteItem, getItemStats, getItemStatsById, getItemByAisle } from "../controllers/item";

const router = express.Router()

router.get('/aisle/:id', getItemByAisle)
router.get('/stats/:id', getItemStatsById)
router.get('/stats/', getItemStats)

router.put('/:id', editItem)
router.get('/:id', findItem)
router.delete('/:id', deleteItem)

router.get('/', searchItem)
router.post('/', addItem)


export default router