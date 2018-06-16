const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const recordingDir = './recordings/';
const outputDir = recordingDir + 'converted/';
const mergedDir = recordingDir + 'merged/';
const convertedTextFile = 'reclist.txt';

// Make a new stream for each time someone starts to talk
const generateOutputFile = (fileName) => {
  return fs.createWriteStream(`${recordingDir + fileName}.pcm`);
};

/* 
  Convert raw PCM to OGG usual command: ffmpeg -f s16le -ar 48000 -ac 2 -i input.pcm -ar 48000 -ac 2 output.ogg
  -f  : Format(Ex: s16le(signed 16-bit little endian samples))
  -ac : Channels(Ex: Stereo, Mono)
  -ar : Sample rate(Ex: 16000Hz)

  Usage: 
  convertPCMtoOGG('dudu1.pcm', 'dudu1.ogg');
*/
const convertPCMtoOGG = (inputFile, outputFile) => (
  ffmpeg(recordingDir + inputFile)
  .inputOptions([
    '-f s16le',
    '-ar 48000',
    '-ac 2'
  ])
  .output(outputDir + outputFile)
  .outputOptions([
    '-ar 48000',
    '-ac 2'
  ])
  .on('start', () => {
    console.log('Creating streams!');
  })
  .on('error', (err, stdout, stderr) => {
    console.log(`Error: ${err.message}`);
    console.log(`ffmpeg output:\n ${stdout}`);
    console.log(`ffmpeg stderr:\n ${stderr}`);
  })
  .on('end', () => {
    console.log(`Conversion has finished! Check out ${outputDir} folder.`);
    addConvertedToList(outputFile);
  })
  .run()
);

// Usage: addConvertedToList('dudu1.ogg');
const addConvertedToList = (data) => {
  fs.appendFile(outputDir + convertedTextFile, `file '${data}'\n`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Datas successfully appended to the text file.");
    }
  });
};

// Usage: mergeConvertedAudios("output.ogg");
const mergeConvertedAudios = (mergedFile) => {
  /* 
    Command: ffmpeg -f concat -safe 0 -i list.txt -c copy merged.ogg
    The approach of concatenating audio files with text file is clearly better way doing it. 
    Directly merging is better for video formats instead of audio. You may get stuttering in audios. Deal with it(dat joke in 2k18)
  */
  ffmpeg(outputDir + convertedTextFile)
    .inputOptions([
      '-f concat',
      '-safe 0'
    ])
    .output(mergedDir + mergedFile)
    .outputOptions([
      '-c copy'
    ])
    .on('start', () => {
      console.log('Merging...');
    })
    .on('error', (err, stdout, stderr) => {
      console.log(`Error: ${err.message}`);
      console.log(`ffmpeg output:\n ${stdout}`);
      console.log(`ffmpeg stderr:\n ${stderr}`);
    })
    .on('end', () => {
      console.log(`Merging has finished! Check out ${mergedDir} folder.`);
    })
    .run()
  
};

exports.convertPCMtoOGG = convertPCMtoOGG;
exports.addConvertedToList = addConvertedToList;
exports.mergeConvertedAudios = mergeConvertedAudios;
exports.generateOutputFile = generateOutputFile;
exports.recordingDir = recordingDir;