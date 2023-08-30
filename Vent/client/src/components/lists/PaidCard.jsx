import React, { useState, useEffect } from "react";
import _Image from "../_Image";
import { GoArrowUpRight, GoArrowSwitch, GoArrowBoth } from "react-icons/go";

import dayjs from "dayjs";
import { ethers } from "ethers";

export default function PaidCard({ tx, coin }) {
  return (
    <>
      <div className="paid">
        <div className="flex-row align-center">
          {/* <_Image logo={"avax.network"} alt={"Avalanche"} /> */}
          <div id="box">
            {tx?.type === "send" && <GoArrowUpRight />}
            {tx?.type === "cross" && <GoArrowBoth />}
            {tx?.type === "swap" && <GoArrowSwitch />}
            {/* <GoArrowSwitch /> */}
            {/* <GoArrowBoth /> */}
          </div>
          <h4 className="paid__name">{tx?.name}</h4>
        </div>
        <p className="paid__type">
          <div
            className="paid__type-box coin"
            style={{ borderColor: tx?.token ? "#ddb849" : "#4352d7" }}
          >
            <div
              className="dot"
              style={{ backgroundColor: tx?.token ? "#ddb849" : "#4352d7" }}
            ></div>
          </div>
          {tx?.token ? "aUSDC" : coin?.toUpperCase()}
        </p>
        <h6 className="paid__from">
          From
          <p className="paid__from-address">
            {tx?.from.toString().slice(0, 7)}
            .....
            {tx?.from.toString().slice(-5)}
          </p>
        </h6>
        <h6 className="paid__from">
          To
          <p className="paid__from-address">{tx?.to}</p>
        </h6>
        <p className="paid__time">
          {dayjs(tx?.createdAt || Date.now()).format("DD MMM, YY")}
        </p>
        <Amount amount={tx?.amount} token={tx?.token} coin={coin} />

        <div className="btn" style={{ width: "200px" }}>
          {tx?.type !== "send" && <CheckStatus hash={tx?.hash} />}
        </div>
      </div>
    </>
  );
}

import { Button, Tooltip } from "antd";
const Amount = React.memo(({ amount, token, coin }) => {
  const { formatUnits } = ethers.utils;
  const [_amount, setAmount] = useState();

  useEffect(() => {
    if (amount) {
      if (token) {
        setAmount(formatUnits(amount.toString(), "mwei").toString());
        return;
      }
      setAmount(formatUnits(amount.toString(), "ether").toString());
    }
  }, []);
  return (
    <Tooltip title={`${amount}`}>
      <h6 className="paid__amount">
        {parseFloat(_amount).toFixed(2)}
        <span> {token ? "ausdc" : coin.toLowerCase()}</span>
      </h6>
    </Tooltip>
  );
});

import {
  AxelarGMPRecoveryAPI,
  Environment,
} from "@axelar-network/axelarjs-sdk";

const SDK = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
});

const CheckStatus = React.memo(({ hash }) => {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);
  async function loadAxelar() {
    try {
      setLoading(true);
      const res = await SDK.queryTransactionStatus(hash);
      console.log("res", hash, res);
      if (res) {
        setStatus(res.status);
        setLoading(false);
      }
      return res;
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div style={{ marginLeft: "auto", color: "black" }}>
      {status ? (
        <h5 style={{ fontWeight: "400", cursor: "default" }}>{status}</h5>
      ) : (
        <Button onClick={loadAxelar} loading={loading}>
          Get Status
        </Button>
      )}
    </div>
  );
});
