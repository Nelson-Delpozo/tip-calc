// app/routes/index.tsx
import { useState } from "react";

import BartenderInput from "../components/BartenderInput";
import TipCalculationDisplay from "../components/TipCalculationDisplay";

export default function Index() {
  // State for total cash tips, bartenders, and display of results
  const [cashTips, setCashTips] = useState<number>(0);
  const [bartenders, setBartenders] = useState([{ name: "", creditTips: 0 }]);
  const [isCalculated, setIsCalculated] = useState(false);
  interface CalculationResult {
    busserTipOut: number;
    perBartenderShare: number;
    calculations: {
      name: string;
      creditTips: number;
      owesBusser: number;
      zelleAmount: number;
    }[];
  }

  const [results, setResults] = useState<CalculationResult | null>(null);

  // Handle cash tips input
  const handleCashTipsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashTips(parseFloat(e.target.value) || 0);
  };

  // Handle adding a new bartender
  const addBartender = () => {
    setBartenders([...bartenders, { name: "", creditTips: 0 }]);
  };

  // Handle removing a bartender by index
  const removeBartender = (index: number) => {
    setBartenders(bartenders.filter((_, i) => i !== index));
  };

  // Update bartender information
  const updateBartender = (index: number, name: string, creditTips: number) => {
    const updatedBartenders = bartenders.map((bartender, i) =>
      i === index ? { name, creditTips } : bartender
    );
    setBartenders(updatedBartenders);
  };

  // Handle form submission to calculate tips distribution
  const handleCalculate = () => {
    if (bartenders.some((b) => b.name === "" || b.creditTips < 0)) {
      alert("Please fill out all bartender names and valid credit tip amounts.");
      return;
    }

    // Total tips including cash and credit
    const totalTips = cashTips + bartenders.reduce((sum, b) => sum + b.creditTips, 0);
    const busserTipOut = totalTips * 0.1;
    const distributableTips = totalTips - busserTipOut;
    const perBartenderShare = distributableTips / bartenders.length;

    const calculations = bartenders.map((bartender) => {
      const difference = perBartenderShare - bartender.creditTips;
      return {
        ...bartender,
        owesBusser: bartender === bartenders[0] ? busserTipOut : 0,
        zelleAmount: difference,
      };
    });

    setResults({
      busserTipOut,
      perBartenderShare,
      calculations,
    });
    setIsCalculated(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bartender Tip Split Calculator</h1>
      
      {/* Input for total cash tips */}
      <label htmlFor="cashTips" className="block mb-2">Total Cash Tips:</label>
      <input
        id="cashTips"
        type="number"
        value={cashTips}
        onChange={handleCashTipsChange}
        className="border px-2 py-1 mb-4 w-full"
      />

      {/* Dynamic list of bartender inputs */}
      {bartenders.map((bartender, index) => (
        <BartenderInput
          key={index}
          index={index}
          name={bartender.name}
          creditTips={bartender.creditTips}
          updateBartender={updateBartender}
          removeBartender={() => removeBartender(index)}
        />
      ))}

      {/* Add another bartender button */}
      <button onClick={addBartender} className="bg-blue-500 text-white px-2 py-1 mb-4">
        Add Another Bartender
      </button>

      {/* Calculate button */}
      <button onClick={handleCalculate} className="bg-green-500 text-white px-4 py-2">
        Calculate Distribution
      </button>

      {/* Display results after calculation */}
      {isCalculated && results ? <TipCalculationDisplay results={results} /> : null}
    </div>
  );
}
