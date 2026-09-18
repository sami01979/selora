import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <h2 className="font-script text-3xl text-plum mb-5">Shop by category</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {CATEGORIES.map((c) => (
          <div
            key={c.value}
            onClick={() => navigate(`/category/${c.value}`)}
            className="border border-lavender rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white transition-transform duration-200 hover:scale-105 active:scale-105 hover:border-plum"
          >
            <span className="text-2xl sm:text-3xl">{c.emoji}</span>
            <p className="text-[11px] sm:text-sm text-center font-poppins text-gray-700 leading-tight">
              {c.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}