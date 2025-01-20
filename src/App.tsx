import React, { useState, useEffect } from "react";
import axios from "axios";
import NewOrders from "./NewOrders";
import "./index.css";
import { MdEditNote } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";

interface iOrders {
  id: number;
  orderdescription: string;
  createdat: string;
  productcount: string;
}

const App = () => {
  const [orders, setOrders] = useState<iOrders[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewOrder, setIsNewOrder] = useState<boolean>(false);
  const [cartProducts, setCartProducts] = useState<number>(0);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://blinkworx-backend.onrender.com/api/order");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      const response = await axios.delete(
        `https://blinkworx-backend.onrender.com/api/orders/${id}`
      );
      if (response) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm !== "") {
      const filterData = orders?.filter(
        (order: iOrders) =>
          order?.id.toString().includes(searchTerm) ||
          order?.orderdescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      if (filterData.length > 0) {
        setOrders(filterData);
      } else {
        setOrders([]);
      }
    } else {
      fetchOrders();
    }
  }, [searchTerm]);

  useEffect(() => {
    const total = orders.reduce(
      (acc, order) =>
        acc + Number(order?.productcount ? order?.productcount : ""),
      0
    );
    setCartProducts(Number(total));
  }, [orders]);

  const convertDate = (dateString: string) => {
    const date = new Date(dateString);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleOpenNewOrder = () => {
    setIsNewOrder(true);
  };

  const handleCloseNewOrder = () => {
    setIsNewOrder(false);
  };

  const renderUi = () => {
    if (!isNewOrder) {
      return (
        <>
          <div style={styles.orderContainer}>
            <h1 style={{ fontSize: "22px" }}>Order Management</h1>
            <div style={{ position: "relative" }}>
              <span style={styles.cart}>{cartProducts}</span>
              <FaCartShopping style={styles.cartIcon} />
            </div>
            <input
              type="text"
              placeholder="Search by Order Description"
              value={searchTerm}
              onChange={handleSearch}
              style={styles.input}
            />
            <button onClick={handleOpenNewOrder} className="add-order">
              <FaPlusCircle
                style={{ color: "green", fontSize: "14px", marginRight: "7px" }}
              />
              New Order
            </button>
          </div>
          {orders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Description</th>
                  <th>Count of Products</th>
                  <th>Created At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order: iOrders) => (
                  <tr key={order?.createdat}>
                    <td>{order?.id}</td>
                    <td>{order?.orderdescription}</td>
                    <td>{order?.productcount}</td>
                    <td>{convertDate(order?.createdat)}</td>
                    <td>
                      <div style={{ display: "flex" }}>
                        <MdEditNote style={styles.edit} />
                        <FaTrash
                          onClick={() => deleteOrder(order?.id)}
                          style={styles.delete}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: "10px", textAlign: "center" }}>
              No Records
            </div>
          )}
        </>
      );
    } else {
      return (
        <NewOrders
          handleCloseNewOrder={handleCloseNewOrder}
          fetchOrders={fetchOrders}
        />
      );
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", margin: "5rem 10rem" }}
    >
      {renderUi()}
    </div>
  );
};

const styles = {
  cart: {
    position: "absolute" as const,
    right: "-5px",
    bottom: "20px",
    background: "red",
    color: "white",
    width: "15px",
    display: "flex",
    justifyContent: "center",
    borderRadius: "100%",
    fontSize: "11px",
    height: "15px",
  },
  cartIcon: {
    color: "gray",
    marginLeft: "22px",
    fontSize: "25px",
    cursor: "pointer",
  },
  orderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: { padding: "5px", width: "270px", marginLeft: "22px" },
  edit: {
    fontSize: "18px",
    marginRight: "4px",
    cursor: "pointer",
  },
  delete: { fontSize: "16px", cursor: "pointer" },
};

export default App;
