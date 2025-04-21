// O'zbekistondan tashqarida joylashgan lekin O'zbekiston nazorat qiladigan suv omborlari 
export const crossBorderReservoirs = [
  {
    id: 'toktogul',
    name: 'Toktogul suv ombori',
    country: 'Qirg\'iziston',
    capacity: '19500',  // million m³
    currentLevel: '8750',
    location: { lat: 41.7756, lng: 72.9424 },
    rivers: ['Naryn daryosi'],
    servedRegions: [
      'Andijon viloyati',
      'Namangan viloyati',
      'Farg\'ona viloyati'
    ],
    mainCanals: [
      'Shimoliy Farg\'ona kanali',
      'Katta Andijon kanali'
    ],
    monitoringStations: 3,
    underUzbekControl: true,
    details: 'Sirdaryo havzasidagi eng yirik suv ombori, O\'zbekiston, Qirg\'iziston va Qozog\'iston o\'rtasidagi suv taqsimotiga katta ta\'sir ko\'rsatadi.',
    image: '/images/reservoirs/toktogul.jpg'
  },
  {
    id: 'andijan',
    name: 'Andijon suv ombori',
    country: 'Qirg\'iziston / O\'zbekiston',
    capacity: '1900',  // million m³
    currentLevel: '1200',
    location: { lat: 40.7693, lng: 73.0871 },
    rivers: ['Qoradaryo'],
    servedRegions: [
      'Andijon viloyati',
      'Namangan viloyati',
      'Farg\'ona viloyati'
    ],
    mainCanals: [
      'Shahrixonsoy kanali',
      'Janubiy Farg\'ona kanali'
    ],
    monitoringStations: 5,
    underUzbekControl: true,
    details: 'Chegarada joylashgan bu suv ombori Farg\'ona vodiysidagi ekin maydonlarini sug\'orish uchun muhim ahamiyatga ega.',
    image: '/images/reservoirs/andijan.jpg'
  },
  {
    id: 'chartak',
    name: 'Chartak suv ombori',
    country: 'Qirg\'iziston',
    capacity: '280',  // million m³
    currentLevel: '160',
    location: { lat: 41.2513, lng: 72.0621 },
    rivers: ['Chatkal daryosi'],
    servedRegions: [
      'Namangan viloyati'
    ],
    mainCanals: [
      'Namangan kanali',
      'Chortoq-Namangan kanali'
    ],
    monitoringStations: 2,
    underUzbekControl: true,
    details: 'Namangan viloyatining shimoliy tumanlarini sug\'orish uchun muhim manba hisoblanadi.',
    image: '/images/reservoirs/chartak.jpg'
  },
  {
    id: 'shordara',
    name: 'Shardara suv ombori',
    country: 'Qozog\'iston',
    capacity: '5200',  // million m³
    currentLevel: '3400',
    location: { lat: 41.2438, lng: 67.9683 },
    rivers: ['Sirdaryo'],
    servedRegions: [
      'Sirdaryo viloyati',
      'Jizzax viloyati'
    ],
    mainCanals: [
      'Dustlik kanali',
      'Jizzax kanali'
    ],
    monitoringStations: 3,
    underUzbekControl: false,
    sharedControl: true,
    details: 'O\'zbekiston va Qozog\'iston o\'rtasida suv taqsimoti bo\'yicha hamkorlik mavjud, O\'zbekiston monitoring qiladi.',
    image: '/images/reservoirs/shardara.jpg'
  },
  {
    id: 'tuyamuyun',
    name: 'Tuyamo\'yin suv ombori',
    country: 'Turkmaniston / O\'zbekiston',
    capacity: '7800',  // million m³
    currentLevel: '4200',
    location: { lat: 41.2071, lng: 61.4125 },
    rivers: ['Amudaryo'],
    servedRegions: [
      'Xorazm viloyati',
      'Qoraqalpog\'iston Respublikasi'
    ],
    mainCanals: [
      'Toshsoqa kanali',
      'Qoraqum kanali',
      'Xorazm kanali'
    ],
    monitoringStations: 6,
    underUzbekControl: true,
    sharedControl: true,
    details: 'Amudaryo havzasidagi eng muhim suv omborlaridan biri, Xorazm va Qoraqalpog\'istondagi ekin maydonlarini sug\'orish uchun asosiy manba.',
    image: '/images/reservoirs/tuyamuyun.jpg'
  },
  {
    id: 'koksaray',
    name: 'Ko\'ksaroy suv ombori',
    country: 'Qozog\'iston',
    capacity: '3000',  // million m³
    currentLevel: '1800',
    location: { lat: 42.2789, lng: 68.1245 },
    rivers: ['Sirdaryo (suv o\'tkazish kanali orqali)'],
    servedRegions: [
      'Sirdaryo viloyati (qisman)'
    ],
    mainCanals: [
      'Keles kanali'
    ],
    monitoringStations: 2,
    underUzbekControl: false,
    sharedControl: true,
    details: 'Sirdaryo toshqinlarini oldini olish va suv taqsimoti maqsadida qurilgan. O\'zbekiston tomonidan monitoring qilinadi.',
    image: '/images/reservoirs/koksaray.jpg'
  },
  {
    id: 'bahri-tojik',
    name: 'Bahri Tojik suv ombori',
    country: 'Tojikiston',
    capacity: '4100',  // million m³
    currentLevel: '2700',
    location: { lat: 40.2843, lng: 70.0012 },
    rivers: ['Sirdaryo'],
    servedRegions: [
      'Sirdaryo viloyati',
      'Jizzax viloyati'
    ],
    mainCanals: [
      'Farhod kanali',
      'Dalvarzin kanali'
    ],
    monitoringStations: 2,
    underUzbekControl: false,
    sharedControl: true,
    details: 'O\'zbekiston, Tojikiston va Qozog\'iston o\'rtasida hamkorlikda boshqariladi. Asosan energetika va sug\'orish uchun ishlatiladi.',
    image: '/images/reservoirs/bahri-tojik.jpg'
  }
];

export const getReservoirById = (id: string) => {
  return crossBorderReservoirs.find(reservoir => reservoir.id === id);
};

export const getCrossBorderReservoirsByCountry = (country: string) => {
  return crossBorderReservoirs.filter(reservoir => reservoir.country.includes(country));
};

export const getReservoirsByRegion = (region: string) => {
  return crossBorderReservoirs.filter(reservoir => 
    reservoir.servedRegions.some(r => r.includes(region))
  );
};

export const getUzbekControlledReservoirs = () => {
  return crossBorderReservoirs.filter(reservoir => 
    reservoir.underUzbekControl || reservoir.sharedControl
  );
};

export const getTotalCrossBorderCapacity = () => {
  return crossBorderReservoirs.reduce((sum, reservoir) => 
    sum + parseInt(reservoir.capacity), 0
  );
};

export const getTotalUzbekControlledCapacity = () => {
  return getUzbekControlledReservoirs().reduce((sum, reservoir) => 
    sum + parseInt(reservoir.capacity), 0
  );
};