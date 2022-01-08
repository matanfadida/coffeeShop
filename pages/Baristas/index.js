import { MongoClient } from "mongodb";
import { Fragment, useContext } from "react";
import Barista from "../../components/Baristas/Barista";
import AuthContext from "../../components/state/auth-context";

const baristas = (props) => {
  const ctx = useContext(AuthContext);
  ctx.cleanItemHandler();
  return (
    <Fragment>
      <h1> Hi {ctx.getBaristaName}</h1>
      <Barista
        ordersData={props.ordersData}
        _id={props.id}
        totalAmount={props.totalAmount}
        place={props.place}
        tablesData={props.tablesData}
        idTable={props.idTable}
      />
    </Fragment>
  );
};

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb://matan:matanfadida@cluster0-shard-00-00.u8zmn.mongodb.net:27017,cluster0-shard-00-01.u8zmn.mongodb.net:27017,cluster0-shard-00-02.u8zmn.mongodb.net:27017/coffe-database?ssl=true&replicaSet=atlas-lrttc1-shard-0&authSource=admin&retryWrites=true&w=majority"
  );

  const db = client.db();

  const result = db.collection("orders");

  const ordersData = await result.find().toArray();

  const resultTables = db.collection("tables");

  const tablesData = await resultTables.find().toArray();

  client.close();

  return {
    props: {
      idTable: tablesData[0]._id.toString(),
      tablesData: tablesData.map((table) => table.table),
      place: ordersData.map((data) => data.chair),
      totalAmount: ordersData.map((data) => ({
        totalAmount: data.totalAmount,
      })),
      id: ordersData.map((data) => ({ id: data._id.toString() })),
      ordersData: ordersData.map((data) => ({
        data: data.data,
        vip: data.vip,
      })),
    },
  };
}

export default baristas;
