# 驱动手工联调笔记

本目录存放**现场联调、验收**时使用的测试矩阵与检查清单，不参与 `go test` CI。权威驱动说明与正式验收文档见 [docs/drivers/](../../docs/drivers/index.md)。

| 文件 | 协议 | 说明 |
|------|------|------|
| [ethernet-ip-checklist.md](ethernet-ip-checklist.md) | EtherNet/IP | 模拟器联调用例清单（配合 `../test_ethernet-ip.py`） |
| [bacnet-who-is-iam-matrix.md](bacnet-who-is-iam-matrix.md) | BACnet | Who-Is / I-Am 测试矩阵与验证标准 |
| [bacnet-objectlist-scan.md](bacnet-objectlist-scan.md) | BACnet | objectList 扫描与 Diff 验收方案 |

相关抓包样本见上级目录：`Who-IS.pcapng`、`BACnet发现报文.pcap`、`单播who-is.pcap`。
