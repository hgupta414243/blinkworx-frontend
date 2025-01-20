/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

interface iProducts {
  id: number;
  productname: string;
  productdescription: string;
}
interface iNewOrders {
  handleCloseNewOrder: (arg: boolean) => void;
  fetchOrders: () => void;
}
interface iOrders {
  orderDescription: string;
  products: iProducts[];
}
const NewOrders = ({ handleCloseNewOrder, fetchOrders }: iNewOrders) => {
  const [newOrder, setNewOrder] = useState<iOrders>({
    orderDescription: "",
    products: [],
  });
  const [products, setProducts] = useState<iProducts[]>([]);
  const [checkedItems, setCheckedItems] = useState<any>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://blinkworx-backend.onrender.com/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = (product: iProducts, isAdded: boolean) => {
    if (isAdded === true) {
      setNewOrder((prevOrder: any) => {
        console.log("isAdded", isAdded);
        return {
          ...prevOrder,
          products: [...prevOrder.products, product.id],
        };
      });
    }
  };

  const handleBookOrder = async () => {
    try {
      if (newOrder.products.length > 0) {
        await axios.post("https://blinkworx-backend.onrender.com/api/orders", newOrder);
        setNewOrder({ orderDescription: "", products: [] });
        fetchOrders();
        handleCancel();
      } else {
        return;
      }
    } catch (error) {
      console.error("Error booking order:", error);
    }
  };

  const handleCancel = () => {
    setNewOrder({ orderDescription: "", products: [] });
    handleCloseNewOrder(false);
    fetchOrders();
  };

  const handleCheckBox = (product: iProducts, isChecked: boolean) => {
    setCheckedItems((prevState: any) => ({
      ...prevState,
      [product.id]: !prevState[product.id],
    }));
    handleAddProduct(product, isChecked);
  };

  return (
    <div style={{ margin: "0rem 5rem" }}>
      <div style={styles.mainContainerPage}>
        <div style={{ paddingLeft: "1.2rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <h2 style={{ margin: "0px 0px 10px 0px" }}>Create New Order</h2>
            <input
              type="text"
              placeholder="Order Description"
              style={styles.input}
              value={newOrder?.orderDescription}
              onChange={(e) =>
                setNewOrder({ ...newOrder, orderDescription: e.target.value })
              }
            />
          </div>
        </div>
        <div style={styles.cardMainContainer}>
          {products.map((product: iProducts) => (
            <div style={styles.cardContainer}>
              {checkedItems[product.id] ? (
                <MdCheckBox
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "brown",
                  }}
                  onClick={() => handleCheckBox(product, false)}
                />
              ) : (
                <MdCheckBoxOutlineBlank
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => handleCheckBox(product, true)}
                />
              )}
              <div key={product.id} style={styles.cardSubContainer}>
                <span style={styles.productName}>{product.productname}</span>
                <span style={styles.ruler} />
                <div>{product.productdescription}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.btnContainer}>
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleBookOrder} className="submit-btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    alignItems: "center",
  },
  btnContainer: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "flex-end",
  },
  ruler: {
    width: "100%",
    height: "1.2px",
    background: "lightgray",
    margin: "4px 0px",
  },
  cardMainContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  mainContainerPage: {
    display: "flex",
    flexDirection: "column" as const,
    border: "1.5px solid black",
    padding: "1rem",
    borderRadius: "1rem",
  },
  input: { width: "auto", padding: "8px", marginBottom: "1rem" },
  productName: { color: "green", fontSize: "17px", fontWeight: 500 },
  cardContainer: { display: "flex" },
  cardSubContainer: {
    display: "flex",
    flexDirection: "column" as const,
    height: "62px",
    justifyContent: "center",
    alignItems: "baseline",
    width: "100%",
    border: "1.5px solid black",
    padding: "0px 10px",
    borderRadius: "5px",
  },
};

export default NewOrders;
