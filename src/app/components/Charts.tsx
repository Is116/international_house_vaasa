'use client';

import { Chart } from 'react-google-charts';

const BASE: Record<string, unknown> = {
  fontName: 'Roboto, Google Sans, Arial, sans-serif',
  backgroundColor: { fill: 'transparent' },
  chartArea: { left: 56, right: 20, top: 16, bottom: 48 },
  legend: {
    textStyle: { color: '#5F6368', fontSize: 11 },
    position: 'bottom',
  },
  hAxis: {
    textStyle: { color: '#5F6368', fontSize: 11 },
    gridlines: { color: '#F1F3F4' },
    baselineColor: '#DADCE0',
  },
  vAxis: {
    textStyle: { color: '#5F6368', fontSize: 11 },
    gridlines: { color: '#F1F3F4' },
    baselineColor: '#DADCE0',
  },
  tooltip: { showColorCode: true },
};

const LOADER = (
  <div className="w-full h-full flex items-center justify-center text-sm text-[#5F6368]">
    Loading…
  </div>
);

export type ImmigrationRow = {
  year: number;
  foreign_born_population: number;
  total_population: number;
  net_immigration: number;
};

export type EmploymentRow = {
  year: number;
  finnish_born_rate: number;
  immigrant_rate: number;
};

export type FunnelRow = { stage: string; count: number; percentage: number };

export type UniStudentRow = {
  year: number;
  university: string;
  international_students: number;
};

export type RetentionRow = {
  year: number;
  graduates: number;
  retained: number;
  retention_rate: number;
};

export type NationalityRow = { country: string; population: number };

export type BenchmarkRow = {
  year: number;
  ihh_clients: number;
  ihv_projected: number;
};

export type EmployerRow = {
  company: string;
  sector: string;
  international_employees: number;
};

export function ImmigrationLineChart({ data }: { data: ImmigrationRow[] }) {
  const chartData = [
    ['Year', 'Foreign-born residents', 'Net immigration'],
    ...data.map((r) => [r.year, r.foreign_born_population, r.net_immigration]),
  ];
  return (
    <Chart
      chartType="LineChart"
      data={chartData}
      options={{
        ...BASE,
        colors: ['#1A73E8', '#34A853'],
        series: {
          0: { targetAxisIndex: 0, lineWidth: 3, pointSize: 5 },
          1: { targetAxisIndex: 1, lineWidth: 2, lineDashStyle: [4, 4], pointSize: 4 },
        },
        vAxes: [
          { title: 'Residents', textStyle: { color: '#5F6368', fontSize: 10 } },
          { title: 'Net immigration', textStyle: { color: '#5F6368', fontSize: 10 } },
        ],
        curveType: 'function',
      }}
      width="100%"
      height="320px"
      loader={LOADER}
    />
  );
}

export function NationalitiesPieChart({ data }: { data: NationalityRow[] }) {
  const chartData = [
    ['Country', 'Residents'],
    ...data.map((r) => [r.country, r.population]),
  ];
  return (
    <Chart
      chartType="PieChart"
      data={chartData}
      options={{
        ...BASE,
        colors: [
          '#1A73E8', '#34A853', '#EA4335', '#FBBC04',
          '#9334EA', '#00BCD4', '#FF9800', '#607D8B',
          '#E91E63', '#795548',
        ],
        chartArea: { left: 0, right: 0, top: 16, bottom: 56 },
        pieHole: 0.42,
        legend: {
          position: 'bottom',
          textStyle: { color: '#5F6368', fontSize: 10 },
          maxLines: 3,
        },
        pieSliceTextStyle: { color: '#fff', fontSize: 10, bold: true },
        pieSliceText: 'percentage',
      }}
      width="100%"
      height="320px"
      loader={LOADER}
    />
  );
}

export function EmploymentColumnChart({ data }: { data: EmploymentRow[] }) {
  const chartData = [
    ['Year', 'Finnish-born', 'Immigrant'],
    ...data.map((r) => [String(r.year), r.finnish_born_rate, r.immigrant_rate]),
  ];
  return (
    <Chart
      chartType="ColumnChart"
      data={chartData}
      options={{
        ...BASE,
        colors: ['#34A853', '#EA4335'],
        vAxis: {
          ...BASE.vAxis as object,
          title: 'Employment rate (%)',
          viewWindow: { min: 50, max: 80 },
          format: "#'%'",
        },
        bar: { groupWidth: '62%' },
      }}
      width="100%"
      height="320px"
      loader={LOADER}
    />
  );
}

export function FunnelBarChart({ data }: { data: FunnelRow[] }) {
  const chartData = [
    [
      'Stage',
      'Persons',
      { role: 'style' },
      { role: 'annotation' },
    ],
    ...data.map((r, i) => {
      const colors = ['#1A73E8', '#1A73E8', '#34A853', '#34A853', '#FBBC04', '#EA4335'];
      return [r.stage, r.count, colors[i] ?? '#5F6368', r.count.toLocaleString()];
    }),
  ];
  return (
    <Chart
      chartType="BarChart"
      data={chartData}
      options={{
        ...BASE,
        chartArea: { left: 180, right: 64, top: 8, bottom: 24 },
        hAxis: { ...BASE.hAxis as object, title: 'Persons' },
        legend: { position: 'none' },
        annotations: { textStyle: { color: '#202124', fontSize: 10 } },
      }}
      width="100%"
      height="260px"
      loader={LOADER}
    />
  );
}

export function UniversityStackedChart({
  students,
  years,
  universities,
}: {
  students: Record<string, Record<string, number>>;
  years: number[];
  universities: string[];
}) {
  const chartData = [
    ['Year', ...universities],
    ...years.map((y) => [
      String(y),
      ...universities.map((u) => students[String(y)]?.[u] ?? 0),
    ]),
  ];
  return (
    <Chart
      chartType="ColumnChart"
      data={chartData}
      options={{
        ...BASE,
        colors: ['#1A73E8', '#34A853', '#FBBC04'],
        isStacked: true,
        vAxis: { ...BASE.vAxis as object, title: 'International students' },
        bar: { groupWidth: '62%' },
      }}
      width="100%"
      height="320px"
      loader={LOADER}
    />
  );
}

export function RetentionLineChart({ data }: { data: RetentionRow[] }) {
  const chartData = [
    ['Year', 'Retention rate (%)', 'Retained graduates'],
    ...data.map((r) => [String(r.year), r.retention_rate, r.retained]),
  ];
  return (
    <Chart
      chartType="LineChart"
      data={chartData}
      options={{
        ...BASE,
        colors: ['#9334EA', '#FBBC04'],
        series: {
          0: { targetAxisIndex: 0, lineWidth: 3, pointSize: 6 },
          1: { targetAxisIndex: 1, lineWidth: 2, lineDashStyle: [4, 4], pointSize: 4 },
        },
        vAxes: [
          { title: 'Retention (%)', textStyle: { color: '#5F6368', fontSize: 10 } },
          { title: 'Retained count', textStyle: { color: '#5F6368', fontSize: 10 } },
        ],
        curveType: 'function',
      }}
      width="100%"
      height="280px"
      loader={LOADER}
    />
  );
}

export function BenchmarkColumnChart({ data }: { data: BenchmarkRow[] }) {
  const chartData = [
    ['Year', 'IH Helsinki clients'],
    ...data
      .filter((r) => r.ihh_clients > 0)
      .map((r) => [String(r.year), r.ihh_clients]),
  ];
  return (
    <Chart
      chartType="ColumnChart"
      data={chartData}
      options={{
        ...BASE,
        colors: ['#1A73E8'],
        vAxis: { ...BASE.vAxis as object, title: 'Client visits / year' },
        legend: { position: 'none' },
        bar: { groupWidth: '62%' },
      }}
      width="100%"
      height="320px"
      loader={LOADER}
    />
  );
}

export function EmployerBarChart({ data }: { data: EmployerRow[] }) {
  const chartData = [
    ['Company', 'International employees (est.)', { role: 'style' }],
    ...data.map((r) => [r.company, r.international_employees, '#FBBC04']),
  ];
  return (
    <Chart
      chartType="BarChart"
      data={chartData}
      options={{
        ...BASE,
        chartArea: { left: 80, right: 64, top: 8, bottom: 24 },
        hAxis: { ...BASE.hAxis as object, title: 'International staff (est.)' },
        legend: { position: 'none' },
        annotations: { textStyle: { color: '#202124', fontSize: 10 } },
      }}
      width="100%"
      height="280px"
      loader={LOADER}
    />
  );
}
