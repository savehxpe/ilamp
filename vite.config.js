import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
var compressibleAsset = /\.(js|css|html|svg|json|wasm)$/;
function staticCompressionPlugin() {
    return {
        name: 'static-brotli-gzip-compression',
        apply: 'build',
        generateBundle: function (_, bundle) {
            var _this = this;
            Object.entries(bundle).forEach(function (_a) {
                var _b;
                var _c;
                var fileName = _a[0], asset = _a[1];
                if (!compressibleAsset.test(fileName))
                    return;
                var source = (_c = asset.code) !== null && _c !== void 0 ? _c : asset.source;
                if (!source)
                    return;
                var input = typeof source === 'string' ? Buffer.from(source) : Buffer.from(source);
                var brotli = brotliCompressSync(input, {
                    params: (_b = {}, _b[constants.BROTLI_PARAM_QUALITY] = 11, _b),
                });
                var gzip = gzipSync(input, { level: 9 });
                _this.emitFile({ type: 'asset', fileName: "".concat(fileName, ".br"), source: brotli });
                _this.emitFile({ type: 'asset', fileName: "".concat(fileName, ".gz"), source: gzip });
            });
        },
    };
}
export default defineConfig({
    plugins: [react(), staticCompressionPlugin()],
});
