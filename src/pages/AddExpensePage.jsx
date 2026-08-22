import { Fragment, useState } from "react";
import Navbar from "../components/Navbar";
import { database, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";

const AddExpensePage = () => {
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const value = collection(database, "Expenses");
  const [success, setSuccess] = useState("");
  const { LogOut } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if(!user) {
      setError("User not signed in, please sign in");
      console.log("User not signed in");
      await LogOut();
      return;
    }

    try {
      await addDoc(value, {userId: user.uid, amount: Number(amount), category: category, date: date});
      setSuccess("Expense saved successfully");
      console.log("Expense saved successfully");
    } catch (error) {
      setError(error.message);
      console.error("Error saving expense:", error);
    }

    setTimeout(() => {
      setError("");
      setSuccess("");
      setAmount("");
      setCategory("");
      setDate("");
    }, 3000);
    
  };

  return (
    <Fragment>
      <Navbar />

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-col lg:w-full">
          <h1 className="text-2xl">Add Expense Form</h1>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <form className="mt-4 mb-4" onSubmit={handleSubmit}>
                  <label className="label text-lg">Amount</label>
                  <input type="number" className="input" placeholder="0.00" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>

                  <label className="label text-lg">Category</label>
                  <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="" disabled={true}>Enter a category</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>

                  <label className="label text-lg">Date</label>
                  <input type="date" placeholder="Enter here" className="input" value={date} onChange={(e) => setDate(e.target.value)}/>

                  <button className="btn btn-neutral mt-4 w-full" type="submit">
                    Submit
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

export default AddExpensePage;
