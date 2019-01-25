Module["encoder_create"] = function (Fs, channels, application) {
	const errorPtr = Module._malloc(4);

	const ret = Module._opus_encoder_create(Fs, channels, application, errorPtr);

	const error = Module.getValue(errorPtr);
	Module._free(errorPtr);
	if (error != 0) {
		throw error;
	}

	return ret;
};

Module["encode_float"] = function (st, pcm) {
	const rawPcmLen = pcm.length * 4;										// needed raw length
	const rawPcmPtr = Module._malloc(rawPcmLen);							// allocate mem
	Module.HEAPF32.set(pcm, rawPcmPtr / 4, (rawPcmPtr + rawPcmLen) / 4);	// copy data, divide indices by 4 

	const rawDatLen = rawPcmLen;
	const rawDatPtr = Module._malloc(rawDatLen);

	const outLen = Module._opus_encode_float(st, rawPcmPtr, rawPcmLen / 4, rawDatPtr, rawDatLen);
	Module._free(rawPcmPtr);
	if (outLen < 0) {
		Module._free(rawDatPtr);
		throw outLen;
	}
	// on success copy data in new buffer
	var data = new Uint8Array(outLen);
	data.set(Module.HEAPU8.subarray(rawDatPtr, rawDatPtr + outLen));
	Module._free(rawDatPtr);

	return data;
};

Module["encoder_destroy"] = function (st) {
	Module._opus_encoder_destroy(st);
};


Module["decoder_create"] = function (Fs, channels) {
	const errorPtr = Module._malloc(4);

	const ret = Module._opus_decoder_create(Fs, channels, errorPtr);

	const error = Module.getValue(errorPtr);
	Module._free(errorPtr);
	if (error != 0) {
		throw error;
	}

	return ret;
};

Module["decode_float"] = function (st, dat) {
	const rawDatLen = dat.length;
	const rawDatPtr = Module._malloc(rawDatLen);
	Module.HEAPU8.set(dat, rawDatPtr, rawDatPtr + rawDatLen);

	const rawPcmLen = Module._opus_decoder_get_nb_samples(st, rawDatPtr, rawDatLen) * 4;
	if (rawPcmLen < 0) {
		Module._free(rawDatPtr);
		throw -1;
	}
	const rawPcmPtr = Module._malloc(rawPcmLen);

	const outLen = Module._opus_decode_float(st, rawDatPtr, rawDatLen, rawPcmPtr, rawPcmLen / 4, 0);
	Module._free(rawDatPtr);
	if (outLen < 0) {
		Module._free(rawPcmPtr);
		throw outLen;
	}

	var pcm = new Float32Array(outLen);
	pcm.set(Module.HEAPF32.subarray(rawPcmPtr / 4, rawPcmPtr / 4 + outLen));
	Module._free(rawPcmPtr);

	return pcm;
};

Module["decoder_destroy"] = function (st) {
	Module._opus_decoder_destroy(st);
};


Module["strerror"] = function (error) { 
	return Pointer_stringify(Module._opus_strerror(error));
};

Module["get_version_string"] = function () { 
	return Pointer_stringify(Module._opus_get_version_string());
};