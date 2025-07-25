import React from "react";
import "../Visitor/Control_Compu/Control_Compu.css";

/**
 * DataTable component
 * @param {{ columns: { header: string, accessor: string | ((item: any) => React.ReactNode) }[], data: any[] }} props
 */
export default function DataTable({ columns, data }) {
  return (
    <div className="table-container table-scroll">
      <table className="responsive-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => {
                const value =
                  typeof col.accessor === "function"
                    ? col.accessor(item)
                    : item[col.accessor];
                return <td key={colIndex}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
