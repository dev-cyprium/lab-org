// Lokalni datum u formatu koji očekuje native date input (bez UTC pomeranja dana).
export function danasIsoDatum(): string {
  const danas = new Date();
  const godina = danas.getFullYear();
  const mesec = String(danas.getMonth() + 1).padStart(2, '0');
  const dan = String(danas.getDate()).padStart(2, '0');
  return `${godina}-${mesec}-${dan}`;
}
