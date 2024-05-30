enum InternStatus {
  FRM01 = "FRM01",
  FRM02 = "FRM02",
  FRM03 = "FRM03",
  RED01 = "RED01",
  MLK01 = "MLK01",
  MLK02 = "MLK02",
  MLK03 = "MLK03",
  MLK04 = "MLK04",
  RED02 = "RED02",
  RED03 = "RED03",
  STJ00 = "STJ00",
}

export default InternStatus;

export const InternStatusLabels = {
  FRM01: { id: "FRM01", label: "Staj Formu Oluşturuldu" },
  FRM02: { id: "FRM02", label: "Staj Formu Onaylandı (Dijital)" },
  FRM03: { id: "FRM03", label: "Staj Formu Resmi Belgesi Teslim edildi" },

  RED01: { id: "RED01", label: "Staj Formu Reddedildi" },
  MLK01: { id: "MLK01", label: "Staj Başlangıcı" },
  MLK02: { id: "MLK02", label: "Staj Mülakatı " },

  MLK03: {
    id: "MLK03",
    label: "Staj Mülakatı Resmi Belgeler Teslim Edildi",
  },
  MLK04: { id: "MLK04", label: "Staj Mülakatı Eksik Belge var" },
  RED02: { id: "RED02", label: "Staj Mülakatı Reddedildi" },

  RED03: { id: "RED03", label: "Staj İptal Edildi" },
  STJ00: { id: "STJ00", label: "Staj Tamamlandı" },
};
