import axios from "axios";
import data from "@/orders.json";
import { AVAILABILITY_CHECK_URL } from "@/constants";
import { sleep } from "@/utils";

const ordersService = () => {
  const orders = data;

  const checkOrdersAvailability = async () => {
    try {
      const { data } = await axios.get(AVAILABILITY_CHECK_URL);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
  
  const createOrder = (order) => {
    orders.unshift(order);
  }

  const getOrders = async () => {
    const data = await checkOrdersAvailability();
    if(data?.success) {
      return orders;
    }
    return null;
  };

  const getOrder = async (id) => {
    const index = orders.findIndex((td) => td.id === id);
    if (index === -1) throw new Error("Bad request");
    await sleep();
    return orders[index];
  };

  const updateOrder = (order) => {
    const index = orders.findIndex((td) => td.id === order.id);
    if (index === -1) throw new Error("Bad request");
    orders[index] = order;
  };

  const deleteOrder = async (id) => {
    const index = orders.findIndex((td) => td.id === id);
    if (index === -1) throw new Error("Bad request");
    await sleep();
    orders.splice(index, 1);
  };

  return { createOrder, getOrders, getOrder, updateOrder, deleteOrder };
};

export default ordersService();
