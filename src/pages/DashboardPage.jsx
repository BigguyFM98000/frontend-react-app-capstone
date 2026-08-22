import { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { database } from "../firebase";
import { getDocs, collection, doc, deleteDoc, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUserAuth();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      if (!user?.uid) {
        setExpenses([]);
        setIsLoading(false);
        return;
      }

      try {
        const expensesQuery = query(
          collection(database, "Expenses"),
          where("userId", "==", user.uid),
        );
        const response = await getDocs(expensesQuery);

        setExpenses(
          response.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        );
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [user?.uid]);

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
          {isLoading || expenses.length === 0 ? (
            <li className="list-row w-full p-4 text-center">
              No expenses added. Click Add Expense to add an expense
            </li>
          ) : expenses.map((expense) => (
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
