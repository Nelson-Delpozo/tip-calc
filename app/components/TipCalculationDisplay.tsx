// app/components/TipCalculationDisplay.tsx
import React from "react";

interface TipCalculationDisplayProps {
  results: {
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
    }[];
    zelleTransfers: {
      from: string;
      to: string;
      amount: number;
    }[];
  };
}

const TipCalculationDisplay: React.FC<TipCalculationDisplayProps> = ({ results }) => {
  return (
    <div className="mt-8 p-4 border">
      <h2 className="text-xl font-bold mb-4">Tip Distribution Results</h2>
      
      {/* Busser Tip-Out Details */}
      <p><strong>Busser Tip-Out:</strong> ${results.busserTipOut.toFixed(2)}</p>
      <p><strong>Source for Busser Tip-Out:</strong> {results.busserTipOutSource}</p>
      
      <p><strong>Each Bartender&apos;s Target Share After Tip-Out:</strong> ${results.targetShare.toFixed(2)}</p>

      {/* Detailed Breakdown for Each Bartender */}
      <h3 className="mt-4 font-bold mb-3">Bartender Shares Breakdown:</h3>
      {results.bartenderBalances.map((bartender, index) => (
        <div key={index} className="mb-4 p-2 border">
          <p><strong>{bartender.name}</strong></p>
          <p>Credit Tips: ${bartender.creditTips.toFixed(2)}</p>
          <p>Cash Received: ${bartender.cashReceived.toFixed(2)}</p>
          <p>Zelle Received: ${bartender.zelleReceived.toFixed(2)}</p>
          <p>Zelle Sent: ${bartender.zelleSent.toFixed(2)}</p>
          <p><strong>Final Share:</strong> ${bartender.finalShare.toFixed(2)}</p>
        </div>
      ))}

      {/* Zelle Transfer Recommendations */}
      <h3 className="mt-4 font-bold">Zelle Transfer Recommendations</h3>
      {results.zelleTransfers.length > 0 ? (
        results.zelleTransfers.map((transfer, index) => (
          <p key={index}>
            <strong>{transfer.from}</strong> needs to Zelle <strong>${transfer.amount.toFixed(2)}</strong> to <strong>{transfer.to}</strong>.
          </p>
        ))
      ) : (
        <p>All bartenders are balanced; no transfers needed.</p>
      )}

      {/* Additional Note for Busser Zelle Transfer if applicable */}
      {results.busserTipOutSource !== "Cash" ? <p>
          <strong>Note:</strong> {results.busserTipOutSource} is responsible for Zelle-ing <strong>${results.busserTipOut.toFixed(2)}</strong> to the busser.
        </p> : null}
    </div>
  );
};

export default TipCalculationDisplay;
