import React, { useEffect, useState } from "react";

import { Modal, message } from "antd";
import { ClockLoader, ClimbingBoxLoader, CircleLoader } from "react-spinners";

import {
  AxelarGMPRecoveryAPI,
  Environment,
} from "@axelar-network/axelarjs-sdk";

const SDK = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
});

export default function StatusLoader({ transaction, setTransaction }) {
  const [next, setNext] = useState(0);
  const [status, setStatus] = useState("Called_contract");
  const [closable, setClosable] = useState(false);

  useEffect(() => {
    console.log("123", transaction);
    if (transaction.open && transaction.hash) {
      console.log("use");
      var api = setInterval(async () => {
        const res = await loadAxelar();
        console.log("123 res", status);

        if (
          res.status.gasPaidInfo &&
          res.status.gasPaidInfo.status === "gas_paid"
        ) {
          setNext(1);
        }
        if (res.status === "confirmed") {
          setNext(2);
          setClosable(true);
          message.info("You can now close and wait in background");
        }
        if (res.status === "destination_executed") {
          clearInterval(api);
          message.success("Sent successfullly, now confirm!");
          setTransaction({ open: false, hash: "", okay: true });
        }
      }, 20000);
    }

    return () => clearInterval(api);
  }, [transaction]);

  async function loadAxelar() {
    try {
      const res = await SDK.queryTransactionStatus(transaction?.hash);
      console.log("res", transaction.hash);
      if (res) {
        setStatus(res.status);
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Modal
        title={<span>&nbsp;</span>}
        open={transaction?.open}
        // onOk={handleOk}
        footer={null}
        onCancel={() => {
          setTransaction({ open: false, hash: "", okay: true });
        }}
        width={300}
        style={{
          width: "300px",
          height: "fit-content",
        }}
        centered
      >
        <div
          className="flex-column justify-around align-center prevent-select"
          style={{
            minHeight: "150px",
            maxHeight: "400px",
            overflowY: "scroll",
            gap: "1rem",
            overflow: "hidden",
          }}
        >
          {next === 0 ? (
            <ClimbingBoxLoader color={"#65bee6"} loading={true} size={15} />
          ) : next === 1 ? (
            <ClockLoader color={"#000"} loading={true} size={70} />
          ) : (
            <CircleLoader color={"#805af0"} loading={true} size={70} />
          )}
          {/* Cloclloader, circleloader, climbingbox */}
          <h4
            style={{
              textAlign: "center",
            }}
          >
            Your transaction is{" "}
            <a
              href={`https://testnet.axelarscan.io/gmp/${transaction?.hash}`}
              target="_blank"
            >
              Click here
            </a>{" "}
            <br />
            Status:{" "}
            <span
              color={{
                color: next === 0 ? "#000" : next === 1 ? "#65bee6" : "#805af0",
              }}
            >
              {status.toUpperCase()}
            </span>
          </h4>
        </div>
      </Modal>
    </>
  );
}
