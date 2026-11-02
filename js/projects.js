/* =========================================================
   Trinetra Creations: project data (Day 3, case-study fields Day 5,
   rewritten as realistic sample copy Day 6)
   ONE file holds every project. Used by:
     - Home (the 3 "featured" cards)
     - Work (every card)
     - case-study.html?project=<id> (the full story of one project)
   This file only stores data: it doesn't change the page.

   !!! EVERY CLIENT, NAME, QUOTE AND NUMBER BELOW IS A SAMPLE !!!
   They show how a finished case study should read.
   ========================================================= */

// Master switch: true = show a "Sample" badge on every project card
// and case study. Set to false once these are replaced with real client work.
const SHOW_SAMPLE_LABELS = true;

// Each project is one object. Fields:
//   id        short name used in links (lowercase letters, numbers, dashes only).
//             It becomes the address: case-study.html?project=mitti-cafe
//   title     project name shown on the card
//   client    client name
//   category  type of work (must match a Work page filter button exactly)
//   year      when it was done
//   colors    two colours for the placeholder gradient (shown when there's no photo)
//   featured  true = appears on the Home page (keep exactly 3 featured)
//   image     OPTIONAL (Day 6). A real photo, e.g. image: "assets/work/mitti-cafe.jpg"
//             Shown on the card AND behind the case-study title.
//             Leave the line out and the gradient art from "colors" is used instead.
//             Size: 1600 × 1200 px (4:3), JPG, under 300 KB.
//
// Case-study fields (Day 5). ALL SAMPLE TEXT until real projects arrive:
//   summary   one sentence: used as the page's meta description and hero intro
//   services  list of what we did
//   challenge the client's problem: who they are, what was wrong, and the limit
//             we worked within (budget, deadline, location). 2–3 sentences.
//   approach  3 steps: research → idea → rollout, each with one concrete detail
//   results   up to 3 numbers: { value: 40, suffix: "%", label: "..." }
//             value must be a whole number (it counts up from 0).
//             The label should say WHAT changed and OVER WHAT TIME.
//   quote     { text, name, role } from the client
const PROJECTS = [
  {
    id: "mitti-cafe",
    title: "A café that feels like home",
    client: "Mitti Café",
    category: "Logo & Identity",
    year: 2025,
    colors: ["#7b2ff7", "#e0218a"],
    featured: true,
    summary: "A warm, hand-made identity that turned a quiet neighbourhood café into a place people stop to photograph.",
    services: ["Logo design", "Colour palette", "Menu design", "Signage"],
    challenge: "Mitti Café had loyal regulars and great chai, but from the street it looked like every other café on the road. New customers walked straight past. The owners had a small budget and could close for only one day to change the signboard and interiors.",
    approach: [
      "Research: We spent two mornings in the café, counted who walked past, and asked regulars why they kept coming back. Every answer mentioned the clay kulhad cups.",
      "Idea: We built the logo, colours and hand-drawn lettering around that earthen kulhad, so the brand tells you \"warm, local, unhurried\" at a glance.",
      "Rollout: A new illuminated signboard, menus, cup sleeves and a set of Instagram templates the team can update themselves, all installed in a single closed day.",
    ],
    results: [
      { value: 35, suffix: "%", label: "more walk-in customers in the first 3 months" },
      { value: 2, suffix: "x", label: "Instagram followers in the same period" },
      { value: 4, suffix: "", label: "weeks from first meeting to launch" },
    ],
    quote: {
      text: "People now stop to photograph our signboard. It finally looks like us.",
      name: "Riya Sharma",
      role: "Owner, Mitti Café",
    },
  },
  {
    id: "kaveri-textiles",
    title: "Festive campaign for a family mill",
    client: "Kaveri Textiles",
    category: "Ads & Campaigns",
    year: 2025,
    colors: ["#e0218a", "#ff9933"],
    featured: true,
    summary: "A Diwali campaign that introduced a 40-year-old textile mill to a younger generation of shoppers.",
    services: ["Campaign idea", "Print ads", "Hoardings", "Social media ads"],
    challenge: "Kaveri Textiles is a 40-year-old family mill with deeply loyal customers, most of them over 50. Younger shoppers saw it as \"my parents' shop\". The family wanted to reach them for Diwali without losing the trust they had spent decades building, and the campaign had to be live in six weeks.",
    approach: [
      "Research: We interviewed three generations of Kaveri customers and found that young buyers trusted the fabric but not the old-fashioned look of the ads.",
      "Idea: The line \"Woven for every celebration\", photographed with real Kaveri families, grandparents and grandchildren side by side, instead of models.",
      "Rollout: Hoardings at 12 busy junctions, newspaper ads and Instagram reels, all launched in the same week so people saw the campaign everywhere at once.",
    ],
    results: [
      { value: 48, suffix: "%", label: "higher festive-season sales than the year before" },
      { value: 60, suffix: "%", label: "of new customers were under 35" },
      { value: 12, suffix: "", label: "city hoardings, live for 4 weeks" },
    ],
    quote: {
      text: "Our grandchildren's friends now know the Kaveri name. That was the dream.",
      name: "Suresh Iyer",
      role: "Managing Director, Kaveri Textiles",
    },
  },
  {
    id: "shree-sweets",
    title: "Gift boxes worth keeping",
    client: "Shree Sweets",
    category: "Packaging",
    year: 2024,
    colors: ["#ff9933", "#7b2ff7"],
    featured: true,
    summary: "Festive sweet boxes so beautiful that customers keep them long after the sweets are gone.",
    services: ["Packaging design", "Illustration", "Print production"],
    challenge: "Shree Sweets makes some of the best mithai in town, but its plain cardboard boxes looked cheap next to the big brands. Companies buying Diwali gifts for staff and clients chose those brands instead. The new box had to cost no more than ₹40 to produce.",
    approach: [
      "Research: We asked eight corporate buyers what made a gift box feel premium. All of them said the same thing: \"something people keep\".",
      "Idea: A set of illustrations inspired by local temple art, on a sturdy box with a magnetic lid that works as a jewellery or keepsake box afterwards.",
      "Rollout: We tested three print samples with the printer to get the colours and gold foil right within budget, then designed matching carry bags and gift tags.",
    ],
    results: [
      { value: 3, suffix: "x", label: "corporate gifting orders vs. the previous Diwali" },
      { value: 25, suffix: "%", label: "higher price per box, with no drop in sales" },
      { value: 5000, suffix: "+", label: "boxes sold in one festive season" },
    ],
    quote: {
      text: "Clients tell us they keep the box for jewellery. Best compliment ever.",
      name: "Anil Gupta",
      role: "Founder, Shree Sweets",
    },
  },
  {
    id: "lotus-clinic",
    title: "Calm, trusted, local",
    client: "Lotus Clinic",
    category: "Social Media",
    year: 2024,
    colors: ["#3a1c71", "#d76d77"],
    featured: false,
    summary: "A calm, helpful social media presence that made a small family clinic the first choice in its area.",
    services: ["Social media strategy", "Post templates", "Content calendar"],
    challenge: "Lotus Clinic is a three-doctor family practice. Its Instagram posts were random, rarely seen, and often just festival greetings. When people searched for a doctor nearby, they found the big hospitals first. The clinic had no marketing staff, so whatever we built had to be easy for the reception team to keep running.",
    approach: [
      "Research: We listed the 20 questions patients ask most at reception, and turned each one into a short, friendly post idea.",
      "Idea: \"Two-minute health tips\" from the clinic's own doctors, in a soft, easy-to-read design that feels calm rather than clinical.",
      "Rollout: A three-month content calendar and fill-in-the-blank Canva templates, with clinic timings and a WhatsApp booking link on every post.",
    ],
    results: [
      { value: 4, suffix: "x", label: "monthly Instagram reach after 3 months" },
      { value: 30, suffix: "%", label: "more appointment calls in the same period" },
      { value: 90, suffix: "", label: "posts published in the first quarter" },
    ],
    quote: {
      text: "Patients walk in and mention the tips they saw online. It builds trust before we meet.",
      name: "Dr. Meera Nair",
      role: "Lotus Clinic",
    },
  },
  {
    id: "nandi-motors",
    title: "Launching a new showroom",
    client: "Nandi Motors",
    category: "Ads & Campaigns",
    year: 2024,
    colors: ["#1f1c2c", "#7b2ff7"],
    featured: false,
    summary: "A launch campaign that filled a brand-new car showroom on its opening weekend.",
    services: ["Launch campaign", "Newspaper ads", "Radio script", "Event branding"],
    challenge: "Nandi Motors opened its second showroom on the ring road at the edge of town, where few people drive past by chance. The opening date was fixed, and a quiet first month would have been expensive. We had three weeks to make the whole city aware of it.",
    approach: [
      "Research: We mapped where buyers in the area actually came from, and found most car searches started on WhatsApp and local radio, not billboards.",
      "Idea: A two-week countdown teaser (\"Something big is coming to Ring Road\"), revealed on launch day with free test drives booked in one tap on WhatsApp.",
      "Rollout: Newspaper ads, a 20-second radio spot, and full event branding, from the entrance arch to staff badges, so the opening looked like a festival.",
    ],
    results: [
      { value: 800, suffix: "+", label: "visitors over the opening weekend" },
      { value: 300, suffix: "+", label: "test drives booked on WhatsApp" },
      { value: 52, suffix: "", label: "cars booked in the first week" },
    ],
    quote: {
      text: "We expected a quiet opening. Instead we ran out of chairs.",
      name: "Vikram Rao",
      role: "Dealer Principal, Nandi Motors",
    },
  },
  {
    id: "rangoli-boutique",
    title: "A boutique with a story",
    client: "Rangoli Boutique",
    category: "Logo & Identity",
    year: 2023,
    colors: ["#b31217", "#ff9933"],
    featured: false,
    summary: "A colourful identity that tells the story of the local women artisans behind every garment.",
    services: ["Logo design", "Brand story", "Tags and labels", "Shopping bags"],
    challenge: "Every kurta at Rangoli Boutique is hand-made by women artisans from nearby villages, but nothing in the shop said so. Shoppers compared its prices with factory-made clothes and walked out. The founder wanted customers to understand the value without the shop feeling like a charity.",
    approach: [
      "Research: We met six of the artisans and recorded how long each piece takes, who made it and which village it came from.",
      "Idea: A logo built from a traditional rangoli pattern, and a short brand story, \"Made by her hands\", told in the shop, on the website and on social media.",
      "Rollout: Every clothing tag now carries the maker's name and photo, plus tissue paper and shopping bags that customers reuse as gift wrap.",
    ],
    results: [
      { value: 40, suffix: "%", label: "higher average bill within 6 months" },
      { value: 15, suffix: "", label: "artisans now named on every tag" },
      { value: 2, suffix: "", label: "new stores opened in the next year" },
    ],
    quote: {
      text: "Customers now ask who made their kurta. Our artisans finally get the credit.",
      name: "Kavita Desai",
      role: "Founder, Rangoli Boutique",
    },
  },
];
