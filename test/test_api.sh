#!/bin/bash

# 测试后端 API 返回的数据格式

echo "=== 测试 API 返回的点位数据格式 ==="
echo ""

# 等待服务启动
echo "等待服务启动..."
sleep 3

echo "获取点位数据..."
curl -s "http://127.0.0.1:8080/api/channels/modbus-tcp-1/devices/slave-1/points" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('✓ JSON 解析成功')
    print('返回数据类型:', type(data).__name__)
    print('数据数量:', len(data) if isinstance(data, list) else 'N/A')
    
    if isinstance(data, list) and len(data) > 0:
        first_item = data[0]
        print('')
        print('第一个点位数据:')
        print(json.dumps(first_item, indent=2, ensure_ascii=False))
        
        print('')
        print('字段检查:')
        expected_fields = ['id', 'name', 'address', 'datatype', 'value', 'quality', 'timestamp', 'unit']
        for field in expected_fields:
            status = '✓' if field in first_item else '✗'
            print(f'{status} {field}: {first_item.get(field, \"缺失\")}')
except json.JSONDecodeError as e:
    print('✗ JSON 解析失败:', e)
except Exception as e:
    print('✗ 错误:', e)
" 2>&1

echo ""
echo "=== 测试完成 ==="
