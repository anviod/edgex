#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EtherNet/IP 协议级验证器
工业级标准验证工具
"""

import socket
import struct

# =============================================================================
# 一、核心封装层（必须统一）
# =============================================================================
def build_encap(cmd, session, payload):
    return struct.pack('<HHIIQI',
        cmd,
        len(payload),
        session,
        0x00000000,
        0x0000000000000000,
        0x00000000
    ) + payload

# =============================================================================
# 二、CPF（关键点：必须2个Item）
# =============================================================================
def build_cpf(cip_data):
    return (
        struct.pack('<I', 0x00000000) +      # Interface Handle
        struct.pack('<H', 2) +               # Item Count
        struct.pack('<HH', 0x0000, 0) +      # Null Address
        struct.pack('<HH', 0x00B2, len(cip_data)) +  # UCMM
        cip_data
    )

# =============================================================================
# 三、Session 建立（标准写法）
# =============================================================================
def register_session(sock):
    payload = struct.pack('<HH', 0x0001, 0x0000)
    pkt = build_encap(0x0065, 0, payload)
    sock.send(pkt)
    resp = sock.recv(1024)
    
    if len(resp) < 8:
        raise Exception("Session 响应过短")
    
    session = struct.unpack('<I', resp[4:8])[0]
    
    if session == 0:
        raise Exception("Session 注册失败")
    
    print(f"✓ Session 注册成功: 0x{session:08X}")
    return session

# =============================================================================
# 四、CIP 路径构造（完全合规）
# =============================================================================
def build_path(class_id, instance_id, attr_id=None):
    path = b''
    path += struct.pack('<BB', 0x20, class_id)
    path += struct.pack('<BB', 0x24, instance_id)
    
    if attr_id is not None:
        path += struct.pack('<BB', 0x30, attr_id)
    
    return path

# =============================================================================
# 五、Symbolic Tag（关键）
# =============================================================================
def build_tag_path(tag):
    tag_bytes = tag.encode('ascii')
    path = bytes([0x91, len(tag_bytes)]) + tag_bytes
    
    if len(tag_bytes) % 2 != 0:
        path += b'\x00'
    
    return path

# =============================================================================
# 六、CIP 服务封装
# =============================================================================

def cip_get_attr(class_id, instance, attr):
    path = build_path(class_id, instance, attr)
    path_words = len(path) // 2
    return bytes([0x0E, path_words]) + path

def cip_read_tag(tag):
    path = build_tag_path(tag)
    words = len(path) // 2
    return bytes([0x4C, words]) + path

def cip_write_tag(tag, dtype, value_bytes):
    path = build_tag_path(tag)
    words = len(path) // 2
    return (
        bytes([0x4D, words]) +
        path +
        struct.pack('<H', dtype) +
        struct.pack('<H', 1) +
        value_bytes
    )

# =============================================================================
# 七、发送 RRData（核心入口）
# =============================================================================
def send_rr(sock, session, cip):
    cpf = build_cpf(cip)
    pkt = build_encap(0x006A, session, cpf)
    sock.send(pkt)
    return sock.recv(4096)

# =============================================================================
# 八、响应解析（工业级）
# =============================================================================
def parse_cip(resp):
    if len(resp) < 12:
        raise Exception("响应过短")
    
    status = struct.unpack('<I', resp[8:12])[0]
    
    if status != 0:
        raise Exception(f"Encap Error: 0x{status:08X}")
    
    offset = 24
    
    # 解析 Interface Handle (4 bytes)
    iface = struct.unpack('<I', resp[offset:offset+4])[0]
    offset += 4
    
    # 解析 Item Count (2 bytes)
    item_count = struct.unpack('<H', resp[offset:offset+2])[0]
    offset += 2
    
    cip_data = None
    
    for _ in range(item_count):
        if offset + 4 > len(resp):
            break
        
        type_id = struct.unpack('<H', resp[offset:offset+2])[0]
        length = struct.unpack('<H', resp[offset+2:offset+4])[0]
        offset += 4
        
        if offset + length > len(resp):
            break
        
        if type_id == 0x00B2:
            cip_data = resp[offset:offset+length]
        
        offset += length
    
    if cip_data is None:
        raise Exception("No CIP data")
    
    service = cip_data[0]
    # CIP status is 2 bytes (little-endian) at offset 2
    status = struct.unpack('<H', cip_data[2:4])[0]
    
    return service, status, cip_data

# =============================================================================
# 九、验证逻辑（真正的"验证器"）
# =============================================================================

def verify_identity(sock, session):
    print("\n[验证] Identity Object")
    
    attrs = {
        1: ("Name", "设备名称"),
        2: ("Vendor", "供应商ID"),
        3: ("ProductCode", "产品代码"),
        4: ("Revision", "修订版本"),
        5: ("Status", "状态"),
        6: ("Serial", "串行编号")
    }
    
    all_pass = True
    for attr, (name, desc) in attrs.items():
        try:
            cip = cip_get_attr(1, 1, attr)
            resp = send_rr(sock, session, cip)
            svc, st, data = parse_cip(resp)
            
            if st != 0:
                print(f"✗ {name} ({desc}): 错误 0x{st:02X}")
                all_pass = False
            else:
                # 解析属性值
                if len(data) > 4:
                    data_len = data[4]
                    attr_data = data[5:5+data_len]
                    if attr == 1:
                        value = attr_data.decode('ascii').rstrip('\x00')
                    elif attr in [2, 3, 4, 5]:
                        value = f"0x{int.from_bytes(attr_data[:2], 'little'):04X}"
                    elif attr == 6:
                        value = f"0x{int.from_bytes(attr_data[:4], 'little'):08X}"
                    else:
                        value = attr_data.hex()
                    print(f"✓ {name} ({desc}): {value}")
                else:
                    print(f"✓ {name} ({desc}): OK")
        except Exception as e:
            print(f"✗ {name} ({desc}): 异常 - {e}")
            all_pass = False
    
    return all_pass

def verify_tag_read(sock, session):
    print("\n[验证] Tag Read")
    
    tags = [
        ("IntTag", 0xC3, "INT"),
        ("RealTag", 0xCA, "REAL"),
        ("BoolTag", 0xC1, "BOOL"),
        ("StringTag", 0xD0, "STRING")
    ]
    
    all_pass = True
    for tag, dtype, name in tags:
        try:
            cip = cip_read_tag(tag)
            resp = send_rr(sock, session, cip)
            svc, st, data = parse_cip(resp)
            
            if st != 0:
                print(f"✗ {tag} ({name}): 失败 0x{st:02X}")
                all_pass = False
            else:
                # 解析数据值
                if len(data) > 6:
                    data_type = struct.unpack('<H', data[4:6])[0]
                    count = struct.unpack('<H', data[6:8])[0]
                    tag_data = data[8:]
                    
                    if name == "INT" and len(tag_data) >= 2:
                        value = struct.unpack('<h', tag_data[:2])[0]
                    elif name == "REAL" and len(tag_data) >= 4:
                        value = struct.unpack('<f', tag_data[:4])[0]
                    elif name == "BOOL" and len(tag_data) >= 1:
                        value = bool(tag_data[0])
                    elif name == "STRING" and len(tag_data) >= 2:
                        str_len = struct.unpack('<H', tag_data[:2])[0]
                        if len(tag_data) >= 2 + str_len:
                            value = tag_data[2:2+str_len].decode('ascii')
                        else:
                            value = tag_data[2:].decode('ascii').rstrip('\x00')
                    else:
                        value = tag_data[:8].hex()
                    
                    print(f"✓ {tag} ({name}): {value}")
                else:
                    print(f"✓ {tag} ({name}): OK")
        except Exception as e:
            print(f"✗ {tag} ({name}): 异常 - {e}")
            all_pass = False
    
    return all_pass

def verify_tag_write(sock, session):
    print("\n[验证] Tag Write")
    
    write_tests = [
        ("IntTag", 0xC3, struct.pack('<h', 12345), "INT"),
        ("RealTag", 0xCA, struct.pack('<f', 2.71828), "REAL"),
    ]
    
    all_pass = True
    for tag, dtype, value_bytes, name in write_tests:
        try:
            cip = cip_write_tag(tag, dtype, value_bytes)
            resp = send_rr(sock, session, cip)
            svc, st, data = parse_cip(resp)
            
            if st != 0:
                print(f"✗ {tag} ({name}): 写入失败 0x{st:02X}")
                all_pass = False
            else:
                print(f"✓ {tag} ({name}): 写入成功")
                
                # 验证写入结果
                try:
                    cip_read = cip_read_tag(tag)
                    resp_read = send_rr(sock, session, cip_read)
                    _, st_read, data_read = parse_cip(resp_read)
                    
                    if st_read == 0 and len(data_read) > 8:
                        tag_data = data_read[8:]
                        if name == "INT" and len(tag_data) >= 2:
                            read_value = struct.unpack('<h', tag_data[:2])[0]
                            expected = struct.unpack('<h', value_bytes)[0]
                        elif name == "REAL" and len(tag_data) >= 4:
                            read_value = struct.unpack('<f', tag_data[:4])[0]
                            expected = struct.unpack('<f', value_bytes)[0]
                        
                        if abs(read_value - expected) < 0.001:
                            print(f"  → 验证通过: {read_value}")
                        else:
                            print(f"  → 验证失败: 预期={expected}, 实际={read_value}")
                            all_pass = False
                except Exception as e:
                    print(f"  → 验证异常: {e}")
                    
        except Exception as e:
            print(f"✗ {tag} ({name}): 异常 - {e}")
            all_pass = False
    
    return all_pass

def verify_error(sock, session):
    print("\n[验证] Error Handling")
    
    all_pass = True
    
    # 测试无效标签
    try:
        cip = cip_read_tag("NotExistTag")
        resp = send_rr(sock, session, cip)
        svc, st, _ = parse_cip(resp)
        
        if st == 0:
            print("✗ 无效标签未返回错误")
            all_pass = False
        else:
            print(f"✓ 无效标签正确返回错误码: 0x{st:02X}")
    except Exception as e:
        print(f"✓ 无效标签正确返回异常: {e}")
    
    # 测试无效服务
    try:
        invalid_cip = bytes([0xFF, 0x02]) + struct.pack('<HH', 0x0001, 0x0001)
        resp = send_rr(sock, session, invalid_cip)
        svc, st, _ = parse_cip(resp)
        
        if st == 0:
            print("✗ 无效服务未返回错误")
            all_pass = False
        else:
            print(f"✓ 无效服务正确返回错误码: 0x{st:02X}")
    except Exception as e:
        print(f"✓ 无效服务正确返回异常: {e}")
    
    return all_pass

def verify_data_types(sock, session):
    print("\n[验证] Data Types")
    
    data_types = [
        ("BoolTag", "BOOL"),
        ("SintTag", "SINT"),
        ("IntTag", "INT"),
        ("DintTag", "DINT"),
        ("UsintTag", "USINT"),
        ("UintTag", "UINT"),
        ("UdintTag", "UDINT"),
        ("RealTag", "REAL"),
        ("LrealTag", "LREAL"),
        ("StringTag", "STRING"),
    ]
    
    all_pass = True
    for tag, dtype in data_types:
        try:
            cip = cip_read_tag(tag)
            resp = send_rr(sock, session, cip)
            svc, st, data = parse_cip(resp)
            
            if st != 0:
                print(f"✗ {dtype}: {tag} = 失败 0x{st:02X}")
                all_pass = False
            else:
                print(f"✓ {dtype}: {tag} = OK")
        except Exception as e:
            print(f"✗ {dtype}: {tag} = 异常 - {e}")
            all_pass = False
    
    return all_pass

# =============================================================================
# 十、主流程（最终验收）
# =============================================================================
def main():
    print("=" * 70)
    print("EtherNet/IP 协议级验证器")
    print("=" * 70)
    
    sock = None
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5.0)  # 设置5秒超时
        sock.connect(("127.0.0.1", 44818))
        print("\n✓ TCP 连接成功")
        
        session = register_session(sock)
        
        results = []
        results.append(verify_identity(sock, session))
        results.append(verify_data_types(sock, session))
        results.append(verify_tag_read(sock, session))
        results.append(verify_tag_write(sock, session))
        results.append(verify_error(sock, session))
        
        print("\n" + "=" * 70)
        print("验证结果汇总")
        print("=" * 70)
        
        if all(results):
            print("✓ 100% PASS - 所有验证项通过")
            return 0
        else:
            print("✗ FAIL - 部分验证项失败")
            return 1
            
    except Exception as e:
        print(f"\n✗ 致命错误: {e}")
        import traceback
        traceback.print_exc()
        return 1
    finally:
        if sock:
            sock.close()

if __name__ == "__main__":
    import sys
    sys.exit(main())
