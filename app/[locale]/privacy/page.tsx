import Link from "next/link";
import {
  Anchor,
  Container,
  Divider,
  Group,
  List as MantineList,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { defaultLocale } from "@/i18n";
import { type Locale, locales } from "@/app/lib/i18n/locales";

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

const privacyContent: Record<string, PrivacyContent> = {
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
              "Account information (name, email address) when you sign in with SSO or create an account",
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
        id: "auth",
        title: "5. Sign-In and Authentication",
        paragraphs: [
          "When you sign in with SSO (single sign-on) or as a guest, we receive only the information needed to create and maintain your account (e.g. name, email from your identity provider). We do not post to any external account. You can sign out or request account deletion at any time.",
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
              "Fiókadatok (név, email cím) SSO bejelentkezéskor vagy fióklétrehozáskor",
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
        id: "auth",
        title: "5. Bejelentkezés és hitelesítés",
        paragraphs: [
          "SSO (egyszeri bejelentkezés) vagy vendégként való bejelentkezéskor csak a fiók létrehozásához és karbantartásához szükséges adatokat kapjuk (pl. név, email az identitásszolgáltatótól). Nem posztolunk külső fiókba. Bármikor kijelentkezhetsz vagy törölheted a fiókodat.",
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
// Swahili: use English content until translated
(privacyContent as Record<string, PrivacyContent>).sw = privacyContent.en;

function LegalList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  return (
    <MantineList type={ordered ? "ordered" : "unordered"} spacing="xs">
      {items.map((item, idx) => (
        <MantineList.Item key={idx}>{item}</MantineList.Item>
      ))}
    </MantineList>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <Stack component="section" gap="md">
      <Title order={2}>{section.title}</Title>
      {section.paragraphs?.map((paragraph, idx) => (
        <Text key={idx}>
          {paragraph}
        </Text>
      ))}
      {section.bullets && <LegalList items={section.bullets} ordered={section.ordered} />}
      {section.subSections?.map((sub, idx) => (
        <Stack key={sub.id ?? `${sub.title}-${idx}`} gap="sm">
          <Title order={3}>{sub.title}</Title>
          {sub.paragraphs?.map((paragraph, pIdx) => (
            <Text key={pIdx}>
              {paragraph}
            </Text>
          ))}
          {sub.bullets && <LegalList items={sub.bullets} ordered={sub.ordered} />}
          {sub.subSections?.map((nested, nIdx) => (
            <Stack key={nested.id ?? `${nested.title}-${nIdx}`} gap="sm">
              <Title order={4}>{nested.title}</Title>
              {nested.paragraphs?.map((paragraph, npIdx) => (
                <Text key={npIdx}>
                  {paragraph}
                </Text>
              ))}
              {nested.bullets && <LegalList items={nested.bullets} ordered={nested.ordered} />}
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : defaultLocale;
  const content = privacyContent[locale] ?? privacyContent[defaultLocale];

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="xl">
        <Stack gap="xl">
        <Title order={1}>{content.title}</Title>
        <Text size="sm" c="dimmed">
          {content.lastUpdatedLabel} {content.lastUpdatedDate}
        </Text>

        <Stack gap="xl">
          {content.sections.map((section, idx) => (
            <SectionBlock key={section.id ?? `${section.title}-${idx}`} section={section} />
          ))}
        </Stack>

        <Divider />
        <Group justify="center">
            <Anchor component={Link} href={`/${locale}`}>
              {content.footer.home}
            </Anchor>
            <Anchor component={Link} href={`/${locale}/terms`}>
              {content.footer.terms}
            </Anchor>
            <Anchor component={Link} href={`/${locale}/data-deletion`}>
              {content.footer.dataDeletion}
            </Anchor>
        </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
