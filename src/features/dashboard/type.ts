type typeDataDashboard = {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
};

// Chart data types
type typeBankTraffic = {
  name: string;
  value: number;
};

type typeShiftData = {
  name: string;
  value: number;
  color: string;
};

type typeGateTraffic = {
  name: string;
  value: number;
};

type typeRuasData = {
  name: string;
  value: number;
  color: string;
};

export type {
  typeDataDashboard,
  typeBankTraffic,
  typeShiftData,
  typeGateTraffic,
  typeRuasData,
};
