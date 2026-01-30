import Link from "next/link";
import { defaultLocale } from "@/i18n";
import { type Locale, locales } from "@/app/lib/i18n/locales";

type Section = {
  id?: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: boolean;
  variant?: "warning" | "danger";
  subSections?: Section[];
};

type TermsContent = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdatedDate: string;
  sections: Section[];
  footer: {
    home: string;
    privacy: string;
    dataDeletion: string;
  };
};

const termsContent: Record<string, TermsContent> = {
  en: {
    title: "Terms of Service",
    lastUpdatedLabel: "Last Updated:",
    lastUpdatedDate: "January 13, 2025",
    sections: [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        paragraphs: [
          'Welcome to Amanoba ("we," "our," or "us"). By accessing or using our learning and gaming platform (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Service.',
          "These Terms are a legally binding agreement between you and Amanoba. We may update them at any time; continued use after changes means you accept the updated Terms.",
        ],
      },
      {
        id: "eligibility",
        title: "2. Eligibility",
        paragraphs: ["To use the Service, you must:"],
        bullets: [
          "Be at least 13 years of age (or the minimum age required in your jurisdiction)",
          "Have the legal capacity to enter into a binding agreement",
          "Not be prohibited from using the Service under applicable laws",
          "Provide accurate and complete registration information",
          "Maintain the security of your account credentials",
        ],
        subSections: [
          {
            title: "Parental consent",
            paragraphs: [
              "If you are under 18, you confirm that you have obtained consent from your parent or legal guardian to use the Service.",
            ],
          },
        ],
      },
      {
        id: "account",
        title: "3. Account Registration",
        paragraphs: ["To access certain features, you must create an account. You may register using:"],
        bullets: ["SSO (single sign-on) or anonymous sign-up", "Other authentication methods we may provide in the future"],
        subSections: [
          {
            title: "You agree to:",
            bullets: [
              "Provide accurate, current, and complete information",
              "Maintain and promptly update your account information",
              "Keep your password secure and confidential",
              "Notify us immediately of any unauthorized access",
              "Accept responsibility for all activities under your account",
            ],
          },
        ],
      },
      {
        id: "conduct",
        title: "4. User Conduct",
        paragraphs: ["You agree NOT to:"],
        bullets: [
          "Violate any applicable laws or regulations",
          "Infringe on intellectual property rights of others",
          "Upload or transmit viruses, malware, or harmful code",
          "Attempt to gain unauthorized access to our systems",
          "Use bots, scripts, or automated tools to access the Service",
          "Cheat, exploit bugs, or manipulate game mechanics unfairly",
          "Harass, abuse, or harm other users",
          "Impersonate any person or entity",
          "Collect or harvest user data without permission",
          "Engage in any commercial use without our written consent",
          "Reverse engineer or attempt to extract source code",
          "Create derivative works based on our platform",
        ],
      },
      {
        id: "games",
        title: "5. Games and Services",
        subSections: [
          {
            title: "5.1 Free Games",
            paragraphs: [
              "We offer free games that are available to all registered users. Free games may have limited features, hints, or rewards compared to premium offerings.",
            ],
          },
          {
            title: "5.2 Premium Games and Features",
            paragraphs: ["Premium games and features require a paid subscription. Premium benefits may include:"],
            bullets: [
              "Access to exclusive games (e.g., Madoku)",
              "Unlimited hints and assistance",
              "Ad-free experience",
              "Priority support",
              "Exclusive achievements and rewards",
            ],
          },
          {
            title: "5.3 Gamification Features",
            paragraphs: [
              "Our platform includes gamification elements such as points, achievements, levels, leaderboards, and rewards. These features:",
            ],
            bullets: [
              "Have no real-world monetary value",
              "Cannot be transferred, sold, or exchanged for cash",
              "May be modified or discontinued at our discretion",
              "Are subject to our terms and policies",
            ],
          },
        ],
      },
      {
        id: "payments",
        title: "6. Payment and Subscriptions",
        subSections: [
          {
            title: "6.1 Premium Subscriptions",
            paragraphs: [
              "Premium subscriptions are billed on a recurring basis (monthly, annually, etc.) until cancelled. You authorize us to charge your payment method automatically.",
            ],
          },
          {
            title: "6.2 Billing",
            bullets: [
              "Charges are made in advance for each billing period",
              "No refunds for partial periods or unused features",
              "Prices may change with 30 days' notice",
              "Failed payments may result in service suspension",
            ],
          },
          {
            title: "6.3 Cancellation",
            paragraphs: [
              "You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. You will retain access until that date.",
            ],
          },
          {
            title: "6.4 Refund Policy",
            paragraphs: [
              "Generally, all payments are non-refundable. Exceptions may be made at our sole discretion for extraordinary circumstances.",
            ],
          },
        ],
      },
      {
        id: "ip",
        title: "7. Intellectual Property",
        paragraphs: ["All content, features, and functionality of the Service, including but not limited to:"],
        bullets: [
          "Software code and architecture",
          "Game designs, mechanics, and rules",
          "Graphics, images, and visual elements",
          "Text, audio, and video content",
          "Trademarks, logos, and branding",
        ],
        subSections: [
          {
            title: "Ownership",
            paragraphs: [
              "Are owned by Amanoba or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or create derivative works without our express written permission.",
            ],
          },
        ],
      },
      {
        id: "user-content",
        title: "8. User Content",
        paragraphs: [
          "You may be able to submit content such as profile information, messages, or feedback. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to:",
        ],
        bullets: [
          "Use, reproduce, and display your content",
          "Modify and adapt content for technical requirements",
          "Store and process content in our systems",
        ],
        subSections: [
          {
            title: "Your responsibility",
            paragraphs: [
              "You represent that you own or have rights to any content you submit and that it does not violate any third-party rights or applicable laws.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        title: "9. Privacy and Data Protection",
        paragraphs: [
          "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.",
          "By using the Service, you consent to our data practices as described in the Privacy Policy.",
        ],
      },
      {
        id: "disclaimers",
        title: "10. Disclaimers",
        variant: "warning",
        paragraphs: ['THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. We disclaim all warranties, express or implied, including:'],
        bullets: [
          "Warranties of merchantability or fitness for a particular purpose",
          "Warranties of non-infringement",
          "Warranties regarding accuracy, reliability, or availability",
          "Warranties that the Service will be uninterrupted or error-free",
        ],
      },
      {
        id: "liability",
        title: "11. Limitation of Liability",
        variant: "danger",
        paragraphs: ["TO THE MAXIMUM EXTENT PERMITTED BY LAW, AMANOBA SHALL NOT BE LIABLE FOR:"],
        bullets: [
          "Indirect, incidental, special, consequential, or punitive damages",
          "Loss of profits, data, use, or other intangible losses",
          "Damages resulting from unauthorized access to your account",
          "Damages from interruptions or errors in the Service",
          "Damages from third-party content or conduct",
        ],
        subSections: [
          {
            title: "Liability cap",
            paragraphs: [
              "Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.",
            ],
          },
        ],
      },
      {
        id: "indemnification",
        title: "12. Indemnification",
        paragraphs: [
          "You agree to indemnify and hold harmless Amanoba, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:",
        ],
        bullets: ["Your use of the Service", "Your violation of these Terms", "Your violation of any rights of another party", "Your content or conduct"],
      },
      {
        id: "termination",
        title: "13. Termination",
        paragraphs: ["We may suspend or terminate your access to the Service at any time, with or without notice, for any reason, including:"],
        bullets: ["Violation of these Terms", "Fraudulent, abusive, or illegal activity", "Prolonged inactivity", "At your request"],
        subSections: [
          {
            title: "Effect of termination",
            paragraphs: [
              "Upon termination, your right to use the Service immediately ceases. Provisions that should survive termination (including disclaimers, limitations of liability, and indemnification) will remain in effect.",
            ],
          },
        ],
      },
      {
        id: "dispute",
        title: "14. Dispute Resolution",
        paragraphs: ["Any disputes arising from these Terms or your use of the Service shall be resolved through:"],
        bullets: [
          "Informal Resolution: Contact us at info@amanoba.com to resolve disputes informally",
          "Binding Arbitration: If informal resolution fails, disputes shall be resolved by binding arbitration",
          "Class Action Waiver: You agree to bring claims individually, not as part of a class action",
        ],
        ordered: true,
      },
      {
        id: "law",
        title: "15. Governing Law",
        paragraphs: [
          "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Amanoba operates, without regard to conflict of law principles.",
        ],
      },
      {
        id: "changes",
        title: "16. Changes to Terms",
        paragraphs: ["We reserve the right to modify these Terms at any time. We will notify you of material changes by:"],
        bullets: [
          "Posting the updated Terms on this page",
          'Updating the "Last Updated" date',
          "Sending an email notification (for significant changes)",
        ],
        subSections: [
          {
            title: "Acceptance of changes",
            paragraphs: ["Your continued use of the Service after changes constitutes acceptance of the updated Terms."],
          },
        ],
      },
      {
        id: "general",
        title: "17. General Provisions",
        bullets: [
          "Entire Agreement: These Terms constitute the entire agreement between you and Amanoba",
          "Severability: If any provision is found unenforceable, the remaining provisions remain in effect",
          "Waiver: Our failure to enforce any right does not waive that right",
          "Assignment: We may assign our rights and obligations; you may not without our consent",
          "Force Majeure: We are not liable for delays or failures due to circumstances beyond our control",
        ],
      },
      {
        id: "contact",
        title: "18. Contact Information",
        paragraphs: ["If you have questions about these Terms of Service, please contact us:"],
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
      privacy: "Privacy Policy",
      dataDeletion: "Data Deletion",
    },
  },
  hu: {
    title: "Felhasználási feltételek",
    lastUpdatedLabel: "Utolsó frissítés:",
    lastUpdatedDate: "2025. január 13.",
    sections: [
      {
        id: "acceptance",
        title: "1. A feltételek elfogadása",
        paragraphs: [
          "Üdv az Amanobánál („mi”, „minket”, „miénk”). Az oldalunk és szolgáltatásunk használatával elfogadod a jelen Felhasználási feltételeket („Feltételek”). Ha nem értesz egyet, kérjük, ne használd a szolgáltatást.",
          "A Feltételek kötelező érvényű szerződést jelentenek közted és az Amanoba között. A Feltételeket bármikor frissíthetjük; ha a módosítás után is használod a szolgáltatást, az a frissített Feltételek elfogadását jelenti.",
        ],
      },
      {
        id: "eligibility",
        title: "2. Jogosultság",
        paragraphs: ["A szolgáltatás használatához:"],
        bullets: [
          "Legalább 13 évesnek kell lenned (vagy el kell érned a területed szerinti minimum életkort)",
          "Rendelkezned kell jogképességgel a szerződéskötéshez",
          "Nem lehetsz eltiltva a szolgáltatás használatától a vonatkozó jogszabályok alapján",
          "Pontos, hiánytalan regisztrációs adatokat kell megadnod",
          "Biztosítanod kell a hozzáférési adataid védelmét",
        ],
        subSections: [
          {
            title: "Szülői hozzájárulás",
            paragraphs: [
              "18 év alatt kijelented, hogy rendelkezel szülői vagy törvényes gondviselői hozzájárulással a szolgáltatás használatához.",
            ],
          },
        ],
      },
      {
        id: "account",
        title: "3. Fiókregisztráció",
        paragraphs: ["Egyes funkciók eléréséhez fiókot kell létrehoznod. Regisztrálhatsz:"],
        bullets: ["SSO (egyszeri bejelentkezés) vagy vendég regisztrációval", "Más hitelesítési módokkal, amelyeket később kínálunk"],
        subSections: [
          {
            title: "Vállalod, hogy:",
            bullets: [
              "Pontos, aktuális és teljes adatokat adsz meg",
              "Karbantartod és frissíted a fiókadataidat",
              "Biztonságban tartod a jelszavad",
              "Azonnal jelzed, ha jogosulatlan hozzáférést észlelsz",
              "Felelősséget vállalsz minden fiók alatt végzett tevékenységért",
            ],
          },
        ],
      },
      {
        id: "conduct",
        title: "4. Felhasználói magatartás",
        paragraphs: ["Vállalod, hogy NEM fogsz:"],
        bullets: [
          "Jogsértő vagy szabályt sértő magatartást tanúsítani",
          "Mások szellemi tulajdonát megsérteni",
          "Vírusokat, rosszindulatú kódot feltölteni vagy terjeszteni",
          "Jogosulatlan hozzáférést szerezni rendszereinkhez",
          "Botokat, scripteket vagy automatizált eszközöket használni a szolgáltatás elérésére",
          "Csalni, hibákat kihasználni, a játékmenetet tisztességtelenül manipulálni",
          "Zaklatni, bántalmazni vagy kárt okozni más felhasználóknak",
          "Más személynek vagy szervezetnek kiadni magad",
          "Felhasználói adatokat engedély nélkül gyűjteni vagy kezelni",
          "Kereskedelmi célra használni a platformot írásos hozzájárulás nélkül",
          "Visszafejteni vagy megkísérelni a forráskód kinyerését",
          "A platformból származtatott műveket létrehozni",
        ],
      },
      {
        id: "games",
        title: "5. Játékok és szolgáltatások",
        subSections: [
          {
            title: "5.1 Ingyenes játékok",
            paragraphs: [
              "Ingyenes játékokat kínálunk minden regisztrált felhasználónak. Ezek bizonyos funkciókban, tippekben vagy jutalmakban korlátozottabbak lehetnek a prémium ajánlatokhoz képest.",
            ],
          },
          {
            title: "5.2 Prémium játékok és funkciók",
            paragraphs: ["A prémium játékok és funkciók fizetős előfizetést igényelnek. A prémium előnyök például:"],
            bullets: [
              "Hozzáférés exkluzív játékokhoz (pl. Madoku)",
              "Korlátlan tippek és segítség",
              "Reklámmentes élmény",
              "Elsőbbségi támogatás",
              "Exkluzív eredmények és jutalmak",
            ],
          },
          {
            title: "5.3 Gamifikációs elemek",
            paragraphs: [
              "A platform pontokat, eredményeket, szinteket, ranglistát és jutalmakat tartalmaz. Ezek:",
            ],
            bullets: [
              "Nem rendelkeznek valódi pénzbeli értékkel",
              "Nem ruházhatók át, nem adhatók el és nem válthatók készpénzre",
              "Bármikor módosíthatók vagy megszüntethetők",
              "A saját feltételeink és irányelveink vonatkoznak rájuk",
            ],
          },
        ],
      },
      {
        id: "payments",
        title: "6. Fizetés és előfizetések",
        subSections: [
          {
            title: "6.1 Prémium előfizetés",
            paragraphs: [
              "A prémium előfizetések ismétlődő (havi, éves stb.) díjazással működnek a lemondásig. Felhatalmazol minket, hogy automatikusan terheljük a fizetési módodat.",
            ],
          },
          {
            title: "6.2 Számlázás",
            bullets: [
              "A díjak előre kerülnek felszámításra minden számlázási időszakra",
              "Részidőszakra vagy fel nem használt funkciókra nincs visszatérítés",
              "Árváltozás előtt 30 nappal értesítést küldünk",
              "Sikertelen fizetés a szolgáltatás felfüggesztését eredményezheti",
            ],
          },
          {
            title: "6.3 Lemondás",
            paragraphs: [
              "Az előfizetést bármikor lemondhatod. A lemondás a jelenlegi számlázási ciklus végén lép életbe, addig hozzáférsz a szolgáltatáshoz.",
            ],
          },
          {
            title: "6.4 Visszatérítési irányelvek",
            paragraphs: [
              "Általánosságban a kifizetések nem visszatérítendők. Kivételes esetekben saját mérlegelésünk szerint adhatunk visszatérítést.",
            ],
          },
        ],
      },
      {
        id: "ip",
        title: "7. Szellemi tulajdon",
        paragraphs: ["A szolgáltatás tartalma, funkciói és működése – többek között:"],
        bullets: [
          "Szoftverkód és architektúra",
          "Játékdizájn, mechanikák, szabályok",
          "Grafika, képek, vizuális elemek",
          "Szöveges, hang- és videótartalom",
          "Védjegyek, logók, arculat",
        ],
        subSections: [
          {
            title: "Tulajdonjog",
            paragraphs: [
              "Az Amanoba vagy licencadóink tulajdonát képezik, és szerzői jogi, védjegy- és egyéb jogszabályok védik. Másolásuk, módosításuk, terjesztésük, értékesítésük vagy származtatott mű készítése csak írásos engedéllyel lehetséges.",
            ],
          },
        ],
      },
      {
        id: "user-content",
        title: "8. Felhasználói tartalom",
        paragraphs: [
          "Megadhatsz tartalmat (profiladatok, üzenetek, visszajelzés). A beküldött tartalomra nem kizárólagos, globális, jogdíjmentes licencet adsz számunkra, hogy:",
        ],
        bullets: [
          "Felhasználjuk, reprodukáljuk és megjelenítsük",
          "Műszaki okból módosítsuk, átalakítsuk",
          "Rendszereinkben tároljuk és feldolgozzuk",
        ],
        subSections: [
          {
            title: "Felelősséged",
            paragraphs: [
              "Kijelented, hogy rendelkezel a beküldött tartalomhoz szükséges jogokkal, és az nem sért harmadik felet vagy jogszabályt.",
            ],
          },
        ],
      },
      {
        id: "privacy",
        title: "9. Adatvédelem és adatkezelés",
        paragraphs: [
          "Fontos számunkra az adataid védelme. A személyes adatok kezelését az Adatvédelmi tájékoztató szabályozza, amely jelen Feltételek része.",
          "A szolgáltatás használatával elfogadod az Adatvédelmi tájékoztatóban leírt adatkezelési gyakorlatunkat.",
        ],
      },
      {
        id: "disclaimers",
        title: "10. Felelősségkizárás",
        variant: "warning",
        paragraphs: [
          "A SZOLGÁLTATÁST „AHOGY VAN” ÉS „AHOGY ELÉRHETŐ” ALAPON NYÚJTJUK, BÁRMIFÉLE GARANCIA NÉLKÜL. Kifejezetten kizárunk minden – többek között az alábbi – garanciát:",
        ],
        bullets: [
          "Foralombahozhatóságra vagy egy adott célra való alkalmasságra",
          "Jogbitorlás-mentességre",
          "Pontosságra, megbízhatóságra, rendelkezésre állásra",
          "Folyamatos, hibamentes működésre",
        ],
      },
      {
        id: "liability",
        title: "11. Felelősség korlátozása",
        variant: "danger",
        paragraphs: ["A TÖRVÉNY ÁLTAL MEGENGEDETT LEGTELJESEBB MÉRTÉKBEN AZ AMANOBA NEM FELELŐS:"],
        bullets: [
          "Közvetett, járulékos, különleges, következményi vagy büntető jellegű károkért",
          "Elnyert haszon, adatvesztés, használati jog elvesztése vagy egyéb immateriális károk esetén",
          "Jogosulatlan fiókhozzáférésből eredő károkért",
          "A szolgáltatás megszakítása vagy hibája miatti károkért",
          "Harmadik fél tartalmából vagy magatartásából eredő károkért",
        ],
        subSections: [
          {
            title: "Felelősségi plafon",
            paragraphs: [
              "Teljes felelősségünk nem haladhatja meg a követelést megelőző 12 hónapban általad fizetett összeget, vagy 100 USD-t – a magasabb érték érvényes.",
            ],
          },
        ],
      },
      {
        id: "indemnification",
        title: "12. Kártalanítás",
        paragraphs: [
          "Vállalod, hogy kártalanítod az Amanobát, kapcsolt vállalkozásait és munkatársaikat minden igény, kár, veszteség, költség (beleértve az ügyvédi díjakat) esetén, amely az alábbiakból ered:",
        ],
        bullets: [
          "A szolgáltatás használata",
          "A Feltételek megsértése",
          "Mások jogainak megsértése",
          "A tartalmad vagy magatartásod",
        ],
      },
      {
        id: "termination",
        title: "13. Felmondás",
        paragraphs: ["A hozzáférésedet bármikor felfüggeszthetjük vagy megszüntethetjük, előzetes értesítéssel vagy anélkül, ha például:"],
        bullets: ["Megszeged a Feltételeket", "Csaló, visszaélésszerű vagy jogsértő tevékenységet folytatsz", "Hosszú ideig nem vagy aktív", "Kéred a megszüntetést"],
        subSections: [
          {
            title: "Felmondás hatása",
            paragraphs: [
              "Felmondáskor azonnal megszűnik a szolgáltatás használatának joga. A felmondást követően is hatályban maradnak azok a pontok, amelyeknek fenn kell maradniuk (pl. felelősségkorlátozás, kártalanítás).",
            ],
          },
        ],
      },
      {
        id: "dispute",
        title: "14. Vitarendezés",
        paragraphs: ["A Feltételekből vagy a szolgáltatás használatából eredő vitákat az alábbi módon rendezzük:"],
        bullets: [
          "Informális rendezés: lépj kapcsolatba velünk az info@amanoba.com címen",
          "Kötelező választottbíróság: ha az informális egyeztetés nem vezet eredményre, a vita választottbírósági útra kerül",
          "Csoportos kereset kizárása: a követeléseket egyénileg kell benyújtani, csoportos per kizárt",
        ],
        ordered: true,
      },
      {
        id: "law",
        title: "15. Irányadó jog",
        paragraphs: [
          "A Feltételekre az Amanoba működési helye szerinti jog az irányadó, a kollíziós szabályok figyelmen kívül hagyásával.",
        ],
      },
      {
        id: "changes",
        title: "16. Feltételek módosítása",
        paragraphs: ["A Feltételeket bármikor módosíthatjuk. A lényeges változásokról az alábbi módokon értesítünk:"],
        bullets: [
          "A frissített Feltételek közzététele ezen az oldalon",
          "Az „Utolsó frissítés” dátum módosítása",
          "Email-értesítés küldése (jelentős változások esetén)",
        ],
        subSections: [
          {
            title: "Változások elfogadása",
            paragraphs: ["A módosítások utáni további használat a frissített Feltételek elfogadását jelenti."],
          },
        ],
      },
      {
        id: "general",
        title: "17. Általános rendelkezések",
        bullets: [
          "Teljes megállapodás: a Feltételek jelentik a teljes megállapodást közted és az Amanoba között",
          "Részleges érvénytelenség: ha valamely rendelkezés végrehajthatatlan, a többi hatályban marad",
          "Lemondás: jogérvényesítés elmulasztása nem jelent lemondást az adott jogról",
          "Engedményezés: jogainkat és kötelezettségeinket átruházhatjuk; te csak beleegyezésünkkel teheted",
          "Vis maior: a tőlünk független okból bekövetkező késedelemért vagy szolgáltatás-kimaradásért nem tartozunk felelősséggel",
        ],
      },
      {
        id: "contact",
        title: "18. Kapcsolat",
        paragraphs: ["Ha kérdésed van a Felhasználási feltételekkel kapcsolatban, lépj velünk kapcsolatba:"],
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
      privacy: "Adatvédelmi irányelvek",
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
  const wrapperClasses =
    section.variant === "warning"
      ? "bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg"
      : section.variant === "danger"
        ? "bg-red-50 border-l-4 border-red-600 p-6 rounded-lg"
        : "";

  const body = (
    <>
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
    </>
  );

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
      {section.variant ? <div className={wrapperClasses}>{body}</div> : body}
    </section>
  );
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = locales.includes(localeParam as Locale) ? (localeParam as Locale) : defaultLocale;
  const content = termsContent[locale] ?? termsContent[defaultLocale];

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
            <Link href={`/${locale}/privacy`} className="text-indigo-600 hover:underline">
              {content.footer.privacy}
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
