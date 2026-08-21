import { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { database } from "../firebase";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const value = collection(database, "Expenses");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getDocs(value);

        setExpenses(
          response.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        );
        console.log(expenses);
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();
  }, [expenses]);

  const handleDelete = async (expenseId) => {
    const deleteValue = doc(database, "Expenses", expenseId);
    await deleteDoc(deleteValue);
  };

  return (
    <Fragment>
      <Navbar />

      <h2 className="p-4 pb-2 text-lg opacity-60 tracking-wide">
        All Expenses
      </h2>
      <div className="p-2">
        <ul className="list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-base-200 shadow-md mb-2 overflow-y-scroll">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="list-row w-full p-4 flex flex-row justify-between items-center border-4 border-solid border-black bg-white"
            >
              <div>
                <div className="uppercase text-black">{expense.category}</div>
                <div className="text-md uppercase font-semibold opacity-60 text-black">
                  {expense.amount}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <button
                  onClick={() => navigate(`/update/${expense.id}`)}
                  className="p-2 text-black btn btn-square btn-ghost bg-yellow-300 text-md size-fit"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="p-2 text-black btn btn-square btn-ghost bg-red-600 text-md size-fit"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
