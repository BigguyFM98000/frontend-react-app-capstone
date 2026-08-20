import { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { database } from "../firebase";
import { getDocs, collection } from "firebase/firestore";

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const value = collection(database, "Expenses");

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
  }, []);

  return (
    <Fragment>
      <Navbar />

      <h2 className="p-4 pb-2 text-lg opacity-60 tracking-wide">
        All Expenses
      </h2>
      <div className="p-2">
      <ul className="list bg-white rounded-box shadow-md m-2">
       
        {expenses.map((expense) => (
          <li key={expense.id} className="list-row flex flex-row justify-between items-center gap-4 flex-wrap lg:w-full sm:w-1/3 md:w-1/3">
            <div>
              <div className="uppercase text-black">{expense.category}</div>
              <div className="text-md uppercase font-semibold opacity-60 text-black">
                {expense.amount}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <button className="p-2 text-black btn btn-square btn-ghost bg-yellow-300 text-md size-fit">Update</button>
              <button className="p-2 text-black btn btn-square btn-ghost bg-red-600 text-md size-fit">Delete</button>
            </div>
          </li>
        ))}
        
      </ul>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
