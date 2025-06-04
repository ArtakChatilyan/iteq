// import { Link, Navigate, useNavigate } from "react-router-dom";
// import Paging from "../../paging/Paging";
// import DataAdd from "./DataAdd";
// import styles from "./DataView.module.css";
// import { category, subCategory } from "./categories/categories";
// import { categoryAPI } from "../dal/api";

// const DataView = ({
//   contentId,
//   data,
//   totalCount,
//   pageSize,
//   currentPage,
//   onPaging,
// }) => {
//   const navigate = useNavigate();
//   const properties = [];

//   switch (contentId) {
//     case "main":
//       for (let prop in category) properties.push(category[prop]);
//       break;
//     case "sub":
//       for (let prop in subCategory) properties.push(subCategory[prop]);
//       break;
//   }

//   const deleteItem = (id) => {
//     // categoryAPI.deleteCategory(id).then((data) => {
//     //   console.log(data);
//     //   window.location.reload(false);
//     // });
//   };

//   return (
//     <div className={styles.data}>
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             {properties.map((p) => {
//               if (p.public) return <th>{p.view}</th>;
//             })}
//             <th></th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.length > 0 ? (
//             data.map((d) => (
//               <tr className={styles.item}>
//                 <td>{d.nameEn}</td>
//                 <td>{d.nameGe}</td>
//                 <td>{d.nameRu}</td>
//                 <td>
//                   <img src={d.imgUrl} className={styles.img} />
//                 </td>

//                 <td>
//                   <Link
//                     to={`/admin/edit/${contentId}/${d.id}`}
//                     className={styles.btn}
//                   >
//                     edit
//                   </Link>
//                 </td>
//                 <td>
//                   <button
//                     className={styles.btn}
//                     onClick={() => deleteItem(d.id)}
//                   >
//                     delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td>no data to preview</td>
//             </tr>
//           )}
//         </tbody>
//         <tfoot>
//           <tr>
//             <td>
//               <Link
//                 to={`/admin/add/${contentId}`}
//                 style={{ textDecoration: "underline", color: "#7dacee" }}
//               >
//                 add
//               </Link>
//             </td>
//             <td colSpan={6}>
//               <div style={{ textAlign: "right" }}>
//                 <Paging
//                   totalCount={totalCount}
//                   currentPage={currentPage}
//                   pageSize={pageSize}
//                   paging={onPaging}
//                 />
//               </div>
//             </td>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// };

// export default DataView;
