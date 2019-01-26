OPUS_FUNCS:=               '_opus_encoder_create', '_opus_encode_float', '_opus_encoder_destroy'
OPUS_FUNCS:=${OPUS_FUNCS}, '_opus_decoder_create', '_opus_decode_float', '_opus_decoder_get_nb_samples', '_opus_decoder_destroy'
OPUS_FUNCS:=${OPUS_FUNCS}, '_opus_strerror', '_opus_get_version_string'

OPUS_DIR=./opus
EMCC_OPTS=-O3 --llvm-lto 3 -s MODULARIZE_INSTANCE=1 -s EXPORT_NAME='opus' -s NO_FILESYSTEM=1 -s ALLOW_MEMORY_GROWTH=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='['ccall', 'getValue', 'setValue']' -s EXPORTED_FUNCTIONS="['_malloc', ${OPUS_FUNCS}]"

.PHONY: test

all: init compile
autogen:
	cd $(OPUS_DIR); \
	./autogen.sh
configure:
	cd $(OPUS_DIR); \
	emconfigure ./configure --disable-extra-programs --disable-doc --disable-intrinsics
bind:
	cd $(OPUS_DIR); \
	emmake make;
init: autogen configure bind
compile:
	mkdir -p ./build; \
	emcc ${EMCC_OPTS} --bind -I ${OPUS_DIR}/include --post-js ./src/defines.js --post-js ./src/functions.js ./src/helper.c  ${OPUS_DIR}/.libs/libopus.a -o build/opus.js; \
	cp -f ${OPUS_DIR}/COPYING build/COPYING.libopus;
test:
	emrun --serve_root ./ ./test/test.html