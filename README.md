# 📊 Allocation Table Guide

This table is a **hierarchical allocation system** built using **AG Grid**, allowing users to allocate values or percentages across parent and child categories. It supports dynamic updates and variance tracking.

---

## 🚀 Features

- **Double-click to edit** input cells.
- Two allocation modes:
  - **Allocate %**: Increases value by a given percentage.
  - **Allocate Value**: Sets a new absolute value.
- Real-time **variance** calculation from the original value.
- Intelligent **upward and downward propagation**:
  - Allocating in **child rows** updates parent totals.
  - Allocating in **parent rows** distributes values to children.
- **Input validation** to prevent invalid characters (letters, symbols, etc.).
- Toast notifications using `sonner` for user feedback.

---

## ✍️ How to Use

1. **Edit a cell**:
   - Double-click the **`Input` cell** of a row to begin editing.
   - Enter a **numeric value** (e.g., `10`, `25.5`, etc.).
   - Press Enter or click outside to save.

2. **Allocate the input**:
   - Click the **`Allocate %`** button to apply the input as a percentage.
   - Click the **`Allocate Value`** button to apply the input as a direct value.

3. **See changes in real-time**:
   - The `Value` and `Variance` columns will update immediately.
   - Parents or children will be recalculated depending on the allocation direction.
