(function() {
  var style = getComputedStyle(document.documentElement);
  var gold = style.getPropertyValue('--gold').trim() || '#c5a059';
  var goldDeep = style.getPropertyValue('--gold-deep').trim() || '#b38f43';
  var goldLight = style.getPropertyValue('--gold-light').trim() || '#dfc38a';
  var ink = style.getPropertyValue('--ink').trim() || '#343a40';
  var muted = style.getPropertyValue('--muted').trim() || '#6c757d';
  var line = style.getPropertyValue('--line').trim() || '#e9ecef';
  var panel = style.getPropertyValue('--panel').trim() || '#ffffff';
  var bgSoft = style.getPropertyValue('--bg-soft').trim() || '#f1f3f5';

  // ARM64 = gold (primary), x86 = gold-light (contrast)
  var armColor = gold;
  var x86Color = goldLight;

  // --- Chart 1: Q3 万 Tag 压测对比 ---
  var chart1 = echarts.init(document.getElementById('chart-q3'), null, { renderer: 'svg' });
  chart1.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: panel,
      borderColor: line,
      textStyle: { color: ink }
    },
    legend: {
      data: ['ARM64 (RK3588s)', 'x86 (i5-13500H)'],
      textStyle: { color: ink },
      icon: 'roundRect'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['吞吐量', 'lag P95', 'lag max', '内存漂移', 'GC pause'],
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: line } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: line } },
      splitLine: { lineStyle: { color: line } }
    },
    series: [
      {
        name: 'ARM64 (RK3588s)',
        type: 'bar',
        data: [9890, 1.10, 3.04, -8.28, 0.22],
        itemStyle: { color: armColor },
        barWidth: '35%'
      },
      {
        name: 'x86 (i5-13500H)',
        type: 'bar',
        data: [8988, 0.99, 53.80, -3.89, 0.58],
        itemStyle: { color: x86Color },
        barWidth: '35%'
      }
    ],
    animation: false
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // --- Chart 2: G007 设备吞吐量对比 ---
  var chart2 = echarts.init(document.getElementById('chart-g007'), null, { renderer: 'svg' });
  chart2.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: panel,
      borderColor: line,
      textStyle: { color: ink }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: ink }
    },
    series: [{
      name: '吞吐量',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      data: [
        { value: 996, name: 'ARM64: 996 devices/s', itemStyle: { color: armColor } },
        { value: 972, name: 'x86: 972 devices/s', itemStyle: { color: x86Color } }
      ],
      label: {
        color: ink,
        formatter: '{b}\n{d} dev/s'
      },
      animation: false
    }]
  });
  window.addEventListener('resize', function() { chart2.resize(); });

  // --- Chart 3: 微基准对比 (归一化到 x86，ARM/x86 ratio) ---
  var chart3 = echarts.init(document.getElementById('chart-micro'), null, { renderer: 'svg' });
  var benchData = [
    { name: 'GetShadowDevice_COW',          value: 1.29 },
    { name: 'GetShadowDevice',              value: 1.38 },
    { name: 'WriteShadowDevice_MultiPoint', value: 1.03 },
    { name: 'NotifySubscribers',            value: 0.89 },
    { name: 'ApplyCollectToShadow_Pooled',  value: 0.95 },
    { name: 'WriteShadowDevice',            value: 0.85 },
    { name: 'LoadPoints_Pooled',            value: 1.00 }
  ];
  chart3.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: panel,
      borderColor: line,
      textStyle: { color: ink },
      formatter: function(params) {
        var v = params[0].value;
        var label = v < 1 ? 'ARM 更快' : v > 1 ? 'x86 更快' : '持平';
        return params[0].name + '<br/>ARM/x86: ' + v.toFixed(2) + '× (' + label + ')';
      }
    },
    grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'ARM / x86 比率 (ns/op)',
      nameTextStyle: { color: ink },
      min: 0.7,
      max: 1.4,
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: line } },
      splitLine: { lineStyle: { color: line } }
    },
    yAxis: {
      type: 'category',
      data: benchData.map(function(d) { return d.name; }),
      axisLabel: { color: ink },
      axisLine: { lineStyle: { color: line } }
    },
    series: [{
      type: 'bar',
      data: benchData.map(function(d) {
        var color;
        if (d.value < 0.95) color = armColor;       // ARM significantly faster
        else if (d.value > 1.05) color = goldDeep;  // x86 significantly faster
        else color = muted;                          // roughly equal
        return { value: d.value, itemStyle: { color: color } };
      }),
      label: {
        show: true,
        position: 'right',
        formatter: '{c}×',
        color: ink
      },
      animation: false
    }],
    graphic: [{
      type: 'line',
      shape: { x1: 0, y1: 0, x2: 0, y2: 1 },
      style: { stroke: muted, lineWidth: 1, lineDash: [4, 4] },
      left: '10%',
      top: '5%',
      z: 0
    }]
  });
  window.addEventListener('resize', function() { chart3.resize(); });

})();