import { PieChart, Pie, Cell } from 'recharts';


const COLORS = ['#1f2937', '#e5e7eb']; // gris oscuro y gris claro

function ReservationPieChart({ reservedDays }) {
  // Sacamos el anio
  const currentYear = new Date().getFullYear();
  const totalDays = getNumberOfDaysInYear(currentYear);
  const availableDays = totalDays - reservedDays;
  const percentage = ((reservedDays / 365) * 100).toFixed(0);

  const data = [
  { name: 'Reservado', value: reservedDays }, // días reservados
  { name: 'Disponible', value: availableDays }, // días no reservados (365 - 130)
];

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-gray-800 font-medium text-sm mb-2">Reservas / Año</h3>
      <div className="relative w-40 h-40">
        {/* PieChart */}
        <PieChart width={160} height={160}>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        {/* Texto central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-xl font-bold text-gray-800">{percentage}%</p>
          <p className="text-xl font-bold text-gray-800">{`en ${currentYear}`}</p>
        </div>
      </div>
    </div>
  );
}

function getNumberOfDaysInYear(year) {

  const isLeap = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));

  return isLeap
    ? 366
    : 365;

}

export default ReservationPieChart;
