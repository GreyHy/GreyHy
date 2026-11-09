import sharp from 'sharp';

// Rasterize the existing SVG layout, then encode delta frames into a looping GIF.
// Only terminal text changes, keeping the diagram and the palette steady.
export async function animateBanner(source, colors, mobile) {
  const width = mobile ? 440 : 1200;
  const height = mobile ? 480 : 360;
  const frames = [];
  const frameCount = 64;
  const command = '$ whoami';
  const message = 'building reliable systems';
  const x = mobile ? 40 : 86;
  const commandY = mobile ? 100 : 127;
  const statusY = mobile ? 220 : 267;
  const size = mobile ? 14 : 16;
  const mono = "'Liberation Mono',Consolas,monospace";
  const ramp = (frame, start) => Math.min(1, Math.max(0, (frame - start) / 3));

  for (let frame = 0; frame < frameCount; frame++) {
    const typedCommand = command.slice(0, Math.min(command.length, frame + 1));
    const typedMessage = message.slice(0, Math.max(0, frame - 18));
    const cursorOn = frame % 8 < 4;
    const commandCursor = frame < 10 && cursorOn;
    const statusCursor = frame >= 18 && cursorOn;
    const cursor = (cx, cy) => `<rect x="${cx}" y="${cy - size + 2}" width="7" height="${size + 2}" rx="1" fill="${colors.accent}"/>`;
    const commandText = `<text x="${x}" y="${commandY}" font-family="${mono}" font-size="${mobile ? 15 : 16}" font-weight="600" fill="${colors.accent}">${typedCommand}</text>${commandCursor ? cursor(x + typedCommand.length * (mobile ? 9 : 9.6) + 3, commandY) : ''}`;
    const statusText = `<text x="${x}" y="${statusY}" font-family="${mono}" font-size="${size}" fill="${colors.text}"><tspan fill="${colors.accent}">→</tspan><tspan> ${typedMessage}</tspan></text>${statusCursor ? cursor(x + (typedMessage.length + 2) * size * .6 + 2, statusY) : ''}`;
    let svg = source;
    if (mobile) {
      svg = svg.replace(/<text[^>]*>\$ whoami<\/text>/, commandText)
        .replace(/(<text[^>]*)(>Hank Huang<\/text>)/, `$1 opacity="${ramp(frame, 8)}"$2`)
        .replace(/(<text[^>]*)(>Quality · Test Infra · AI \/ Agent<\/text>)/, `$1 opacity="${ramp(frame, 13)}"$2`)
        .replace(/<text[^>]*>→ building reliable systems<\/text>/, frame >= 18 ? statusText : '');
    } else {
      svg = svg.replace(/<text[^>]*class="mono prompt">\$ whoami<\/text>/, commandText)
        .replace(/class="name"/, `class="name" opacity="${ramp(frame, 8)}"`)
        .replace(/class="tagline"/, `class="tagline" opacity="${ramp(frame, 13)}"`)
        .replace(/<text[^>]*class="mono">[\s\S]*?<\/text>/, frame >= 18 ? statusText : '');
    }
    frames.push(await sharp(Buffer.from(svg)).flatten({ background: colors.bg }).removeAlpha().raw().toBuffer());
  }

  return sharp(Buffer.concat(frames), {
    raw: { width, height: height * frameCount, channels: 3, pageHeight: height }
  }).gif({ loop: 0, delay: Array(frameCount).fill(120), colours: 128, dither: 0, effort: 7 }).toBuffer();
}
