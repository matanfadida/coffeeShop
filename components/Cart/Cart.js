import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import AuthContext from "../state/auth-context";
import Card from "../UI/Card";
import CartItem from "./CartItem";
import Table from "../Clients/Table";
import { getSession } from "next-auth/react";
import ChooesTable from "../Clients/choos-table";

const Cart = (props) => {
  const ctx = useContext(AuthContext);
  const router = useRouter();
  const [sendReq, setSendReq] = useState(false);
  const [sit, setSit] = useState("");
  const [enteredTable, setEnteredTable] = useState(0);
  const [enteredChair, setEnteredChair] = useState(0);
  const table = props.tablesData;
  const current = new Date();

  let place = null;
  let emailUser = "";
  let outsideAvailability = false;
  if (current.getDay() !== 1) {
    outsideAvailability = true;
  }

  getSession().then((session) => {
    if (session) {
      emailUser = session.user.email;
    }
  });

  const totalAmount = `$${ctx.totalAmount.toFixed(2)}`;

  const cartIteamAddHandler = (item) => {};
  const cartIteamRemoveHandler = (id) => {};

  const BackBuyHandler = () => {
    router.push("/Menu");
  };

  const enteredTableHandler = (event) => {
    setEnteredTable(event.target.value);
  };
  const enteredChairHandler = (event) => {
    setEnteredChair(event.target.value);
  };

  const selectSitHandler = (event) => {
    setSit(event.target.value);
  };

  let ShowTable;

  if (sit === "inside") {
    ShowTable = (
      <p>
        {table[0].inside.map((chair, index) => (
          <Table key={index} id={index} chair={chair} />
        ))}
      </p>
    );
  } else if (sit === "outside") {
    ShowTable = (
      <p>
        {table[0].outside.map((chair, index) => (
          <Table key={index} id={index} chair={chair} />
        ))}
      </p>
    );
  }
  const ChangeOrderHandler = async () => {};

  const OrderHandler = async () => {
    if (
      (sit === "inside" &&
        table[0].inside[enteredTable - 1][enteredChair - 1] === 0) ||
      (sit === "outside" &&
        table[0].inside[enteredTable - 1][enteredChair - 1] === 0)
    ) {
      console.log("the chair occupied try other");
      return;
    }
    setSendReq(true);
    if (sit === "inside") {
      table[0].inside[enteredTable - 1][enteredChair - 1] = 0;
      place = {
        sit: "inside",
        table: enteredTable - 1,
        chair: enteredChair - 1,
      };
    } else {
      table[0].outside[enteredTable - 1][enteredChair - 1] = 0;
      place = {
        sit: "outside",
        table: enteredTable - 1,
        chair: enteredChair - 1,
      };
    }
    await fetch("/api/items/table-data", {
      method: "PUT",
      body: JSON.stringify({
        id: props.idTable,
        table: { inside: table[0].inside, outside: table[0].outside },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await fetch("/api/items/order-data", {
      method: "POST",
      body: JSON.stringify({
        chair: {
          sit: sit,
          table: [enteredTable - 1],
          chair: [enteredChair - 1],
        },
        totalAmount: totalAmount,
        data: ctx.dynamicItems,
        user: emailUser,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setSendReq(false);
    ctx.changeOrdersHandler();
    router.push("/Menu");
  };

  const cartItems = (
    <ul>
      {ctx.dynamicItems.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartIteamRemoveHandler.bind(null, item.id)}
          onAdd={cartIteamAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  if (sendReq) {
    return (
      <Card>
        {sendReq && (
          <Fragment>
            <FontAwesomeIcon icon={faSpinner} size="2x" spin={true} />
            <br />
            <br />
            <label>Sending Order To Baristas..</label>
          </Fragment>
        )}
      </Card>
    );
  }
  return (
    <Card>
      {cartItems}
      <div>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      <div>
        {!ctx.baristaChange && <button onClick={BackBuyHandler}>Close</button>}
        {ctx.baristaChange && (
          <ChooesTable
            ordersData={ctx.dynamicItems}
            totalAmount={totalAmount}
            id={ctx.getOrderId}
            tablesData={props.tablesData}
            idTable={props.idTable}
            place={ctx.place}
          />
        )}
        {!ctx.baristaChange && (
          <Fragment>
            {ctx.ordered ? (
              <button onClick={OrderHandler}>chenge Order</button>
            ) : (
              <button onClick={OrderHandler}>Order</button>
            )}
            <br />
            {!ctx.ordered && (
              <Fragment>
                <label>Where Sit?</label>
                <select name="sit" id="sit" onChange={selectSitHandler}>
                  <option value="all">All</option>
                  <option value="inside">inside</option>
                  {outsideAvailability && (
                    <option value="outside">outside</option>
                  )}
                </select>
                {!outsideAvailability && (
                  <>
                    <br />
                    <label>Sitting outside not available</label>
                  </>
                )}
                <br />
                <label>open to sit</label>
                {ShowTable}
              </Fragment>
            )}

            <br />
            <span>choose a table</span>
            <input type="number" onChange={enteredTableHandler} />
            <br />
            <span>choose a Chair</span>
            <input type="number" onChange={enteredChairHandler} />
          </Fragment>
        )}
      </div>
    </Card>
  );
};

export default Cart;
