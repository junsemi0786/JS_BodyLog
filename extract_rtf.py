import re
import sys

def decode_rtf(text):
    # 1. Decode \uN escapes (Unicode)
    def replace_unicode(match):
        try:
            code = int(match.group(1))
            if code < 0: code += 65536
            if 0xD800 <= code <= 0xDFFF: return ''
            return chr(code)
        except: return ''
    text = re.sub(r'\\u(-?\d+)[ ]?', replace_unicode, text)
    
    # 2. Decode \'XX escapes (likely CP949 for Korean RTF)
    def replace_hex(match):
        hex_str = match.group(0)
        matches = re.findall(r"\\\'([0-9a-fA-F]{2})", hex_str)
        try:
            raw_bytes = bytes.fromhex(''.join(matches))
            return raw_bytes.decode('cp949', errors='ignore')
        except:
            return ''
    
    # Match consecutive hex escapes
    text = re.sub(r"(\\\'[0-9a-fA-F]{2})+", replace_hex, text)
    
    # 3. Clean up RTF control words
    text = re.sub(r'\\[a-z0-9\-]+', ' ', text)
    text = re.sub(r'[{}]', '', text)
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            with open(sys.argv[1], 'r', encoding='ascii', errors='ignore') as f:
                content = f.read()
                decoded = decode_rtf(content)
                print(decoded.encode('utf-8', 'ignore').decode('utf-8'))
        except Exception as e:
            print(f"Error: {e}")
