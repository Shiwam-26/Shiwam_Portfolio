import os
import sys
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def do_GET(self):
        # Support HTTP 206 Range requests so Chrome download resumption works 100%
        range_header = self.headers.get('Range')
        path = self.translate_path(self.path)
        if range_header and os.path.isfile(path):
            file_size = os.path.getsize(path)
            range_match = re.search(r'bytes=(\d+)-(\d*)', range_header)
            if range_match:
                start = int(range_match.group(1))
                end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
                if start < file_size:
                    end = min(end, file_size - 1)
                    content_length = end - start + 1
                    self.send_response(206)
                    self.send_header('Content-Type', self.guess_type(path))
                    self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                    self.send_header('Content-Length', str(content_length))
                    if path.endswith('.pdf'):
                        self.send_header('Content-Disposition', 'attachment; filename="Shiwam_Kumar_Data_Analyst_Resume.pdf"')
                    self.end_headers()
                    try:
                        with open(path, 'rb') as f:
                            f.seek(start)
                            self.wfile.write(f.read(content_length))
                    except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
                        pass
                    return
        return super().do_GET()

    def handle(self):
        try:
            super().handle()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

    def log_message(self, format, *args):
        sys.stdout.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format % args))
        sys.stdout.flush()

if __name__ == '__main__':
    port = 8080
    server = ThreadingHTTPServer(('0.0.0.0', port), CustomHandler)
    print(f'Server listening on http://localhost:{port}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
