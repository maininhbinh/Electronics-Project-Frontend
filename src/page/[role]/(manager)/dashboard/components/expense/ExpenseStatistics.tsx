import CardContainer from '../../../../../../common/CardContainter';
import ExpenseStatisticsChart from '../expense/ExpenseStatisticsChart';
import { expenseData, ExpenseDataType } from '../../../../../../data/expense-chart';
import ReactECharts from 'echarts-for-react';
import { useChartResize } from '../../../../../../providers/useEchartResize';
import { useEffect, useRef, useState } from 'react';

const ExpenseStatistics = ({data}: {data: Array<any>}) => {
  const chartRef = useRef<ReactECharts>(null);
  const [chartData, setChartData] = useState<ExpenseDataType>([]);
  useChartResize(chartRef);
  // Fetch sales data
  useEffect(() => {
    const cateogry = data ? data.map(item=>({
      value: 45,
      name: item.category,
      selected: true
    })) : []
    
    setChartData(cateogry.length < 2 ? expenseData : cateogry);
  }, [data]);
  return (
    <ExpenseStatisticsChart chartRef={chartRef} seriesData={chartData} />
  );
};

export default ExpenseStatistics;
