import { Fragment, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase";

const UpdateExpensePage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");

  useEffect(() =>{
    const getExpense = async () => {
      try {
        const expenseRef = doc(database, "Expenses", id);
        const expenseSnapshot = await getDoc(expenseRef);
        if(expenseSnapshot.exists()){
          const expenseData = {id: expenseSnapshot.id, ...expenseSnapshot.data()};
          setExpense(expenseData);
          setUpdatedAmount(expenseData.amount ?? "");
          setUpdatedCategory(expenseData.category ?? "");
          setUpdatedDate(expenseData.date ?? "");
        }
      } catch (error) {
        console.log("Error occured: ", error.message);
      }
    }
    getExpense();
  }, [id])

  if(!expense) {
    return <h1><span className="loading loading-spinner loading-xl"></span></h1>
  }

  const handleUpdate = async (event) => {
    event.preventDefault();
    const expenseRef = doc(database, "Expenses", id);

    try {
      await updateDoc(expenseRef, {amount: updatedAmount, category: updatedCategory, date: updatedDate});
      setSuccess("Expense updated successfully");
      setTimeout(()=>{
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      setError("Error while updating: ", error.message);
      console.log("Error while updating: ", error.message);
    }
  }

  return (
    <Fragment>
      <Navbar />

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-col lg:w-full">
          <h1 className="text-2xl">Update Expense Form</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form className="mt-4 mb-4" onSubmit={handleUpdate}>
                  <label className="label text-lg">Amount</label>
                  <input type="number" className="input" placeholder="0.00" name="amount" value={updatedAmount} onChange={(e) => setUpdatedAmount(e.target.value)}/>

                  <label className="label text-lg">Category</label>
                  <select className="select" value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)}>
                    <option value="" disabled={true}>Enter a category</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>

                  <label className="label text-lg">Date</label>
                  <input type="date" placeholder="Enter here" className="input" value={updatedDate} onChange={(e) => setUpdatedDate(e.target.value)}/>

                  <button className="btn btn-neutral mt-4 w-full" type="submit">
                    Update
                  </button>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateExpensePage;
