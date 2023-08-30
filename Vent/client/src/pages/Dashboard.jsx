import React, { useEffect, useState } from "react";
import { Button, Empty, Select } from "antd";
import DotLoader from "react-spinners/DotLoader";

import Card from "../components/home/Card";
import OwnCard from "../components/dashboard/OwnCard";
import { GoPlus } from "react-icons/go";
import { useVent } from "../Context";
import NotConnected from "../components/NotConnected";

export default function Dashboard({}) {
  const {
    handleSidebar,
    handleSidebar2,
    getOwnerVents,
    handleModal,
    currentAccount,
    flag,
    ownVents,
  } = useVent();

  useEffect(() => {
    if (flag.dashboard || !currentAccount) return;

    getOwnerVents(currentAccount);
  }, [currentAccount]);

  console.log("Dashboard", currentAccount, ownVents);
  return (
    <>
      {/* Filter section */}
      <div className="flex-row filters-box">
        {/* Title */}
        <h2 onClick={() => handleSidebar2(true)}>Your Vents</h2>
        {/* Filter Buttons */}
        {/* <button className="ml-a btn btn--secondary btn--secondary">
          By date
        </button>
        <button className="btn btn--secondary btn--secondary">By date</button>
        <button className="btn btn--secondary btn--secondary-active">
          By date
        </button> */}

        {/* Create Button */}
        <button
          className="ml-a btn btn--highlight btn--create"
          onClick={() => currentAccount && handleModal(true, "Add")}
        >
          Create new vent <GoPlus />
        </button>
      </div>
      {!currentAccount ? (
        <>
          <div
            className="flex-column align-center justify-center"
            style={{ height: "33%", fontSize: "1.3rem" }}
          >
            <NotConnected />
          </div>
        </>
      ) : ownVents && ownVents.length > 0 ? (
        <div className="events events-box">
          {ownVents.map((vent) => (
            <OwnCard
              id={vent.uid}
              handleSidebar={handleSidebar}
              handleSidebar2={handleSidebar2}
              vent={vent}
            />
          ))}
        </div>
      ) : (
        <Empty
          className="flex-column justify-center align-center"
          style={{ height: "40%", marginTop: "2rem" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`Sorry, no vents created yet!`}
        />
      )}
      <h2>Joined Vents</h2>
      {currentAccount ? (
        <JoinedVents />
      ) : (
        <>
          <div
            className="flex-column align-center justify-center"
            style={{ height: "30%" }}
          >
            <NotConnected />
          </div>
        </>
      )}
    </>
  );
}

const JoinedVents = ({}) => {
  const {
    flag,
    flagJoined,
    constants,
    currentNetwork,
    Contract,
    joinedVents,
    getJoinedVents,
    switchNetwork,
  } = useVent();
  const { networks } = constants;

  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState("");

  async function _getjoined() {
    setLoading(true);
    await getJoinedVents();
    setLoading(false);
  }

  useEffect(() => {
    if (selectedChain !== currentNetwork) {
      setSelectedChain(currentNetwork);
    }
  }, [currentNetwork]);

  useEffect(() => {
    if (Contract && !flag.lists_joined) _getjoined();
  }, [Contract, flag, currentNetwork]);

  return (
    <>
      <div className="flex-row align-center" style={{ gap: "1rem" }}>
        <Select
          value={selectedChain}
          defaultValue={selectedChain.toLowerCase()}
          style={{
            width: "150px",
          }}
          onChange={(e) => {
            setSelectedChain(e);
            if (e.toLowerCase() === currentNetwork.toLowerCase())
              return flagJoined(true);

            flagJoined(false);
          }}
          options={networks.map((e) =>
            e.value !== currentNetwork
              ? e
              : { ...e, label: `${e.label}  (active)` }
          )}
        />
        <Button
          className="btn btn--primary"
          disabled={
            currentNetwork.toLowerCase() === selectedChain.toLowerCase()
          }
          style={{
            // width: "100px",
            padding: "0 1rem",
            fontSize: ".8rem",
            fontWeight: "700",
          }}
          onClick={() => switchNetwork(selectedChain)}
        >
          Switch Network
        </Button>
      </div>
      {loading ? (
        <div
          className="flex-column justify-center align-center"
          style={{ height: "30%" }}
        >
          <DotLoader size={30} color="blue" />
        </div>
      ) : joinedVents && joinedVents.length > 0 ? (
        <>
          <div className="events events-box" style={{ marginTop: "2rem" }}>
            {joinedVents.map((vent) => (
              <Card id={vent.uid} vent={vent} />
            ))}
          </div>
        </>
      ) : (
        <Empty
          style={{ height: "40%" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`Sorry, there is no vents you joined in this chain!`}
        />
      )}
    </>
  );
};
