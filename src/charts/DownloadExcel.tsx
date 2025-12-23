import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { SetStateAction, useState } from "react";
import * as XLSX from "xlsx";

interface Columns {
  name: string;
  key: string;
}

const DownloadExcel = (props: any) => {
  const { selectedStudents, filename } = props;

  const filterData = (columns: Columns[], students: any) => {
    let actualColumns = columns.map((column) => {
      return column.key;
    });

    let firstObj: { [key: string]: string } = {};
    if (actualColumns) actualColumns.forEach((key) => (firstObj[key] = "__"));

    let finalData = [];

    if (students.length > 0) {
      finalData = students.map((student: any) => {
        return Object.keys(student)
          .filter((key) => actualColumns.includes(key))
          .reduce((acc: any, key: any) => {
            acc[key] = student[key];
            return acc;
          }, {});
      });
    }
    finalData.unshift(firstObj);
    return finalData;
  };

  const handleDownload = () => {
    const finalData = filterData(selectedColumns, selectedStudents);

    if (selectedStudents.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(finalData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, `${filename}.xlsx`);
    }
  };

  const TableColumns: Columns[] = [
    { name: "Hostel ID", key: "hostelId" },
    { name: "Roll No", key: "rollNo" },
    { name: "Name", key: "name" },
    { name: "College", key: "college" },
    { name: "Year", key: "year" },
    { name: "Branch", key: "branch" },
    { name: "Gender", key: "gender" },
    { name: "Room No", key: "roomNo" },
    { name: "Email", key: "email" },
    { name: "Phone No", key: "phoneNo" },
    { name: "Parent Name", key: "parentName" },
    { name: "Parent PhoneNo", key: "parentPhoneNo" },
    { name: "Status", key: "currentStatus" },
    { name: "Total Requests", key: "requestCount" },
  ];
  const [selectedColumns, setSelectedColumns] = useState<Columns[]>(
    TableColumns.slice(1, 12)
  );

  const onColumnChange = (e: CheckboxChangeEvent) => {
    let _selectedColumns = [...selectedColumns];

    if (e.checked) _selectedColumns.push(e.value);
    else
      _selectedColumns = _selectedColumns.filter(
        (column) => column.key !== e.value.key
      );

    setSelectedColumns(_selectedColumns);
  };

  return (
    <>
      <h4 className="special-font">
        Selected Students :{" "}
        <span className={selectedStudents.length?"text-primary":"text-red-500"} >{selectedStudents.length?selectedStudents.length: "Select atleast one student"}</span>
      </h4>
      <h4 className="special-font">Select Columns :</h4>
      <div className="grid">
        {TableColumns.map((column) => {
          return (
            <div key={column.key} className="col-4 flex align-items-center">
              <Checkbox
                inputId={column.key}
                name="column"
                value={column}
                onChange={onColumnChange}
                checked={selectedColumns.some(
                  (item) => item.key === column.key
                )}
              />
              <label htmlFor={column.key} className="ml-2">
                {column.name}
              </label>
            </div>
          );
        })}

        <div className="flex align-items-center justify-content-end w-11 mt-2">
          <Button label="Download" disabled={selectedStudents.length<1} text raised onClick={handleDownload} />
        </div>
      </div>
    </>
  );
};

export default DownloadExcel;
