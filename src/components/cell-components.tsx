import { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "./ui/button";
import { memo } from "react";
import { toast } from "sonner";

export type AllocateCellProps = {
  params: CustomCellRendererProps;
  updateParentTotals: (
    updatedData: AllocateCellProps["params"]["data"][],
    childId: string
  ) => AllocateCellProps["params"]["data"][];
  distributeToChildren: (
    updatedData: AllocateCellProps["params"]["data"][],
    parentId: string,
    newValue: number
  ) => AllocateCellProps["params"]["data"][];
  setRowDataFlat: React.Dispatch<
    React.SetStateAction<AllocateCellProps["params"]["data"][]>
  >;
  rowDataFlat: AllocateCellProps["params"]["data"][];
};

const handleAllocate = (
  params: AllocateCellProps["params"],
  updateParentTotals: AllocateCellProps["updateParentTotals"],
  distributeToChildren: AllocateCellProps["distributeToChildren"],
  setRowDataFlat: AllocateCellProps["setRowDataFlat"],
  rowDataFlat: AllocateCellProps["rowDataFlat"]
) => {
  const input = params.data.input;
  const updatedData = [...rowDataFlat];
  const target = updatedData.find((r) => r.id === params.data.id);

  // Validate input: should be a number or decimal only
  if (!/^\d*\.?\d*$/.test(input)) {
    toast.error("Invalid input: only numeric values are allowed.");
    target.input = "";
    setRowDataFlat(updatedData);
    return;
  }

  const percentage = parseFloat(input);
  if (!isNaN(percentage)) {
    target.value = Math.round(target.value * (1 + percentage / 100));
    target.variance =
      ((target.value - target.originalValue) / target.originalValue) * 100;

    let newData = [...updatedData];

    if (params.data.parentId) {
      newData = updateParentTotals(newData, target.id);
    } else {
      newData = distributeToChildren(newData, target.id, target.value);
    }

    setRowDataFlat(newData);
    toast.success("Allocated percentage to the category");
  }
};

const handleAllocateValue = (
  params: AllocateCellProps["params"],
  updateParentTotals: AllocateCellProps["updateParentTotals"],
  distributeToChildren: AllocateCellProps["distributeToChildren"],
  setRowDataFlat: AllocateCellProps["setRowDataFlat"],
  rowDataFlat: AllocateCellProps["rowDataFlat"]
) => {
  const input = params.data.input;
  const updatedData = [...rowDataFlat];
  const target = updatedData.find((r) => r.id === params.data.id);

  // Validate input: should be a number or decimal only
  if (!/^\d*\.?\d*$/.test(input)) {
    toast.error("Invalid input: only numeric values are allowed.");
    target.input = "";
    setRowDataFlat(updatedData);
    return;
  }

  const newValue = parseFloat(input);
  if (!isNaN(newValue)) {
    target.value = newValue;
    target.variance =
      ((target.value - target.originalValue) / target.originalValue) * 100;

    let newData = [...updatedData];
    if (params.data.parentId) {
      newData = updateParentTotals(newData, target.id);
    } else {
      newData = distributeToChildren(newData, target.id, newValue);
    }
    setRowDataFlat(newData);
    toast.success("Allocated value to the category");
  }
};

export const AllocatePercentage = memo(
  ({
    params,
    updateParentTotals,
    distributeToChildren,
    setRowDataFlat,
    rowDataFlat,
  }: AllocateCellProps) => {
    return (
      <Button
        size='sm'
        onClick={() =>
          handleAllocate(
            params,
            updateParentTotals,
            distributeToChildren,
            setRowDataFlat,
            rowDataFlat
          )
        }>
        Allocate %
      </Button>
    );
  }
);

export const AllocateValueButton = memo(
  ({
    params,
    updateParentTotals,
    distributeToChildren,
    setRowDataFlat,
    rowDataFlat,
  }: AllocateCellProps) => {
    return (
      <Button
        size='sm'
        onClick={() =>
          handleAllocateValue(
            params,
            updateParentTotals,
            distributeToChildren,
            setRowDataFlat,
            rowDataFlat
          )
        }>
        Allocate Value
      </Button>
    );
  }
);
