export async function imageUrlToBase64String(url: string) {
  const imageBuffer = await fetch(url)
    .then((res) => res.arrayBuffer())
    .then(Buffer.from);

  return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
}
