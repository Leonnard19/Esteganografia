//converter valor de byte para inteiro
const bytesToInt = (bytes) => {
  let result = 0
  result = result | (0xFF000000 & parseInt(bytes[3]) << 24)
  result = result | (0x00FF0000 & parseInt(bytes[2]) << 16)
  result = result | (0x0000FF00 & parseInt(bytes[1]) << 8)
  result = result | (0x000000FF & parseInt(bytes[0]) << 0)
  return result
}

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

  return newImageBytes;
}

function decryptMsgFromImage(imageBytes) {
  // Inicio dos dados
  const dataOffset = bytesToInt([
    imageBytes[10],
    imageBytes[11],
    imageBytes[12],
    imageBytes[13],
  ])

  const textArray = [];
  let iterator = 0;
  let index = dataOffset;
  let tempChar = [];

  // Msg começa na posição imageBytes[dataoffset]

  while (iterator !== 8) {
    const byte = imageBytes[index];

    tempChar.push(byte.toString().split('').pop());
    iterator++;

    //Fim do Character
    if (iterator >= 8) {
      const char = tempChar.reduce((acc, current) => {
        return (acc += current);
      });

      //Checa se o character é ponto
      if (char === '00101110') break;

      textArray.push(char);
      tempChar = [];
      iterator = 0;
    }

    index++;
  }

  //criar a mensagem
  const message = textArray.reduce((acc, current) => {
    return (acc += String.fromCharCode(parseInt(current, 2)));
  }, '');

  return message;
}

function imageBytesWithEncodedMsg(encodedBytes, imageBytes) {
  // Inicio dos dados
  const dataOffset = bytesToInt([
    imageBytes[10],
    imageBytes[11],
    imageBytes[12],
    imageBytes[13],
  ])

  const encoded = new Uint8Array(encodedBytes); //converter para ArrayBuffer

  let primeira = new Uint8Array();
  let ultima = new Uint8Array();
  primeira = imageBytes.slice(0, dataOffset) // primeiro
  ultima = imageBytes.slice(dataOffset + encodedBytes.length, imageBytes.length); //ultimo

  // Unir todos
  const newImageBytes = new Uint8Array([
    ...primeira,
    ...encoded,
    ...ultima
  ]);

  return newImageBytes;
}

function esteganografia(message, imageBytes) {
  const encodedBytes = hideMsgInImage(message, imageBytes);

  const newImageBytes = imageBytesWithEncodedMsg(encodedBytes, imageBytes);

  return newImageBytes;
}

module.exports = { esteganografia, decryptMsgFromImage };
