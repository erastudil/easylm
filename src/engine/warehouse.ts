/**
 * Backward-compatibility wrapper for The Stacks (formerly Warehouse).
 * Re-exports from stacks.ts.
 */
export {
  execStacks as execWarehouse,
  stacksStats as warehouseStats,
  tokenize,
  splitChapters,
  extractDoors,
  type StackChapter as WarehouseChapter,
  type StackPack as WarehousePack
} from './stacks';
