function hideMsgInImage(message, imageBytes) {
  let newImageBytes = [];

  const msgBinary = Array.from(message)
    .reduce((acc, char) => acc.concat(char.charCodeAt().toString(2)), [])
    .map((bin) => '0'.repeat(8 - bin.length) + bin);

  msgBinary.forEach((binaryChar, binaryCharIndex) => {
    const binaryCharArray = Array.from(binaryChar);

    binaryCharArray.forEach((binary, binaryIndex) => {
      newImageBytes.push(
        Number(
          imageBytes[binaryIndex + binaryCharIndex * 8]
            .toString()
            .slice(0, -1) + binary,
        ),
      );
    });
  });

  //console.log(newImageBytes)
  return newImageBytes;
}

function decryptMsgFromImage(imageBytes) {
  const textArray = [];

  let iterator = 0;
  let index = 0;

  let tempChar = [];

  while (iterator !== 8) {
    const byte = imageBytes[index];

    tempChar.push(byte.toString().split('').pop());
    iterator++;

    //Fim do Character
    if (iterator >= 8) {
      const char = tempChar.reduce((acc, current) => {
        return (acc += current);
      });

      //Checa o character se é ponto
      if (char === '00101110') break;

      textArray.push(char);
      tempChar = [];
      iterator = 0;
    }

    index++;
  }

  //criar a msg
  const message = textArray.reduce((acc, current) => {
    return (acc += String.fromCharCode(parseInt(current, 2)));
  }, '');

  return message;
}

// nao ta fazendo alteração do imageBytes
function imageBytesWithEncodedMsg(encodedBytes, imageBytes) {

  const cutImageBytes = imageBytes.slice(
    encodedBytes.length,
    imageBytes.length,
  );

  const newImageBytes = encodedBytes.concat(cutImageBytes);

  return newImageBytes;
}

function esteganografia(message, imageBytes) {
  const encodedBytes = hideMsgInImage(message, imageBytes);

  const newImageBytes = imageBytesWithEncodedMsg(encodedBytes, imageBytes);

  return newImageBytes;
}

module.exports = { esteganografia, decryptMsgFromImage };
