import { useEffect, useState } from "react";
import styles from "./Orders.module.css";
import "animate.css";
import LoadingScreen from "../../loadingScreen/LoadingScreen";
import Paging from "../../paging/Paging";
import { basketAPI, orderAPI } from "../../dalUser/userApi";
import OrderCard from "./ordercard/OrderCard";
import { useDispatch } from "react-redux";
import { getBasketItemsCount } from "../../../redux-store/userSlice";
import { useTranslation } from "react-i18next";

const Orders = ({ userId }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [basketList, setBasketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(0);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalCount, setModalCount] = useState(false);
  const [isAnimateDelete, setIsAnimateDelete] = useState(false);
  const [isAnimateCount, setIsAnimateCount] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    LoadBasket(userId, currentPage, perPage);
  }, [currentPage]);

  const LoadBasket = (userId) => {
    basketAPI
      .getUserBasket(currentPage, perPage, userId)
      .then((response) => {
        for (let i = 0; i < response.data.basketList.length; i++) {
          response.data.basketList[i].alertOnCount = false;
          response.data.basketList[i].isIncluded = true;
          response.data.basketList[i].price = response.data.basketList[i]
            .modelInfo.discount
            ? response.data.basketList[i].modelInfo.newPrice
            : response.data.basketList[i].modelInfo.price;
        }
        setBasketList(response.data.basketList);
        setTotal(response.data.total);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setTotalPrice(
      basketList
        .filter((b) => b.isIncluded)
        .reduce((acc, current) => acc + current.count * current.price, 0)
    );
  }, [basketList]);

  const setCount = (basketId, count) => {
    let tmpList = basketList;
    tmpList.find((b) => b.id === basketId).count = parseInt(count);
    setBasketList([...tmpList]);
  };

  const checkBasket = (basketId, checked) => {
    let tmpList = basketList;
    tmpList.find((b) => b.id === basketId).isIncluded = checked;
    setBasketList([...tmpList]);
  };

  const pagingHandler = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteBasketHandle = (id) => {
    setDeleteId(id);
    setModalDelete(true);
    setIsAnimateDelete(true);
  };

  const deleteBasket = () => {
    setLoading(true);
    basketAPI
      .deleteBasket(deleteId)
      .then((response) => {
        if (basketList.length === 1) {
          if (currentPage > 1) setCurrentPage((currentPage) => currentPage - 1);
        } else {
          LoadBasket(userId, currentPage, perPage);
        }
        dispatch(getBasketItemsCount(userId));
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
    closeModalDelete();
  };

  const closeModalDelete = () => {
    setIsAnimateDelete(false);
    setTimeout(() => {
      setModalDelete(false);
    }, 600);
  };

  const closeModalCount = () => {
    setModalCount(false);
    setIsAnimateCount(false);
  };

  const orderBasket = () => {
    if (
      basketList.filter((b) => b.isIncluded && b.count > b.modelInfo.count)
        .length > 0
    ) {
      setModalCount(true);
      setIsAnimateCount(true);
    } else {
      setLoading(true);
      let date = new Date();
      orderAPI
        .addOrder({
          orders: basketList.filter((b) => b.isIncluded),
          totalPrice: totalPrice,
          orderDate: new Date(
            new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          )
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        })
        .then((response) => {
          dispatch(getBasketItemsCount(userId));
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className={styles.block}>
      {loading && <LoadingScreen showGif={true} />}
      <div className={modalDelete ? styles.modal : styles.hide}>
        <div
          className={
            isAnimateDelete
              ? "animate__animated animate__bounceInDown"
              : "animate__animated animate__bounceOutUp"
          }
        >
          <div className={styles.btnGroup}>
            <button className={styles.btn} onClick={deleteBasket}>
              delete
            </button>
            <button className={styles.btn} onClick={closeModalDelete}>
              cancel
            </button>
          </div>
        </div>
      </div>
      <div className={modalCount ? styles.modal : styles.hide}>
        <div
          className={
            isAnimateCount
              ? "animate__animated animate__bounceInDown"
              : "animate__animated animate__bounceOutUp"
          }
        >
          <div className={styles.btnGroup}>
            <div>the quantity you selected exceeds the maximum</div>
            <button className={styles.btn} onClick={closeModalCount}>
              close
            </button>
          </div>
        </div>
      </div>
      {basketList.map((b) => (
        <OrderCard
          basket={b}
          deleteBasket={deleteBasketHandle}
          setCount={setCount}
          checkBasket={checkBasket}
        />
      ))}
      <Paging
        mode="user"
        totalCount={total}
        currentPage={currentPage}
        pageSize={perPage}
        paging={pagingHandler}
      />
      <div className={styles.order}>
        <button type="button" className={styles.btn} onClick={orderBasket}>
          {t("order")}
        </button>
        <div>
          <span className={styles.price}>{t("total")}</span>
          <span className={styles.price}>{totalPrice}&#8382;</span>
        </div>
      </div>
    </div>
  );
};

export default Orders;
