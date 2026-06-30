// Placeholder external links for related authorities/channels.
// All external links must open in a new tab.

export const EXTERNAL_LINKS = {
  biBicara: "https://bicara131.bi.go.id/",
  lapsSjk: "https://lapssjk.id/",
  ojk: "https://kontak157.ojk.go.id/",
  bappebti: "https://pengaduan.bappebti.go.id/",
  lps: "https://www.lps.go.id/",
  polriSiber: "https://patrolisiber.id/",
  cekPenyelenggara:
    "https://www.bi.go.id/id/layanan/informasi-perizinan/sistem-pembayaran/default.aspx",
  formulirFasilitasi:
    "https://drive.google.com/file/d/1Ekxe5j3vHbJhzjHje4X_nteyot_WePj_/view?usp=sharing",
  tataTertib:
    "https://drive.google.com/file/d/11rg-sdGg_Se8MBaarp9-kindgthY0646/view?usp=sharing",
  suratPernyataan:
    "https://drive.google.com/file/d/1YPQpmDrL6z0Oj6Q6KYag8M1VDWgx6ern/view?usp=sharing",
} as const;

export const RELATED_CHANNELS = [
  { label: "BI Bicara", href: EXTERNAL_LINKS.biBicara },
  { label: "LAPS SJK", href: EXTERNAL_LINKS.lapsSjk },
  { label: "OJK", href: EXTERNAL_LINKS.ojk },
  { label: "Bappebti", href: EXTERNAL_LINKS.bappebti },
  { label: "LPS", href: EXTERNAL_LINKS.lps },
  { label: "PolriSiber", href: EXTERNAL_LINKS.polriSiber },
] as const;
