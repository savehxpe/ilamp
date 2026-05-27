import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const compressibleAsset = /\.(js|css|html|svg|json|wasm)$/;

function staticCompressionPlugin() {
  return {
    name: 'static-brotli-gzip-compression',
    apply: 'build' as const,
    generateBundle(_: unknown, bundle: Record<string, { code?: string; source?: string | Uint8Array }>) {
      Object.entries(bundle).forEach(([fileName, asset]) => {
        if (!compressibleAsset.test(fileName)) return;

        const source = asset.code ?? asset.source;
        if (!source) return;

        const input = typeof source === 'string' ? Buffer.from(source) : Buffer.from(source);
        const brotli = brotliCompressSync(input, {
          params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
        });
        const gzip = gzipSync(input, { level: 9 });

        this.emitFile({ type: 'asset', fileName: `${fileName}.br`, source: brotli });
        this.emitFile({ type: 'asset', fileName: `${fileName}.gz`, source: gzip });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), staticCompressionPlugin()],
});
