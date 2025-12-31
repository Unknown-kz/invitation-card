
import { ScheduleItem } from './types';

export const WEDDING_DETAILS = {
  couple: {
    husband: "ЕРЖАН",
    wife: "ГҮЛСАРА",
    title: "50 жылдық Алтын той"
  },
  date: new Date("2026-01-25T15:00:00"),
  location: {
    name: "«Ақтілек» мейрамханасы",
    address: "Исатай Батыр көшесі, 58, Астана",
    coords: { lat: 51.119689, lng: 71.243982 },
    mapLink: "https://2gis.kz/astana/search/%D0%B8%D1%81%D0%B0%D1%82%D0%B0%D0%B9%2058/firm/70000001097227888/71.243982%2C51.119689?m=71.443112%2C51.129688%2F10.62",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&q=80"
    ]
  },
  contact: {
    name: "Жұман",
    phone: "87081298373",
    whatsapp: "https://wa.me/77081298373",
    role: "Той үйлестірушісі"
  },
  colors: [
    { name: 'Алтын', hex: '#C5A059' },
    { name: 'Шампань', hex: '#F7E7CE' },
    { name: 'Крем', hex: '#F9F7F2' },
    { name: 'Қоңыр', hex: '#4A3728' },
    { name: 'Қою қола', hex: '#4A3728' }
  ],
  music: [
    { id: 1, title: "Махаббат Мелодиясы", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Алтын Вальс", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Той Бастар", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
  ]
};

export const SCHEDULE: ScheduleItem[] = [
  { time: "15:00", title: "Қонақтарды қарсы алу", description: "Сәлемдесу сусындары және фотоаймақ" },
  { time: "16:00", title: "Салтанатты ашылу", description: "50 жылдық махаббат мерекесінің басталуы" },
  { time: "17:00", title: "Мерекелік дастархан", description: "Кешкі ас, құттықтаулар және өнер көрсетулер" },
  { time: "19:00", title: "Отбасылық естелік", description: "Жарты ғасырлық саяхат туралы видеобаян" },
  { time: "21:30", title: "Той тортын кесу", description: "Алтын белестің тәтті сәті" }
];

export const TABLES_CONFIG = [
  { id: 1, name: "Құрметті қонақтар", capacity: 12 },
  { id: 2, name: "Достар аймағы", capacity: 12 },
  { id: 3, name: "Туыстар (А)", capacity: 12 },
  { id: 4, name: "Туыстар (Ә)", capacity: 12 },
  { id: 5, name: "Жастар үстелі", capacity: 12 },
  { id: 6, name: "Бас отбасылық үстел", capacity: 12 },
];
