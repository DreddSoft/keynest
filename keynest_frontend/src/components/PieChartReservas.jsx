import { PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Reservado', value: 130 }, // días reservados
  { name: 'Disponible', value: 235 }, // días no reservados (365 - 130)
];

const COLORS = ['#1f2937', '#e5e7eb']; // gris oscuro y gris claro

function ReservationPieChart({ reservedDays = 130 }) {
  const percentage = ((reservedDays / 365) * 100).toFixed(0);

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
        </div>
      </div>
    </div>
  );
}

export default ReservationPieChart;
