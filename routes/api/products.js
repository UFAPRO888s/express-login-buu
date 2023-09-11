import express from "express";
const router = express.Router();
import { database, firestore } from "../../firebase.js";
// import "firebase/firestore";
import { collection, getDocs ,query, where, orderBy,limit } from "firebase/firestore";
import { push, ref, set, update, remove, onValue } from "firebase/database";

import { verifyToken } from "./auth.js";

const productCollections = "products/";
const productRef = ref(database, productCollections);

const data_centerRef = collection(firestore, "data_center");

router.get("/", async (req, res) => {
  const mainDocs = [];
  const querySnapshot = await getDocs(collection(firestore, "data_center"));
  querySnapshot.forEach(async (doc) => {
    mainDocs.push({ ...doc.data(), _id: doc.id });
  });
  //console.log(mainDocs)
  res.json(mainDocs);
});

//get single product
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if(!id){return}
  let queryDocs = []
  const qZX = query(data_centerRef, where('categorie_id', '==', id), orderBy("Year"));
  const querySnapshot = await getDocs(qZX);
  querySnapshot.forEach(async (doc) => {
    queryDocs.push({ ...doc.data(), _id: doc.id });
  });
  // const querySnapshot = await getDocs(collection(firestore, "data_center"));
  // const snapshot = await querySnapshot.where('categorie_id', '==', id);
  // if (snapshot.empty) {
  //   console.log('No matching documents.');
  //   return;
 
  console.log(queryDocs);
  res.json(queryDocs);
});


// //get all products
// router.get("/", (req, res) => {
//   onValue(
//     productRef,
//     (snapshot) => {
//       if (snapshot.exists()) {
//         const productList = [];
//         snapshot.forEach((data) => {
//           productList.push({ id: data.key, ...data.val() });
//         });
//         console.log(productList);
//         res.json(productList);
//       } else {
//         res.status(404).send({ error: "product database is Empty" });
//       }
//     },
//     {
//       onlyOnce: true,
//     }
//   );
// });

// //get single product
// router.get("/:id", (req, res) => {
//   const id = req.params.id;
//   onValue(
//     ref(database, productCollections + id),
//     (snapshot) => {
//       if (snapshot.exists()) {
//         console.log(snapshot.val());
//         res.json(snapshot.val());
//       } else {
//         res
//           .status(404)
//           .send({ error: "product does not exit with given id:" + id });
//       }
//     },
//     {
//       onlyOnce: true,
//     }
//   );
// });

//add new product
router.post("/", verifyToken, (req, res) => {
  const product = req.body;
  let errorString = "";

  if (!product.title) errorString += "title is not provided, ";
  if (!product.category) errorString += "category is not provided, ";
  if (!product.price) errorString += "price is not provided";

  if (!errorString) {
    set(push(productRef), product)
      .then(() => res.send({ message: "product Added Successfully" }))
      .catch((error) => {
        console.log(error);
        res.status(500).send({ error: error.message });
      });
  } else {
    res.status(400).send({ error: errorString });
  }
});

//update product
router.put("/:id", verifyToken, (req, res) => {
  const product = req.body;
  const id = req.params.id;

  update(ref(database, productCollections + id), product)
    .then(() => res.send({ message: "product Updated Successfully" }))
    .catch((error) => {
      console.log(err);
      res.status(500).send({ error: error.message });
    });
});

//delete product
router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;

  remove(ref(database, productCollections + id))
    .then(() => res.send({ message: "product Deleted Successfully" }))
    .catch((error) => {
      console.log(err);
      res.status(500).send({ error: error.message });
    });
});

export default router;
