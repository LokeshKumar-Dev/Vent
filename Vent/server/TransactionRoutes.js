const express = require("express");
const asyncHandler = require("express-async-handler");

const Transaction = require("./TransactionModel.js");

const transactionRouter = express.Router();

//==================ENTRY ROUTES==================

// POST Entry on transaction model
transactionRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      // get all data of name, amount, date, category, type, description from req.body
      const { from, to, type, name, amount, fromChain, toChain, token, hash } =
        req.body;
      // create a new entry in transaction model
      const data = await Transaction.create({
        from: from.toLowerCase(),
        to,
        type,
        name,
        amount,
        fromChain,
        toChain,
        token,
        hash,
      });

      //send response
      res.status(200).json({
        msg: "inserted Success",
        data,
      });
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  })
);

//by owner
transactionRouter.get(
  "/:owner",
  asyncHandler(async (req, res) => {
    try {
      const { owner } = req.params;
      //find all entries by user id and type of income or expense
      const arr = await Transaction.find({
        from: owner.toLowerCase(),
      }).sort({ createdAt: -1 }); //sort by date in descending order

      //send response
      res.status(200).json({
        msg: "transaction fetch Success",
        transactions: arr,
      });
    } catch (err) {
      res.status(404).json({ msg: err });
    }
  })
);
//Update entry's name, amount, date, category, type, description using id pass in params

//Balance
transactionRouter.put(
  "/balance/:chainName/:uid",
  asyncHandler(async (req, res) => {
    try {
      const { chainName, uid } = req.params;

      const vent = await Transaction.findOne({
        chainName: {
          $regex: chainName,
          $options: "i",
        },
        uid,
      });
      console.log("balance", uid, chainName);
      //Check if transaction exists to avoid error
      if (vent) {
        //if data is not present then use old data
        vent.balance = req.body.balance || vent.balance;
        // console.log(req.body);
        console.log(req.body.balance);
        await vent.save(); //Save

        res.json({
          message: "success",
        });
      } else {
        res.status(404);
        throw new Error("Transaction not found");
      }
    } catch (err) {
      console.log(err);
      res.status(404);
      throw new Error("Transaction not found");
    }
  })
);

transactionRouter.put(
  "/save/:id",
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      console.log("save");
      const vent = await Transaction.findById(id);
      //Check if transaction exists to avoid error
      if (vent) {
        //if data is not present then use old data
        let { address } = req.body;
        address = address.toLowerCase();

        if (!vent.saved.includes(address)) {
          vent.saved.push(address);
        }

        await vent.save(); //Save
        res.json({
          message: "success",
        });
      } else {
        res.status(404);
        throw new Error("Transaction not found");
      }
    } catch (err) {
      console.log(err);
      res.status(404);
      throw new Error("Transaction not found");
    }
  })
);

// // DELETE Entry
// transactionRouter.delete(
//   "/:chainName/:uid",
//   asyncHandler(async (req, res) => {
//     const { chainName, uid } = req.params;

//     Transaction.deleteOne({
//       chainName: {
//         $regex: chainName,
//         $options: "i",
//       },
//       uid,
//     })
//       .then((obj) => {
//         //Checks Deleted by Count
//         return res.status(200).json({
//           msg: "Deleted Success",
//         }); //Deleted
//       })
//       .catch((err) => {
//         res.status(401).json({ msg: err }); //Not Found
//       });
//   })
// );

module.exports = transactionRouter;
