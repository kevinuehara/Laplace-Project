import { HTMLProps, memo } from "react";

interface SelectProps extends HTMLProps<HTMLSelectElement> {
  items: { label: string; value: string }[];
  isDark: boolean;
}

export const Select = ({
  label,
  selected,
  items,
  onChange,
  isDark,
}: SelectProps) => {
  return (
    <div className="flex absolute mt-2">
      <label className={`text-white mb-1`}>{label}: </label>
      <select
        onChange={onChange}
        className={`${
          isDark ? "bg-gray-700 text-white" : "bg-white text-black"
        }  w-24 p-1 rounded-md ml-2`}
      >
        {items.map((item) => (
          <option selected={selected} value={item.value} key={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
