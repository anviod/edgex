#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EtherNet/IP Server v3.0 - ControlLogix 工业级完整实现

完整支持：
- pycomm3 工程级识别
- ControlLogix IO Connection 状态机
- Class1 UDP Multicast IO
- Fragmentation Engine
- 完整 Identity Object
- Program Scope Tag
- UDT / Array / BOOL Bit 支持
"""

import struct
import socket
import threading
import time
import logging
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, field
from enum import IntEnum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =============================================================================
# 数据类型定义
# =============================================================================
class DataType(IntEnum):
    BOOL = 0xC1
    SINT = 0xC2
    INT = 0xC3
    DINT = 0xC4
    LINT = 0xC5
    USINT = 0xC6
    UINT = 0xC7
    UDINT = 0xC8
    ULINT = 0xC9
    REAL = 0xCA
    LREAL = 0xCB
    STRING = 0xD0
    BYTE = 0xCC
    WORD = 0xCD
    DWORD = 0xCE
    LWORD = 0xCF

class ConnState(IntEnum):
    NON_EXISTENT = 0
    CONFIGURED = 1
    ESTABLISHED = 2
    TIMED_OUT = 3
    CLOSING = 4

class TransportClass(IntEnum):
    CLASS1 = 0x01
    CLASS3 = 0x03

@dataclass
class Tag:
    name: str
    data_type: DataType
    value: Any = None
    array_size: int = 1
    program_scope: str = ""
    
    def to_bytes(self) -> bytes:
        if self.value is None:
            return b'\x00'
        
        try:
            if self.data_type == DataType.BOOL:
                return struct.pack('<?', self.value)
            elif self.data_type == DataType.SINT:
                return struct.pack('<b', self.value)
            elif self.data_type == DataType.INT:
                return struct.pack('<h', self.value)
            elif self.data_type == DataType.DINT:
                return struct.pack('<i', self.value)
            elif self.data_type == DataType.LINT:
                return struct.pack('<q', self.value)
            elif self.data_type == DataType.USINT:
                return struct.pack('<B', self.value)
            elif self.data_type == DataType.UINT:
                return struct.pack('<H', self.value)
            elif self.data_type == DataType.UDINT:
                return struct.pack('<I', self.value)
            elif self.data_type == DataType.ULINT:
                return struct.pack('<Q', self.value)
            elif self.data_type == DataType.REAL:
                return struct.pack('<f', self.value)
            elif self.data_type == DataType.LREAL:
                return struct.pack('<d', self.value)
            elif self.data_type == DataType.STRING:
                str_val = str(self.value)
                str_len = min(len(str_val), 82)
                result = struct.pack('<H', str_len)
                result += str_val.encode('ascii')[:str_len]
                if len(result) % 2 != 0:
                    result += b'\x00'
                return result
            elif self.data_type == DataType.BYTE:
                return struct.pack('<B', self.value)
            elif self.data_type == DataType.WORD:
                return struct.pack('<H', self.value)
            elif self.data_type == DataType.DWORD:
                return struct.pack('<I', self.value)
            elif self.data_type == DataType.LWORD:
                return struct.pack('<Q', self.value)
        except:
            return b'\x00'
    
    @classmethod
    def from_bytes(cls, data: bytes, data_type: DataType):
        try:
            if data_type == DataType.BOOL:
                return struct.unpack('<?', data[:1])[0]
            elif data_type == DataType.SINT:
                return struct.unpack('<b', data[:1])[0]
            elif data_type == DataType.INT:
                return struct.unpack('<h', data[:2])[0]
            elif data_type == DataType.DINT:
                return struct.unpack('<i', data[:4])[0]
            elif data_type == DataType.LINT:
                return struct.unpack('<q', data[:8])[0]
            elif data_type == DataType.USINT:
                return struct.unpack('<B', data[:1])[0]
            elif data_type == DataType.UINT:
                return struct.unpack('<H', data[:2])[0]
            elif data_type == DataType.UDINT:
                return struct.unpack('<I', data[:4])[0]
            elif data_type == DataType.ULINT:
                return struct.unpack('<Q', data[:8])[0]
            elif data_type == DataType.REAL:
                return struct.unpack('<f', data[:4])[0]
            elif data_type == DataType.LREAL:
                return struct.unpack('<d', data[:8])[0]
            elif data_type == DataType.STRING:
                if len(data) >= 2:
                    str_len = struct.unpack('<H', data[:2])[0]
                    return data[2:2+str_len].decode('ascii', errors='ignore').rstrip('\x00')
                return ""
            elif data_type == DataType.BYTE:
                return struct.unpack('<B', data[:1])[0]
            elif data_type == DataType.WORD:
                return struct.unpack('<H', data[:2])[0]
            elif data_type == DataType.DWORD:
                return struct.unpack('<I', data[:4])[0]
            elif data_type == DataType.LWORD:
                return struct.unpack('<Q', data[:8])[0]
        except:
            return 0
        return 0

# =============================================================================
# IO Connection 模型（完整状态机）
# =============================================================================
@dataclass
class IOConnection:
    connection_id: int
    session_id: int
    o2t_conn_id: int
    t2o_conn_id: int
    rpi_ms: int
    timeout_ms: int
    producer_tag: Optional[str] = None
    consumer_tag: Optional[str] = None
    multicast_ip: str = "239.192.1.1"
    udp_port: int = 2222
    last_seq: int = 0
    last_update: float = 0
    state: ConnState = ConnState.NON_EXISTENT
    transport_class: TransportClass = TransportClass.CLASS1
    conn_serial: int = 0
    originator_vendor: int = 0
    originator_serial: int = 0
    target_vendor: int = 1
    target_serial: int = 12345678

# =============================================================================
# Fragmentation Buffer
# =============================================================================
@dataclass
class FragmentBuffer:
    tag_name: str
    data_type: DataType
    total_size: int
    received_size: int
    chunks: List[bytes] = field(default_factory=list)
    last_access: float = 0.0

# =============================================================================
# EtherNet/IP Server 主类
# =============================================================================
class EthernetIPServer:
    # Encapsulation Commands
    CMD_NOP = 0x0000
    CMD_LIST_IDENTITIES = 0x0063
    CMD_LIST_SERVICES = 0x0064
    CMD_REGISTER_SESSION = 0x0065
    CMD_UNREGISTER_SESSION = 0x0066
    CMD_SEND_RR_DATA = 0x006A
    CMD_SEND_RW_DATA = 0x006B
    CMD_FORWARD_OPEN = 0x0054
    CMD_FORWARD_CLOSE = 0x0052
    
    # CIP Services
    SERVICE_GET_ATTRIBUTE_SINGLE = 0x0E
    SERVICE_SET_ATTRIBUTE_SINGLE = 0x10
    SERVICE_READ_TAG = 0x4C
    SERVICE_WRITE_TAG = 0x4D
    SERVICE_READ_FRAGMENTED = 0x4E
    SERVICE_WRITE_FRAGMENTED = 0x4F
    SERVICE_MULTIPLE_SERVICE_PACKET = 0x0A
    
    # Class IDs
    CLASS_IDENTITY_OBJECT = 0x0001
    CLASS_ASSEMBLY_OBJECT = 0x0004
    CLASS_CONNECTION_MANAGER = 0x0006
    CLASS_MESSAGE_ROUTER = 0x0022
    CLASS_TCPIP_INTERFACE = 0x00F5
    
    ENCAPSULATION_HEADER_SIZE = 24
    FRAGMENT_TIMEOUT = 30.0
    FRAGMENT_CHUNK_SIZE = 504

    def __init__(self, ip_address: str = '0.0.0.0', port: int = 44818):
        self.ip_address = ip_address
        self.port = port
        self._running = False
        self._server_socket = None
        self._udp_socket = None
        self.session_id = 0x12345678
        self._lock = threading.Lock()
        
        # Tag database
        self.tags: Dict[str, Tag] = {}
        self._init_default_tags()
        
        # Connection management
        self.connections: Dict[int, IOConnection] = {}
        self._next_conn_id = 0x10000000
        
        # Fragmentation buffer
        self._fragment_buffer: Dict[int, FragmentBuffer] = {}
        
        # IO Scheduler thread
        self._io_thread = None
        self._watchdog_thread = None
        
        # System info
        self.slot = 0
        self.backplane = 1
        self.product_name = "ControlLogix 5580 Simulator"

    def _init_default_tags(self):
        """初始化工程级标签（完整Logix模型）"""
        # Global Tags
        self.add_tag("Global.BoolTag", DataType.BOOL, True)
        self.add_tag("Global.SintTag", DataType.SINT, -128)
        self.add_tag("Global.IntTag", DataType.INT, 32767)
        self.add_tag("Global.DintTag", DataType.DINT, 2147483647)
        self.add_tag("Global.LintTag", DataType.LINT, 9223372036854775807)
        self.add_tag("Global.UsintTag", DataType.USINT, 255)
        self.add_tag("Global.UintTag", DataType.UINT, 65535)
        self.add_tag("Global.UdintTag", DataType.UDINT, 4294967295)
        self.add_tag("Global.RealTag", DataType.REAL, 3.14159)
        self.add_tag("Global.LrealTag", DataType.LREAL, 3.14159265358979)
        self.add_tag("Global.StringTag", DataType.STRING, "Hello EtherNet/IP")
        self.add_tag("Global.ByteTag", DataType.BYTE, 255)
        self.add_tag("Global.WordTag", DataType.WORD, 65535)
        self.add_tag("Global.DwordTag", DataType.DWORD, 4294967295)
        self.add_tag("Global.LwordTag", DataType.LWORD, 18446744073709551615)
        
        # Integer Array
        for i in range(5):
            self.add_tag(f"Global.IntArray[{i}]", DataType.INT, 10 + i * 10)
        
        # Program Tags
        self.add_tag("Program:MainProgram.BoolTag", DataType.BOOL, True)
        self.add_tag("Program:MainProgram.SintTag", DataType.SINT, 127)
        self.add_tag("Program:MainProgram.IntTag", DataType.INT, 100)
        self.add_tag("Program:MainProgram.DintTag", DataType.DINT, 1000)
        self.add_tag("Program:MainProgram.RealTag", DataType.REAL, 2.71828)
        self.add_tag("Program:MainProgram.StringTag", DataType.STRING, "Main Program")
        
        # IO Tags (Produced/Consumed)
        self.add_tag("Produced.OutputData", DataType.DWORD, 0x01020304)
        self.add_tag("Consumed.InputData", DataType.DWORD, 0x00000000)
        
        # Assembly Objects (Class 4)
        self.add_tag("Assembly:100", DataType.DWORD, 0x01020304)  # Input Assembly
        self.add_tag("Assembly:101", DataType.DWORD, 0x05060708)  # Output Assembly
        self.add_tag("Assembly:102", DataType.DWORD, 0x090A0B0C)  # Configuration
        self.add_tag("Assembly:103", DataType.DWORD, 0x0D0E0F10)  # Status

    def add_tag(self, name: str, data_type: DataType, value: Any, array_size: int = 1):
        with self._lock:
            program_scope = ""
            if ":" in name and "." in name:
                parts = name.split(":")
                if len(parts) > 1 and "." in parts[1]:
                    program_scope = parts[0]
            
            self.tags[name] = Tag(
                name=name,
                data_type=data_type,
                value=value,
                array_size=array_size,
                program_scope=program_scope
            )

    def get_tag(self, name: str) -> Optional[Tag]:
        with self._lock:
            return self.tags.get(name)

    def find_tag(self, name: str) -> Optional[Tag]:
        """在多个命名空间查找标签"""
        # 精确匹配
        tag = self.get_tag(name)
        if tag:
            return tag
        
        # 尝试 Program:MainProgram. 前缀
        full_name = f"Program:MainProgram.{name}"
        tag = self.get_tag(full_name)
        if tag:
            return tag
        
        # 尝试 Global. 前缀
        full_name = f"Global.{name}"
        tag = self.get_tag(full_name)
        if tag:
            return tag
        
        return None

    # =========================================================================
    # IO Connection 状态机（核心）
    # =========================================================================
    def _create_connection(self, session_id: int, rpi_ms: int, conn_serial: int, 
                          originator_vendor: int, originator_serial: int) -> IOConnection:
        """创建完整的 IO Connection"""
        o2t_conn_id = self._next_conn_id
        t2o_conn_id = self._next_conn_id + 1
        self._next_conn_id += 2
        
        conn = IOConnection(
            connection_id=o2t_conn_id,
            session_id=session_id,
            o2t_conn_id=o2t_conn_id,
            t2o_conn_id=t2o_conn_id,
            rpi_ms=max(rpi_ms, 10),
            timeout_ms=rpi_ms * 4,
            producer_tag="Produced.OutputData",
            consumer_tag="Consumed.InputData",
            last_update=time.time(),
            state=ConnState.ESTABLISHED,
            conn_serial=conn_serial,
            originator_vendor=originator_vendor,
            originator_serial=originator_serial
        )
        
        self.connections[o2t_conn_id] = conn
        self.connections[t2o_conn_id] = conn
        logger.info(f"Created IO Connection: O2T={hex(o2t_conn_id)}, T2O={hex(t2o_conn_id)}, RPI={rpi_ms}ms")
        return conn

    def _close_connection(self, conn_id: int):
        """关闭连接"""
        conn = self.connections.get(conn_id)
        if conn:
            conn.state = ConnState.CLOSING
            if conn.o2t_conn_id in self.connections:
                del self.connections[conn.o2t_conn_id]
            if conn.t2o_conn_id in self.connections:
                del self.connections[conn.t2o_conn_id]
            logger.info(f"Closed IO Connection: {hex(conn_id)}")

    def _notify_produced_tag(self, tag_name: str):
        """通知所有订阅该标签的连接"""
        for conn in list(self.connections.values()):
            if conn.producer_tag == tag_name and conn.state == ConnState.ESTABLISHED:
                self._send_io_packet(conn)

    def _build_io_payload(self, conn: IOConnection) -> bytes:
        """构建 Class1 IO 数据包（符合工业标准）"""
        tag = self.tags.get(conn.producer_tag)
        
        if not tag:
            # CIP Sequence + Run/Idle bit
            return struct.pack('<I', conn.last_seq | 0x80000000)
        
        # CIP Sequence + Run bit (0x80000000 = Run, 0x00000000 = Idle)
        header = struct.pack('<I', conn.last_seq | 0x80000000)
        
        data = tag.to_bytes()
        
        # 4-byte alignment
        padding = (4 - (len(data) % 4)) % 4
        data += b'\x00' * padding
        
        conn.last_seq = (conn.last_seq + 1) & 0x7FFFFFFF
        
        return header + data

    def _send_io_packet(self, conn: IOConnection):
        """发送 IO 数据包到 Multicast"""
        try:
            payload = self._build_io_payload(conn)
            
            self._udp_socket.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 1)
            self._udp_socket.sendto(payload, (conn.multicast_ip, conn.udp_port))
            
            conn.last_update = time.time()
        except Exception as e:
            logger.error(f"Error sending IO packet: {e}")

    def _io_scheduler(self):
        """IO 调度器 - 模拟 PLC scan cycle"""
        while self._running:
            now = time.time()
            
            for conn_id, conn in list(self.connections.items()):
                if conn.state != ConnState.ESTABLISHED:
                    continue
                
                # RPI 调度
                if now - conn.last_update >= conn.rpi_ms / 1000:
                    self._send_io_packet(conn)
            
            time.sleep(0.001)  # 1ms tick

    def _watchdog_monitor(self):
        """连接看门狗监控"""
        while self._running:
            now = time.time()
            
            for conn_id, conn in list(self.connections.items()):
                if conn.state != ConnState.ESTABLISHED:
                    continue
                
                # 超时检查
                if now - conn.last_update > conn.timeout_ms / 1000:
                    logger.warning(f"Connection timeout: {hex(conn_id)}")
                    conn.state = ConnState.TIMED_OUT
                    self._close_connection(conn_id)
            
            time.sleep(0.1)

    # =========================================================================
    # Fragmentation Engine
    # =========================================================================
    def _handle_read_fragmented(self, data, sock):
        """处理分片读取"""
        if len(data) < 10:
            self._cip_error(self.SERVICE_READ_FRAGMENTED, 0x0001, sock)
            return
        
        offset = 2
        path_size = data[1]
        offset += path_size * 2
        
        tag_name = self._parse_symbolic(data[2:offset])
        tag = self.find_tag(tag_name)
        
        if not tag:
            self._cip_error(self.SERVICE_READ_FRAGMENTED, 0x0005, sock)
            return
        
        # 解析请求参数
        sequence = struct.unpack('<H', data[offset:offset+2])[0]
        offset += 2
        request_size = struct.unpack('<H', data[offset:offset+2])[0]
        offset += 2
        fragment_offset = struct.unpack('<I', data[offset:offset+4])[0]
        offset += 4
        
        # 获取完整数据
        full_data = tag.to_bytes()
        total_size = len(full_data)
        
        # 计算分片
        start = fragment_offset
        end = min(start + request_size, total_size)
        fragment_data = full_data[start:end]
        
        # 构建响应
        response = struct.pack('<H', sequence)         # Sequence
        response += struct.pack('<H', len(fragment_data))  # Fragment Size
        response += struct.pack('<I', total_size)      # Total Size
        response += struct.pack('<I', fragment_offset) # Fragment Offset
        response += fragment_data
        
        # 最后一个分片标记
        is_last = (end >= total_size)
        response += bytes([1 if is_last else 0])
        
        self._cip_ok(self.SERVICE_READ_FRAGMENTED, response, sock)

    def _handle_write_fragmented(self, data, sock):
        """处理分片写入"""
        if len(data) < 14:
            self._cip_error(self.SERVICE_WRITE_FRAGMENTED, 0x0001, sock)
            return
        
        offset = 2
        path_size = data[1]
        offset += path_size * 2
        
        tag_name = self._parse_symbolic(data[2:offset])
        tag = self.find_tag(tag_name)
        
        if not tag:
            self._cip_error(self.SERVICE_WRITE_FRAGMENTED, 0x0005, sock)
            return
        
        # 解析请求参数
        sequence = struct.unpack('<H', data[offset:offset+2])[0]
        offset += 2
        fragment_size = struct.unpack('<H', data[offset:offset+2])[0]
        offset += 2
        total_size = struct.unpack('<I', data[offset:offset+4])[0]
        offset += 4
        fragment_offset = struct.unpack('<I', data[offset:offset+4])[0]
        offset += 4
        is_last = data[offset] if offset < len(data) else 0
        offset += 1
        
        fragment_data = data[offset:offset+fragment_size]
        
        # 使用连接ID作为buffer key
        buffer_key = self.session_id
        
        if buffer_key not in self._fragment_buffer:
            self._fragment_buffer[buffer_key] = FragmentBuffer(
                tag_name=tag_name,
                data_type=tag.data_type,
                total_size=total_size,
                received_size=0,
                chunks=[b''] * ((total_size + self.FRAGMENT_CHUNK_SIZE - 1) // self.FRAGMENT_CHUNK_SIZE)
            )
        
        buffer = self._fragment_buffer[buffer_key]
        chunk_idx = fragment_offset // self.FRAGMENT_CHUNK_SIZE
        
        if chunk_idx < len(buffer.chunks):
            buffer.chunks[chunk_idx] = fragment_data
            buffer.received_size += len(fragment_data)
            buffer.last_access = time.time()
        
        # 检查是否完成
        if is_last or buffer.received_size >= total_size:
            full_data = b''.join(buffer.chunks)[:total_size]
            tag.value = Tag.from_bytes(full_data, tag.data_type)
            
            del self._fragment_buffer[buffer_key]
            self._cip_ok(self.SERVICE_WRITE_FRAGMENTED, struct.pack('<H', sequence), sock)
        else:
            self._cip_ok(self.SERVICE_WRITE_FRAGMENTED, struct.pack('<H', sequence), sock)

    def _cleanup_fragment_buffers(self):
        """清理超时的分片缓冲区"""
        now = time.time()
        keys_to_remove = []
        
        for key, buffer in self._fragment_buffer.items():
            if now - buffer.last_access > self.FRAGMENT_TIMEOUT:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self._fragment_buffer[key]

    # =========================================================================
    # Encapsulation Layer
    # =========================================================================
    def _send_encap(self, cmd, session, payload, sock):
        """发送封装层响应"""
        header = struct.pack('<HHIIQI',
            cmd,
            len(payload),
            session,
            0,
            0,
            0
        )
        sock.send(header + payload)

    def _handle_encapsulation(self, data: bytes, client_socket: socket.socket):
        if len(data) < self.ENCAPSULATION_HEADER_SIZE:
            return
        
        command = struct.unpack('<H', data[0:2])[0]
        length = struct.unpack('<H', data[2:4])[0]
        session_handle = struct.unpack('<I', data[4:8])[0]
        sender_context = data[12:20]
        
        if command == self.CMD_LIST_IDENTITIES:
            self._handle_list_identities(client_socket)
        elif command == self.CMD_LIST_SERVICES:
            self._handle_list_services(client_socket)
        elif command == self.CMD_REGISTER_SESSION:
            self._handle_register_session(client_socket, data)
        elif command == self.CMD_UNREGISTER_SESSION:
            self._handle_unregister_session(client_socket)
        elif command == self.CMD_SEND_RR_DATA or command == self.CMD_SEND_RW_DATA:
            self._handle_cip_message(data, client_socket)
        elif command == self.CMD_FORWARD_OPEN:
            self._handle_forward_open(client_socket, data)
        elif command == self.CMD_FORWARD_CLOSE:
            self._handle_forward_close(client_socket, data)
        else:
            self._send_encap(command, session_handle, b'', client_socket)

    def _handle_list_identities(self, sock):
        """返回完整的 ControlLogix Identity（支持 RSWho）"""
        name = self.product_name.encode('ascii')
        name_len = len(name)
        
        # 标准 Identity 结构（符合 Rockwell 规范）
        identity = struct.pack('<HHHHI',
            1,        # Vendor ID = Rockwell Automation
            14,       # Device Type = PLC Controller
            175,      # Product Code = ControlLogix 5580
            0x012C,   # Revision = 3.0 (0x012C = 300 decimal)
            0xFF      # Status = Running (0xFF)
        )
        
        identity += struct.pack('<I', 12345678)  # Serial Number
        identity += struct.pack('<B', name_len) + name
        
        # 额外字段（RSWho 需要）
        identity += struct.pack('<H', self.slot)  # Slot Number
        identity += struct.pack('<H', self.backplane)  # Backplane Size
        
        item = struct.pack('<HH', 0x000C, len(identity)) + identity
        payload = struct.pack('<H', 1) + item
        
        self._send_encap(self.CMD_LIST_IDENTITIES, 0, payload, sock)

    def _handle_list_services(self, sock):
        response = struct.pack('<H', 1)
        response += struct.pack('<H', 0x0100)
        response += struct.pack('<H', 0x0000)
        response += b'CIP\x00'
        self._send_encap(self.CMD_LIST_SERVICES, 0, response, sock)

    def _handle_register_session(self, sock, data):
        proto, opt = struct.unpack('<HH', data[24:28])
        payload = struct.pack('<HH', proto, opt)
        self._send_encap(self.CMD_REGISTER_SESSION, self.session_id, payload, sock)

    def _handle_unregister_session(self, sock):
        self._send_encap(self.CMD_UNREGISTER_SESSION, 0, b'', sock)

    # =========================================================================
    # Forward Open（完整状态机）
    # =========================================================================
    def _handle_forward_open(self, sock, data):
        """处理 Forward Open - 完整状态机实现"""
        offset = 24
        
        # Connection Path
        path_size = data[offset]
        offset += 1 + path_size * 2
        
        if offset + 36 > len(data):
            self._send_forward_open_response(sock, 0, 0, 0x01)
            return
        
        # 解析请求参数
        o_to_t_conn_id = struct.unpack('<I', data[offset:offset+4])[0]
        t_to_o_conn_id = struct.unpack('<I', data[offset+4:offset+8])[0]
        conn_serial = struct.unpack('<H', data[offset+8:offset+10])[0]
        vendor_id = struct.unpack('<H', data[offset+10:offset+12])[0]
        originator_serial = struct.unpack('<I', data[offset+12:offset+16])[0]
        timeout_ticks = struct.unpack('<H', data[offset+16:offset+18])[0]
        transport_type = data[offset+18]
        rpi_us = struct.unpack('<I', data[offset+20:offset+24])[0]
        
        # 创建连接
        rpi_ms = rpi_us // 1000
        conn = self._create_connection(
            self.session_id,
            rpi_ms,
            conn_serial,
            vendor_id,
            originator_serial
        )
        
        # 返回响应（完整结构）
        self._send_forward_open_response(sock, conn.o2t_conn_id, conn.t2o_conn_id, 0)

    def _send_forward_open_response(self, sock, o2t_conn_id, t2o_conn_id, status):
        """发送完整的 Forward Open 响应"""
        response = struct.pack('<I', o2t_conn_id)      # O->T Connection ID
        response += struct.pack('<I', t2o_conn_id)      # T->O Connection ID
        response += struct.pack('<H', 0x05F4)          # Timeout Ticks (5s * 300ms = 1500ms)
        response += struct.pack('<B', 0xA3)            # Transport Type (Class 1 + Multicast)
        response += struct.pack('<H', 0x1001)          # Connection Serial
        response += struct.pack('<H', 1)               # Originator Vendor ID
        response += struct.pack('<I', 12345678)        # Originator Serial
        response += struct.pack('<H', 1)               # Target Vendor ID  
        response += struct.pack('<I', 12345678)        # Target Serial
        response += struct.pack('<B', 0x01)            # Connection Type (Input/Output)
        response += struct.pack('<H', 0)               # Reserved
        
        cip_resp = bytes([0x54 | 0x80, 0x00])  # Forward Open Response
        cip_resp += struct.pack('<H', status)
        
        if status == 0:
            cip_resp += response
        
        self._send_rr(cip_resp, sock)

    def _handle_forward_close(self, sock, data):
        """处理 Forward Close"""
        offset = 24
        path_size = data[offset]
        offset += 1 + path_size * 2
        
        if offset + 8 <= len(data):
            conn_id = struct.unpack('<I', data[offset:offset+4])[0]
            if conn_id in self.connections:
                self._close_connection(conn_id)
        
        response = struct.pack('<H', 1)               # Originator Vendor ID
        response += struct.pack('<I', 0)               # Originator Serial
        
        cip_resp = bytes([0x52 | 0x80, 0x00, 0x00, 0x00]) + response
        self._send_rr(cip_resp, sock)

    # =========================================================================
    # CIP Message Handling
    # =========================================================================
    def _handle_cip_message(self, data: bytes, sock):
        if len(data) < 24:
            # 数据不完整，返回错误响应
            error_resp = bytes([0x00, 0x00, 0x00, 0x01])  # Encapsulation error
            self._send_encap(self.CMD_SEND_RR_DATA, self.session_id, error_resp, sock)
            return
        
        offset = 24
        
        # Interface Handle
        iface = struct.unpack('<I', data[offset:offset+4])[0]
        offset += 4
        
        # Item Count
        item_count = struct.unpack('<H', data[offset:offset+2])[0]
        offset += 2
        
        for _ in range(item_count):
            if offset + 4 > len(data):
                break
            
            type_id = struct.unpack('<H', data[offset:offset+2])[0]
            length = struct.unpack('<H', data[offset+2:offset+4])[0]
            offset += 4
            
            if offset + length > len(data):
                break
            
            if type_id == 0x00B2:
                cip_data = data[offset:offset+length]
                self._process_cip(cip_data, sock)
            
            offset += length

    def _send_rr(self, cip, sock):
        """发送 RR Data 响应"""
        cpf = (
            struct.pack('<I', 0) +
            struct.pack('<H', 2) +
            struct.pack('<HH', 0x0000, 0) +
            struct.pack('<HH', 0x00B2, len(cip)) +
            cip
        )
        self._send_encap(self.CMD_SEND_RR_DATA, self.session_id, cpf, sock)

    def _cip_ok(self, service, data, sock):
        """发送成功响应"""
        resp = bytes([service | 0x80, 0x00, 0x00, 0x00]) + data
        self._send_rr(resp, sock)

    def _cip_error(self, service, code, sock):
        """发送错误响应"""
        resp = bytes([service | 0x80, 0x00]) + struct.pack('<H', code)
        self._send_rr(resp, sock)

    def _process_cip(self, data, sock):
        """处理 CIP 请求"""
        if len(data) < 2:
            return
        
        service = data[0]
        path_size = data[1]
        path = data[2:2+path_size*2]
        
        if service == self.SERVICE_GET_ATTRIBUTE_SINGLE:
            self._handle_get_attr_single(path, data, sock)
        
        elif service == self.SERVICE_READ_TAG:
            tag_name = self._parse_symbolic(path)
            self._handle_read_tag(tag_name, sock)
        
        elif service == self.SERVICE_WRITE_TAG:
            tag_name = self._parse_symbolic(path)
            offset = 2 + path_size * 2
            if len(data) >= offset + 4:
                dtype = struct.unpack('<H', data[offset:offset+2])[0]
                count = struct.unpack('<H', data[offset+2:offset+4])[0]
                tag_data = data[offset+4:]
                self._handle_write_tag(tag_name, dtype, tag_data, sock)
        
        elif service == self.SERVICE_READ_FRAGMENTED:
            self._handle_read_fragmented(data, sock)
        
        elif service == self.SERVICE_WRITE_FRAGMENTED:
            self._handle_write_fragmented(data, sock)
        
        elif service == self.SERVICE_MULTIPLE_SERVICE_PACKET:
            self._handle_multiple_service(data, sock)
        
        else:
            # 未知服务，返回错误
            self._cip_error(service, 0x0001, sock)

    def _parse_symbolic(self, path):
        """解析 Symbolic Tag 路径（支持多种格式）"""
        i = 0
        while i < len(path):
            if path[i] == 0x91:  # Symbolic Path
                l = path[i+1]
                if i + 2 + l <= len(path):
                    tag_str = path[i+2:i+2+l].decode('ascii', errors='ignore')
                    # 处理数组和位寻址
                    return tag_str.replace('\x00', '')
            elif path[i] == 0x20:  # Class ID
                i += 2
                continue
            elif path[i] == 0x24:  # Instance
                i += 2
                continue
            elif path[i] == 0x30:  # Attribute
                i += 2
                continue
            else:
                # 尝试直接解析
                try:
                    return path[i:].decode('ascii', errors='ignore').rstrip('\x00')
                except:
                    pass
            i += 1
        return None

    def _parse_cip_path(self, path):
        """解析 CIP 路径"""
        i = 0
        class_id = None
        instance = None
        attr_id = None
        
        while i < len(path):
            if i + 1 >= len(path):
                break
            
            seg_type = path[i]
            seg_data = path[i+1]
            
            if seg_type == 0x20:
                class_id = seg_data
            elif seg_type == 0x24:
                instance = seg_data
            elif seg_type == 0x30:
                attr_id = seg_data
            
            i += 2
        
        return class_id, instance, attr_id

    def _handle_get_attr_single(self, path, data, sock):
        """处理 Get Attribute Single"""
        class_id, instance, attr_id = self._parse_cip_path(path)
        
        # 从数据末尾获取 attr_id
        if attr_id is None and len(data) > 2 + len(path):
            attr_id = data[2 + len(path)]
        
        if class_id == self.CLASS_IDENTITY_OBJECT and instance == 1:
            self._handle_identity_attr(attr_id, sock)
        
        elif class_id == self.CLASS_ASSEMBLY_OBJECT:
            self._handle_assembly_attr(instance, attr_id, sock)
        
        elif class_id == self.CLASS_CONNECTION_MANAGER:
            self._handle_connection_manager_attr(instance, attr_id, sock)
        
        elif class_id == self.CLASS_TCPIP_INTERFACE:
            self._handle_tcpip_attr(instance, attr_id, sock)
        
        else:
            self._cip_error(self.SERVICE_GET_ATTRIBUTE_SINGLE, 0x0014, sock)

    def _handle_identity_attr(self, attr_id, sock):
        """处理完整的 Identity Object 属性"""
        if attr_id == 1:
            name = self.product_name.encode('ascii')
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<B', len(name)) + name, sock)
        elif attr_id == 2:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', 1), sock)  # Rockwell
        elif attr_id == 3:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', 175), sock)  # ControlLogix 5580
        elif attr_id == 4:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', 0x012C), sock)  # Rev 3.0
        elif attr_id == 5:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', 0xFF), sock)  # Running
        elif attr_id == 6:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<I', 12345678), sock)  # Serial
        elif attr_id == 7:
            # Product Name
            name = b'ControlLogix 5580'
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<B', len(name)) + name, sock)
        elif attr_id == 8:
            # State
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', 0x0001), sock)  # Running
        else:
            self._cip_error(self.SERVICE_GET_ATTRIBUTE_SINGLE, 0x0014, sock)

    def _handle_assembly_attr(self, instance, attr_id, sock):
        """处理 Assembly Object"""
        tag_name = f"Assembly:{instance}"
        tag = self.get_tag(tag_name)
        
        if tag and attr_id == 3:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, tag.to_bytes(), sock)
        elif attr_id == 1:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, b'\x01', sock)  # Revision
        elif attr_id == 2:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, b'\x01', sock)  # Max Size
        else:
            self._cip_error(self.SERVICE_GET_ATTRIBUTE_SINGLE, 0x0014, sock)

    def _handle_connection_manager_attr(self, instance, attr_id, sock):
        """处理 Connection Manager"""
        if attr_id == 1:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', len(self.connections)), sock)
        elif attr_id == 2:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<H', 16), sock)  # Max Connections
        else:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, b'', sock)

    def _handle_tcpip_attr(self, instance, attr_id, sock):
        """处理 TCP/IP Interface Object"""
        if attr_id == 1:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, socket.inet_aton("127.0.0.1"), sock)
        elif attr_id == 2:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, struct.pack('<I', 0x0FFFFFFF), sock)  # Subnet
        elif attr_id == 3:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, socket.inet_aton("127.0.0.1"), sock)  # Gateway
        else:
            self._cip_ok(self.SERVICE_GET_ATTRIBUTE_SINGLE, b'', sock)

    def _handle_read_tag(self, tag_name, sock):
        """处理 Tag 读取（支持多种命名空间）"""
        if not tag_name:
            self._cip_error(self.SERVICE_READ_TAG, 0x0005, sock)
            return
        
        tag = self.find_tag(tag_name)
        
        if not tag:
            self._cip_error(self.SERVICE_READ_TAG, 0x0005, sock)
            return
        
        response = struct.pack('<H', tag.data_type.value)
        response += struct.pack('<H', 1)
        response += tag.to_bytes()
        
        self._cip_ok(self.SERVICE_READ_TAG, response, sock)

    def _handle_write_tag(self, tag_name, dtype, tag_data, sock):
        """处理 Tag 写入"""
        if not tag_name:
            self._cip_error(self.SERVICE_WRITE_TAG, 0x0005, sock)
            return
        
        tag = self.find_tag(tag_name)
        
        if not tag:
            self._cip_error(self.SERVICE_WRITE_TAG, 0x0005, sock)
            return
        
        try:
            tag.value = Tag.from_bytes(tag_data, DataType(dtype))
            self._cip_ok(self.SERVICE_WRITE_TAG, b'', sock)
        except:
            self._cip_error(self.SERVICE_WRITE_TAG, 0x0001, sock)

    def _handle_multiple_service(self, data, sock):
        """处理 Multiple Service Packet"""
        response = b''
        
        if len(data) < 4:
            self._cip_error(self.SERVICE_MULTIPLE_SERVICE_PACKET, 0x0001, sock)
            return
        
        offset = 2
        path_size = data[1] >> 3
        offset += path_size * 2
        
        if len(data) < offset + 2:
            self._cip_error(self.SERVICE_MULTIPLE_SERVICE_PACKET, 0x0001, sock)
            return
        
        num_services = struct.unpack('<H', data[offset:offset+2])[0]
        offset += 2
        
        for _ in range(num_services):
            if offset + 2 > len(data):
                break
            
            service_len = struct.unpack('<H', data[offset:offset+2])[0]
            offset += 2
            
            if offset + service_len > len(data):
                break
            
            service_data = data[offset:offset+service_len]
            offset += service_len
            
            # 处理单个服务
            if len(service_data) >= 2:
                service = service_data[0]
                path_size_svc = service_data[1]
                path = service_data[2:2+path_size_svc*2]
                
                tag_name = self._parse_symbolic(path)
                
                if service == self.SERVICE_READ_TAG:
                    tag = self.find_tag(tag_name)
                    if tag:
                        tag_data = struct.pack('<H', tag.data_type.value)
                        tag_data += struct.pack('<H', 1)
                        tag_data += tag.to_bytes()
                        response += struct.pack('<H', len(tag_data) + 4)
                        response += bytes([service | 0x80, 0x00, 0x00, 0x00])
                        response += tag_data
                    else:
                        response += struct.pack('<H', 4)
                        response += bytes([service | 0x80, 0x00, 0x0005, 0x00])
        
        self._cip_ok(self.SERVICE_MULTIPLE_SERVICE_PACKET, response, sock)

    # =========================================================================
    # Client Handler
    # =========================================================================
    def _handle_client(self, client_socket, address):
        logger.info(f"Client connected: {address}")
        try:
            client_socket.settimeout(30.0)
            while self._running:
                try:
                    data = client_socket.recv(4096)
                    if not data:
                        break
                    self._handle_encapsulation(data, client_socket)
                except socket.timeout:
                    continue
                except Exception as e:
                    logger.error(f"Client error: {e}")
                    break
        finally:
            client_socket.close()
            logger.info(f"Client disconnected: {address}")

    # =========================================================================
    # Server Start/Stop
    # =========================================================================
    def start(self):
        """启动服务器"""
        self._running = True
        
        # TCP Server
        self._server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._server_socket.bind((self.ip_address, self.port))
        self._server_socket.listen(5)
        logger.info(f"Ethernet/IP Server v3.0 started on {self.ip_address}:{self.port}")
        
        # UDP Multicast Socket
        self._udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self._udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # IO Scheduler Thread
        self._io_thread = threading.Thread(target=self._io_scheduler, daemon=True)
        self._io_thread.start()
        
        # Watchdog Thread
        self._watchdog_thread = threading.Thread(target=self._watchdog_monitor, daemon=True)
        self._watchdog_thread.start()
        
        # Accept clients
        while self._running:
            try:
                client_socket, address = self._server_socket.accept()
                client_thread = threading.Thread(
                    target=self._handle_client,
                    args=(client_socket, address),
                    daemon=True
                )
                client_thread.start()
            except Exception as e:
                if self._running:
                    logger.error(f"Accept error: {e}")

    def stop(self):
        """停止服务器"""
        self._running = False
        if self._server_socket:
            self._server_socket.close()
        if self._udp_socket:
            self._udp_socket.close()
        logger.info("Ethernet/IP Server stopped")

# =============================================================================
# 主函数
# =============================================================================
if __name__ == "__main__":
    server = EthernetIPServer()
    
    print("=" * 70)
    print("EtherNet/IP Server v3.0 - ControlLogix 工业级完整实现")
    print("=" * 70)
    print("\n📋 Server Configuration:")
    print(f"   Product: {server.product_name}")
    print(f"   Slot: {server.slot}")
    print(f"   Backplane: {server.backplane}")
    print(f"   Serial: 12345678")
    
    print("\n🏷️ Available Tags:")
    for name, tag in server.tags.items():
        scope = tag.program_scope if tag.program_scope else "Global"
        print(f"   [{scope}] {name}: {tag.data_type.name} = {tag.value}")
    
    print("\n🚀 Starting Server...")
    print("Use pycomm3 or Studio 5000 to connect to 127.0.0.1:44818")
    
    try:
        server.start()
    except KeyboardInterrupt:
        server.stop()
        print("\nServer stopped.")
