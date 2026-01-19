import Link from "next/link";
import { Locale, defaultLocale, locales } from "@/i18n";

type Section = {
  id?: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: boolean;
  subSections?: Section[];
};

type PrivacyContent = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  sections: Section[];
  footer: {
    home: string;
    terms: string;
    dataDeletion: string;
  };
};

const privacyContent: Record<Locale, PrivacyContent> = {
  en: {
    title: "Privacy Policy",
    lastUpdatedLabel: "Last Updated:",
    lastUpdatedDate: "January 13, 2025",
    sections: [
      {
        id: "intro",
        title: "1. Introduction",
        paragraphs: [
          'Welcome to Amanoba ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our learning and gaming platform.',
        ],
      },
      {
        id: "collection",
        title: "2. Information We Collect",
        subSections: [
          {
            title: "2.1 Information You Provide",
            bullets: [
              "Account information (name, email address) through Facebook OAuth",
              "Profile information (display name, avatar)",
              "Game and learning preferences and settings",
              "Communications with our support team",
            ],
          },
          {
            title: "2.2 Information Automatically Collected",
            bullets: [
              "Gameplay and learning data (scores, achievements, progress)",
              "Device information (browser type, operating system)",
              "Usage data (features used, time spent, interactions)",
              "IP address and general location data",
              "Cookies and similar tracking technologies",
            ],
          },
        ],
      },
      {
        id: "use",
        title: "3. How We Use Your Information",
        paragraphs: ["We use your information to:"],
        bullets: [
          "Provide and maintain our services",
          "Personalize your learning and gaming experience",
          "Track your progress, achievements, and rewards",
          "Process premium subscriptions and transactions",
          "Send important service updates and notifications",
          "Analyze and improve platform performance",
          "Prevent fraud and ensure platform security",
          "Comply with legal obligations",
        ],
      },
      {
        id: "sharing",
        title: "4. Information Sharing",
        paragraphs: ["We do not sell your personal information. We may share your information with:"],
        bullets: [
          "Service Providers: third parties that help us operate the platform (hosting, analytics, payment processing)",
          "Legal Requirements: when required by law or to protect our rights",
          "Business Transfers: in connection with a merger, acquisition, or sale of assets",
          "With Your Consent: when you explicitly authorize sharing",
        ],
      },
      {
        id: "facebook",
        title: "5. Facebook Login",
        paragraphs: [
          "When you sign in using Facebook, we receive basic profile information (name, email, profile picture) as permitted by Facebook's OAuth system. We do not post to your Facebook account without your explicit permission. You can manage Facebook app permissions in your Facebook settings at any time.",
        ],
      },
      {
        id: "security",
        title: "6. Data Security",
        paragraphs: ["We implement industry-standard security measures to protect your information, including:"],
        bullets: [
          "Encrypted data transmission (HTTPS/SSL)",
          "Secure authentication systems",
          "Regular security audits",
          "Access controls and monitoring",
        ],
        subSections: [
          {
            title: "Important note",
            paragraphs: ["No method of transmission over the Internet is 100% secure. We cannot guarantee absolute security."],
          },
        ],
      },
      {
        id: "rights",
        title: "7. Your Rights",
        paragraphs: ["You have the right to:"],
        bullets: [
          "Access: request a copy of your personal data",
          "Correction: update or correct inaccurate information",
          "Deletion: request deletion of your account and data (see Data Deletion Policy)",
          "Portability: receive your data in a portable format",
          "Objection: object to certain data processing activities",
          "Withdraw Consent: withdraw consent for data processing at any time",
        ],
        subSections: [
          {
            title: "How to exercise your rights",
            paragraphs: ["Contact us at info@amanoba.com and we will assist you."],
          },
        ],
      },
      {
        id: "children",
        title: "8. Children's Privacy",
        paragraphs: [
          "Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.",
        ],
      },
      {
        id: "cookies",
        title: "9. Cookies and Tracking",
        paragraphs: ["We use cookies and similar technologies to enhance your experience. You can control cookies through your browser settings. We use:"],
        bullets: [
          "Essential Cookies: required for platform functionality",
          "Analytics Cookies: help us understand platform usage",
          "Preference Cookies: remember your settings",
        ],
      },
      {
        id: "retention",
        title: "10. Data Retention",
        paragraphs: [
          "We retain your personal information for as long as your account is active or as needed to provide services. We delete or anonymize your data upon account deletion request, except where we must retain it for legal or security purposes.",
        ],
      },
      {
        id: "transfers",
        title: "11. International Data Transfers",
        paragraphs: [
          "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.",
        ],
      },
      {
        id: "changes",
        title: "12. Changes to This Policy",
        paragraphs: [
          'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.',
        ],
      },
      {
        id: "contact",
        title: "13. Contact Us",
        paragraphs: ["If you have questions or concerns about this Privacy Policy or our data practices, please contact us:"],
        subSections: [
          {
            title: "Email",
            paragraphs: ["info@amanoba.com"],
          },
          {
            title: "Company",
            paragraphs: ["Amanoba Learning & Gaming Platform"],
          },
        ],
      },
    ],
    footer: {
      home: "Back to Home",
      terms: "Terms of Service",
      dataDeletion: "Data Deletion",
    },
  },
  hu: {
    title: "Adatvédelmi irányelvek",
    lastUpdatedLabel: "Utolsó frissítés:",
    lastUpdatedDate: "2025. január 13.",
    sections: [
      {
        id: "intro",
        title: "1. Bevezetés",
        paragraphs: [
          "Üdv az Amanobánál („mi”, „minket”, „miénk”). Elkötelezettek vagyunk az adataid védelme mellett. Jelen Adatvédelmi irányelvek bemutatják, hogyan gyűjtjük, használjuk, osztjuk meg és védjük az adataidat, amikor a tanulási és játékplatformunkat használod.",
        ],
      },
      {
        id: "collection",
        title: "2. Milyen adatokat gyűjtünk",
        subSections: [
          {
            title: "2.1 Általad megadott adatok",
            bullets: [
              "Fiókadatok (név, email cím) Facebook OAuth-on keresztül",
              "Profiladatok (megjelenített név, avatar)",
              "Játék- és tanulási preferenciák, beállítások",
              "Ügyfélszolgálattal folytatott kommunikáció",
            ],
          },
          {
            title: "2.2 Automatikusan gyűjtött adatok",
            bullets: [
              "Játék- és tanulási adatok (pontszámok, eredmények, haladás)",
              "Eszközinformációk (böngésző, operációs rendszer)",
              "Használati adatok (funkcióhasználat, idő, interakciók)",
              "IP-cím és általános lokációs adatok",
              "Cookie-k és hasonló nyomkövető technológiák",
            ],
          },
        ],
      },
      {
        id: "use",
        title: "3. Hogyan használjuk az adataidat",
        paragraphs: ["Az adataidat arra használjuk, hogy:"],
        bullets: [
          "Biztosítsuk és fenntartsuk a szolgáltatásainkat",
          "Személyre szabjuk a tanulási és játékélményt",
          "Kövessük a haladásod, eredményeid és jutalmaid",
          "Kezeljük a prémium előfizetéseket és tranzakciókat",
          "Fontos értesítéseket küldjünk",
          "Elemezzük és fejlesszük a platform teljesítményét",
          "Megelőzzük a csalást és biztosítsuk a platform biztonságát",
          "Teljesítsük jogi kötelezettségeinket",
        ],
      },
      {
        id: "sharing",
        title: "4. Adatmegosztás",
        paragraphs: ["Nem adjuk el a személyes adataidat. Adataidat az alábbiakkal oszthatjuk meg:"],
        bullets: [
          "Szolgáltatók: harmadik felek, akik segítenek a platform működtetésében (tárhely, analitika, fizetés)",
          "Jogi kötelezettség: ha jogszabály írja elő, vagy jogaink védelmében szükséges",
          "Üzleti tranzakciók: egyesülés, felvásárlás vagy eszközértékesítés esetén",
          "Hozzájárulással: ha kifejezetten engedélyezed a megosztást",
        ],
      },
      {
        id: "facebook",
        title: "5. Facebook bejelentkezés",
        paragraphs: [
          "Facebook-bejelentkezéskor a Facebook OAuth engedélyei alapján a nevedet, email címedet és profilképedet kapjuk meg. Kifejezett engedélyed nélkül nem posztolunk a fiókodba. A Facebook beállításokban bármikor módosíthatod az engedélyeket.",
        ],
      },
      {
        id: "security",
        title: "6. Adatbiztonság",
        paragraphs: ["Iparági bevált biztonsági megoldásokat alkalmazunk, többek között:"],
        bullets: [
          "Titkosított adatátvitel (HTTPS/SSL)",
          "Biztonságos hitelesítési rendszerek",
          "Rendszeres biztonsági auditok",
          "Hozzáférés-kezelés és monitorozás",
        ],
        subSections: [
          {
            title: "Fontos megjegyzés",
            paragraphs: ["Az internetes adatátvitel soha nem 100%-ban biztonságos, így a teljes biztonságot nem tudjuk garantálni."],
          },
        ],
      },
      {
        id: "rights",
        title: "7. Felhasználói jogok",
        paragraphs: ["Jogosult vagy:"],
        bullets: [
          "Hozzáférés: kérheted a rólad tárolt adatok másolatát",
          "Helyesbítés: pontosíthatod a hibás adatokat",
          "Törlés: kérheted a fiókod és adataid törlését (lásd Adattörlési irányelvek)",
          "Hordozhatóság: kérheted az adataid hordozható formában",
          "Tiltakozás: tiltakozhatsz bizonyos adatkezelések ellen",
          "Hozzájárulás visszavonása: bármikor visszavonhatod az adatkezelési hozzájárulásod",
        ],
        subSections: [
          {
            title: "Jogok gyakorlása",
            paragraphs: ["Írj az info@amanoba.com címre, és segítünk a folyamatban."],
          },
        ],
      },
      {
        id: "children",
        title: "8. Gyermekek adatainak védelme",
        paragraphs: [
          "A platform nem 13 év alattiaknak készült. Nem gyűjtünk tudatosan személyes adatot 13 év alatti gyermekektől. Ha úgy véled, ilyen adatot kaptunk, kérjük, azonnal jelezd.",
        ],
      },
      {
        id: "cookies",
        title: "9. Cookie-k és nyomkövetés",
        paragraphs: ["Cookie-kat és hasonló technológiákat használunk az élmény javítására. A cookie-kat a böngésződben szabályozhatod. Többek között az alábbiakat használjuk:"],
        bullets: [
          "Szükséges cookie-k: a platform működéséhez elengedhetetlenek",
          "Analitikai cookie-k: segítenek megérteni a használatot",
          "Preferencia cookie-k: megjegyzik a beállításaidat",
        ],
      },
      {
        id: "retention",
        title: "10. Adatmegőrzés",
        paragraphs: [
          "A személyes adatokat addig őrizzük, amíg a fiók aktív vagy a szolgáltatás nyújtásához szükséges. Fióktörléskor töröljük vagy anonimizáljuk az adatokat, kivéve, ha jogi vagy biztonsági okból meg kell őriznünk.",
        ],
      },
      {
        id: "transfers",
        title: "11. Nemzetközi adattovábbítás",
        paragraphs: [
          "Az adataid kerülhetnek olyan országba is, amely nem az állandó lakóhelyed szerinti állam. Minden esetben gondoskodunk a megfelelő védelmi garanciákról, összhangban jelen Adatvédelmi irányelvekkel.",
        ],
      },
      {
        id: "changes",
        title: "12. Változások az irányelvekben",
        paragraphs: [
          "Az Adatvédelmi irányelveket időről időre frissíthetjük. A lényeges változásokról ezen az oldalon, az „Utolsó frissítés” dátum frissítésével, és szükség esetén külön értesítéssel tájékoztatunk. A platform további használata a frissített irányelvek elfogadását jelenti.",
        ],
      },
      {
        id: "contact",
        title: "13. Kapcsolat",
        paragraphs: ["Ha kérdésed van az Adatvédelmi irányelvekkel vagy adatkezelési gyakorlatunkkal kapcsolatban, vedd fel velünk a kapcsolatot:"],
        subSections: [
          {
            title: "Email",
            paragraphs: ["info@amanoba.com"],
          },
          {
            title: "Társaság",
            paragraphs: ["Amanoba tanulási és játékplatform"],
          },
        ],
      },
    ],
    footer: {
      home: "Vissza a főoldalra",
      terms: "Felhasználási feltételek",
      dataDeletion: "Adattörlés",
    },
  },
};

function List({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const ListComponent = ordered ? "ol" : "ul";
  return (
    <ListComponent className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2`}>
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ListComponent>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
      {section.paragraphs?.map((paragraph, idx) => (
        <p key={idx} className={idx > 0 ? "mt-2" : undefined}>
          {paragraph}
        </p>
      ))}
      {section.bullets && <List items={section.bullets} ordered={section.ordered} />}
      {section.subSections?.map((sub, idx) => (
        <div key={sub.id ?? `${sub.title}-${idx}`} className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{sub.title}</h3>
          {sub.paragraphs?.map((paragraph, pIdx) => (
            <p key={pIdx} className={pIdx > 0 ? "mt-2" : undefined}>
              {paragraph}
            </p>
          ))}
          {sub.bullets && <List items={sub.bullets} ordered={sub.ordered} />}
          {sub.subSections?.map((nested, nIdx) => (
            <div key={nested.id ?? `${nested.title}-${nIdx}`} className="mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{nested.title}</h4>
              {nested.paragraphs?.map((paragraph, npIdx) => (
                <p key={npIdx} className={npIdx > 0 ? "mt-2" : undefined}>
                  {paragraph}
                </p>
              ))}
              {nested.bullets && <List items={nested.bullets} ordered={nested.ordered} />}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale = locales.includes(params.locale as Locale) ? (params.locale as Locale) : defaultLocale;
  const content = privacyContent[locale] ?? privacyContent[defaultLocale];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{content.title}</h1>
        <p className="text-sm text-gray-600 mb-8">
          {content.lastUpdatedLabel} {content.lastUpdatedDate}
        </p>

        <div className="space-y-8 text-gray-700">
          {content.sections.map((section, idx) => (
            <SectionBlock key={section.id ?? `${section.title}-${idx}`} section={section} />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 space-x-4">
            <Link href={`/${locale}`} className="text-indigo-600 hover:underline">
              {content.footer.home}
            </Link>
            <Link href={`/${locale}/terms`} className="text-indigo-600 hover:underline">
              {content.footer.terms}
            </Link>
            <Link href={`/${locale}/data-deletion`} className="text-indigo-600 hover:underline">
              {content.footer.dataDeletion}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
