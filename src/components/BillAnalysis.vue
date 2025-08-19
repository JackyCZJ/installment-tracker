<template>
  <div class="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
    <!-- 头部 -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center">
        <div
          class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">账单分析</h2>
          <p class="text-gray-300">可视化分析您的账单数据</p>
        </div>
      </div>

      <!-- 月工资输入 -->
      <div class="flex items-center gap-4">
        <div class="flex items-center">
          <label for="monthlySalary" class="text-sm font-semibold text-gray-200 mr-3">
            月工资 (元)
          </label>
          <input
            id="monthlySalary"
            v-model.number="monthlySalary"
            type="number"
            step="100"
            min="0"
            class="w-32 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
            placeholder="0"
          />
        </div>
      </div>
    </div>

    <!-- 图表类型切换 -->
    <div class="flex gap-2 mb-8">
      <button
        v-for="chartType in chartTypes"
        :key="chartType.value"
        @click="currentChartType = chartType.value"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition-all duration-300',
          currentChartType === chartType.value
            ? 'bg-blue-500 text-white shadow-lg'
            : 'bg-white/10 text-gray-300 hover:bg-white/20',
        ]"
      >
        {{ chartType.label }}
      </button>
    </div>

    <!-- 图表容器 -->
    <div v-if="bills.length > 0" class="space-y-8">
      <!-- 金额分布饼图 -->
      <div
        v-if="currentChartType === 'amount'"
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 class="text-xl font-semibold text-white mb-4">账单金额分布</h3>
        <div class="h-80">
          <PieChart :data="amountChartData" :options="pieChartOptions" />
        </div>
      </div>

      <!-- 利率对比柱状图 -->
      <div
        v-if="currentChartType === 'rate'"
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 class="text-xl font-semibold text-white mb-4">年利率对比</h3>
        <div class="h-80">
          <BarChart :data="rateChartData" :options="barChartOptions" />
        </div>
      </div>

      <!-- 还款进度折线图 -->
      <div
        v-if="currentChartType === 'progress'"
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 class="text-xl font-semibold text-white mb-4">还款进度趋势</h3>
        <div class="h-80">
          <LineChart :data="progressChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- 来源统计 -->
      <div
        v-if="currentChartType === 'source'"
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 class="text-xl font-semibold text-white mb-4">账单来源统计</h3>
        <div class="h-80">
          <DoughnutChart :data="sourceChartData" :options="doughnutChartOptions" />
        </div>
      </div>

      <!-- 用途统计 -->
      <div
        v-if="currentChartType === 'purpose'"
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 class="text-xl font-semibold text-white mb-4">账单用途统计</h3>

        <!-- 用途分布图表 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 用途数量分布 -->
          <div>
            <h4 class="text-lg font-medium text-white mb-4">用途数量分布</h4>
            <div class="h-64">
              <DoughnutChart :data="purposeCountChartData" :options="doughnutChartOptions" />
            </div>
          </div>

          <!-- 用途金额分布 -->
          <div>
            <h4 class="text-lg font-medium text-white mb-4">用途金额分布</h4>
            <div class="h-64">
              <PieChart :data="purposeAmountChartData" :options="pieChartOptions" />
            </div>
          </div>
        </div>

        <!-- 用途统计表格 -->
        <div class="mt-6">
          <h4 class="text-lg font-medium text-white mb-4">详细统计</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-white/20">
                  <th class="text-left py-3 text-gray-300">用途</th>
                  <th class="text-right py-3 text-gray-300">数量</th>
                  <th class="text-right py-3 text-gray-300">总金额</th>
                  <th class="text-right py-3 text-gray-300">平均金额</th>
                  <th class="text-right py-3 text-gray-300">占比</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="stat in purposeStats"
                  :key="stat.purpose"
                  class="border-b border-white/10"
                >
                  <td class="py-3 text-white">{{ stat.displayName }}</td>
                  <td class="py-3 text-right text-gray-300">{{ stat.count }}</td>
                  <td class="py-3 text-right text-white">
                    ¥{{ formatCurrency(stat.totalAmount) }}
                  </td>
                  <td class="py-3 text-right text-gray-300">
                    ¥{{ formatCurrency(stat.averageAmount) }}
                  </td>
                  <td class="py-3 text-right text-blue-400">{{ stat.percentage.toFixed(1) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 工资分析 -->
      <div
        v-if="currentChartType === 'salary' && salaryAnalysis"
        class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 class="text-xl font-semibold text-white mb-4">工资分析</h3>

        <!-- 工资分析卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div class="text-2xl font-bold text-green-400">
              ¥{{ formatCurrency(salaryAnalysis.monthlySalary) }}
            </div>
            <div class="text-sm text-gray-300">月工资</div>
          </div>
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div class="text-2xl font-bold text-red-400">
              ¥{{ formatCurrency(salaryAnalysis.totalMonthlyPayment) }}
            </div>
            <div class="text-sm text-gray-300">月还款总额</div>
          </div>
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div class="text-2xl font-bold text-blue-400">
              ¥{{ formatCurrency(salaryAnalysis.remainingSalary) }}
            </div>
            <div class="text-sm text-gray-300">剩余工资</div>
          </div>
          <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div class="text-2xl font-bold text-yellow-400">
              {{ salaryAnalysis.paymentRatio.toFixed(1) }}%
            </div>
            <div class="text-sm text-gray-300">还款占比</div>
          </div>
        </div>

        <!-- 月还款分布图 -->
        <div class="h-80" v-if="salaryChartData">
          <BarChart :data="salaryChartData" :options="salaryChartOptions" />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <div
        class="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">暂无数据</h3>
      <p class="text-gray-300">添加账单后即可查看分析图表</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Pie as PieChart,
  Bar as BarChart,
  Line as LineChart,
  Doughnut as DoughnutChart,
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js'
import type { BillRecord } from '../types/installment'
import { getPurposeDisplayNameById } from '../config/purposes'

// 注册Chart.js组件
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
)

interface Props {
  bills: BillRecord[]
  monthlySalary?: number
  salaryAnalysis?: any
}

const props = withDefaults(defineProps<Props>(), {
  monthlySalary: 0,
  salaryAnalysis: null,
})

const currentChartType = ref('amount')
const monthlySalary = ref(props.monthlySalary)

const chartTypes = [
  { label: '金额分布', value: 'amount' },
  { label: '利率对比', value: 'rate' },
  { label: '还款进度', value: 'progress' },
  { label: '来源统计', value: 'source' },
  { label: '用途统计', value: 'purpose' },
  { label: '工资分析', value: 'salary' },
]

// 生成随机颜色
const generateColors = (count: number) => {
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#EC4899',
    '#6366F1',
  ]
  return colors.slice(0, count)
}

// 格式化货币
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN').format(amount)
}

// 金额分布饼图数据
const amountChartData = computed(() => ({
  labels: props.bills.map((bill) => bill.name),
  datasets: [
    {
      label: '账单金额',
      data: props.bills.map((bill) => bill.input.totalAmount),
      backgroundColor: generateColors(props.bills.length),
      borderColor: generateColors(props.bills.length).map((color) => color + '80'),
      borderWidth: 2,
    },
  ],
}))

// 利率对比柱状图数据
const rateChartData = computed(() => ({
  labels: props.bills.map((bill) => bill.name),
  datasets: [
    {
      label: '年利率 (%)',
      data: props.bills.map((bill) => bill.input.annualRate),
      backgroundColor: generateColors(props.bills.length).map((color) => color + '80'),
      borderColor: generateColors(props.bills.length),
      borderWidth: 2,
    },
  ],
}))

// 还款进度折线图数据
const progressChartData = computed(() => ({
  labels: props.bills.map((bill) => bill.name),
  datasets: [
    {
      label: '还款进度 (%)',
      data: props.bills.map((bill) => bill.summary.progressPercentage),
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F680',
      tension: 0.4,
      fill: true,
    },
  ],
}))

// 来源统计环形图数据
const sourceChartData = computed(() => {
  const sourceMap = new Map<string, number>()
  props.bills.forEach((bill) => {
    const source = bill.input.source || '未分类'
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
  })

  return {
    labels: Array.from(sourceMap.keys()),
    datasets: [
      {
        label: '账单数量',
        data: Array.from(sourceMap.values()),
        backgroundColor: generateColors(sourceMap.size),
        borderColor: generateColors(sourceMap.size).map((color) => color + '80'),
        borderWidth: 2,
      },
    ],
  }
})

// 用途统计数据
const purposeStats = computed(() => {
  const purposeMap = new Map<string, { count: number; totalAmount: number; bills: BillRecord[] }>()

  props.bills.forEach((bill) => {
    const purpose = bill.input.purpose || '其他'
    const existing = purposeMap.get(purpose) || { count: 0, totalAmount: 0, bills: [] }
    purposeMap.set(purpose, {
      count: existing.count + 1,
      totalAmount: existing.totalAmount + bill.input.totalAmount,
      bills: [...existing.bills, bill],
    })
  })

  const totalAmount = props.bills.reduce((sum, bill) => sum + bill.input.totalAmount, 0)

  return Array.from(purposeMap.entries())
    .map(([purpose, data]) => ({
      purpose,
      displayName: getPurposeDisplayNameById(purpose) || purpose,
      count: data.count,
      totalAmount: data.totalAmount,
      averageAmount: data.totalAmount / data.count,
      percentage: (data.totalAmount / totalAmount) * 100,
      bills: data.bills,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
})

// 用途数量分布图表数据
const purposeCountChartData = computed(() => ({
  labels: purposeStats.value.map((stat) => stat.displayName),
  datasets: [
    {
      label: '账单数量',
      data: purposeStats.value.map((stat) => stat.count),
      backgroundColor: generateColors(purposeStats.value.length),
      borderColor: generateColors(purposeStats.value.length).map((color) => color + '80'),
      borderWidth: 2,
    },
  ],
}))

// 用途金额分布图表数据
const purposeAmountChartData = computed(() => ({
  labels: purposeStats.value.map((stat) => stat.displayName),
  datasets: [
    {
      label: '账单金额',
      data: purposeStats.value.map((stat) => stat.totalAmount),
      backgroundColor: generateColors(purposeStats.value.length),
      borderColor: generateColors(purposeStats.value.length).map((color) => color + '80'),
      borderWidth: 2,
    },
  ],
}))

// 工资分析图表数据
const salaryChartData = computed(() => {
  if (!props.salaryAnalysis) return null

  return {
    labels: ['月工资', '月还款总额', '剩余工资'],
    datasets: [
      {
        label: '金额 (元)',
        data: [
          props.salaryAnalysis.monthlySalary,
          props.salaryAnalysis.totalMonthlyPayment,
          props.salaryAnalysis.remainingSalary,
        ],
        backgroundColor: ['#10B981', '#EF4444', '#3B82F6'],
        borderColor: ['#10B981', '#EF4444', '#3B82F6'],
        borderWidth: 2,
      },
    ],
  }
})

// 图表配置选项
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#E5E7EB',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed
          return `${label}: ¥${value.toLocaleString()}`
        },
      },
    },
  },
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `年利率: ${context.parsed.y}%`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#E5E7EB',
      },
      grid: {
        color: '#374151',
      },
    },
    x: {
      ticks: {
        color: '#E5E7EB',
      },
      grid: {
        color: '#374151',
      },
    },
  },
}

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `还款进度: ${context.parsed.y.toFixed(1)}%`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        color: '#E5E7EB',
        callback: (value: any) => `${value}%`,
      },
      grid: {
        color: '#374151',
      },
    },
    x: {
      ticks: {
        color: '#E5E7EB',
      },
      grid: {
        color: '#374151',
      },
    },
  },
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#E5E7EB',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value}个 (${percentage}%)`
        },
      },
    },
  },
}

const salaryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `金额: ¥${context.parsed.y.toLocaleString()}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#E5E7EB',
        callback: (value: any) => `¥${value.toLocaleString()}`,
      },
      grid: {
        color: '#374151',
      },
    },
    x: {
      ticks: {
        color: '#E5E7EB',
      },
      grid: {
        color: '#374151',
      },
    },
  },
}
</script>
