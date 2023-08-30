import React, { useState, useEffect } from "react";
import DotLoader from "react-spinners/DotLoader";
import { Empty } from "antd";

import Card from "../components/home/Card";
import PaidCard from "./../components/lists/PaidCard";
import NotConnected from "../components/NotConnected";

import { useVent } from "../Context";

export default function Lists() {
  const { currentAccount } = useVent();

  return (
    <>
      <h2>Last Paid</h2>
      {currentAccount ? (
        <PaidLists />
      ) : (
        <div
          className="flex-column justify-center align-center"
          style={{ height: "30%" }}
        >
          <NotConnected />
        </div>
      )}
      <h2>Saved Vents</h2>
      {currentAccount ? (
        <SavedVents currentAccount={currentAccount} />
      ) : (
        <div
          className="flex-column justify-center align-center"
          style={{ height: "30%" }}
        >
          <NotConnected />
        </div>
      )}
    </>
  );
}

const SavedVents = React.memo(({ currentAccount }) => {
  const { savedVents, getSavedVents, flag } = useVent();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!flag.lists) {
      setLoading(true);
      getSavedVents().then(() => setLoading(false));
    }
  }, [savedVents]);

  return (
    <>
      {loading ? (
        <div
          className="flex-column justify-center align-center"
          style={{ height: "30%" }}
        >
          <DotLoader size={15} color="blue" />
        </div>
      ) : savedVents && savedVents.length > 0 ? (
        <>
          <div className="events ">
            {savedVents.map((vent) => (
              <Card id={vent.uid} vent={vent} />
            ))}
          </div>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`Sorry, no saved vents yet!`}
        />
      )}
    </>
  );
});

const PaidLists = React.memo(({ currentAccount }) => {
  const { transactionLists, coin } = useVent();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (transactionsLists) {
    //   setLoading(true);
    //   getSavedVents().then(() => setLoading(false));
    // }
  }, [transactionLists]);

  return (
    <>
      {loading ? (
        <div
          className="flex-column justify-center align-center"
          style={{ height: "30%" }}
        >
          <DotLoader size={15} color="blue" />
        </div>
      ) : transactionLists && transactionLists.length > 0 ? (
        <>
          <div className="paid-box">
            {transactionLists.map((transaction) => (
              <>
                <PaidCard
                  tx={transaction}
                  coin={coin(transaction?.toChain)?.coin}
                />
              </>
            ))}
          </div>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`Start pay to vents!`}
        />
      )}
    </>
  );
});
