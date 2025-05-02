import { useState } from "react";
import DataTable from "./components/DataTable";

const App = () => {
  const [rowData, setRowData] = useState([
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      children: [
        {
          id: "phones",
          label: "Phones",
          value: 800,
        },
        {
          id: "laptops",
          label: "Laptops",
          value: 700,
        },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      children: [
        {
          id: "tables",
          label: "Tables",
          value: 300,
        },
        {
          id: "chairs",
          label: "Chairs",
          value: 700,
        },
      ],
    },
  ]);

  return (
    <main className='space-y-10 p-10'>
      <h1 className='text-2xl font-bold'>Lumel Project</h1>
      <div>
        <DataTable data={rowData} />
      </div>
    </main>
  );
};

export default App;
