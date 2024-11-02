// app/routes/index.tsx
import React, { useState } from "react";

//correct imports
import BartenderInput from "../components/BartenderInput";
import TipCalculationDisplay from "../components/TipCalculationDisplay";

export default function Index() {
  // Initialize state with two default bartenders and empty input fields
  const [bartenders, setBartenders] = useState([
    { name: "", creditTips: "" },
    { name: "", creditTips: "" },
  ]);
  const [cashTips, setCashTips] = useState<string>(""); // Empty string for cashTips input
  const [isCalculated, setIsCalculated] = useState(false);
  interface Result {
    busserTipOut: number;
    busserTipOutSource: string;
    targetShare: number;
    bartenderBalances: {
      name: string;
      creditTips: number;
      cashReceived: number;
      zelleReceived: number;
      zelleSent: number;
      finalShare: number;
      adjustmentNeeded: number;
    }[];
    zelleTransfers: {
      from: string;
      to: string;
      amount: number;
    }[];
  }

  const [results, setResults] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCashTipsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashTips(e.target.value);
  };

  const addBartender = () => {
    setBartenders([...bartenders, { name: "", creditTips: "" }]);
  };

  const removeBartender = (index: number) => {
    setBartenders(bartenders.filter((_, i) => i !== index));
  };

  const updateBartender = (index: number, name: string, creditTips: string) => {
    const updatedBartenders = bartenders.map((bartender, i) =>
      i === index ? { name, creditTips } : bartender,
    );
    setBartenders(updatedBartenders);
  };

  const handleCalculate = () => {
    // Convert cashTips and creditTips to numbers for calculations, defaulting to 0 if empty
    const parsedCashTips = parseFloat(cashTips) || 0;
    const parsedBartenders = bartenders.map((b) => ({
      name: b.name,
      creditTips: parseFloat(b.creditTips) || 0,
    }));

    // Validation
    if (parsedBartenders.some((b) => b.name === "" || b.creditTips < 0)) {
      setErrorMessage("I need bartenders names bruh");
      return;
    }

    // Clear error message if validation passes
    setErrorMessage("");

    const totalTips =
      parsedCashTips +
      parsedBartenders.reduce((sum, b) => sum + b.creditTips, 0);
    const busserTipOut = totalTips * 0.1;
    const distributableTips = totalTips - busserTipOut;
    const targetShare = distributableTips / parsedBartenders.length;

    const bartenderBalances = parsedBartenders.map((bartender) => ({
      name: bartender.name,
      creditTips: bartender.creditTips,
      cashReceived: 0,
      zelleReceived: 0,
      zelleSent: 0,
      finalShare: bartender.creditTips,
      adjustmentNeeded: targetShare - bartender.creditTips,
    }));

    let remainingCashTips = parsedCashTips;
    let busserTipOutSource = "Cash";

    // Allocate cash tips first for busser tip-out, then to bartenders
    if (remainingCashTips >= busserTipOut) {
      remainingCashTips -= busserTipOut;
    } else {
      busserTipOutSource = `${parsedBartenders[0].name}`;
      bartenderBalances[0].zelleSent += busserTipOut;
      bartenderBalances[0].finalShare -= busserTipOut;
    }

    // Distribute remaining cash tips to help bartenders reach the target share
    bartenderBalances.forEach((bartender) => {
      if (remainingCashTips > 0 && bartender.adjustmentNeeded > 0) {
        const cashContribution = Math.min(
          bartender.adjustmentNeeded,
          remainingCashTips,
        );
        bartender.cashReceived = cashContribution;
        bartender.finalShare += cashContribution;
        bartender.adjustmentNeeded -= cashContribution;
        remainingCashTips -= cashContribution;
      }
    });

    const zelleTransfers: { from: string; to: string; amount: number }[] = [];

    // Adjust any remaining discrepancies using Zelle transfers
    const overpaidBartenders = bartenderBalances.filter(
      (b) => b.finalShare > targetShare,
    );
    const underpaidBartenders = bartenderBalances.filter(
      (b) => b.finalShare < targetShare,
    );

    overpaidBartenders.forEach((overpaid) => {
      let surplus = overpaid.finalShare - targetShare;

      underpaidBartenders.forEach((underpaid) => {
        if (surplus <= 0) return;

        const needed = targetShare - underpaid.finalShare;
        const amountToTransfer = Math.min(surplus, needed);

        if (amountToTransfer > 0) {
          zelleTransfers.push({
            from: overpaid.name,
            to: underpaid.name,
            amount: amountToTransfer,
          });

          overpaid.finalShare -= amountToTransfer;
          overpaid.zelleSent += amountToTransfer;

          underpaid.finalShare += amountToTransfer;
          underpaid.zelleReceived += amountToTransfer;

          surplus -= amountToTransfer;
        }
      });
    });

    setResults({
      busserTipOut,
      busserTipOutSource,
      targetShare,
      bartenderBalances,
      zelleTransfers,
    });
    setIsCalculated(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="relative mb-4 flex items-center justify-center border p-4">
        <label htmlFor="cashTips" className="mb-2 mr-3 block">
          Bucket Cash:
        </label>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          id="cashTips"
          type="number"
          value={cashTips}
          onChange={handleCashTipsChange}
          className="mb-4 border border-green-700 bg-green-50 px-2 py-1"
          placeholder="Enter cash tips"
        />
      </div>

      {/* Render each BartenderInput for each entry in bartenders */}
      {bartenders.map((bartender, index) => (
        <BartenderInput
          key={index}
          index={index}
          name={bartender.name}
          creditTips={bartender.creditTips}
          updateBartender={(index, name, creditTips) =>
            updateBartender(index, name, creditTips.toString())
          }
          removeBartender={() => removeBartender(index)}
          inputRef={React.createRef<HTMLInputElement>()}
        />
      ))}

      <div>
        {errorMessage ? (
          <div className="font-freckle mb-4 bg-green-50 p-2 text-center text-xl text-green-700">
            {errorMessage}
          </div>
        ) : null}
      </div>

      <div className="mb-4 flex space-x-4">
        <button
          onClick={addBartender}
          className="rounded bg-green-700 px-4 py-2 text-white"
        >
          Add Another Flan-mate
        </button>

        <button
          onClick={handleCalculate}
          className="rounded bg-green-700 px-4 py-2 text-white"
        >
          See What&apos;s Up
        </button>
      </div>

      {isCalculated && results ? (
        <TipCalculationDisplay results={results} />
      ) : null}
    </div>
  );
}
