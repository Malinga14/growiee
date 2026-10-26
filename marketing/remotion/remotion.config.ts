import { Config } from "@remotion/cli/config";

// Vertical TikTok videos render best as high-quality H.264 MP4.
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);
Config.setEntryPoint("./src/index.ts");
