// app/components/BartenderInput.tsx
import React from "react";

interface BartenderInputProps {
  index: number;
  name: string;
  creditTips: number;
  updateBartender: (index: number, name: string, creditTips: number) => void;
  removeBartender: () => void;
}

const BartenderInput: React.FC<BartenderInputProps> = ({
  index,
  name,
  creditTips,
  updateBartender,
  removeBartender,
}) => {
  return (
    <div className="mb-4 border p-4 relative">
      <label htmlFor={`bartenderName-${index}`} className="block">Bartender Name:</label>
      <input
        id={`bartenderName-${index}`}
        type="text"
        value={name}
        onChange={(e) => updateBartender(index, e.target.value, creditTips)}
        className="border px-2 py-1 mb-2 w-full"
      />

      <label htmlFor={`creditTips-${index}`} className="block">Credit Card Tips:</label>
      <input
        id={`creditTips-${index}`}
        type="number"
        value={creditTips}
        onChange={(e) => updateBartender(index, name, parseFloat(e.target.value) || 0)}
        className="border px-2 py-1 w-full"
      />

      {/* Remove button */}
      <button
        onClick={removeBartender}
        className="absolute top-2 right-2 text-red-500"
      >
        ×
      </button>
    </div>
  );
};

export default BartenderInput;
