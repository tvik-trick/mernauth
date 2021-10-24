import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const history = useHistory();
  const [quote, setQuote] = useState(" ");
  const [tempquote, setTempquote] = useState(" ");
  async function populationquote() {
    const response = await fetch("/api/quote", {
      headers: {
        "Content-Type": "application/json",

        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (data.status == "ok") {
      setQuote(data.quote);
    } else {
      alert(data.error);
    }
    console.log(data);
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        history.replace("/login");
      } else {
        populationquote();
      }
    }
  }, []);

  async function updatequote(event) {
    event.preventDefault();
    const req = await fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempquote,
      }),
    });
    const data = await req.json();
    if (data.status == "ok") {
      setQuote(tempquote);
      setTempquote("");
    } else {
      alert(data.error);
    }
  }

  return (
    <div>
      <h1> your Quote :{quote || "no quote found "} </h1>
      <form onSubmit={updatequote}>
        <input
          type="text"
          placeholder="quote"
          value={tempquote}
          onChange={(e) => setTempquote(e.target.value)}
        />
        <input type="submit" value="update quote" />
      </form>
    </div>
  );
};

export default Dashboard;
