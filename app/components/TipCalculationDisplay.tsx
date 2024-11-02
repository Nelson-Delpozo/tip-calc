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
      zelleToBusser: number;
    }[];
    zelleTransfers: {
      from: string;
      to: string;
      amount: number;
    }[];
  };
}

const TipCalculationDisplay: React.FC<TipCalculationDisplayProps> = ({
  results,
}) => {
  // Group Zelle transfers by sender
  const groupedTransfers: Record<string, { to: string; amount: number }[]> = {};

  results.zelleTransfers.forEach((transfer) => {
    if (!groupedTransfers[transfer.from]) {
      groupedTransfers[transfer.from] = [];
    }
    groupedTransfers[transfer.from].push({
      to: transfer.to,
      amount: transfer.amount,
    });
  });

  return (
    <div className="mt-8 border p-4">
      <h2 className="mb-4 text-xl font-bold">Tip Distribution Results:</h2>

      {/* Busser Tip-Out Details */}
      <p>
        <strong>Busser Tip-Out:</strong> ${results.busserTipOut.toFixed(2)}
      </p>
      <p>
        <strong>Source for Busser Tip-Out:</strong> {results.busserTipOutSource}
      </p>

      <p>
        <strong>Each Bartender&apos;s Target Share After Tip-Out:</strong> $
        {results.targetShare.toFixed(2)}
      </p>

  {/* Detailed Breakdown for Each Bartender */}
  <h3 className="mb-3 mt-4 font-bold">Bartender Shares Breakdown:</h3>
      {results.bartenderBalances.map((bartender, index) => (
        <div key={index} className="mb-4 border p-2">
          <p>
            <strong>{bartender.name}</strong>
          </p>
          <p>Credit Tips: ${bartender.creditTips.toFixed(2)}</p>
          <p>Cash Split: ${bartender.cashReceived.toFixed(2)}</p>
          <p>
            Zelle from {results.zelleTransfers.filter(transfer => transfer.to === bartender.name).length > 1 ? 'Flan-mates' : 'Flan-mate'}: ${bartender.zelleReceived.toFixed(2)}
          </p>
          <p>
            Zelle to {results.zelleTransfers.filter(transfer => transfer.from === bartender.name).length > 1 ? 'Flan-mates' : 'Flan-mate'}: ${bartender.zelleSent.toFixed(2)}
          </p>
          <p>Zelle to Busser: ${bartender.zelleToBusser.toFixed(2)}</p>
          <p>
            <strong>Shift Total:</strong> ${bartender.finalShare.toFixed(2)}
          </p>
        </div>
      ))}

      {/* Zelle Transfer Recommendations */}
      <h3 className="mt-4 font-bold">Zelle Action:</h3>
      {Object.keys(groupedTransfers).length > 0 ? (
        Object.entries(groupedTransfers).map(([from, transfers], index) => (
          <p key={index}>
            <strong>{from}</strong> needs to Zelle{" "}
            {transfers.map((transfer, i) => (
              <span key={i}>
                <strong>${transfer.amount.toFixed(2)}</strong> to <strong>{transfer.to}</strong>
                {i < transfers.length - 1 ? ", and " : ""}
              </span>
            ))}
            .
          </p>
        ))
      ) : (
        <p
        className="font-freckle text-green-700 text-xl text-center"
        >None needed.</p>
      )}

      {/* Zelle Transfer Recommendations for Busser Tip-Out */}
      {results.busserTipOutSource !== "Cash" ? (
        <div>
          {results.bartenderBalances.map((bartender, index) =>
            bartender.zelleToBusser > 0 ? (
              <p key={index}>
                <strong>{bartender.name}</strong> needs to Zelle{" "}
                <strong>${bartender.zelleToBusser.toFixed(2)}</strong> to the
                busser.
              </p>
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TipCalculationDisplay;
