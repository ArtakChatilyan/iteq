import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderAPI } from "../../../dalUser/userApi";

const Orders = () => {
  const { clientId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) LoadOrders(clientId, currentPage, perPage);
  }, [currentPage, clientId]);

  const LoadOrders = (clientId) => {
    orderAPI
      .getUserOrders(currentPage, perPage, clientId)
      .then((response) => {
        setOrderList(response.data.basketList);
        setTotal(response.data.total);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return <div></div>;
};

export default Orders;
