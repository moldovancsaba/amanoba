const fs = require('fs');
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf-8'));

// Translation dictionaries for Bulgarian and Polish
// This is a comprehensive translation mapping
const translations = {
  bg: {
    common: {
      loading: 'Зареждане...',
      error: 'Грешка',
      success: 'Успех',
      save: 'Запази',
      cancel: 'Отказ',
      delete: 'Изтрий',
      edit: 'Редактирай',
      create: 'Създай',
      back: 'Назад',
      next: 'Напред',
      previous: 'Предишен',
      submit: 'Изпрати',
      close: 'Затвори',
      search: 'Търсене',
      filter: 'Филтър',
      sort: 'Сортиране',
      actions: 'Действия',
      dashboard: 'Табло',
      view: 'Преглед',
      active: 'Активен',
      inactive: 'Неактивен',
      premium: 'Премиум',
      free: 'Безплатно',
      yes: 'Да',
      no: 'Не',
      status: 'Статус',
      type: 'Тип',
      name: 'Име',
      description: 'Описание',
      createdAt: 'Създадено',
      updatedAt: 'Обновено',
      total: 'Общо',
      count: 'Брой',
      copied: 'Копирано!',
      points: 'точки',
      xp: 'XP',
      retry: 'Опитай отново',
      noDataFound: 'Няма данни',
      auth: { signIn: 'Вход', signOut: 'Изход' },
      courses: { title: 'Курсове' },
      games: { title: 'Игри' },
      leaderboard: { title: 'Класация' },
      challenges: { title: 'Предизвикателства' },
      quests: { title: 'Задачи' },
      achievements: { title: 'Постижения' },
      rewards: { title: 'Награди' },
      or: 'или',
      termsOfService: 'Условия за ползване',
      privacyPolicy: 'Политика за поверителност',
      byContinuing: 'Продължавайки, вие се съгласявате с',
      and: 'и'
    }
  },
  pl: {
    common: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      success: 'Sukces',
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      edit: 'Edytuj',
      create: 'Utwórz',
      back: 'Wstecz',
      next: 'Dalej',
      previous: 'Poprzedni',
      submit: 'Wyślij',
      close: 'Zamknij',
      search: 'Szukaj',
      filter: 'Filtruj',
      sort: 'Sortuj',
      actions: 'Akcje',
      dashboard: 'Panel',
      view: 'Widok',
      active: 'Aktywny',
      inactive: 'Nieaktywny',
      premium: 'Premium',
      free: 'Darmowe',
      yes: 'Tak',
      no: 'Nie',
      status: 'Status',
      type: 'Typ',
      name: 'Nazwa',
      description: 'Opis',
      createdAt: 'Utworzono',
      updatedAt: 'Zaktualizowano',
      total: 'Razem',
      count: 'Liczba',
      copied: 'Skopiowano!',
      points: 'punkty',
      xp: 'XP',
      retry: 'Spróbuj ponownie',
      noDataFound: 'Brak danych',
      auth: { signIn: 'Zaloguj się', signOut: 'Wyloguj się' },
      courses: { title: 'Kursy' },
      games: { title: 'Gry' },
      leaderboard: { title: 'Ranking' },
      challenges: { title: 'Wyzwania' },
      quests: { title: 'Zadania' },
      achievements: { title: 'Osiągnięcia' },
      rewards: { title: 'Nagrody' },
      or: 'lub',
      termsOfService: 'Warunki korzystania',
      privacyPolicy: 'Polityka prywatności',
      byContinuing: 'Kontynuując, zgadzasz się z',
      and: 'i'
    }
  }
};

// Recursive function to translate an object
function translateObject(obj, lang, prefix = '') {
  const result = {};
  const langDict = translations[lang];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object - recurse
      result[key] = translateObject(value, lang, fullKey);
    } else {
      // Leaf value - translate if available, otherwise keep English
      const translated = getNestedValue(langDict, fullKey);
      result[key] = translated !== undefined ? translated : value;
    }
  }
  
  return result;
}

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

// Generate Bulgarian translation
const bgTranslated = translateObject(en, 'bg');
fs.writeFileSync('messages/bg.json', JSON.stringify(bgTranslated, null, 2));
console.log('✅ Created messages/bg.json');

// Generate Polish translation
const plTranslated = translateObject(en, 'pl');
fs.writeFileSync('messages/pl.json', JSON.stringify(plTranslated, null, 2));
console.log('✅ Created messages/pl.json');

console.log('Note: These files have partial translations. Full translations require comprehensive dictionaries for all 600+ keys.');
