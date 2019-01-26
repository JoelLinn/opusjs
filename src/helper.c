#include "emscripten.h"
#include "opus.h"

// wrap variable argument count functions

EMSCRIPTEN_KEEPALIVE
int opus_encoder_ctl_0(OpusEncoder *st, int request){
	return opus_encoder_ctl(st, request);
}
EMSCRIPTEN_KEEPALIVE
int opus_encoder_ctl_1(OpusEncoder *st, int request, int p1){
	return opus_encoder_ctl(st, request, p1);
}

EMSCRIPTEN_KEEPALIVE
int opus_decoder_ctl_0(OpusDecoder *st, int request){
	return opus_decoder_ctl(st, request);
}

EMSCRIPTEN_KEEPALIVE
int opus_decoder_ctl_1(OpusDecoder *st, int request, int p1){
	return opus_decoder_ctl(st, request, p1);
}