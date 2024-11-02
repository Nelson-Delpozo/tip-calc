// app/components/BartenderInput.tsx
import React from "react";

interface BartenderInputProps {
  index: number;
  name: string;
  creditTips: string | number; // Allow both string and number
  updateBartender: (index: number, name: string, creditTips: string | number) => void;
  removeBartender: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const BartenderInput: React.FC<BartenderInputProps> = ({
  index,
  name,
  creditTips,
  updateBartender,
  removeBartender,
  inputRef,
}) => {
  return (
    <div className="mb-4 border p-4 relative">
      <label htmlFor={`bartenderName-${index}`} className="block">Bartender Name:</label>
      <input
        id={`bartenderName-${index}`}
        type="text"
        value={name}
        onChange={(e) => updateBartender(index, e.target.value, creditTips)}
        className="border px-2 py-1 mb-2 w-full bg-green-50"
        ref={inputRef}
      />

      <label htmlFor={`creditTips-${index}`} className="block">Credit Card Tips:</label>
      <input
        id={`creditTips-${index}`}
        type="number"
        value={creditTips}
        onChange={(e) => updateBartender(index, name, e.target.value)}
        className="border px-2 py-1 w-full bg-green-50"
      />

      {/* Remove button */}
      <button
        onClick={removeBartender}
        className="absolute top-2 right-2 text-red-800 font-bold"
      >
        ×
      </button>
    </div>
  );
};

export default BartenderInput;
