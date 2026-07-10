(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var arm = style.getPropertyValue('--arm').trim();
  var x86 = style.getPropertyValue('--x86').trim();

  // --- Chart 1: Q3 万 Tag 压测对比 ---
  var chart1 = echarts.init(document.getElementById('chart-q3'), null, { renderer: 'svg' });
  var option1 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: bg2,
      borderColor: rule,
      textStyle: { color: ink }
    },
    legend: {
      data: ['ARM64 (RK3588s)', 'x86 (i5-13500H)'],
      textStyle: { color: ink },
      icon: 'roundRect'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['吞吐量 (points/s)', 'lag P95 (ms)', 'lag max (ms)', '内存漂移 (%)', 'GC pause max (ms)'],
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [
      {
        name: 'ARM64 (RK3588s)',
        type: 'bar',
        data: [9890, 1.10, 3.04, -8.28, 0.22],
        itemStyle: { color: arm },
        barWidth: '35%'
      },
      {
        name: 'x86 (i5-13500H)',
        type: 'bar',
        data: [8988, 0.99, 53.80, -3.89, 0.58],
        itemStyle: { color: x86 },
        barWidth: '35%'
      }
    ],
    animation: false
  };
  chart1.setOption(option1);
  window.addEventListener('resize', function() { chart1.resize(); });

  // --- Chart 2: G007 设备吞吐量对比 ---
  var chart2 = echarts.init(document.getElementById('chart-g007'), null, { renderer: 'svg' });
  var option2 = {
    tooltip: {
      trigger: 'item',
      backgroundColor: bg2,
      borderColor: rule,
      textStyle: { color: ink }
    },
    title: {
      subtext: '目标 ≥ 950 devices/s',
      subtextStyle: { color: muted },
      left: 'center'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: ink }
    },
    series: [
      {
        name: '吞吐量',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 996, name: 'ARM64: 996 devices/s', itemStyle: { color: arm } },
          { value: 972, name: 'x86: 972 devices/s', itemStyle: { color: x86 } }
        ],
        label: {
          color: ink,
          formatter: '{b}\n{d} dev/s'
        },
        emphasis: {
          label: {
            fontSize: 16
          }
        },
        animation: false
      }
    ]
  };
  chart2.setOption(option2);
  window.addEventListener('resize', function() { chart2.resize(); });

  // --- Chart 3: 微基准对比 (归一化到 x86，ARM/x86 ratio) ---
  var chart3 = echarts.init(document.getElementById('chart-micro'), null, { renderer: 'svg' });
  var option3 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: bg2,
      borderColor: rule,
      textStyle: { color: ink },
      formatter: 'Benchmark: {b}<br/>{a}: {c}× (ARM vs x86)'
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: 'ARM / x86 ratio (ns/op)',
      nameTextStyle: { color: ink },
      min: 0.7,
      max: 1.4,
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule } }
    },
    yAxis: {
      type: 'category',
      data: [
        'GetShadowDevice_COW',
        'GetShadowDevice',
        'WriteShadowDevice_MultiPoint',
        'NotifySubscribers',
        'ApplyCollectToShadow_Pooled',
        'WriteShadowDevice',
        'LoadPoints_Pooled'
      ],
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: rule } }
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 1.29, itemStyle: { color: x86 > 1 ? arm : x86 } },
          { value: 1.38, itemStyle: { color: x86 > 1 ? arm : x86 } },
          { value: 1.03, itemStyle: { color: (1.03 > 1.05 || 1.03 < 0.95) ? accent : muted } },
          { value: 0.89, itemStyle: { color: 0.89 < 1 ? arm : x86 } },
          { value: 0.95, itemStyle: { color: 0.95 < 1 ? arm : x86 } },
          { value: 0.85, itemStyle: { color: 0.85 < 1 ? arm : x86 } },
          { value: 1.00, itemStyle: { color: muted } }
        ],
        label: {
          show: true,
          position: 'right',
          formatter: '{c}×',
          color: ink
        },
        animation: false
      }
    ],
    graphic: [
      {
        type: 'line',
        shape: {
          x1: 100 * 1.0,
          y1: 0,
          x2: 100 * 1.0,
          y2: 100
        },
        style: {
          stroke: accent,
          lineWidth: 2
        },
        left: 0,
        top: 0
      }
    ]
  };
  chart3.setOption(option3);
  window.addEventListener('resize', function() { chart3.resize(); });

})();
