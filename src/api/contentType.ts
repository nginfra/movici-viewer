const extensions: Record<string, string> = {
  'application/json': '.json',
  'application/msgpack': '.msgpack',
  'application/x-msgpack': '.msgpack',
  'application/netcdf': '.nc',
  'application/x-netcdf': '.nc',
  'text/csv': '.csv',
  'text/html': '.html',
  'text/plain': '.txt',
  'image/tiff': '.tif'
};

export function getExtension(contentType: string) {
  const mimetype = contentType.split(';')[0];
  const try_extension = extensions[mimetype];
  return try_extension ? try_extension : '.dat';
}
