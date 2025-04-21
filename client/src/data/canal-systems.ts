// Kanallar tarmog'i va suv yetkazib berish tizimi ma'lumotlari

export interface Canal {
  id: string;
  name: string;
  length: number; // km
  capacity: number; // m³/s
  reservoirSource: string; // qaysi suv omboridan boshlanadi
  servedDistricts: string[]; // qaysi tumanlarni sug'oradi
  coordinates: {
    startPoint: { lat: number; lng: number };
    endPoint: { lat: number; lng: number };
    path?: { lat: number; lng: number }[]; // agar kanal murakkab yo'nalishga ega bo'lsa
  };
  branches: string[]; // asosiy kanaldan chiqadigan kichik kanallar
  yearBuilt: number;
  lastRenovated?: number;
  status: 'operational' | 'maintenance' | 'construction' | 'planned';
  waterVolume: number; // million m³/yil
}

export const canalSystems: Canal[] = [
  {
    id: 'fergana-canal',
    name: 'Katta Farg\'ona kanali',
    length: 350,
    capacity: 200,
    reservoirSource: 'andijan', // Andijon suv omboridan
    servedDistricts: [
      'Andijon tumani', 
      'Asaka tumani', 
      'Baliqchi tumani',
      'Oltiariq tumani', 
      'Qo\'qon tumani', 
      'Beshariq tumani',
      'Quvasoy tumani'
    ],
    coordinates: {
      startPoint: { lat: 40.7812, lng: 72.9842 },
      endPoint: { lat: 40.5386, lng: 70.9428 },
      path: [
        { lat: 40.7812, lng: 72.9842 },
        { lat: 40.7703, lng: 72.6512 },
        { lat: 40.7456, lng: 72.2154 },
        { lat: 40.7201, lng: 71.7854 },
        { lat: 40.6943, lng: 71.3219 },
        { lat: 40.5386, lng: 70.9428 }
      ]
    },
    branches: [
      'Janubiy Farg\'ona kanali',
      'Shimoliy Farg\'ona kanali',
      'Andijon-Shahrixon kanali'
    ],
    yearBuilt: 1939,
    lastRenovated: 2018,
    status: 'operational',
    waterVolume: 5400
  },
  {
    id: 'amu-bukhara',
    name: 'Amu-Buxoro mashina kanali',
    length: 197,
    capacity: 270,
    reservoirSource: 'amudarya-direct', // To'g'ridan-to'g'ri Amudaryodan
    servedDistricts: [
      'Qorako\'l tumani', 
      'Olot tumani', 
      'Buxoro tumani',
      'Jondor tumani', 
      'Shofirkon tumani', 
      'G\'ijduvon tumani',
      'Vobkent tumani'
    ],
    coordinates: {
      startPoint: { lat: 39.1053, lng: 63.6081 },
      endPoint: { lat: 39.7744, lng: 64.4216 }
    },
    branches: [
      'Qorako\'l kanali',
      'Olot magistral kanali',
      'Buxoro eski ariq'
    ],
    yearBuilt: 1965,
    lastRenovated: 2010,
    status: 'operational',
    waterVolume: 4800
  },
  {
    id: 'south-karshi',
    name: 'Janubiy Qarshi magistral kanali',
    length: 124,
    capacity: 175,
    reservoirSource: 'talimarjan',
    servedDistricts: [
      'Qarshi tumani', 
      'Kasbi tumani', 
      'Muborak tumani',
      'Nishon tumani', 
      'Mirishkor tumani'
    ],
    coordinates: {
      startPoint: { lat: 38.4132, lng: 65.7992 },
      endPoint: { lat: 38.8622, lng: 65.2130 }
    },
    branches: [
      'Mirishkor kanali',
      'Nishon kanali',
      'Kasbi magistral kanali'
    ],
    yearBuilt: 1973,
    lastRenovated: 2015,
    status: 'operational',
    waterVolume: 3600
  },
  {
    id: 'dustlik-canal',
    name: 'Dustlik kanali',
    length: 113,
    capacity: 230,
    reservoirSource: 'shordara',
    servedDistricts: [
      'Sayxunobod tumani', 
      'Sirdaryo tumani', 
      'Oqoltin tumani',
      'Boyovut tumani'
    ],
    coordinates: {
      startPoint: { lat: 41.2438, lng: 67.9883 },
      endPoint: { lat: 40.6581, lng: 68.7428 }
    },
    branches: [
      'Boyovut kanali',
      'Sirdaryo magistral kanali',
      'Oqoltin tarmog\'i'
    ],
    yearBuilt: 1962,
    lastRenovated: 2017,
    status: 'operational',
    waterVolume: 2900
  },
  {
    id: 'amu-zang',
    name: 'Amudaryo-Zang kanali',
    length: 172,
    capacity: 250,
    reservoirSource: 'tuyamuyun',
    servedDistricts: [
      'Shovot tumani', 
      'Urganch tumani', 
      'Xonqa tumani',
      'Xazorasp tumani',
      'Gurlan tumani'
    ],
    coordinates: {
      startPoint: { lat: 41.2071, lng: 61.4225 },
      endPoint: { lat: 41.5563, lng: 60.6318 }
    },
    branches: [
      'Xazorasp kanali',
      'Urganch-Pitnak kanali',
      'Shovot tarmog\'i'
    ],
    yearBuilt: 1952,
    lastRenovated: 2020,
    status: 'operational',
    waterVolume: 4200
  },
  {
    id: 'north-fergana',
    name: 'Shimoliy Farg\'ona kanali',
    length: 165,
    capacity: 110,
    reservoirSource: 'toktogul',
    servedDistricts: [
      'Namangan tumani', 
      'Chortoq tumani', 
      'Kosonsoy tumani',
      'Pop tumani', 
      'Chust tumani', 
      'Uychi tumani'
    ],
    coordinates: {
      startPoint: { lat: 41.2362, lng: 72.3680 },
      endPoint: { lat: 41.0021, lng: 71.2345 }
    },
    branches: [
      'Chortoq kanali',
      'Kosonsoy tarmog\'i',
      'Namangan-Uychi kanali'
    ],
    yearBuilt: 1940,
    lastRenovated: 2019,
    status: 'operational',
    waterVolume: 2100
  },
  {
    id: 'kattakurgan-tarmogi',
    name: 'Kattaqo\'rg\'on tarmog\'i',
    length: 78,
    capacity: 90,
    reservoirSource: 'kattakurgan',
    servedDistricts: [
      'Kattaqo\'rg\'on tumani', 
      'Narpay tumani', 
      'Pastdarg\'om tumani',
      'Nurota tumani'
    ],
    coordinates: {
      startPoint: { lat: 39.8907, lng: 66.2635 },
      endPoint: { lat: 40.1238, lng: 65.9721 }
    },
    branches: [
      'Narpay kanali',
      'Pastdarg\'om tarmog\'i',
      'Nurota kanali'
    ],
    yearBuilt: 1957,
    lastRenovated: 2016,
    status: 'operational',
    waterVolume: 1600
  }
];

export const getCanalsByReservoir = (reservoirId: string) => {
  return canalSystems.filter(canal => canal.reservoirSource === reservoirId);
};

export const getCanalsByDistrict = (districtName: string) => {
  return canalSystems.filter(canal => 
    canal.servedDistricts.some(district => 
      district.toLowerCase().includes(districtName.toLowerCase())
    )
  );
};

export const getMainCanals = () => {
  return canalSystems.filter(canal => canal.capacity >= 150);
};

export const getTotalCanalLength = () => {
  return canalSystems.reduce((sum, canal) => sum + canal.length, 0);
};

export const getTotalWaterVolume = () => {
  return canalSystems.reduce((sum, canal) => sum + canal.waterVolume, 0);
};