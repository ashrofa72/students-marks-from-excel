import { useState, useEffect } from 'react';
import * as ExcelJS from 'exceljs';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Main() {
  const [excelFiles, setExcelFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]); // All loaded data
  const [filteredTableData, setFilteredTableData] = useState([]); // Data filtered by classroom
  const [classrooms, setClassrooms] = useState([]); // Unique list of classrooms
  const [selectedClassroom, setSelectedClassroom] = useState(''); // Selected classroom
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch Excel files from the public directory
    const fetchExcelFiles = async () => {
      try {
        const response = await fetch('/api/excel-files');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExcelFiles(data.files);
      } catch (error) {
        console.error('Failed to fetch Excel files:', error);
      }
    };

    fetchExcelFiles();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.value);
  };

  const handleLoadExcelData = async () => {
    if (!selectedFile) {
      alert('Please select an Excel file.');
      return;
    }

    try {
      const response = await fetch(`/api/excel-data?file=${selectedFile}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Extract unique classrooms from the loaded data
      const uniqueClassrooms = [...new Set(data.data.map(row => row.Classroom))];
      setClassrooms(uniqueClassrooms);

      // Reset classroom selection and filtered data
      setSelectedClassroom('');
      setTableData(data.data); // Store all data
      setFilteredTableData([]); // Clear filtered data
    } catch (error) {
      console.error('Failed to load Excel data:', error);
      alert('Failed to load Excel data. Please check the console for details.');
    }
  };

  const handleClassroomSelect = (event) => {
    const classroom = event.target.value;
    setSelectedClassroom(classroom);

    // Filter data based on the selected classroom
    if (classroom) {
      const filteredData = tableData.filter(row => row.Classroom === classroom);
      setFilteredTableData(filteredData);
    } else {
      setFilteredTableData([]); // Clear filtered data if no classroom is selected
    }
  };

  const handlePrintTable = () => {
    window.print();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="text-right mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">برنامج درجات الطالبات</h1>
        {user && (
          <div>
            <span>Welcome, {user.email}</span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={handleSignOut}
            >
              نسجيل الخروج
            </button>
          </div>
        )}
      </div>

      {/* File Selection */}
      <div className="text-right mb-4">
        <label htmlFor="excelFile" className="block text-gray-700 text-sm font-bold mb-2">
         اختر ملف الأكسيل
        </label>
        <select
          id="excelFile"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleFileSelect}
          value={selectedFile || ''}
        >
          <option value="" disabled>Select a file</option>
          {excelFiles.map((file) => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          onClick={handleLoadExcelData}
        >
          تحميل البيانات
        </button>
      </div>

      {/* Classroom Selection */}
      {tableData.length > 0 && (
        <div className="text-right mb-4">
          <label htmlFor="classroom" className="block text-gray-700 text-sm font-bold mb-2">
           اخنر الفصل
          </label>
          <select
            id="classroom"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleClassroomSelect}
            value={selectedClassroom}
          >
            <option value="">All Classrooms</option>
            {classrooms.map((classroom) => (
              <option key={classroom} value={classroom}>{classroom}</option>
            ))}
          </select>
        </div>
      )}

      {/* Table Display */}
      {(filteredTableData.length > 0 || tableData.length > 0) && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-400 text-center">
            <thead>
              <tr>
                {Object.keys(tableData[0] || {}).map((header) => (
                  <th key={header} className="border border-gray-400 px-4 py-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(selectedClassroom ? filteredTableData : tableData).map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-400 px-4 py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Button */}
      {(filteredTableData.length > 0 || tableData.length > 0) && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={handlePrintTable}
        >
          طباعة الجدول
        </button>
      )}
    </div>
  );
}