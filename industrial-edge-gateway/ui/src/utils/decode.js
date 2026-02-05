export const base64ToUint8Array = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export const uint8ArrayToHex = (bytes) => {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
}

export const detectFileType = (bytes) => {
    if (bytes.length < 2) return null;
    
    const check = (magic) => {
        if (bytes.length < magic.length) return false;
        for (let i = 0; i < magic.length; i++) {
            if (bytes[i] !== magic[i]) return false;
        }
        return true;
    }

    if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) return { ext: 'png', mime: 'image/png', name: 'PNG Image' };
    if (check([0xFF, 0xD8, 0xFF])) return { ext: 'jpg', mime: 'image/jpeg', name: 'JPEG Image' };
    if (check([0x25, 0x50, 0x44, 0x46])) return { ext: 'pdf', mime: 'application/pdf', name: 'PDF Document' };
    if (check([0x50, 0x4B, 0x03, 0x04])) return { ext: 'zip', mime: 'application/zip', name: 'ZIP Archive' };
    if (check([0x1F, 0x8B])) return { ext: 'gz', mime: 'application/gzip', name: 'GZIP Archive' };
    if (check([0x42, 0x4D])) return { ext: 'bmp', mime: 'image/bmp', name: 'BMP Image' };
    if (check([0x47, 0x49, 0x46, 0x38])) return { ext: 'gif', mime: 'image/gif', name: 'GIF Image' };
    
    return null;
}

export const downloadBytes = (bytes, filename) => {
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
