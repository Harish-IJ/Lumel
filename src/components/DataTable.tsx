import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ValueFormatterParams,
} from "ag-grid-community";
import { useCallback, useState } from "react";
import { AllocatePercentage, AllocateValueButton } from "./cell-components";

ModuleRegistry.registerModules([AllCommunityModule]);

type CategoryNode = {
  id: string;
  label: string;
  value: number;
  children?: CategoryNode[];
};

const DataTable = ({ data }: { data: CategoryNode[] }) => {
  const [rowDataFlat, setRowDataFlat] = useState(flattenTree(data));
  const updateParentTotals = useCallback((updatedData, childId) => {
    const child = updatedData.find((row) => row.id === childId);
    if (!child || !child.parentId) return updatedData;

    const parent = updatedData.find((row) => row.id === child.parentId);
    const siblings = updatedData.filter(
      (row) => row.parentId === child.parentId
    );

    parent.value = siblings.reduce((acc, row) => acc + row.value, 0);
    parent.variance =
      ((parent.value - parent.originalValue) / parent.originalValue) * 100;

    return updateParentTotals(updatedData, parent.id);
  }, []);

  const distributeToChildren = useCallback(
    (updatedData, parentId, newValue) => {
      const parent = updatedData.find((row) => row.id === parentId);
      const children = updatedData.filter((row) => row.parentId === parentId);
      const totalOld = children.reduce((acc, row) => acc + row.value, 0);

      const multiplier = totalOld > 0 ? newValue / totalOld : 1;
      children.forEach((child) => {
        child.value = Math.round(child.value * multiplier);
        child.variance =
          ((child.value - child.originalValue) / child.originalValue) * 100;
        updatedData = distributeToChildren(updatedData, child.id, child.value); // go deeper
      });

      parent.value = newValue;
      parent.variance =
        ((newValue - parent.originalValue) / parent.originalValue) * 100;
      return updatedData;
    },
    []
  );

  const [colDefs, setColDefs] = useState([
    {
      field: "label",
      headerName: "Label",
      cellClass: (params) => {
        if (params.data.parentId) return ["!pl-8"];
      },
    },
    { field: "value", headerName: "Value" },
    { field: "input", headerName: "Input", editable: true },
    {
      field: "allocation_percentage",
      headerName: "Allocation %",
      cellRenderer: (params) => {
        return (
          <AllocatePercentage
            params={params}
            rowDataFlat={rowDataFlat}
            setRowDataFlat={setRowDataFlat}
            distributeToChildren={distributeToChildren}
            updateParentTotals={updateParentTotals}
          />
        );
      },
    },
    {
      field: "allocation_val",
      headerName: "Allocation Value",
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <AllocateValueButton
            params={params}
            rowDataFlat={rowDataFlat}
            setRowDataFlat={setRowDataFlat}
            distributeToChildren={distributeToChildren}
            updateParentTotals={updateParentTotals}
          />
        );
      },
    },
    {
      field: "variance",
      headerName: "Variance %",
      valueFormatter: (params: ValueFormatterParams) =>
        `${(params.value ?? 0).toFixed(2)}%`,
    },
  ]);

  return (
    <div style={{ height: 500 }}>
      <AgGridReact rowData={rowDataFlat} columnDefs={colDefs} />
    </div>
  );
};

function flattenTree(data, parentId = null, level = 0) {
  return data.reduce((acc, item) => {
    const { children, ...rest } = item;
    const flatItem = {
      ...rest,
      parentId,
      level,
      input: null,
      allocation_percentage: null,
      allocation_val: null,
      variance: null,
      originalValue: rest.value,
    };

    acc.push(flatItem);

    if (children && children.length > 0) {
      acc.push(...flattenTree(children, item.id, level + 1));
    }

    return acc;
  }, []);
}

export default DataTable;
