import dgram from 'dgram';

export default async function handler(req, res) {
  const ip = req.query.ip;
  const port = parseInt(req.query.port) || 19132;

  if (!ip) return res.status(400).json({ error: 'Parameter ?ip= wajib diisi' });

  try {
    const result = await pingBedrock(ip, port);
    res.status(200).json({ online: true, ...result });
  } catch (e) {
    res.status(200).json({ online: false, error: e.message });
  }
}

function pingBedrock(ip, port) {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket('udp4');
    const pingBuffer = Buffer.from([
      0x01, ...Array(22).fill(0x00)
    ]);

    const timeout = setTimeout(() => {
      client.close();
      reject(new Error('Timeout: Server tidak merespons'));
    }, 3000);

    client.send(pingBuffer, 0, pingBuffer.length, port, ip, (err) => {
      if (err) {
        clearTimeout(timeout);
        client.close();
        return reject(err);
      }
    });

    client.once('message', (msg) => {
      clearTimeout(timeout);
      client.close();
      const data = msg.toString().split(';');
      resolve({
        ip,
        port,
        motd: data[1],
        version: data[3],
        players: {
          online: parseInt(data[4]),
          max: parseInt(data[5])
        }
      });
    });
  });
}
