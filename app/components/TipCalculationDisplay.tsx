// app/components/TipCalculationDisplay.tsx
import React from "react";

interface TipCalculationDisplayProps {
  results: {
    busserTipOut: number;
    perBartenderShare: number;
    calculations: {
      name: string;
      creditTips: number;
      owesBusser: number;
      zelleAmount: number;
    }[];
  };
}

const TipCalculationDisplay: React.FC<TipCalculationDisplayProps> = ({ results }) => {
  return (
    <div className="mt-8 p-4 border">
      <h2 className="text-xl font-bold mb-4">Tip Distribution Results</h2>
      <p>Busser Tip-Out: ${results.busserTipOut.toFixed(2)}</p>
      <p>Each Bartender&apos;s Share After Tip-Out: ${results.perBartenderShare.toFixed(2)}</p>
      
      <h3 className="mt-4 font-bold">Individual Calculations</h3>
      {results.calculations.map((bartender, index) => (
        <div key={index} className="mb-2">
          <p>
            {bartender.name}: ${bartender.creditTips.toFixed(2)} in Credit Tips
          </p>
          <p>
            Zelle Transfer Needed: ${bartender.zelleAmount.toFixed(2)}
            {bartender.owesBusser > 0 ? ` (Includes busser tip-out)` : ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TipCalculationDisplay;
